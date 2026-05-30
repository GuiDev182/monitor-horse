const { useState, useMemo } = React;
const LOGO = "assets/realclub-logo.png";

const I = {
  grid: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>,
  clubs: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /></svg>,
  server: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>,
  chart: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18" /><path d="M7 14l3-4 3 3 4-6" /></svg>,
  db: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg>,
  users: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  out: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
  user: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 12 0v1" /></svg>,
  shield: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
  key: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 8-8M15 6l3 3M18 3l3 3" /></svg>,
  head: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 18v-6a8 8 0 0 1 16 0v6" /><path d="M20 19a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3zM4 19a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H4z" /></svg>,
  cog: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 2.6 14H2.5a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3.5a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></svg>,
  eye: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  eyeOff: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.9 4.5A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-3.3 4M6.3 6.4A16.4 16.4 0 0 0 2 12s3.5 7 10 7a10.6 10.6 0 0 0 4.2-.9" /><path d="m4 4 16 16" /><path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" /></svg>,
  refresh: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v5h-5" /></svg>,
  check: (p) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5" /></svg>,
  tick: (p) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12.5 4.5 4.5L19 6.5" /></svg>,
  arrow: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
};

function go(href) {window.location.href = href;}

/* papéis = enum papel_usuario (suporte | gestor | admin) */
const ROLES = [
{ id: "suporte", t: "Suporte", d: "Atende clubes e acompanha o status dos serviços.", ic: I.head, ac: "var(--rc-green)", soft: "#00A84818" },
{ id: "gestor", t: "Gestor", d: "Cadastra clubes e gere relatórios da operação.", ic: I.cog, ac: "var(--rc-blue)", soft: "#4848A016" },
{ id: "admin", t: "Admin", d: "Acesso total, inclusive gestão de usuários.", ic: I.shield, ac: "var(--rc-purple)", soft: "#8E2E8E16" }];


function monogram(name) {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "?";
  return ((w[0][0] || "") + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
}
function avaColor(name) {
  const cs = ["var(--rc-blue)", "var(--rc-purple)", "var(--rc-green)", "var(--rc-cyan)", "var(--rc-red)"];
  let h = 0;for (const c of name) h = h * 31 + c.charCodeAt(0) >>> 0;
  return cs[h % cs.length];
}

function Field({ label, req, opt, children, err, hint }) {
  return (
    <div className="fcol">
      <label className="flabel">{label}{req && <span className="req">*</span>}{opt && <span className="opt">(opcional)</span>}</label>
      {children}
      {err && <span className="ferr">{err}</span>}
      {hint && !err && <span className="hint">{hint}</span>}
    </div>);

}

function pwScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4); // 0..4
}
const PW_LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
const PW_COLORS = ["var(--rc-red)", "var(--rc-red)", "var(--rc-yellow)", "var(--rc-cyan)", "var(--rc-green)"];

function genPassword() {
  const up = "ABCDEFGHJKLMNPQRSTUVWXYZ",lo = "abcdefghijkmnpqrstuvwxyz",nu = "23456789",sy = "!@#$%&*?";
  const all = up + lo + nu + sy;let p = "";
  p += up[Math.floor(Math.random() * up.length)];
  p += lo[Math.floor(Math.random() * lo.length)];
  p += nu[Math.floor(Math.random() * nu.length)];
  p += sy[Math.floor(Math.random() * sy.length)];
  for (let i = 0; i < 8; i++) p += all[Math.floor(Math.random() * all.length)];
  return p.split("").sort(() => Math.random() - 0.5).join("");
}

