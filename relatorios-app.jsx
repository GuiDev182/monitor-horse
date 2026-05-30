const { useState } = React;
const LOGO = "assets/realclub-logo.png";

const I = {
  grid: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>),
  clubs: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>),
  server: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>),
  chart: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>),
  out: (p)=>(<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>),
  db: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>),
  down: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>),
  up: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>),
  alert: (p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>),
  clock: (p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
  pulse: (p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>),
  build: (p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/></svg>),
  dl: (p)=>(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>),
};
const go = (h) => window.location.href = h;
const PAL = ["var(--rc-red)","var(--rc-purple)","var(--rc-blue)","var(--rc-cyan)","var(--rc-green)"];

/* ---------- datasets per period ---------- */
const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DATA = {
  "12m": {
    label: "Paradas por mês · 2026",
    bars: MONTHS.map((m, i) => ({ x: m, v: [4,2,5,3,6,2,1,3,7,4,2,1][i] })),
    kpi: { stops: 40, stopsΔ: -12, downtime: "38h 20m", downΔ: -8, uptime: "99,2%", upΔ: 0.3, worst: "Itanhangá", worstN: 9 },
  },
  "30d": {
    label: "Paradas por dia · últimos 14 dias",
    bars: ["12","13","14","15","16","17","18","19","20","21","22","23","24","25"].map((d, i) => ({ x: d, v: [1,0,2,1,3,0,1,2,0,1,4,2,1,0][i] })),
    kpi: { stops: 18, stopsΔ: -5, downtime: "11h 05m", downΔ: -3, uptime: "99,4%", upΔ: 0.2, worst: "Guará", worstN: 4 },
  },
  "7d": {
    label: "Paradas por dia · últimos 7 dias",
    bars: ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((d, i) => ({ x: d, v: [2,1,3,0,2,1,0][i] })),
    kpi: { stops: 9, stopsΔ: -2, downtime: "4h 12m", downΔ: -1, uptime: "99,6%", upΔ: 0.1, worst: "Guará", worstN: 3 },
  },
};

const RANK = [
  { name: "Clube de Campo Itanhangá", city: "Rio de Janeiro · RJ", stops: 9, downtime: "9h 40m", uptime: 97.1 },
  { name: "Associação Atlética Guará", city: "Brasília · DF", stops: 7, downtime: "6h 15m", uptime: 98.0 },
  { name: "Clube dos Bancários", city: "Curitiba · PR", stops: 4, downtime: "2h 50m", uptime: 99.1 },
  { name: "Clube Náutico de Salvador", city: "Salvador · BA", stops: 3, downtime: "1h 30m", uptime: 99.4 },
  { name: "Grêmio Náutico Cisne Branco", city: "Porto Alegre · RS", stops: 2, downtime: "0h 55m", uptime: 99.7 },
];

const INCIDENTS = [
  { club: "Clube de Campo Itanhangá", cause: "Timeout no endpoint /horse/health", dur: "2h 14m", when: "Hoje, 09:12", resolved: false },
  { club: "Associação Atlética Guará", cause: "Erro 503 · serviço indisponível", dur: "1h 02m", when: "Hoje, 03:48", resolved: true },
  { club: "Clube dos Bancários", cause: "Falha de conexão com o banco", dur: "0h 38m", when: "Ontem, 22:10", resolved: true },
  { club: "Clube Náutico de Salvador", cause: "Reinício do servidor de aplicação", dur: "0h 21m", when: "Ontem, 14:33", resolved: true },
  { club: "Clube de Campo Itanhangá", cause: "Certificado SSL expirado", dur: "1h 47m", when: "27 mai, 19:05", resolved: true },
];

const mono = (n) => { const w = n.replace(/^(Clube|Sociedade|Grêmio|Associação)\s+/i, "").split(/\s+/); return ((w[0]?.[0]||"")+(w[1]?.[0]||"")).toUpperCase(); };

