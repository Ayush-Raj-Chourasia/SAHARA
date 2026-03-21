import React from 'react';
import { Shield, Pulse, Drop, Heart, Fork, Pill, Moon, Steps, Bell, Send, Trash, Edit, Plus, Info, Check } from '../components/Icons';

// Sub-components used across the dashboard
const Card = ({ children, th, full, d, show }) => (
  <div style={{
    background: th.surface, color: th.text, borderRadius: 24, padding: "24px",
    boxShadow: th.shadow, border: `1px solid ${th.border}`,
    transition: "transform 0.3s ease, opacity 0.3s ease",
    opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(16px)',
    transitionDelay: `${d * 0.1}s`,
    gridColumn: full ? "1 / -1" : "auto"
  }}>
    {children}
  </div>
);

const CH = ({ icon, title, children, th }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: th.text }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Label = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "inherit", opacity: 0.6 }}>{children}</p>
);

const Banner = ({ children, col, bg, bd }) => (
  <div style={{ background: bg, border: `1px solid ${bd}`, color: col, borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
    {children}
  </div>
);

const StatusPill = ({ eaten, dark, G }) => (
  <span style={{
    padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
    background: eaten ? (dark ? G.gBgD : G.gBg) : (dark ? G.aBgD : G.aBg),
    color: eaten ? G.green : G.amber,
    border: `1.5px solid ${eaten ? (dark ? G.gBdD : G.gBd) : (dark ? G.aBdD : G.aBd)}`
  }}>
    {eaten ? "✓ Eaten" : "Pending"}
  </span>
);

const AlertRow = ({ sev, title, desc, th, dark, G }) => {
  const col = sev === 'warn' ? G.red : G.blue;
  const bg = sev === 'warn' ? (dark ? G.rBgD : G.rBg) : (dark ? G.bBgD : G.bBg);
  const bd = sev === 'warn' ? (dark ? G.rBdD : G.rBd) : (dark ? G.bBdD : G.bBd);
  return (
    <div style={{ display: "flex", gap: 12, background: bg, border: `1.5px solid ${bd}`, borderRadius: 14, padding: "14px" }}>
      <div style={{ color: col, flexShrink: 0 }}><Shield size={20} /></div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: col }}>{title}</p>
        <p style={{ fontSize: 13, color: th.sub, marginTop: 2, lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  );
};

const SeniorDashboard = (props) => {
  const { th, dark, vitals, setVitals, vMode, setVMode, setEditV, setTmpV, medTaken, setMedTaken,
    sleep, setSleep, steps, setSteps, editAct, setEditAct, foodLog, setFoodLog, setShowFood,
    kcal, prot, score, sent, pushAlert, now, show, G, MEALS_CFG, countdown } = props;

  const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
  const lbl = score >= 80 ? "Good Condition" : score >= 60 ? "Monitor Closely" : "Needs Attention";
  const circ = 2 * Math.PI * 50;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 180px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>

      {/* Score */}
      <Card th={th} full d={0} show={show}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
            <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={58} cy={58} r={50} fill="none" stroke={th.s3} strokeWidth={9} />
              <circle cx={58} cy={58} r={50} fill="none" stroke={col} strokeWidth={9}
                strokeLinecap="round" strokeDasharray={circ}
                style={{ strokeDashoffset: show ? circ - (score / 100) * circ : circ, transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 7px ${col}55)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: col, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 10, color: th.muted, letterSpacing: ".06em" }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 170 }}>
            <Label>Health Score</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8, marginBottom: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: col, display: "inline-block", boxShadow: `0 0 9px ${col}80` }} />
              <span style={{ fontSize: 21, fontWeight: 700, color: col }}>{lbl}</span>
            </div>
            <div style={{ background: th.s3, borderRadius: 99, height: 9, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ width: show ? `${score}%` : "0%", height: 9, borderRadius: 99, background: `linear-gradient(90deg,${col}CC,${col})`, transition: "width 1s ease" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Vitals */}
      <Card th={th} full d={1} show={show}>
        <CH th={th} icon={<Pulse color={G.green} />} title="Vitals" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12, marginTop: 16 }}>
          {[{ k: "bp", label: "Blood Pressure", unit: "mmHg", icon: <Pulse size={24} />, tint: dark ? "#1a2820" : "#f0fdf4" },
          { k: "sugar", label: "Blood Sugar", unit: "mg/dL", icon: <Drop size={24} />, tint: dark ? "#0e1828" : "#eff6ff" },
          { k: "heart", label: "Heart Rate", unit: "bpm", icon: <Heart size={24} />, tint: dark ? "#28100e" : "#fff1f2" }].map(v => (
            <div key={v.k} style={{ borderRadius: 18, padding: "18px 16px", position: "relative", background: v.tint, border: `1.5px solid ${th.border}` }}>
               <div style={{ color: G.green }}>{v.icon}</div>
              <p style={{ color: th.sub, fontSize: 14, fontWeight: 600, marginTop: 9 }}>{v.label}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: th.text, lineHeight: 1 }}>{vitals[v.k]}</span>
                <span style={{ fontSize: 13, color: th.muted }}>{v.unit}</span>
              </div>
              <button onClick={() => { setEditV(v.k); setTmpV(vitals[v.k]); }} style={{ position: "absolute", top: 11, right: 11, background: th.s2, border: `1px solid ${th.border}`, borderRadius: 9, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>
                <Edit size={12} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Food Diary */}
      <Card th={th} full d={2} show={show}>
        <CH th={th} icon={<Fork color={G.amber} />} title="Food Diary">
          <button onClick={() => setShowFood(true)} style={{ background: th.accent, color: th.atext, border: "none", borderRadius: 13, padding: "11px 20px", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
            <Plus size={19} /> Add Food
          </button>
        </CH>
        <div style={{ display: "flex", gap: 11, margin: "17px 0", flexWrap: "wrap" }}>
          {[{ l: "Calories", v: kcal, u: "kcal", max: 1800 }, { l: "Protein", v: prot, u: "g", max: 60 }].map(s => (
            <div key={s.l} style={{ flex: 1, minWidth: 148, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 16, padding: "15px 17px" }}>
              <Label>{s.l}</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: th.text }}>{s.v}</span>
                <span style={{ fontSize: 14, color: th.muted }}>{s.u}</span>
              </div>
              <div style={{ background: th.border, borderRadius: 99, height: 6, marginTop: 9, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (s.v / s.max) * 100)}%`, height: 6, background: G.green, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(MEALS_CFG).filter(([k]) => k !== 'medication').map(([key, m]) => {
            const eaten = foodLog.some(f => f.meal.toLowerCase() === key);
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "12px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{m.emoji}</span>
                  <div>
                    <span style={{ fontSize: 17, fontWeight: 700, color: th.text }}>{m.label}</span>
                    <p style={{ fontSize: 12, color: th.muted }}>{m.time}</p>
                  </div>
                </div>
                <StatusPill eaten={eaten} dark={dark} G={G} />
              </div>
            )
          })}
        </div>
      </Card>

       {/* Medication */}
       <Card th={th} d={3} show={show}>
        <CH th={th} icon={<Pill color={G.blue} />} title="Medication" />
        <div style={{ background: dark ? "#12181f" : "#f8f8ff", border: `1.5px solid ${th.border}`, borderRadius: 18, padding: "17px" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: th.text }}>Metformin</p>
          <p style={{ color: th.sub, fontSize: 16, marginTop: 4 }}>2:00 PM · After Lunch</p>
          <button onClick={() => setMedTaken(!medTaken)} style={{ width: "100%", marginTop: 15, padding: "16px", borderRadius: 14, fontSize: 19, fontWeight: 800, background: medTaken ? th.s2 : th.accent, color: medTaken ? th.sub : th.atext, border: "none", cursor: 'pointer' }}>
            {medTaken ? "✓ Medication Taken" : "Mark as Taken"}
          </button>
        </div>
      </Card>

      {/* Activity */}
      <Card th={th} d={4} show={show}>
        <CH th={th} icon={<Moon color={G.blue} />} title="Activity" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
           <div style={{ background: th.accent, borderRadius: 18, padding: "17px", color: th.atext }}>
              <p style={{ fontSize: 32, fontWeight: 800 }}>{sleep} hrs</p>
              <p style={{ opacity: 0.7, fontSize: 12 }}>SLEEP</p>
           </div>
           <div style={{ background: th.s2, border: `1px solid ${th.border}`, borderRadius: 18, padding: "17px" }}>
              <p style={{ fontSize: 32, fontWeight: 800 }}>{steps.toLocaleString()}</p>
              <p style={{ color: th.sub, fontSize: 12 }}>STEPS</p>
           </div>
        </div>
      </Card>

      {/* Health Alerts */}
      <Card th={th} d={5} show={show}>
          <CH th={th} icon={<Bell color={G.red} />} title="Health Alerts" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AlertRow sev="warn" title="Anaemia Risk" desc="Iron levels trending low. Suggest adding spinach to diet." th={th} dark={dark} G={G} />
            <AlertRow sev="info" title="Hydration" desc="Drink 2 more glasses of water today." th={th} dark={dark} G={G} />
          </div>
      </Card>

    </main>
  );
};

export default SeniorDashboard;
