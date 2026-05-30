const { useState, useMemo, useEffect, useCallback } = React;
const LOGO = "assets/realclub-logo.png";

/* ---------------- icons ---------------- */
const I = {
  grid: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>),
  clubs: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>),
  server: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>),
  chart: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>),
  search: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>),
  bell: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>),
  refresh: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/></svg>),
  out: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>),
  check: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>),
  alert: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>),
  total: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/></svg>),
  trash: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>),
  db: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>),
  link: (p)=>(<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>),
  plus: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  flask: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3h6M10 3v6.5L5.2 17a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7.5 14h9"/></svg>),
};

const PAL = ["var(--rc-purple)","var(--rc-blue)","var(--rc-green)","var(--rc-red)","var(--rc-cyan)","var(--rc-yellow)"];

function monogram(name) {
  const w = String(name).replace(/^(Clube|Sociedade|Grêmio|Associação)\s+/i, "").split(/\s+/);
  return ((w[0]?.[0] || "") + (w[1]?.[0] || "")).toUpperCase();
}
function relTime(min) {
  if (min <= 0) return "agora";
  if (min === 1) return "há 1 min";
  return "há " + min + " min";
}

/* ---------------- status pill ---------------- */
function StatusPill({ state, onClick }) {
  // state: "up" | "down" | "checking"
  if (state === "checking") {
    return <span className="status checking"><span className="mini-spin"/>Verificando…</span>;
  }
  const up = state === "up";
  return (
    <span className={"status " + (up ? "up" : "down")} onClick={onClick} title={onClick ? "Clique para verificar novamente" : ""}>
      <span className="dot"/>{up ? "Serviço ativo" : "Serviço parado"}
    </span>
  );
}

/* ---------------- QA card (mock / simulado) ---------------- */
function MockCard({ club, idx, onToggle, onDelete }) {
  const color = PAL[idx % PAL.length];
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="card">
      <div className="card-top">
        <span className="mono" style={{ background: color }}>{monogram(club.nome)}</span>
        <div style={{ minWidth: 0 }}>
          <div className="club-name">{club.nome}</div>
          <div className="club-meta">{club.cidade} · {club.uf}</div>
        </div>
        {confirm ? (
          <div className="confirm">
            <span>Remover?</span>
            <button className="cf-btn" onClick={() => setConfirm(false)}>Cancelar</button>
            <button className="cf-btn danger" onClick={onDelete}>Remover</button>
          </div>
        ) : (
          <button className="card-del" title="Remover do mock" onClick={() => setConfirm(true)}>{I.trash()}</button>
        )}
      </div>
      <div className="card-div"/>
      <div className="svc-row">
        <div className="svc-l">
          <span className="svc-ic">{I.server()}</span>
          <div>
            <div className="svc-name">API Horse <span className="amb-tag">homolog</span></div>
            <div className="svc-sub">{club.versao} · simulado · {relTime(club.min)}</div>
          </div>
        </div>
        <StatusPill state={club.up ? "up" : "down"} onClick={onToggle}/>
      </div>
    </div>
  );
}

/* ---------------- Produção card (health-check real) ---------------- */
function ProdCard({ club, idx, health, checking, onCheck, onDelete }) {
  const color = PAL[idx % PAL.length];
  const [confirm, setConfirm] = useState(false);
  const state = checking ? "checking" : (!health ? "checking" : (health.ok ? "up" : "down"));

  let sub;
  if (checking || !health) sub = "Consultando endpoint…";
  else if (health.ok) sub = `${health.versao || club.versao || "—"} · ${health.http} · ${health.ms} ms`;
  else if (health.http) sub = `HTTP ${health.http} · ${health.ms} ms`;
  else sub = `Sem resposta · ${health.error || "falha de conexão"}`;

  const amb = (health && health.ambiente) || club.ambiente || "producao";

  return (
    <div className="card">
      <div className="card-top">
        <span className="mono" style={{ background: color }}>{monogram(club.nome)}</span>
        <div style={{ minWidth: 0 }}>
          <div className="club-name">{club.nome}</div>
          <div className="club-meta">{club.cidade || "—"}{club.uf ? " · " + club.uf : ""}</div>
        </div>
        {confirm ? (
          <div className="confirm">
            <span>Excluir?</span>
            <button className="cf-btn" onClick={() => setConfirm(false)}>Cancelar</button>
            <button className="cf-btn danger" onClick={onDelete}>Excluir</button>
          </div>
        ) : (
          <button className="card-del" title="Excluir clube" onClick={() => setConfirm(true)}>{I.trash()}</button>
        )}
      </div>
      <div className="card-div"/>
      <div className="svc-row">
        <div className="svc-l">
          <span className="svc-ic">{I.server()}</span>
          <div>
            <div className="svc-name">API Horse <span className="amb-tag">{amb}</span></div>
            <div className="svc-sub">{sub}</div>
          </div>
        </div>
        <StatusPill state={state} onClick={checking ? null : onCheck}/>
      </div>
      <div className="url-line">{I.link()}<a href={club.url_health} target="_blank" rel="noreferrer">{club.url_health}</a></div>
    </div>
  );
}

