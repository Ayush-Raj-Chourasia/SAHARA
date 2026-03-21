import React, { useState } from 'react';
import { Shield, Pulse, Drop, Heart, Fork, Pill, Moon, Steps, Bell, Send, Trash, Edit, Plus, Info, Check, MessageSquare, ArrowLeft, ArrowRight, Activity, Mic } from '../components/Icons';
import VitalsWizard from '../components/VitalsWizard';
import NutritionVoice from '../components/NutritionVoice';
import { MedicationCompliance, AnaemiaRiskCard } from '../components/ClinicalComponents';
import { Card, CH, Label, G } from '../components/DashboardComponents';

const SeniorDashboard = (props) => {
  const { th, dark, vitals, setVitals, kcal, prot, score, show } = props;
  const [showWizard, setShowWizard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const handleVitalsComplete = (newData) => {
    setVitals({
        bp: `${newData.bp_sys}/${newData.bp_dia}`,
        sugar: newData.sugar,
        heart: newData.hb 
    });
    setShowWizard(false);
  };

  const triggerSOS = () => {
    if (window.confirm("TRIGGER SOS ALERT? Your family will be notified immediately.")) {
        alert("SOS SENT! GPS: 20.2961° N, 85.8245° E. SMS sent to linked contacts.");
    }
  };

  const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
  const lbl = score >= 80 ? "Good Condition" : score >= 60 ? "Monitor Closely" : "Needs Attention";
  const circ = 2 * Math.PI * 50;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 180px" }}>
      {showWizard && <VitalsWizard th={th} onClose={() => setShowWizard(false)} onComplete={handleVitalsComplete} />}
      {showVoice && <NutritionVoice th={th} dark={dark} onClose={() => setShowVoice(false)} onAdd={(f) => props.setFoodLog([...props.foodLog, f])} />}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>
        
        {/* Profile & Health Score (§4.1) */}
        <Card th={th} full d={0} show={show}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
                    <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
                        <circle cx={58} cy={58} r={50} fill="none" stroke={th.s3} strokeWidth={9} />
                        <circle cx={58} cy={58} r={50} fill="none" stroke={col} strokeWidth={9}
                            strokeLinecap="round" strokeDasharray={circ}
                            style={{ strokeDashoffset: show ? circ - (score / 100) * circ : circ, transition: "stroke-dashoffset 1s ease" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: col, lineHeight: 1 }}>{score}</span>
                        <span style={{ fontSize: 10, color: th.muted, letterSpacing: ".06em" }}>/100</span>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <Label>Today's Health Status</Label>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: col, marginTop: 4 }}>{lbl}</h2>
                    <p style={{ color: th.sub, fontSize: 14, marginTop: 4 }}>Based on your last readings & nutrition.</p>
                </div>
            </div>
        </Card>

        {/* Primary Actions (§4.1 & §4.2) */}
        <Card th={th} full d={0.5} show={show}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button onClick={() => setShowWizard(true)} style={{ background: G.orange, color: "#fff", border: "none", borderRadius: 24, padding: "32px 20px", fontSize: 20, fontWeight: 900, cursor: "pointer", gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: "0 10px 30px rgba(234,88,12,0.3)" }}>
                    <Activity size={24} /> Log My Health
                </button>
                <button onClick={() => setShowVoice(true)} style={{ background: th.s3, color: th.text, border: "none", borderRadius: 24, padding: "20px", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Mic size={20} color={G.orange} /> Nutrition AI
                </button>
                <button onClick={() => window.location.href='/chat'} style={{ background: th.s3, color: th.text, border: "none", borderRadius: 24, padding: "20px", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <MessageSquare size={20} color={th.accent} /> AI Chat
                </button>
            </div>
        </Card>

        {/* Vitals Summary (§4.1) */}
        <Card th={th} d={1} show={show}>
            <CH th={th} icon={<Pulse color={G.green} />} title="Recent Readings" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[{ l: 'Blood Pressure', v: vitals.bp, u: 'mmHg', i: <Pulse color={G.green} /> },
                  { l: 'Blood Sugar', v: vitals.sugar, u: 'mg/dL', i: <Drop color="#3b82f6" /> },
                  { l: 'Haemoglobin', v: vitals.heart, u: 'g/dL', i: <Activity color="#ef4444" /> }].map(v => (
                    <div key={v.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: th.s2, borderRadius: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {v.i}
                            <span style={{ fontWeight: 700 }}>{v.l}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: 20, fontWeight: 900 }}>{v.v}</span>
                            <span style={{ fontSize: 12, color: th.muted, marginLeft: 4 }}>{v.u}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Medication Compliance (§4.6) */}
        <Card th={th} d={1.5} show={show}>
            <CH th={th} icon={<Pill color="#3b82f6" />} title="Medications" />
            <div style={{ background: dark ? "#12181f" : "#eff6ff", padding: 20, borderRadius: 20 }}>
                <h4 style={{ fontSize: 20, fontWeight: 900 }}>Metformin</h4>
                <p style={{ fontSize: 14, color: '#3b82f6', fontWeight: 700 }}>2:00 PM · After Lunch</p>
                <button style={{ width: '100%', marginTop: 15, padding: 12, borderRadius: 12, background: '#3b82f6', color: '#FFF', border: 'none', fontWeight: 800 }}>Mark as Taken</button>
            </div>
            <MedicationCompliance th={th} dark={dark} />
        </Card>

        {/* Anaemia Warning (§4.3) */}
        <Card th={th} full d={2} show={show}>
            <CH th={th} icon={<Bell color={G.red} />} title="Health Alerts" />
            <AnaemiaRiskCard th={th} dark={dark} G={G} />
        </Card>

      </div>

      {/* SOS Button (§4.4) */}
      <button onClick={triggerSOS} style={{
        position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        width: 140, height: 140, borderRadius: '50%', background: G.red, color: '#FFF',
        border: '10px solid rgba(255,255,255,0.2)', cursor: 'pointer', zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 50px rgba(220,38,38,0.5)'
      }}>
        <Shield size={48} />
        <span style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>SOS</span>
      </button>

    </main>
  );
};

export default SeniorDashboard;
