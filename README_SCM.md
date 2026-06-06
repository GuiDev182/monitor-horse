Como rodar (no Windows)

Básico — só o estado do serviço, sem proxy para a API:
.\win-health-agent.ps1 -ServiceName "ApiHorse" -Port 8765

Com proxy — consulta o SCM para /health/service e repassa /health + /health/ready para a API real:
.\win-health-agent.ps1 -ServiceName "ApiHorse" -Port 8765 -UpstreamUrl "https://api.meuclube.com/health"

---
Como conectar ao dashboard

No painel, cadastre (ou edite) o clube com a URL:
http://localhost:8765/health

O store vai derivar automaticamente:
- /health/service → agente consulta o SCM via Get-Service
- /health/ready → proxy para a API real (se -UpstreamUrl for informado) ou stub
- /health → idem

---
O que o agente retorna em /health/service

{
  "estado": "Running",
  "servico_windows": "ApiHorse",
  "display_name": "ApiHorse Service",
  "modo_inicio": "Automatic",
  "iniciado_em": "2026-06-06T08:00:00Z"
}

O dashboard já interpreta estado: "Running" como verde e "Stopped" / "Paused" como vermelho sem nenhuma alteração no frontend.

▎ Nota: na primeira execução pode ser necessário rodar como Administrador caso a porta 8765 seja bloqueada pelo Windows Firewall