/* ---------------- app ---------------- */
function Dashboard() {
  const [env, setEnv] = useState(() => (window.RC ? RC.getEnv() : "qa"));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [spinning, setSpinning] = useState(false);

  /* QA (mock, simulado) */
  const [qaClubs, setQaClubs] = useState(() => (window.RC ? RC.MOCK_QA.slice() : []));
  /* Produção (cadastrados manualmente) */
  const [prodClubs, setProdClubs] = useState(() => (window.RC ? RC.getProdClubs() : []));
  const [health, setHealth] = useState({});     // id -> resultado
  const [checking, setChecking] = useState({}); // id -> bool

  const isProd = env === "prod";

  /* health-check real de um clube */
  const checkOne = useCallback(async (club) => {
    setChecking((s) => ({ ...s, [club.id]: true }));
    const res = await RC.checkHealth(club.url_health);
    setHealth((h) => ({ ...h, [club.id]: res }));
    setChecking((s) => ({ ...s, [club.id]: false }));
    return res;
  }, []);

  const checkAll = useCallback(async (list) => {
    const arr = list || prodClubs;
    await Promise.all(arr.map((c) => checkOne(c)));
  }, [prodClubs, checkOne]);

  /* ao entrar em Produção, dispara verificação real */
  useEffect(() => {
    if (isProd) {
      const fresh = RC.getProdClubs();
      setProdClubs(fresh);
      checkAll(fresh);
    }
    // eslint-disable-next-line
  }, [isProd]);

  const switchEnv = (e) => { setEnv(e); RC.setEnv(e); setFilter("all"); };

  /* ---- QA actions ---- */
  const toggleQa = (id) => setQaClubs((cs) => cs.map((c) => c.id === id ? { ...c, up: !c.up, min: 0 } : c));
  const removeQa = (id) => setQaClubs((cs) => cs.filter((c) => c.id !== id));

  /* ---- Prod actions ---- */
  const removeProd = (id) => { RC.removeProdClub(id); setProdClubs(RC.getProdClubs()); };

  const refresh = () => {
    setSpinning(true);
    if (isProd) {
      checkAll().then(() => setSpinning(false));
    } else {
      setTimeout(() => { setQaClubs((cs) => cs.map((c) => ({ ...c, min: c.up ? Math.floor(Math.random()*5)+1 : c.min }))); setSpinning(false); }, 700);
    }
  };

  /* ---- derived counts ---- */
  const list = isProd ? prodClubs : qaClubs;
  const upCount = isProd
    ? prodClubs.filter((c) => health[c.id] && health[c.id].ok).length
    : qaClubs.filter((c) => c.up).length;
  const downCount = isProd
    ? prodClubs.filter((c) => health[c.id] && !health[c.id].ok).length
    : qaClubs.filter((c) => !c.up).length;

  const visible = useMemo(() => list
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => {
      const up = isProd ? (health[c.id] && health[c.id].ok) : c.up;
      const passFilter = filter === "all" || (filter === "up" ? up : !up && (isProd ? !!health[c.id] : true));
      return passFilter && String(c.nome).toLowerCase().includes(query.toLowerCase());
    }), [list, filter, query, isProd, health]);

  const navItems = [
    [I.grid, "Visão geral", true, null, null],
    [I.clubs, "Clubes", false, null, "RealClub%20Cadastro.html"],
    [I.server, "Serviços / API", false, downCount ? String(downCount) : null, null],
    [I.chart, "Relatórios", false, null, "RealClub%20Relatorios.html"],
    [I.db, "Modelo de dados", false, null, "RealClub%20Banco%20de%20Dados.html"],
    [I.clubs, "Usuários", false, null, "RealClub%20Cadastro%20Usuario.html"],
  ];

  const envMeta = RC.ENVS[env];

  return (
    <div className="app">
      {/* sidebar */}
      <aside className="side">
        <img className="side-logo" src={LOGO} alt="RealClub"/>
        <div className="nav">
          <div className="nav-h">Painel</div>
          {navItems.map(([ic, label, on, badge, href], k) => (
            <button key={k} className={"nav-i" + (on ? " on" : "")}
              onClick={() => { if (href) window.location.href = href; }}>
              {ic()}{label}{badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </div>
        <div className="side-user">
          <span className="side-ava">GS</span>
          <div style={{ minWidth: 0 }}>
            <div className="side-uname">Guilherme S.</div>
            <div className="side-urole">Equipe de Suporte</div>
          </div>
          <button className="side-out" title="Sair" onClick={() => window.location.href = "RealClub%20Login.html"}>{I.out()}</button>
        </div>
      </aside>

      {/* main */}
      <main className="main">
        <header className="topbar">
          <div>
            <div className="top-title">Visão geral dos clubes</div>
            <div className="top-sub">{isProd ? "Health-checks reais do serviço API Horse" : "Ambiente de homologação · dados simulados"}</div>
          </div>

          <div className="envsw" style={{ marginLeft: "auto" }}>
            <button className={"qa" + (env === "qa" ? " on qa" : "")} onClick={() => switchEnv("qa")}>
              <span className="led"/>Homologação
            </button>
            <button className={"prod" + (env === "prod" ? " on prod" : "")} onClick={() => switchEnv("prod")}>
              <span className="led"/>Produção
            </button>
          </div>

          <div className="search">
            {I.search()}
            <input placeholder="Buscar clube…" value={query} onChange={(e) => setQuery(e.target.value)}/>
          </div>
          <button className="icon-btn" title="Notificações">{I.bell()}<span className="ping"/></button>
        </header>

        <div className="scroll">
          {/* env banner pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span className="env-pill" style={{ background: envMeta.soft, color: envMeta.ink }}>
              <span className="led" style={{ background: envMeta.color }}/>
              Ambiente: {envMeta.label}
            </span>
            <span style={{ fontSize: 12.5, color: "var(--rc-mute)", fontWeight: 600 }}>
              {isProd ? `${prodClubs.length} serviço(s) cadastrado(s) na tela Clubes` : `${qaClubs.length} serviços fictícios para teste do painel`}
            </span>
          </div>

          {/* stats */}
          <div className="stats">
            <div className="stat">
              <span className="stat-ic" style={{ background: "#4848A014", color: "var(--rc-blue)" }}>{I.total()}</span>
              <div><div className="stat-v">{list.length}</div><div className="stat-l">{isProd ? "Clubes monitorados" : "Clubes em homologação"}</div></div>
            </div>
            <div className="stat">
              <span className="stat-ic" style={{ background: "#00A84818", color: "var(--rc-green)" }}>{I.check()}</span>
              <div><div className="stat-v">{upCount}</div><div className="stat-l">Serviços ativos</div></div>
            </div>
            <div className="stat">
              <span className="stat-ic" style={{ background: "#F0303014", color: "var(--rc-red)" }}>{I.alert()}</span>
              <div><div className="stat-v">{downCount}</div><div className="stat-l">Serviços parados</div></div>
            </div>
          </div>

          {/* toolbar */}
          <div className="toolbar">
            <div className="seg">
              <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>Todos <span className="cnt">{list.length}</span></button>
              <button className={filter === "up" ? "on" : ""} onClick={() => setFilter("up")}>Ativos <span className="cnt">{upCount}</span></button>
              <button className={filter === "down" ? "on" : ""} onClick={() => setFilter("down")}>Parados <span className="cnt">{downCount}</span></button>
            </div>
            <button className={"refresh" + (spinning ? " spin" : "")} onClick={refresh}>{I.refresh()} {isProd ? "Verificar agora" : "Atualizar"}</button>
          </div>

          {/* grid / empty */}
          {list.length === 0 && isProd ? (
            <div className="empty-card">
              <div className="empty-ic">{I.server()}</div>
              <div className="empty-h">Nenhum serviço cadastrado</div>
              <div className="empty-p">Em Produção o painel monitora os clubes cadastrados manualmente. Cadastre o primeiro clube e seu endpoint <b>API Horse</b> para começar.</div>
              <button className="empty-btn" onClick={() => window.location.href = "RealClub%20Cadastro.html"}>{I.plus()} Cadastrar clube</button>
            </div>
          ) : visible.length ? (
            <div className="grid">
              {visible.map(({ c, i }) => isProd
                ? <ProdCard key={c.id} club={c} idx={i} health={health[c.id]} checking={!!checking[c.id]} onCheck={() => checkOne(c)} onDelete={() => removeProd(c.id)}/>
                : <MockCard key={c.id} club={c} idx={i} onToggle={() => toggleQa(c.id)} onDelete={() => removeQa(c.id)}/>
              )}
            </div>
          ) : (
            <div className="empty">Nenhum clube encontrado para os filtros atuais.</div>
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard/>);
