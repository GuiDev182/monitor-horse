const { useState } = React;
const LOGO = "assets/realclub-logo.png";

const I = {
  grid: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>),
  clubs: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>),
  server: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>),
  chart: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>),
  cog: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 2.6 14H2.5a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.4-.7V3.5a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 4.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.4 2.4h.4a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.1.7Z"/></svg>),
  out: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>),
  db: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>),
  building: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-3a2 2 0 0 1 4 0v3"/></svg>),
  link: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>),
  user: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg>),
  bolt: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>),
  check: (p)=>(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>),
  arrow: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
};

function go(href){ window.location.href = href; }

function Field({ label, req, opt, children, err, hint }) {
  return (
    <div className="fcol">
      <label className="flabel">{label}{req && <span className="req">*</span>}{opt && <span className="opt">(opcional)</span>}</label>
      {children}
      {err && <span className="ferr">{err}</span>}
      {hint && !err && <span className="hint">{hint}</span>}
    </div>
  );
}

function Cadastro() {
  const [v, setV] = useState({ nome:"", cnpj:"", cidade:"", uf:"", url:"", token:"", ambiente:"prod", intervalo:"5" });
  const [touched, setTouched] = useState(false);
  const [test, setTest] = useState("idle"); // idle | loading | ok | err
  const [done, setDone] = useState(false);
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); if (k === "url") setTest("idle"); };

  const eNome = touched && !v.nome.trim();
  const eUrl = touched && !/^https?:\/\/.+/.test(v.url.trim());

  const runTest = () => {
    if (!/^https?:\/\/.+/.test(v.url.trim())) { setTouched(true); return; }
    setTest("loading");
    setTimeout(() => setTest(v.url.includes("erro") ? "err" : "ok"), 1100);
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!v.nome.trim() || !/^https?:\/\/.+/.test(v.url.trim())) return;
    if (window.RC) {
      RC.addProdClub({
        nome: v.nome.trim(),
        cidade: v.cidade.trim(),
        uf: v.uf,
        cnpj: v.cnpj.trim(),
        url_health: v.url.trim(),
        versao: (v.versao || "").trim(),
        intervalo: Number(v.intervalo) || 5,
        ambiente: "producao",
        responsavel_nome: (v.resp || "").trim(),
        responsavel_email: (v.email || "").trim(),
      });
      RC.setEnv("prod"); // novos cadastros vivem em Produção
    }
    setDone(true);
  };

  const ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  const nav = [
    [I.grid, "Visão geral", false, "RealClub%20Dashboard.html"],
    [I.clubs, "Clubes", true, null],
    [I.server, "Serviços / API", false, "RealClub%20Dashboard.html"],
    [I.chart, "Relatórios", false, "RealClub%20Relatorios.html"],
    [I.db, "Modelo de dados", false, "RealClub%20Banco%20de%20Dados.html"],
    [I.user, "Usuários", false, "RealClub%20Cadastro%20Usuario.html"],
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
          <div style={{ minWidth: 0 }}>
            <div className="side-uname">Guilherme S.</div>
            <div className="side-urole">Equipe de Suporte</div>
          </div>
          <button className="side-out" title="Sair" onClick={() => go("RealClub%20Login.html")}>{I.out()}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            <a onClick={() => go("RealClub%20Dashboard.html")}>Clubes</a>
            <span>/</span>
            <span className="cur">Novo cadastro</span>
          </div>
        </header>

        <div className="scroll">
          <form className="wrap" onSubmit={submit}>
            <h1 className="page-h1">Cadastrar clube</h1>
            <p className="page-sub">Registre o clube e configure o serviço <b>API Horse</b> que será monitorado pelo painel de suporte.</p>

            {/* Section: dados do clube */}
            <div className="sec">
              <div className="sec-head">
                <span className="sec-ic" style={{ background: "#8E2E8E16", color: "var(--rc-purple)" }}>{I.building()}</span>
                <div><div className="sec-t">Dados do clube</div><div className="sec-d">Identificação do clube associado</div></div>
              </div>
              <div className="frow one">
                <Field label="Nome do clube" req err={eNome ? "Informe o nome do clube." : ""}>
                  <input className={"inp" + (eNome ? " bad" : "")} placeholder="Ex.: Clube Atlético Veranópolis" value={v.nome} onChange={set("nome")}/>
                </Field>
              </div>
              <div className="frow">
                <Field label="CNPJ" opt>
                  <input className="inp" placeholder="00.000.000/0000-00" value={v.cnpj} onChange={set("cnpj")}/>
                </Field>
                <Field label="Cidade" opt>
                  <input className="inp" placeholder="Ex.: Veranópolis" value={v.cidade} onChange={set("cidade")}/>
                </Field>
              </div>
              <div className="frow last">
                <Field label="Estado (UF)" opt>
                  <select className="inp" value={v.uf} onChange={set("uf")}>
                    <option value="">Selecione…</option>
                    {ufs.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
                <div/>
              </div>
            </div>

            {/* Section: serviço API Horse */}
            <div className="sec">
              <div className="sec-head">
                <span className="sec-ic" style={{ background: "#00A84818", color: "var(--rc-green)" }}>{I.server()}</span>
                <div><div className="sec-t">Serviço monitorado · API Horse</div><div className="sec-d">Endpoint que o painel irá consultar para verificar o status</div></div>
              </div>
              <div className="frow one">
                <Field label="URL do serviço (endpoint de health)" req
                  err={eUrl ? "Informe uma URL válida (http:// ou https://)." : ""}
                  hint="Ex.: https://api.seuclube.com.br/horse/health">
                  <input className={"inp" + (eUrl ? " bad" : "")} placeholder="https://api.seuclube.com.br/horse/health" value={v.url} onChange={set("url")}/>
                </Field>
              </div>
              <div className="frow one">
                <Field label="Versão da API Horse" opt hint="Versão atual do serviço em execução no clube. Ex.: v2.4.1">
                  <input className="inp" placeholder="Ex.: v2.4.1" value={v.versao || ""} onChange={set("versao")}/>
                </Field>
              </div>
              <div className="frow">
                <Field label="Intervalo de verificação">
                  <select className="inp" value={v.intervalo} onChange={set("intervalo")}>
                    <option value="1">A cada 1 minuto</option>
                    <option value="5">A cada 5 minutos</option>
                    <option value="15">A cada 15 minutos</option>
                    <option value="30">A cada 30 minutos</option>
                  </select>
                </Field>
                <div/>
              </div>
              <div className="card-div" style={{ height: 1, background: "var(--rc-line)", margin: "18px 0 16px" }}/>
              <div className="test">
                <button type="button" className="test-btn" onClick={runTest}>
                  {test === "loading" ? <span className="spin"/> : I.bolt()} Testar conexão
                </button>
                {test === "loading" && <span className="test-res" style={{ color: "var(--rc-gray)" }}>Verificando endpoint…</span>}
                {test === "ok" && <span className="test-res ok"><span className="dot" style={{ background: "var(--rc-green)" }}/>Conexão bem-sucedida · serviço respondeu 200 OK</span>}
                {test === "err" && <span className="test-res err"><span className="dot" style={{ background: "var(--rc-red)" }}/>Falha ao conectar · verifique a URL</span>}
              </div>
            </div>

            {/* Section: responsável */}
            <div className="sec">
              <div className="sec-head">
                <span className="sec-ic" style={{ background: "#4848A016", color: "var(--rc-blue)" }}>{I.user()}</span>
                <div><div className="sec-t">Responsável técnico</div><div className="sec-d">Contato para alertas de indisponibilidade</div></div>
              </div>
              <div className="frow last">
                <Field label="Nome" opt>
                  <input className="inp" placeholder="Nome do responsável" value={v.resp || ""} onChange={set("resp")}/>
                </Field>
                <Field label="E-mail para alertas" opt>
                  <input className="inp" placeholder="ti@seuclube.com.br" value={v.email || ""} onChange={set("email")}/>
                </Field>
              </div>
            </div>

            <div className="actions">
              <button type="button" className="btn-ghost" onClick={() => go("RealClub%20Dashboard.html")}>Cancelar</button>
              <button type="submit" className="btn-primary">Cadastrar clube {I.arrow()}</button>
            </div>
          </form>
        </div>
      </main>

      {done && (
        <div className="ov">
          <div className="ov-card">
            <div className="ov-ic">{I.check()}</div>
            <h2 className="ov-h">Clube cadastrado!</h2>
            <p className="ov-p"><b style={{ color: "var(--rc-ink)" }}>{v.nome}</b> foi adicionado ao monitoramento de <b style={{ color: "var(--rc-green)" }}>Produção</b>. O serviço API Horse será verificado a cada {v.intervalo} min.</p>
            <button className="ov-b" onClick={() => go("RealClub%20Dashboard.html")}>Ir para o painel</button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Cadastro/>);
