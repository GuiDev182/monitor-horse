const { useState, useRef, useEffect } = React;

const LOGO = "assets/realclub-logo.png";

/* ---------------- icons ---------------- */
const IcMail = (p) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>
  </svg>
);
const IcLock = (p) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4.5" y="11" width="15" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </svg>
);
const IcEye = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcEyeOff = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M9.9 4.5A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-3.3 4M6.3 6.4A16.4 16.4 0 0 0 2 12s3.5 7 10 7a10.6 10.6 0 0 0 4.2-.9"/><path d="m4 4 16 16"/><path d="M9.5 9.6a3 3 0 0 0 4.2 4.2"/>
  </svg>
);
const IcAlert = (p) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5v.5"/>
  </svg>
);
const IcCheck = (p) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m4.5 12.5 5 5 10-11"/>
  </svg>
);
const IcArrow = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IcBack = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6"/>
  </svg>
);
const IcHead = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 18v-6a8 8 0 0 1 16 0v6"/><path d="M20 19a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3zM4 19a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H4z"/>
  </svg>
);

/* ---------------- shared form logic ---------------- */
function useLoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [view, setView] = useState("login"); // login | forgot | sent

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwValid = pw.length >= 6;
  const eErr = touched.email && !emailValid ? (email.trim() === "" ? "Informe seu e-mail." : "E-mail inválido.") : "";
  const pErr = touched.pw && !pwValid ? (pw === "" ? "Informe sua senha." : "Mínimo de 6 caracteres.") : "";

  function submit(e) {
    e.preventDefault();
    setTouched({ email: true, pw: true });
    if (!emailValid || !pwValid) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1300);
  }
  function reset() { setStatus("idle"); setView("login"); setTouched({}); }

  return { email, setEmail, pw, setPw, showPw, setShowPw, remember, setRemember,
    touched, setTouched, status, view, setView, emailValid, pwValid, eErr, pErr, submit, reset };
}

/* ---------------- reusable fields ---------------- */
function EmailField({ f }) {
  return (
    <div className="rc-field-wrap">
      <label className="rc-label">E-mail</label>
      <div className="rc-field">
        <span className="rc-ic"><IcMail/></span>
        <input className={"rc-input has-icon" + (f.eErr ? " invalid" : "")} type="email" placeholder="voce@clube.com.br"
          value={f.email} autoComplete="email"
          onChange={(e) => f.setEmail(e.target.value)}
          onBlur={() => f.setTouched((t) => ({ ...t, email: true }))} />
      </div>
      {f.eErr && <p className="rc-err"><IcAlert/>{f.eErr}</p>}
    </div>
  );
}
function PwField({ f }) {
  return (
    <div className="rc-field-wrap">
      <label className="rc-label">Senha</label>
      <div className="rc-field">
        <span className="rc-ic"><IcLock/></span>
        <input className={"rc-input has-icon has-eye" + (f.pErr ? " invalid" : "")} type={f.showPw ? "text" : "password"}
          placeholder="••••••••" value={f.pw} autoComplete="current-password"
          onChange={(e) => f.setPw(e.target.value)}
          onBlur={() => f.setTouched((t) => ({ ...t, pw: true }))} />
        <button type="button" className="rc-eye" onClick={() => f.setShowPw((s) => !s)} aria-label="Mostrar senha">
          {f.showPw ? <IcEyeOff/> : <IcEye/>}
        </button>
      </div>
      {f.pErr && <p className="rc-err"><IcAlert/>{f.pErr}</p>}
    </div>
  );
}
function RememberRow({ f }) {
  return (
    <div className="rc-row">
      <label className="rc-check" onClick={() => f.setRemember((r) => !r)}>
        <span className={"rc-box" + (f.remember ? " on" : "")}>
          {f.remember && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>}
        </span>
        <span>Lembrar-me</span>
      </label>
      <a className="rc-link" onClick={() => f.setView("forgot")}>Esqueci minha senha</a>
    </div>
  );
}
function SubmitBtn({ f, label }) {
  return (
    <button className="rc-btn" type="submit" disabled={f.status === "loading"}>
      {f.status === "loading" ? <><span className="rc-spin"/> Entrando…</> : <>{label || "Entrar"} <IcArrow/></>}
    </button>
  );
}

/* forgot-password sub view */
function ForgotView({ f }) {
  const [sent, setSent] = useState(false);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  return (
    <div style={{ animation: "rcfade .35s ease" }}>
      <a className="rc-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18 }}
         onClick={() => { setSent(false); f.setView("login"); }}><IcBack/> Voltar ao login</a>
      {!sent ? (
        <>
          <h1 className="rc-h1">Recuperar acesso</h1>
          <p className="rc-sub">Informe seu e-mail e enviaremos um link para você redefinir sua senha.</p>
          <div style={{ height: 24 }}/>
          <EmailField f={f}/>
          <button className="rc-btn" type="button" onClick={() => { if (ok) setSent(true); else f.setTouched((t)=>({...t,email:true})); }}>
            Enviar link de recuperação <IcArrow/>
          </button>
        </>
      ) : (
        <div className="rc-done">
          <div className="rc-checkc"><span style={{ color: "var(--ac)" }}><IcCheck/></span></div>
          <h1 className="rc-h1">Verifique seu e-mail</h1>
          <p className="rc-sub">Enviamos um link de recuperação para<br/><b style={{ color: "var(--rc-ink)" }}>{f.email}</b></p>
        </div>
      )}
    </div>
  );
}

