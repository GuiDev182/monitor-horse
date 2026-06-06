# Tutorial — Monitorar serviço Windows no dashboard remoto

Este guia cobre todo o caminho: criar um serviço de teste no Windows, expor o agente local via Cloudflare Tunnel e conectar ao dashboard RealClub acessado remotamente.

---

## Pré-requisitos

- Windows 10/11 ou Windows Server 2019+
- PowerShell 5.1+ (já incluso no Windows)
- Acesso de Administrador na máquina
- Conta gratuita no [Cloudflare](https://cloudflare.com) (para o tunnel)
- Um domínio configurado no Cloudflare **ou** usar o subdomínio gratuito `trycloudflare.com`

---

## Parte 1 — Criar o serviço Windows de teste

### 1.1 Instalar o NSSM

O NSSM (Non-Sucking Service Manager) registra qualquer executável como serviço Windows.

```powershell
winget install NSSM.NSSM
```

### 1.2 Criar o script do serviço

Crie a pasta e o script:

```powershell
New-Item -ItemType Directory -Path "C:\realclub-test" -Force
```

Salve o arquivo `C:\realclub-test\api-fake.ps1` com o conteúdo abaixo:

```powershell
# Simula um serviço em execução contínua
while ($true) { Start-Sleep -Seconds 60 }
```

### 1.3 Registrar e iniciar o serviço

```powershell
nssm install ApiHorse powershell.exe
nssm set ApiHorse AppParameters "-ExecutionPolicy Bypass -NoProfile -File C:\realclub-test\api-fake.ps1"
nssm set ApiHorse DisplayName "ApiHorse (Teste RealClub)"
nssm set ApiHorse Start SERVICE_AUTO_START
nssm start ApiHorse
```

### 1.4 Confirmar que está rodando

```powershell
Get-Service -Name ApiHorse
```

Saída esperada:

```
Status   Name               DisplayName
------   ----               -----------
Running  ApiHorse           ApiHorse (Teste RealClub)
```

---

## Parte 2 — Instalar e configurar o agente local

O agente (`win-health-agent.ps1`) consulta o SCM do Windows diretamente e expõe o estado via HTTP.

### 2.1 Copiar o agente

Copie o arquivo `win-health-agent.ps1` deste repositório para a máquina Windows, por exemplo em `C:\realclub-test\`.

### 2.2 Iniciar o agente

```powershell
cd C:\realclub-test
.\win-health-agent.ps1 -ServiceName "ApiHorse" -Port 8765
```

Saída esperada no terminal:

```
  RealClub Win Health Agent
  ─────────────────────────────────────────
  Porta     : http://localhost:8765
  Serviço   : ApiHorse
  Upstream  : (stub — apenas /health/service é real)

  Configure o dashboard apontando url_health para:
  http://localhost:8765/health

  Ctrl+C para parar.
```

### 2.3 Testar localmente

Em outro terminal PowerShell:

```powershell
Invoke-RestMethod http://localhost:8765/health/service
```

Resposta esperada:

```json
{
  "estado": "Running",
  "servico_windows": "ApiHorse",
  "display_name": "ApiHorse (Teste RealClub)",
  "modo_inicio": "Automatic",
  "iniciado_em": "2026-06-06T13:00:00Z"
}
```

---

## Parte 3 — Expor o agente via Cloudflare Tunnel

O Cloudflare Tunnel cria um canal HTTPS seguro da máquina Windows até a internet, sem abrir portas no firewall.

### 3.1 Instalar o cloudflared

```powershell
winget install Cloudflare.cloudflared
```

### Opção A — URL temporária (sem domínio, para testes rápidos)

Rode em um terminal separado enquanto o agente está rodando:

```powershell
cloudflared tunnel --url http://localhost:8765
```

O cloudflared imprime uma URL pública gerada automaticamente:

```
Your quick Tunnel has been created! Visit it at:
https://exemplo-aleatorio-123.trycloudflare.com
```

Use essa URL no dashboard:
```
https://exemplo-aleatorio-123.trycloudflare.com/health
```

> A URL muda a cada execução. Use esta opção apenas para testes rápidos.

---

### Opção B — URL fixa com domínio próprio (recomendado para produção)

#### 3.2 Autenticar

```powershell
cloudflared tunnel login
```

Abre o browser para autorizar. Escolha o domínio desejado.

#### 3.3 Criar o tunnel

```powershell
cloudflared tunnel create realclub-agent
```

Anote o **Tunnel ID** exibido (formato UUID).

#### 3.4 Apontar o DNS

```powershell
cloudflared tunnel route dns realclub-agent agent.meuclube.com
```

> Substitua `agent.meuclube.com` pelo subdomínio desejado no seu domínio.

#### 3.5 Criar o arquivo de configuração

Salve em `C:\Users\<seu-usuario>\.cloudflared\config.yml`:

```yaml
tunnel: realclub-agent
credentials-file: C:\Users\<seu-usuario>\.cloudflared\<tunnel-id>.json

ingress:
  - hostname: agent.meuclube.com
    service: http://localhost:8765
  - service: http_status:404
```

#### 3.6 Instalar como serviço Windows (inicia automaticamente)

```powershell
cloudflared service install
cloudflared tunnel run realclub-agent
```

A URL pública fica fixa em:
```
https://agent.meuclube.com/health
```

---

## Parte 4 — Conectar ao dashboard remoto

### 4.1 Abrir o dashboard

Acesse o dashboard RealClub no browser remoto (qualquer máquina, qualquer rede).

### 4.2 Ir para a aba Produção

No dashboard, alterne o ambiente para **Produção** e clique em **Adicionar clube**.

### 4.3 Preencher os dados do clube

| Campo | Valor |
|---|---|
| Nome | Clube Atlético Veranópolis (ou o nome real) |
| URL Health | `https://agent.meuclube.com/health` |
| Versão | v2.4.1 |
| Intervalo | 5 min |

### 4.4 Verificar o estado do serviço Windows

Após salvar, o dashboard faz o health check e exibe o bloco **Serviço Windows** com o estado lido diretamente do SCM.

| Estado no SCM | Dashboard |
|---|---|
| `Running` | verde — Ativo |
| `Stopped` | vermelho — Parado |
| `Paused` | vermelho — Pausado |
| Serviço não encontrado | vermelho — NotFound |

---

## Parte 5 — Ciclo de testes

Simule falhas e veja o dashboard reagir em tempo real:

```powershell
# Parar o serviço → dashboard fica vermelho
Stop-Service ApiHorse

# Iniciar novamente → dashboard volta a verde
Start-Service ApiHorse

# Pausar
Suspend-Service ApiHorse

# Retomar
Resume-Service ApiHorse
```

---

## Limpeza após os testes

```powershell
# Parar e remover o serviço de teste
nssm stop ApiHorse
nssm remove ApiHorse confirm

# Remover o tunnel (opcional)
cloudflared tunnel delete realclub-agent

# Remover os arquivos
Remove-Item -Recurse -Force C:\realclub-test
```

---

## Resumo da arquitetura

```
Browser remoto
(dashboard RealClub)
        │
        │ HTTPS  GET /health/service
        ▼
Cloudflare Tunnel
(agent.meuclube.com)
        │
        │ HTTP localhost:8765
        ▼
win-health-agent.ps1
        │
        │ Get-Service (SCM)
        ▼
Serviço Windows (ApiHorse)
```