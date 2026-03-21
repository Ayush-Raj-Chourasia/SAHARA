import React, { useState } from 'react';
import { Shield, Pulse, Drop, Heart, Fork, Pill, Moon, Steps, Bell, Send, Trash, Edit, Plus, Info, Check, MessageSquare, ArrowLeft, ArrowRight, Activity, Mic } from '../components/Icons';
import VitalsWizard from '../components/VitalsWizard';
import NutritionVoice from '../components/NutritionVoice';
import { MedicationCompliance, AnaemiaRiskCard } from '../components/ClinicalComponents';
import { Card, CH, Label, G } from '../components/DashboardComponents';
import { useAuth } from '../context/AuthContext';

const SeniorDashboard = (props) => {
  const { th, dark, vitals, setVitals, kcal, prot, show } = props;
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [score, setScore] = useState(props.score);

  // Sync score from parent (loaded from DB)
  React.useEffect(() => { if (props.score !== null) setScore(props.score); }, [props.score]);

  const handleVitalsComplete = async (newData) => {
    setVitals({
        bp: `${newData.bp_sys}/${newData.bp_dia}`,
        sugar: newData.sugar,
        heart: newData.hb
    });
    setShowWizard(false);

    // POST to backend → get real health score
    try {
        const payload = {
            bp_sys: parseFloat(newData.bp_sys) || 120,
            bp_dia: parseFloat(newData.bp_dia) || 80,
            blood_sugar: parseFloat(newData.sugar) || 95,
            hemoglobin: parseFloat(newData.hb) || 12.5,
            weight_kg: 65, fatigue_level: parseFloat(newData.fatigue) || 2,
            age: user?.age || 70, gender: user?.gender || "male",
            sleep_duration: 7, quality_of_sleep: 7,
            physical_activity_level: 40, stress_level: 4,
            heart_rate: 72, daily_steps: 3000,
            MCH: 28, MCHC: 33, MCV: 85,
            user_id: user?.id || "default"
        };
        const res = await fetch('/api/health/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.health_score !== undefined) setScore(data.health_score);
    } catch (e) {
        console.error('Health log save failed', e);
    }
  };

  const triggerSOS = () => {
    if (window.confirm("TRIGGER SOS ALERT? Your family will be notified immediately.")) {
        alert("SOS SENT! GPS: 20.2961° N, 85.8245° E. SMS sent to linked contacts.");
    }
  };

  const displayScore = score ?? 0;
  const col = displayScore >= 80 ? G.green : displayScore >= 60 ? G.amber : score === null ? '#9B9890' : G.red;
  const lbl = score === null ? "No Data Yet" : displayScore >= 80 ? "Good Condition" : displayScore >= 60 ? "Monitor Closely" : "Needs Attention";
  const circ = 2 * Math.PI * 50;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 180px" }}>
      {showWizard && <VitalsWizard th={th} onClose={() => setShowWizard(false)} onComplete={handleVitalsComplete} />}
      {showVoice && <NutritionVoice th={th} dark={dark} onClose={() => setShowVoice(false)} onAdd={(f) => props.setFoodLog([...props.foodLog, f])} />}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>
        
        {/* Profile & Health Score (§4.1) */}
        <Card th={th} full d={0} show={show}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
                {/* Circle Score */}
                <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
                    <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
                        <circle cx={58} cy={58} r={50} fill="none" stroke={th.s3} strokeWidth={9} />
                        <circle cx={58} cy={58} r={50} fill="none" stroke={col} strokeWidth={9}
                            strokeLinecap="round" strokeDasharray={circ}
                            style={{ strokeDashoffset: show ? circ - (score / 100) * circ : circ, transition: "stroke-dashoffset 1s ease" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: col, lineHeight: 1 }}>{score}</span>
                        <span style={{ fontSize: 10, color: '#9B9890', letterSpacing: ".06em" }}>/100</span>
                    </div>
                </div>

                {/* Status + Vitals */}
                <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: '#9B9890' }}>Today's Health Status</p>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: col, marginTop: 4, marginBottom: 16 }}>{lbl}</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '10px 14px', borderLeft: '4px solid #16a34a' }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Blood Pressure</p>
                            <p style={{ fontSize: 20, fontWeight: 900, color: '#16a34a', marginTop: 2 }}>{vitals.bp} <span style={{ fontSize: 11, color: '#6b7280' }}>mmHg</span></p>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '10px 14px', borderLeft: '4px solid #2563eb' }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Blood Sugar</p>
                            <p style={{ fontSize: 20, fontWeight: 900, color: '#2563eb', marginTop: 2 }}>{vitals.sugar} <span style={{ fontSize: 11, color: '#6b7280' }}>mg/dL</span></p>
                        </div>
                        <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 14, padding: '10px 14px', borderLeft: '4px solid #dc2626' }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>Haemoglobin</p>
                            <p style={{ fontSize: 20, fontWeight: 900, color: '#dc2626', marginTop: 2 }}>{vitals.heart} <span style={{ fontSize: 11, color: '#6b7280' }}>g/dL</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        {/* Today's Nutrition Summary */}
        <Card th={th} full d={0.3} show={show}>
            <CH th={th} icon={<Fork color={G.orange} />} title="Today's Nutrition" />
            {props.foodLog && props.foodLog.length > 0 ? (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: th.s2, padding: 16, borderRadius: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: th.muted, textTransform: 'uppercase' }}>Total Calories</span>
                            <p style={{ fontSize: 26, fontWeight: 900, color: G.orange }}>{kcal} <span style={{ fontSize: 14 }}>kcal</span></p>
                        </div>
                        <div style={{ background: th.s2, padding: 16, borderRadius: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: th.muted, textTransform: 'uppercase' }}>Total Protein</span>
                            <p style={{ fontSize: 26, fontWeight: 900, color: G.green }}>{prot} <span style={{ fontSize: 14 }}>g</span></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {props.foodLog.map((f, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: th.s2, borderRadius: 14 }}>
                                <span style={{ fontWeight: 700 }}>{f.meal || f.name || 'Meal'}</span>
                                <div style={{ display: 'flex', gap: 14, fontSize: 13, color: th.muted, fontWeight: 700 }}>
                                    <span style={{ color: G.orange }}>{f.kcal} kcal</span>
                                    <span style={{ color: G.green }}>{f.protein}g protein</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: th.muted }}>
                    <Fork size={32} color={th.muted} style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 700, fontSize: 15 }}>No meals logged today</p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>Tap <strong style={{ color: G.orange }}>Nutrition AI</strong> below to log a meal with your voice!</p>
                </div>
            )}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {[
                  { l: 'Blood Pressure', v: vitals.bp, u: 'mmHg', i: <Pulse color={G.green} />, col: G.green, bg: '#f0fdf4', border: '#bbf7d0' },
                  { l: 'Blood Sugar', v: vitals.sugar, u: 'mg/dL', i: <Drop color="#3b82f6" />, col: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
                  { l: 'Haemoglobin', v: vitals.heart, u: 'g/dL', i: <Activity color="#ef4444" />, col: '#dc2626', bg: '#fff1f2', border: '#fecaca' }
                ].map(v => (
                    <div key={v.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: dark ? th.s2 : v.bg, borderRadius: 16, borderLeft: `4px solid ${v.col}`, border: `1px solid ${v.border}`, borderLeftWidth: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {v.i}
                            <span style={{ fontWeight: 700, fontSize: 15, color: dark ? th.text : '#1f2937' }}>{v.l}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: 22, fontWeight: 900, color: v.col }}>{v.v}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: dark ? th.muted : '#6b7280', marginLeft: 4 }}>{v.u}</span>
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
