/* ============================================================
   RealClub · store compartilhado de ambientes (QA / Produção)
   Plain JS — carregar ANTES dos apps babel.
   Persiste em localStorage e expõe window.RC.
   ============================================================ */
(function () {
  const ENV_KEY = "realclub_env";          // "qa" | "prod"
  const CLUBS_KEY = "realclub_clubs_prod";  // clubes cadastrados manualmente (Produção)

  /* ---- ambientes ---- */
  const ENVS = {
    qa:   { id: "qa",   label: "Homologação", short: "QA",       color: "var(--rc-yellow)", soft: "#F0C40022", ink: "#8a6d00" },
    prod: { id: "prod", label: "Produção",    short: "Produção", color: "var(--rc-green)",  soft: "#00A84818", ink: "#067a39" },
  };

  /* ---- seed de Produção (usa o endpoint real informado) ---- */
  const SEED_PROD = [
    {
      id: "seed-cav",
      nome: "Clube Atlético Veranópolis",
      cidade: "Veranópolis", uf: "RS",
      url_health: "https://mp9c555eef131ac6909b.free.beeceptor.com/health",
      versao: "v2.4.1", intervalo: 5, ambiente: "producao",
      criado_em: new Date().toISOString(),
    },
  ];

  /* ---- mock de Homologação (QA) ---- */
  const MOCK_QA = [
    { id: "qa1", nome: "Clube de Testes Alpha",    cidade: "Sandbox", uf: "QA", versao: "v2.5.0-rc1", intervalo: 1, up: true,  min: 1, mock: true },
    { id: "qa2", nome: "Clube Homolog Beta",       cidade: "Sandbox", uf: "QA", versao: "v2.5.0-rc1", intervalo: 1, up: true,  min: 2, mock: true },
    { id: "qa3", nome: "Clube QA Gamma",           cidade: "Sandbox", uf: "QA", versao: "v2.5.0-rc1", intervalo: 1, up: false, min: 8, mock: true },
    { id: "qa4", nome: "Clube Staging Delta",      cidade: "Sandbox", uf: "QA", versao: "v2.4.9",      intervalo: 1, up: true,  min: 3, mock: true },
    { id: "qa5", nome: "Clube Sandbox Épsilon",    cidade: "Sandbox", uf: "QA", versao: "v2.5.0-rc1", intervalo: 1, up: true,  min: 1, mock: true },
    { id: "qa6", nome: "Clube Preview Zeta",       cidade: "Sandbox", uf: "QA", versao: "v2.4.9",      intervalo: 1, up: false, min: 15, mock: true },
  ];

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  const RC = {
    ENVS,
    MOCK_QA,

    getEnv() { return localStorage.getItem(ENV_KEY) || "qa"; },
    setEnv(e) { localStorage.setItem(ENV_KEY, e); },

    /* clubes de Produção (cadastrados manualmente) */
    getProdClubs() {
      const v = read(CLUBS_KEY);
      if (v === null) { localStorage.setItem(CLUBS_KEY, JSON.stringify(SEED_PROD)); return SEED_PROD.slice(); }
      return v;
    },
    setProdClubs(list) { localStorage.setItem(CLUBS_KEY, JSON.stringify(list)); },
    addProdClub(club) {
      const list = this.getProdClubs();
      const item = Object.assign({ id: "c" + Date.now().toString(36), criado_em: new Date().toISOString() }, club);
      list.unshift(item);
      this.setProdClubs(list);
      return item;
    },
    removeProdClub(id) {
      this.setProdClubs(this.getProdClubs().filter((c) => c.id !== id));
    },

    /* ---- health-check REAL contra o url_health ----
       Faz GET, mede latência e interpreta o JSON do serviço:
       { status:"ok", versao, ambiente, ... }                     */
    async checkHealth(url) {
      const t0 = (performance && performance.now) ? performance.now() : Date.now();
      try {
        const res = await fetch(url, { method: "GET", cache: "no-store" });
        const ms = Math.round(((performance && performance.now) ? performance.now() : Date.now()) - t0);
        let body = null;
        try { body = await res.json(); } catch (e) { /* corpo não-JSON */ }
        const statusStr = body && body.status ? String(body.status).toLowerCase() : "";
        const healthy = res.ok && (statusStr ? /ok|ativo|up|healthy|online/.test(statusStr) : true);
        return {
          ok: healthy,
          http: res.status,
          ms,
          versao: body && body.versao,
          ambiente: body && body.ambiente,
          deps: body && body.dependencias,
          at: new Date().toISOString(),
        };
      } catch (err) {
        const ms = Math.round(((performance && performance.now) ? performance.now() : Date.now()) - t0);
        return { ok: false, http: 0, ms, error: String(err && err.message || err), at: new Date().toISOString() };
      }
    },
  };

  window.RC = RC;
})();
