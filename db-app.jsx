const { useState, useEffect } = React;
const LOGO = "assets/realclub-logo.png";

const I = {
  grid: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>),
  clubs: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>),
  server: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>),
  chart: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>),
  db: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>),
  out: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>),
  copy: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>),
  dl: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>),
  users: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>),
  link: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8"/></svg>),
  check: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>),
};
const go = (h) => window.location.href = h;

/* ---------- schema model ---------- */
const TABLES = [
  { name: "usuarios", color: "var(--rc-purple)", icon: I.users, desc: "Equipe que acessa o painel (login)", cols: [
    ["id","uuid",["PK"]], ["nome","varchar(120)",["NN"]], ["email","varchar(160)",["NN","UQ"]],
    ["senha_hash","varchar(255)",["NN"]], ["papel","papel_usuario",["NN"]], ["ativo","boolean",["NN"]],
    ["ultimo_login","timestamptz",[]], ["criado_em","timestamptz",["NN"]] ] },
  { name: "clubes", color: "var(--rc-blue)", icon: I.clubs, desc: "Clubes cadastrados e monitorados", cols: [
    ["id","uuid",["PK"]], ["nome","varchar(160)",["NN"]], ["cnpj","varchar(18)",["UQ"]], ["cidade","varchar(120)",[]],
    ["uf","char(2)",[]], ["responsavel_nome","varchar(120)",[]], ["responsavel_email","varchar(160)",[]],
    ["criado_por","uuid",["FK"],"usuarios.id"], ["criado_em","timestamptz",["NN"]], ["atualizado_em","timestamptz",["NN"]] ] },
  { name: "servicos_apihorse", color: "var(--rc-green)", icon: I.server, desc: "Config. do serviço API Horse (1:1 com clube)", cols: [
    ["id","uuid",["PK"]], ["clube_id","uuid",["FK","UQ"],"clubes.id"], ["url_health","varchar(300)",["NN"]],
    ["versao","varchar(20)",[]], ["intervalo_min","smallint",["NN"]], ["ambiente","ambiente_servico",["NN"]],
    ["status_atual","status_servico",["NN"]], ["verificado_em","timestamptz",[]], ["criado_em","timestamptz",["NN"]] ] },
  { name: "verificacoes", color: "var(--rc-cyan)", icon: I.server, desc: "Histórico de health-checks do serviço", cols: [
    ["id","bigserial",["PK"]], ["servico_id","uuid",["FK"],"servicos_apihorse.id"], ["status","status_servico",["NN"]],
    ["http_code","smallint",[]], ["tempo_resposta_ms","integer",[]], ["mensagem","text",[]], ["verificado_em","timestamptz",["NN"]] ] },
  { name: "incidentes", color: "var(--rc-red)", icon: I.chart, desc: "Períodos em que o serviço ficou parado", cols: [
    ["id","bigserial",["PK"]], ["clube_id","uuid",["FK"],"clubes.id"], ["servico_id","uuid",["FK"],"servicos_apihorse.id"],
    ["causa","varchar(200)",[]], ["inicio","timestamptz",["NN"]], ["fim","timestamptz",[]],
    ["duracao_seg","integer",[]], ["resolvido","boolean",["NN"]], ["criado_em","timestamptz",["NN"]] ] },
  { name: "alertas", color: "var(--rc-yellow)", icon: I.users, desc: "Notificações enviadas ao responsável", cols: [
    ["id","bigserial",["PK"]], ["incidente_id","bigint",["FK"],"incidentes.id"], ["canal","varchar(20)",["NN"]],
    ["destinatario","varchar(160)",["NN"]], ["enviado_em","timestamptz",["NN"]] ] },
];

const RELS = [
  ["usuarios", "clubes", "1 : N", "um usuário cadastra vários clubes"],
  ["clubes", "servicos_apihorse", "1 : 1", "cada clube tem um serviço API Horse"],
  ["servicos_apihorse", "verificacoes", "1 : N", "cada verificação registra um status"],
  ["clubes", "incidentes", "1 : N", "um clube acumula vários incidentes"],
  ["servicos_apihorse", "incidentes", "1 : N", "incidente referente a um serviço"],
  ["incidentes", "alertas", "1 : N", "um incidente dispara vários alertas"],
];

function Badge({ t }) {
  const map = { PK: "pk", FK: "fk", UQ: "uq", NN: "nn" };
  return <span className={"badge " + map[t]}>{t}</span>;
}

