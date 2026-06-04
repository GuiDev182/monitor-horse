# Monitor Horse — Painel RealClub

Painel de suporte para monitorar o serviço **API Horse** dos clubes. Mostra, em tempo real, se o serviço de cada clube está **ativo** ou **parado**, consultando os endpoints de _health check_ da própria API Horse.

---

## 1. O que você precisa

- **Navegador** moderno (Chrome, Edge ou Firefox).
- **Node.js** instalado (só para subir um servidor local) — opcional, veja alternativas abaixo.
- Os arquivos do projeto nesta pasta.

> O painel é 100% front-end (HTML + React via Babel, sem build). Não há backend próprio — ele fala direto com os endpoints da API Horse.

---

## 2. Colocar o painel rodando localmente

Você **não pode** abrir o `RealClub Dashboard.html` com duplo-clique (`file://`) — o navegador bloqueia o carregamento dos arquivos `.jsx` e os `fetch()`. É preciso servir por HTTP. Escolha **uma** opção:

### Opção A — Node.js (recomendado)
Na pasta do projeto:
```bash
npx serve .
```
Abra o endereço que aparecer (ex.: `http://localhost:3000`) e acesse **RealClub Dashboard.html**.

### Opção B — Python (já vem no Windows/Mac/Linux)
```bash
python -m http.server 8080
```
Acesse `http://localhost:8080/RealClub%20Dashboard.html`.

### Opção C — Extensão "Live Server" (VS Code)
Instale a extensão **Live Server**, clique com o botão direito no `RealClub Dashboard.html` → **Open with Live Server**.

---

## 3. Ambientes: Homologação x Produção

No topo do Dashboard há um seletor de ambiente:

| Ambiente | O que mostra | Health-check |
|---|---|---|
| **Homologação (QA)** | Clubes fictícios ("Sandbox") | Simulado — para testar o painel sem dados reais |
| **Produção** | Clubes cadastrados na tela **Clubes** | **Real** — faz `fetch()` no endpoint de cada clube |

O ambiente atual e os clubes cadastrados ficam salvos no navegador (`localStorage`).

---

## 4. Cadastrar um clube real (Produção)

1. No menu lateral, abra **Clubes**.
2. Preencha os dados e, principalmente, a **URL do serviço (endpoint de health)** — ex.: `https://api.seuclube.com.br/health`.
3. Salve. O clube passa a ser monitorado em **Produção** e o painel começa a consultar o endpoint.

---

## 5. Endpoints que a API Horse precisa expor

O painel determina o status consultando os endpoints abaixo. **Só o `/health` é obrigatório.** O contrato completo (com exemplos de resposta) está em [`api-horse-contrato.json`](./api-horse-contrato.json).

### 5.1 `GET /health` — obrigatório
Prova que o serviço está no ar e respondendo.

```bash
curl https://api.seuclube.com.br/health
```
```json
{
  "status": "ok",
  "versao": "v2.4.1",
  "ambiente": "producao",
  "timestamp": "2026-06-03T12:00:00.000Z",
  "uptime_seg": 1843200
}
```
**Regra:** `HTTP 200` + `status: "ok"` → **Serviço ativo**. Timeout, conexão recusada ou `HTTP >= 500` → **Serviço parado**.

### 5.2 `GET /health/ready` — opcional
Verifica se as dependências (banco, fila, disco) estão acessíveis. Devolve `503` se alguma falhar.
```json
{
  "status": "ok",
  "dependencias": { "banco_de_dados": "ok", "fila": "ok", "disco_livre_mb": 24800 }
}
```

### 5.3 `GET /health/service` — opcional
Reporta o estado do **serviço do Windows** (via Service Control Manager). Ideal expor por um agente/watchdog separado, que continua respondendo mesmo se a API Horse principal cair.
```json
{
  "servico_windows": "ApiHorse",
  "estado": "Running",
  "iniciado_em": "2026-06-01T03:11:00.000Z",
  "modo_inicio": "Automatic"
}
```
**Regra:** `estado: "Running"` → ativo; `Stopped` / `Paused` / `StartPending` → não está operando.

> O painel deriva os endpoints irmãos automaticamente a partir da URL cadastrada: `.../health` → `.../health/ready` e `.../health/service`. Se algum não existir, ele mostra **"não exposto"** em vez de quebrar.

---

## 6. CORS — passo importante para Produção

Como o painel roda no navegador (`http://localhost`) e a API Horse está em outro domínio/host, a API Horse precisa **liberar CORS** para o painel conseguir ler a resposta. No servidor da API Horse, habilite o header:

```
Access-Control-Allow-Origin: *
```
(ou, mais seguro, o domínio onde o painel será publicado).

Sem isso, o navegador bloqueia o `fetch()` e o clube aparece como **parado** mesmo estando no ar.

---

## 7. Estrutura do projeto

| Arquivo | Função |
|---|---|
| `RealClub Login.html` | Tela de login |
| `RealClub Dashboard.html` | Painel principal (ambientes + status) |
| `RealClub Cadastro.html` | Cadastro de clube + endpoint |
| `RealClub Cadastro Usuario.html` | Cadastro de usuário da equipe |
| `RealClub Relatorios.html` | Relatórios |
| `RealClub Banco de Dados.html` | Visão do modelo de dados |
| `realclub-store.js` | Estado compartilhado + lógica de health-check |
| `realclub_schema.sql` | Schema do banco (PostgreSQL) |
| `api-horse-contrato.json` | Contrato dos endpoints da API Horse |

---

## 8. Resumo rápido

```bash
# 1. subir o painel
npx serve .

# 2. abrir no navegador
#    http://localhost:3000/RealClub%20Dashboard.html

# 3. cadastrar o clube em "Clubes" com a URL /health
# 4. alternar para o ambiente "Produção"
# 5. o painel consulta a API Horse e mostra ativo/parado
```

**Checklist da API Horse:** expor `GET /health` (obrigatório), liberar **CORS**, e — se possível — adicionar `/health/ready` e `/health/service` para diagnóstico completo.
