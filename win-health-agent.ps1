<#
.SYNOPSIS
    Agente local que expõe /health/service consultando o SCM do Windows diretamente.

.PARAMETER ServiceName
    Nome do serviço Windows a monitorar (default: ApiHorse).

.PARAMETER Port
    Porta HTTP local (default: 8765).

.PARAMETER UpstreamUrl
    URL base do /health real da API (ex: https://api.example.com/health).
    Quando informado, /health e /health/ready são proxiados para a API original.
    Quando omitido, ambos retornam respostas stub simples.

.EXAMPLE
    # Apenas serviço Windows, sem proxy
    .\win-health-agent.ps1 -ServiceName "ApiHorse" -Port 8765

.EXAMPLE
    # Serviço Windows + proxy para a API real
    .\win-health-agent.ps1 -ServiceName "ApiHorse" -Port 8765 -UpstreamUrl "https://api.meuclube.com/health"
#>
param(
    [string] $ServiceName  = "ApiHorse",
    [int]    $Port         = 8765,
    [string] $UpstreamUrl  = ""
)

# ── helpers ────────────────────────────────────────────────────────────────────

function Write-Log($msg) {
    Write-Host "$(Get-Date -Format 'HH:mm:ss')  $msg"
}

function Send-Json($ctx, [int]$status, $obj) {
    $json  = $obj | ConvertTo-Json -Depth 6 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $res   = $ctx.Response
    $res.StatusCode       = $status
    $res.ContentType      = "application/json; charset=utf-8"
    $res.ContentLength64  = $bytes.Length
    $res.Headers.Add("Access-Control-Allow-Origin",  "*")
    $res.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
    $res.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
}

function Get-ServiceState([string]$name) {
    try {
        $svc = Get-Service -Name $name -ErrorAction Stop

        # Tenta obter detalhes extras via WMI (modo de início, PID)
        $wmi       = Get-WmiObject Win32_Service -Filter "Name='$name'" -ErrorAction SilentlyContinue
        $startMode = if ($wmi) { $wmi.StartMode } else { $null }
        $startTime = $null

        if ($svc.Status -eq "Running" -and $wmi -and $wmi.ProcessId -gt 0) {
            try {
                $proc = Get-Process -Id $wmi.ProcessId -ErrorAction SilentlyContinue
                if ($proc) {
                    $startTime = $proc.StartTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
                }
            } catch {}
        }

        return @{
            estado          = $svc.Status.ToString()   # Running | Stopped | Paused | …
            servico_windows = $svc.Name
            display_name    = $svc.DisplayName
            modo_inicio     = $startMode               # Automatic | Manual | Disabled
            iniciado_em     = $startTime
        }
    } catch {
        return @{
            estado          = "NotFound"
            servico_windows = $name
            erro            = $_.Exception.Message
        }
    }
}

# Retorna base sem barra final e sem sufixo /health
function Get-UpstreamBase([string]$url) {
    $u = $url.TrimEnd('/')
    if ($u -match '(?i)/health$') { $u = $u -replace '(?i)/health$', '' }
    return $u
}

function Invoke-Upstream([string]$url) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop
        $body = $null
        try { $body = $r.Content | ConvertFrom-Json } catch {}
        return @{ ok = $true; status = [int]$r.StatusCode; body = $body }
    } catch [System.Net.WebException] {
        $code = 0
        if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
        return @{ ok = $false; status = $code; error = $_.Exception.Message; body = $null }
    } catch {
        return @{ ok = $false; status = 0; error = $_.Exception.Message; body = $null }
    }
}

# ── inicialização ──────────────────────────────────────────────────────────────

$prefix   = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

try { $listener.Start() }
catch {
    Write-Host "ERRO: não foi possível iniciar o listener na porta $Port."
    Write-Host "  $_"
    Write-Host "  Tente executar como Administrador ou escolha outra porta (-Port 9000)."
    exit 1
}

Write-Host ""
Write-Host "  RealClub Win Health Agent"
Write-Host "  ─────────────────────────────────────────"
Write-Host "  Porta     : http://localhost:$Port"
Write-Host "  Serviço   : $ServiceName"
if ($UpstreamUrl) {
    Write-Host "  Upstream  : $UpstreamUrl  (proxy ativo)"
} else {
    Write-Host "  Upstream  : (stub — apenas /health/service é real)"
}
Write-Host ""
Write-Host "  Configure o dashboard apontando url_health para:"
Write-Host "  http://localhost:$Port/health"
Write-Host ""
Write-Host "  Ctrl+C para parar."
Write-Host ""

$upBase = if ($UpstreamUrl) { Get-UpstreamBase $UpstreamUrl } else { "" }

# ── loop principal ─────────────────────────────────────────────────────────────

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $path = $req.Url.AbsolutePath.TrimEnd('/')

        Write-Log "$($req.HttpMethod) $path"

        # CORS preflight
        if ($req.HttpMethod -eq "OPTIONS") {
            $ctx.Response.StatusCode = 204
            $ctx.Response.Headers.Add("Access-Control-Allow-Origin",  "*")
            $ctx.Response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
            $ctx.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            $ctx.Response.OutputStream.Close()
            continue
        }

        switch ($path) {

            # ── /health/service — consulta o SCM diretamente ──────────────────
            "/health/service" {
                $state = Get-ServiceState $ServiceName
                Write-Log "  -> estado=$($state.estado)  serviço=$($state.servico_windows)"
                Send-Json $ctx 200 $state
            }

            # ── /health/ready — proxy ou stub ─────────────────────────────────
            "/health/ready" {
                if ($upBase) {
                    $up = Invoke-Upstream "$upBase/health/ready"
                    $body = if ($up.body) { $up.body } else { @{ status = if ($up.ok) { "ok" } else { "degraded" } } }
                    Send-Json $ctx (if ($up.ok) { 200 } else { 503 }) $body
                } else {
                    Send-Json $ctx 200 @{ status = "ok" }
                }
            }

            # ── /health — proxy ou stub ───────────────────────────────────────
            "/health" {
                if ($upBase) {
                    $up = Invoke-Upstream "$upBase/health"
                    $body = if ($up.body) { $up.body } else { @{ status = if ($up.ok) { "ok" } else { "down" } } }
                    Send-Json $ctx (if ($up.ok) { 200 } else { 503 }) $body
                } else {
                    Send-Json $ctx 200 @{
                        status    = "ok"
                        versao    = "agent-local"
                        ambiente  = "local"
                    }
                }
            }

            default {
                Send-Json $ctx 404 @{ erro = "Endpoint não encontrado: $path" }
            }
        }
    }
} finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "Agente encerrado."
}