function SuccessView({ f, name }) {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = "RealClub%20Dashboard.html"; }, 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="rc-done" style={{ padding: "12px 0" }}>
      <div className="rc-checkc"><span style={{ color: "var(--ac)" }}><IcCheck/></span></div>
      <h1 className="rc-h1">Login efetuado!</h1>
      <p className="rc-sub">Redirecionando para o painel de suporte…</p>
    </div>
  );
}

/* ============================================================
   VARIANT A — centered card
   ============================================================ */
function VariantA() {
  const f = useLoginForm();
  const blobs = [
    [-40,-30,170,"var(--rc-purple)"],[88,72,120,"var(--rc-blue)"],[80,-46,90,"var(--rc-green)"],
    [10,84,150,"var(--rc-yellow)"],[-30,60,90,"var(--rc-red)"],[60,30,70,"var(--rc-cyan)"],
  ];
  return (
    <div className="br" style={{ "--ac": "var(--rc-green)", "--ac-soft": "#00A84818", "--ac-glow": "#00A84855" }}>
      <div className="br-bar">
        <span className="br-dot" style={{ background: "#FF5F57" }}/><span className="br-dot" style={{ background: "#FEBC2E" }}/><span className="br-dot" style={{ background: "#28C840" }}/>
        <span className="br-url"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9A9AA2" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>app.realclub.com.br/entrar</span>
      </div>
      <div className="br-body">
        <div className="va-stage">
          {blobs.map((b, i) => (
            <span key={i} className="va-blob" style={{
              width: b[2], height: b[2], background: b[3],
              left: `${10 + b[0] * 0.55 + 30}%`, top: `${30 + b[1] * 0.45}%` }}/>
          ))}
          <form className="va-card" onSubmit={f.submit}>
            <span className="va-accent"/>
            <img className="va-logo" src={LOGO} alt="RealClub"/>
            {f.status === "success" ? <SuccessView f={f}/> :
             f.view === "forgot" ? <ForgotView f={f}/> : (
              <>
                <span className="rc-pill"><IcHead/> Painel de Suporte</span>
                <h1 className="rc-h1" style={{ marginTop: 14 }}>Bem-vindo de volta 👋</h1>
                <p className="rc-sub">Acesse sua conta para atender os clubes.</p>
                <div style={{ height: 26 }}/>
                <EmailField f={f}/>
                <PwField f={f}/>
                <RememberRow f={f}/>
                <SubmitBtn f={f}/>
                <p className="rc-foot">Não tem acesso? <a>Fale com o administrador</a></p>
                <p className="rc-demo">Demo — qualquer e-mail válido + senha de 6+ caracteres.</p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VARIANT B — split screen, branded left panel
   ============================================================ */
function VariantB() {
  const f = useLoginForm();
  const feats = [
    ["var(--rc-purple)", "Sócios, mensalidades e carteirinhas"],
    ["var(--rc-green)", "Reservas de espaços e eventos"],
    ["var(--rc-blue)", "Financeiro e relatórios em tempo real"],
  ];
  // cluster of overlapping circles -> "people together"
  const cluster = [
    [0,28,46,"var(--rc-purple)"],[40,8,40,"var(--rc-red)"],[78,30,44,"var(--rc-yellow)"],
    [20,62,42,"var(--rc-blue)"],[60,60,40,"var(--rc-green)"],[100,58,36,"var(--rc-cyan)"],
  ];
  return (
    <div className="br" style={{ "--ac": "var(--rc-blue)", "--ac-soft": "#4848A018", "--ac-glow": "#4848A055" }}>
      <div className="br-bar">
        <span className="br-dot" style={{ background: "#FF5F57" }}/><span className="br-dot" style={{ background: "#FEBC2E" }}/><span className="br-dot" style={{ background: "#28C840" }}/>
        <span className="br-url"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9A9AA2" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>app.realclub.com.br/entrar</span>
      </div>
      <div className="br-body">
        <div className="vb-stage">
          {/* left brand panel */}
          <div className="vb-left">
            <span className="vb-blob" style={{ width: 150, height: 150, background: "var(--rc-yellow)", opacity: .14, right: -36, top: -36, filter: "blur(2px)" }}/>
            <span className="vb-blob" style={{ width: 120, height: 120, background: "var(--rc-purple)", opacity: .12, left: -30, bottom: 90, filter: "blur(2px)" }}/>
            <img className="vb-leftlogo" src={LOGO} alt="RealClub"/>
            <p style={{ position: "relative", fontSize: 12.5, color: "var(--rc-mute)", fontWeight: 600, margin: 0 }}>© 2026 RealClub · Plataforma de Gestão para Clubes</p>
          </div>
          {/* right form panel */}
          <div className="vb-right">
            <form className="vb-form" onSubmit={f.submit}>
              {f.status === "success" ? <SuccessView f={f}/> :
               f.view === "forgot" ? <ForgotView f={f}/> : (
                <>
                  <h1 className="rc-h1">Login</h1>
                  <p className="rc-sub">Use suas credenciais da equipe de suporte.</p>
                  <div style={{ height: 26 }}/>
                  <EmailField f={f}/>
                  <PwField f={f}/>
                  <RememberRow f={f}/>
                  <SubmitBtn f={f}/>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- mount (Variant B = definitiva, tela cheia) ---------------- */
function App() {
  return (
    <div className="fullscreen-login">
      <VariantB/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
