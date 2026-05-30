# Monitor Horse — Painel RealClub

Painel de suporte para monitorar o serviço **API Horse** dos clubes.

## Telas
- **Login** — `RealClub Login.html`
- **Dashboard** — `RealClub Dashboard.html` — visão geral dos clubes e status dos serviços
- **Clubes / Cadastro** — `RealClub Cadastro.html` — cadastra um clube e o endpoint de health
- **Usuários** — `RealClub Cadastro Usuario.html` — cadastra membros da equipe
- **Relatórios** — `RealClub Relatorios.html`
- **Modelo de dados** — `RealClub Banco de Dados.html` (schema em `realclub_schema.sql`)

## Ambientes
O painel opera em dois ambientes, alternáveis pelo toggle no topo do Dashboard:

| Ambiente | Origem dos dados | Health-check |
|---|---|---|
| **Homologação (QA)** | Lista mock de clubes "Sandbox" | Simulado |
| **Produção** | Clubes cadastrados na tela Clubes | Real, via `fetch()` no `url_health` |

O estado (ambiente atual + clubes de produção) é persistido em `localStorage` por `realclub-store.js`.

## Health-check (Produção)
Cada clube expõe um endpoint que o painel consulta:

```
GET /health
{
  "status": "ok",
  "versao": "v2.4.1",
  "ambiente": "producao",
  "timestamp": "2026-05-30T14:22:05.318Z",
  "uptime_seg": 1843200,
  "dependencias": { "banco_de_dados": "ok", "fila": "ok" }
}
```

`status: "ok"` + HTTP 2xx → **Serviço ativo**; qualquer outro caso → **Serviço parado**.

## Stack
HTML + React (via Babel standalone, sem build). Basta abrir os arquivos `.html` em um servidor estático.

```bash
npx serve .
```
