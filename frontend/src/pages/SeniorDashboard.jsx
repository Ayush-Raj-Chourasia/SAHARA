import { Shield, Pulse, Drop, Heart, Fork, Pill, Moon, Steps, Bell, Send, Trash, Edit, Plus, Info, Check, MessageSquare, ArrowLeft, ArrowRight, Activity, Mic } from '../components/Icons';
import VitalsWizard from '../components/VitalsWizard';
import NutritionVoice from '../components/NutritionVoice';
import { MedicationCompliance, AnaemiaRiskCard } from '../components/ClinicalComponents';

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
  const { th, dark, vitals, setVitals, kcal, prot, score, G, show } = props;
  const [showWizard, setShowWizard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const handleVitalsComplete = (newData) => {
    setVitals({
        bp: `${newData.bp_sys}/${newData.bp_dia}`,
        sugar: newData.sugar,
        heart: newData.hb // Using Hb for display for now
    });
    setShowWizard(false);
  };

  const triggerSOS = () => {
    if (window.confirm("TRIGER SOS ALERT? Your family will be notified immediately.")) {
        alert("SOS SENT! GPS: 20.2961° N, 85.8245° E");
    }
  };

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 180px" }}>
      {showWizard && <VitalsWizard th={th} onClose={() => setShowWizard(false)} onComplete={handleVitalsComplete} />}
      {showVoice && <NutritionVoice th={th} dark={dark} onClose={() => setShowVoice(false)} onAdd={(f) => props.setFoodLog([...props.foodLog, f])} />}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>
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

      {/* Main Actions */}
      <Card th={th} full d={0.5} show={show}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <button onClick={() => setShowWizard(true)} style={{ background: G.orange, color: "#fff", border: "none", borderRadius: 24, padding: "32px 20px", fontSize: 20, fontWeight: 900, cursor: "pointer", gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: "0 10px 30px rgba(234,88,12,0.3)" }}>
               Log My Health
            </button>
            <button onClick={() => window.location.href='/chat'} style={{ background: th.s3, color: th.text, border: "none", borderRadius: 24, padding: "20px", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
               <MessageSquare size={20} color={th.accent} /> AI Chat
            </button>
            <button onClick={() => setShowVoice(true)} style={{ background: th.s3, color: th.text, border: "none", borderRadius: 24, padding: "20px", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
               <Mic size={20} color={G.orange} /> Nutrition AI
            </button>
        </div>
      </Card>

      {/* Vitals Display */}
      <Card th={th} full d={1} show={show}>
        <CH th={th} icon={<Pulse color={G.green} />} title="Recent Readings" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12, marginTop: 16 }}>
          {[{ k: "bp", label: "Blood Pressure", unit: "mmHg", icon: <Pulse size={24} />, tint: dark ? "#1a2820" : "#f0fdf4" },
          { k: "sugar", label: "Blood Sugar", unit: "mg/dL", icon: <Drop size={24} />, tint: dark ? "#0e1828" : "#eff6ff" },
          { k: "heart", label: "Haemoglobin", unit: "g/dL", icon: <Activity size={24} />, tint: dark ? "#28100e" : "#fff1f2" }].map(v => (
            <div key={v.k} style={{ borderRadius: 18, padding: "18px 16px", background: v.tint, border: `1.5px solid ${th.border}` }}>
               <div style={{ color: G.green }}>{v.icon}</div>
              <p style={{ color: th.sub, fontSize: 14, fontWeight: 600, marginTop: 9 }}>{v.label}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: th.text, lineHeight: 1 }}>{vitals[v.k]}</span>
                <span style={{ fontSize: 13, color: th.muted }}>{v.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </div>

      {/* SOS Button - UNMISSABLE */}
      <button onClick={triggerSOS} style={{
        position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        width: 140, height: 140, borderRadius: '50%', background: G.red, color: '#FFF',
        border: '10px solid rgba(255,255,255,0.2)', cursor: 'pointer', zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 50px rgba(220,38,38,0.5)', transition: 'transform 0.2s'
      }} onMouseDown={e => e.currentTarget.style.transform = 'translateX(-50%) scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}>
        <Shield size={48} />
        <span style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>SOS</span>
      </button>
    </main>
  );
};

export default SeniorDashboard;