function CadastroUsuario() {
  const [v, setV] = useState({ nome: "", email: "", papel: "suporte", senha: "", confirma: "" });
  const [ativo, setAtivo] = useState(true);
  const [welcome, setWelcome] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim());
  const score = pwScore(v.senha);

  const eNome = touched && !v.nome.trim();
  const eEmail = touched && !emailOk;
  const eSenha = touched && v.senha.length < 8;
  const eConf = touched && v.confirma !== v.senha;

  const role = ROLES.find((r) => r.id === v.papel);
  const aColor = v.nome.trim() ? avaColor(v.nome.trim()) : "var(--rc-line)";

  const fillGen = () => {const g = genPassword();setV((s) => ({ ...s, senha: g, confirma: g }));setShowPw(true);};

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!v.nome.trim() || !emailOk || v.senha.length < 8 || v.confirma !== v.senha) return;
    setDone(true);
  };

  const reset = () => {setV({ nome: "", email: "", papel: "suporte", senha: "", confirma: "" });setAtivo(true);setWelcome(true);setShowPw(false);setTouched(false);setDone(false);window.scrollTo(0, 0);};

  const nav = [
  [I.grid, "Visão geral", false, "RealClub%20Dashboard.html"],
  [I.clubs, "Clubes", false, "RealClub%20Cadastro.html"],
  [I.chart, "Relatórios", false, "RealClub%20Relatorios.html"],
  [I.db, "Modelo de dados", false, "RealClub%20Banco%20de%20Dados.html"],
  [I.users, "Usuários", true, null]];


  return (
    <div className="app">
      <aside className="side">
        <img className="side-logo" src={LOGO} alt="RealClub" onClick={() => go("RealClub%20Dashboard.html")} />
        <div className="nav">
          <div className="nav-h">Painel</div>
          {nav.map(([ic, label, on, href], k) =>
          <button key={k} className={"nav-i" + (on ? " on" : "")} onClick={() => href && go(href)}>{ic()}{label}</button>
          )}
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
            <a onClick={() => go("RealClub%20Dashboard.html")}>Usuários</a>
            <span>/</span>
            <span className="cur">Novo usuário</span>
          </div>
        </header>

        <div className="scroll">
          <form className="wrap" onSubmit={submit}>
            <h1 className="page-h1">Cadastrar usuário</h1>
            <p className="page-sub">Crie um acesso para um membro da equipe que irá utilizar o painel de suporte <b>RealClub</b>.</p>

            {/* Section: identificação */}
            <div className="sec">
              <div className="sec-head">
                <span className="sec-ic" style={{ background: "#4848A016", color: "var(--rc-blue)" }}>{I.user()}</span>
                <div><div className="sec-t">Dados do usuário</div><div className="sec-d">Nome e e-mail usados para identificação e login</div></div>
              </div>

              <div className="avarow">
                <div className="avabig" style={{ background: v.nome.trim() ? `linear-gradient(135deg, ${aColor}, var(--rc-purple))` : "#E8E8EE" }}>
                  {v.nome.trim() ? monogram(v.nome) : <span style={{ color: "var(--rc-mute)" }}>{I.user()}</span>}
                </div>
                <div>
                  <div className="ava-meta-n">{v.nome.trim() || "Nome do usuário"}</div>
                  <div className="ava-meta-e">{v.email.trim() || "email@realclub.com.br"}</div>
                </div>
              </div>

              <div className="frow">
                <Field label="Nome completo" req err={eNome ? "Informe o nome do usuário." : ""}>
                  <input className={"inp" + (eNome ? " bad" : "")} placeholder="Ex.: Mariana Costa" value={v.nome} onChange={set("nome")} />
                </Field>
                <Field label="E-mail" req err={eEmail ? v.email.trim() === "" ? "Informe o e-mail." : "E-mail inválido." : ""} hint="Será o login de acesso ao painel.">
                  <input className={"inp" + (eEmail ? " bad" : "")} type="email" placeholder="mariana@realclub.com.br" value={v.email} onChange={set("email")} />
                </Field>
              </div>
            </div>

            {/* Section: senha */}
            <div className="sec">
              <div className="sec-head">
                <span className="sec-ic" style={{ background: "#00A84818", color: "var(--rc-green)" }}>{I.key()}</span>
                <div><div className="sec-t">Senha de acesso</div><div className="sec-d">Mínimo de 8 caracteres · gere uma senha forte automaticamente</div></div>
              </div>

              <div className="frow">
                <Field label="Senha" req err={eSenha ? v.senha === "" ? "Defina uma senha." : "Mínimo de 8 caracteres." : ""}>
                  <div className="ipwrap">
                    <input className={"inp has-eye" + (eSenha ? " bad" : "")} type={showPw ? "text" : "password"} placeholder="••••••••" value={v.senha} onChange={set("senha")} autoComplete="new-password" />
                    <button type="button" className="ip-eye" onClick={() => setShowPw((s) => !s)} aria-label="Mostrar senha">{showPw ? I.eyeOff() : I.eye()}</button>
                  </div>
                  {v.senha &&
                  <>
                      <div className="pwbar">
                        {[0, 1, 2, 3].map((i) =>
                      <span key={i} className="pwseg" style={{ background: i < score ? PW_COLORS[score] : "var(--rc-line)" }} />
                      )}
                      </div>
                      <div className="pwmeta">
                        <span className="pwmeta-l" style={{ color: PW_COLORS[score] }}>{PW_LABELS[score]}</span>
                        <span className="pwreq">{v.senha.length} caracteres</span>
                      </div>
                    </>
                  }
                </Field>
                <Field label="Confirmar senha" req err={eConf ? "As senhas não coincidem." : ""}>
                  <div className="ipwrap">
                    <input className={"inp has-eye" + (eConf ? " bad" : "")} type={showPw ? "text" : "password"} placeholder="••••••••" value={v.confirma} onChange={set("confirma")} autoComplete="new-password" />
                    <button type="button" className="ip-eye" onClick={() => setShowPw((s) => !s)} aria-label="Mostrar senha">{showPw ? I.eyeOff() : I.eye()}</button>
                  </div>
                  {v.confirma && !eConf && v.confirma === v.senha &&
                  <span className="hint" style={{ color: "var(--rc-green)", display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      As senhas coincidem
                    </span>
                  }
                </Field>
              </div>

              <button type="button" className="btn-ghost" style={{ height: 42, padding: "0 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginTop: 14 }} onClick={fillGen}>
                {I.refresh()} Gerar senha forte
              </button>
            </div>

            {/* Section: status / opções */}
            <div className="actions">
              <button type="button" className="btn-ghost" onClick={() => go("RealClub%20Dashboard.html")}>Cancelar</button>
              <button type="submit" className="btn-primary">Cadastrar usuário {I.arrow()}</button>
            </div>
          </form>
        </div>
      </main>

      {done &&
      <div className="ov">
          <div className="ov-card">
            <div className="ov-ava" style={{ background: `linear-gradient(135deg, ${aColor}, var(--rc-purple))` }}>{monogram(v.nome)}</div>
            <h2 className="ov-h">Usuário cadastrado!</h2>
            <p className="ov-p"><b style={{ color: "var(--rc-ink)" }}>{v.nome}</b> foi cadastrado e já pode acessar o painel.</p>
            <div className="ov-row">
              <button className="ov-b ghost" onClick={reset}>Cadastrar outro</button>
              <button className="ov-b" onClick={() => go("RealClub%20Dashboard.html")}>Ir para o painel</button>
            </div>
          </div>
        </div>
      }
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<CadastroUsuario />);