function TableCard({ t }) {
  return (
    <div className="tbl">
      <div className="tbl-h">
        <span className="tbl-ic" style={{ background: t.color }}>{t.icon()}</span>
        <div><div className="tbl-name">{t.name}</div><div className="tbl-desc">{t.desc}</div></div>
      </div>
      {t.cols.map((c, i) => {
        const badges = c[2] || [];
        const isPk = badges.includes("PK");
        const isFk = badges.includes("FK");
        return (
          <div className={"col" + (isPk ? " key" : isFk ? " fk" : "")} key={i}>
            <span className="col-n">{c[0]}</span>
            <span className="col-b">{badges.map((b) => <Badge key={b} t={b}/>)}</span>
            {c[3] && <span className="fkref">→ {c[3]}</span>}
            <span className="col-t">{c[1]}</span>
          </div>
        );
      })}
    </div>
  );
}

function DB() {
  const [toast, setToast] = useState("");
  const sql = () => document.getElementById("sqlsrc").textContent;
  useEffect(() => {
    const el = document.getElementById("sqlview");
    if (el) el.textContent = sql();
  }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2000); };

  const copy = async () => {
    try { await navigator.clipboard.writeText(sql()); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = sql(); document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    flash("SQL copiado para a área de transferência");
  };
  const download = () => {
    const blob = new Blob([sql()], { type: "text/sql;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "realclub_schema.sql";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash("Arquivo realclub_schema.sql baixado");
  };

  const nav = [
    [I.grid, "Visão geral", false, "RealClub%20Dashboard.html"],
    [I.clubs, "Clubes", false, "RealClub%20Cadastro.html"],
    [I.server, "Serviços / API", false, "RealClub%20Dashboard.html"],
    [I.chart, "Relatórios", false, "RealClub%20Relatorios.html"],
    [I.db, "Modelo de dados", true, null],
    [I.users, "Usuários", false, "RealClub%20Cadastro%20Usuario.html"],
  ];

  return (
    <div className="app">
      <aside className="side">
        <img className="side-logo" src={LOGO} alt="RealClub" onClick={() => go("RealClub%20Dashboard.html")}/>
        <div className="nav">
          <div className="nav-h">Painel</div>
          {nav.map(([ic, label, on, href], k) => (
            <button key={k} className={"nav-i" + (on ? " on" : "")} onClick={() => href && go(href)}>{ic()}{label}</button>
          ))}
        </div>
        <div className="side-user">
          <span className="side-ava">GS</span>
          <div style={{ minWidth: 0 }}><div className="side-uname">Guilherme S.</div><div className="side-urole">Equipe de Suporte</div></div>
          <button className="side-out" title="Sair" onClick={() => go("RealClub%20Login.html")}>{I.out()}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="top-title">Modelo de dados</div>
            <div className="top-sub">Esquema PostgreSQL · 6 tabelas · monitoramento do API Horse</div>
          </div>
          <button className="btn" style={{ marginLeft: "auto" }} onClick={copy}>{I.copy()} Copiar SQL</button>
          <button className="btn primary" onClick={download}>{I.dl()} Baixar .sql</button>
        </header>

        <div className="scroll">
          <div className="legend">
            <span className="lg"><span className="badge pk">PK</span> Chave primária</span>
            <span className="lg"><span className="badge fk">FK</span> Chave estrangeira</span>
            <span className="lg"><span className="badge uq">UQ</span> Único</span>
            <span className="lg"><span className="badge nn">NN</span> Obrigatório (not null)</span>
          </div>

          <div className="grid">
            {TABLES.map((t) => <TableCard key={t.name} t={t}/>)}
          </div>

          <div className="rel-panel">
            <h2 className="rel-t">Relacionamentos</h2>
            {RELS.map((r, i) => (
              <div className="rel" key={i}>
                <code>{r[0]}</code>
                <span style={{ color: "var(--rc-mute)" }}>{I.link()}</span>
                <code>{r[1]}</code>
                <span className="card-card">{r[2]}</span>
                <span className="rel-desc">{r[3]}</span>
              </div>
            ))}
          </div>

          <div className="sqlbox">
            <div className="sqlbar">
              <span className="dot" style={{ background: "#FF5F57" }}/><span className="dot" style={{ background: "#FEBC2E" }}/><span className="dot" style={{ background: "#28C840" }}/>
              <span className="t">realclub_schema.sql</span>
            </div>
            <pre className="sqlpre" id="sqlview"></pre>
          </div>
        </div>
      </main>

      <div className={"toast" + (toast ? " show" : "")}>{I.check()} {toast}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<DB/>);