/* ---------- components ---------- */
function Delta({ value, invert }) {
  if (value === 0) return <span className="kpi-d flat">{I.pulse()} estável</span>;
  const good = invert ? value > 0 : value < 0; // for stops/downtime, down(negative) is good
  const cls = good ? "up" : "down";
  const arrow = value < 0 ? I.down() : I.up();
  const txt = (value > 0 ? "+" : "") + value + (invert ? " p.p." : "");
  return <span className={"kpi-d " + cls}>{arrow}{txt} vs. período anterior</span>;
}

function BarChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.v), 1);
  return (
    <div className="vchart">
      {bars.map((b, i) => (
        <div className="vcol" key={i}>
          <div className="vbar-wrap">
            <div className={"vbar" + (b.v === 0 ? " lite" : "")} style={{ height: (b.v / max * 100) + "%" }}>
              <span className="tip">{b.v} {b.v === 1 ? "parada" : "paradas"}</span>
            </div>
          </div>
          <div className="vval">{b.v}</div>
          <div className="vx">{b.x}</div>
        </div>
      ))}
    </div>
  );
}

function Relatorios() {
  const [period, setPeriod] = useState("12m");
  const d = DATA[period];

  function exportCSV() {
    const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const row = (arr) => arr.map(q).join(";");
    const periodName = { "7d": "Últimos 7 dias", "30d": "Últimos 30 dias", "12m": "Últimos 12 meses" }[period];
    const lines = [];
    lines.push(row(["RealClub — Relatório de Indisponibilidade (API Horse)"]));
    lines.push(row(["Período", periodName]));
    lines.push(row(["Gerado em", new Date().toLocaleString("pt-BR")]));
    lines.push("");
    lines.push(row(["RESUMO"]));
    lines.push(row(["Indicador", "Valor"]));
    lines.push(row(["Paradas registradas", d.kpi.stops]));
    lines.push(row(["Tempo total parado", d.kpi.downtime]));
    lines.push(row(["Disponibilidade média", d.kpi.uptime]));
    lines.push(row(["Clube mais afetado", d.kpi.worst + " (" + d.kpi.worstN + " paradas)"]));
    lines.push("");
    lines.push(row(["PARADAS POR PERÍODO — " + d.label]));
    lines.push(row(["Período", "Paradas"]));
    d.bars.forEach((b) => lines.push(row([b.x, b.v])));
    lines.push("");
    lines.push(row(["RANKING / DISPONIBILIDADE POR CLUBE"]));
    lines.push(row(["Clube", "Cidade", "Paradas", "Tempo parado", "Disponibilidade"]));
    RANK.forEach((c) => lines.push(row([c.name, c.city, c.stops, c.downtime, c.uptime.toString().replace(".", ",") + "%"])));
    lines.push("");
    lines.push(row(["INCIDENTES RECENTES"]));
    lines.push(row(["Clube", "Causa", "Duração", "Quando", "Status"]));
    INCIDENTS.forEach((it) => lines.push(row([it.club, it.cause, it.dur, it.when, it.resolved ? "Resolvido" : "Em aberto"])));

    const csv = "\ufeff" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-indisponibilidade-" + period + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const nav = [
    [I.grid, "Visão geral", false, "RealClub%20Dashboard.html"],
    [I.clubs, "Clubes", false, "RealClub%20Cadastro.html"],
    [I.server, "Serviços / API", false, "RealClub%20Dashboard.html"],
    [I.chart, "Relatórios", true, null],
    [I.db, "Modelo de dados", false, "RealClub%20Banco%20de%20Dados.html"],
    [I.clubs, "Usuários", false, "RealClub%20Cadastro%20Usuario.html"],
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
            <div className="top-title">Relatórios de indisponibilidade</div>
            <div className="top-sub">Histórico de paradas do serviço API Horse</div>
          </div>
          <div className="seg" style={{ marginLeft: "auto" }}>
            <button className={period === "7d" ? "on" : ""} onClick={() => setPeriod("7d")}>7 dias</button>
            <button className={period === "30d" ? "on" : ""} onClick={() => setPeriod("30d")}>30 dias</button>
            <button className={period === "12m" ? "on" : ""} onClick={() => setPeriod("12m")}>12 meses</button>
          </div>
          <button className="export" onClick={exportCSV}>{I.dl()} Exportar</button>
        </header>

        <div className="scroll">
          {/* KPIs */}
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-l">{I.alert()} Paradas registradas</div>
              <div className="kpi-v">{d.kpi.stops}</div>
              <Delta value={d.kpi.stopsΔ}/>
            </div>
            <div className="kpi">
              <div className="kpi-l">{I.clock()} Tempo total parado</div>
              <div className="kpi-v">{d.kpi.downtime}</div>
              <Delta value={d.kpi.downΔ}/>
            </div>
            <div className="kpi">
              <div className="kpi-l">{I.pulse()} Disponibilidade média</div>
              <div className="kpi-v">{d.kpi.uptime}</div>
              <Delta value={d.kpi.upΔ} invert/>
            </div>
            <div className="kpi">
              <div className="kpi-l">{I.build()} Clube mais afetado</div>
              <div className="kpi-v" style={{ fontSize: 19, marginTop: 13 }}>{d.kpi.worst}</div>
              <span className="kpi-d down">{I.alert()}{d.kpi.worstN} paradas no período</span>
            </div>
          </div>

          {/* main bar chart */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-t">{d.label}</div>
                <div className="panel-s">Número de vezes que algum clube ficou com o serviço parado</div>
              </div>
              <div className="legend"><span className="sw"/> Paradas do serviço</div>
            </div>
            <BarChart bars={d.bars}/>
          </div>

          {/* two cols: availability + incidents */}
          <div className="two">
            <div className="panel">
              <div className="panel-head"><div><div className="panel-t">Disponibilidade por clube</div><div className="panel-s">Uptime do serviço no período</div></div></div>
              <div className="hbars">
                {RANK.map((c, i) => {
                  const col = c.uptime >= 99.5 ? "var(--rc-green)" : c.uptime >= 99 ? "var(--rc-yellow)" : "var(--rc-red)";
                  return (
                    <div className="hrow" key={i}>
                      <div className="htop"><span className="hname">{c.name}</span><span className="hval" style={{ color: col }}>{c.uptime.toString().replace(".", ",")}%</span></div>
                      <div className="htrack"><div className="hfill" style={{ width: c.uptime + "%", background: col }}/></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head"><div><div className="panel-t">Incidentes recentes</div><div className="panel-s">Últimas paradas detectadas</div></div></div>
              <div className="log">
                {INCIDENTS.map((it, i) => (
                  <div className="li" key={i}>
                    <span className={"li-dot" + (it.resolved ? " resolved" : "")}/>
                    <div style={{ minWidth: 0 }}>
                      <div className="li-club">{it.club}</div>
                      <div className="li-meta">{it.cause}</div>
                    </div>
                    <div className="li-right">
                      <div className="li-dur">{it.dur}</div>
                      <div className="li-when">{it.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ranking table */}
          <div className="panel">
            <div className="panel-head"><div><div className="panel-t">Clubes mais afetados</div><div className="panel-s">Ranking por número de paradas no período</div></div></div>
            <table className="tbl">
              <thead><tr><th>Clube</th><th className="r">Paradas</th><th className="r">Tempo parado</th><th className="r">Disponibilidade</th></tr></thead>
              <tbody>
                {RANK.map((c, i) => {
                  const pillCls = c.uptime >= 99.5 ? "ok" : c.uptime >= 99 ? "warn" : "bad";
                  return (
                    <tr key={i}>
                      <td>
                        <div className="tname">
                          <span className="tmono" style={{ background: PAL[i % PAL.length] }}>{mono(c.name)}</span>
                          <div><div>{c.name}</div><div style={{ fontSize: 11.5, color: "var(--rc-mute)", fontWeight: 600, marginTop: 2 }}>{c.city}</div></div>
                        </div>
                      </td>
                      <td className="r" style={{ fontWeight: 800 }}>{c.stops}</td>
                      <td className="r">{c.downtime}</td>
                      <td className="r"><span className={"pill " + pillCls}>{c.uptime.toString().replace(".", ",")}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Relatorios/>);
