import React from 'react';
import { Shield, Pulse, Drop, Heart, Fork, Pill, Moon, Steps, Bell, Send, Family, Activity } from '../components/Icons';

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

const FamilyDashboard = (props) => {
    const { th, dark, vitals, medTaken, kcal, prot, sleep, steps, score, logs, setLogs, sent, pushAlert, foodLog, now, show, G, MEALS_CFG, countdown } = props;
    const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
    
    return (
        <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>

            <Card th={th} full d={0} show={show}>
                <div style={{ display: "flex", alignItems: "center", gap: 15, flexWrap: "wrap", marginBottom: 17 }}>
                    <div style={{ width: 62, height: 62, borderRadius: 17, background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>👴</div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 25, fontWeight: 800, color: th.text }}>Raj Kumar</p>
                        <p style={{ color: th.sub, fontSize: 14, marginTop: 2 }}>Age 68 · Mumbai · Last sync: Today 8:30 AM</p>
                    </div>
                    <div style={{ textAlign: "center", background: `${col}12`, border: `1.5px solid ${col}28`, borderRadius: 15, padding: "11px 19px" }}>
                        <p style={{ fontSize: 10, color: th.muted, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Score</p>
                        <p style={{ fontSize: 36, fontWeight: 800, color: col, lineHeight: 1 }}>{score}</p>
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))", gap: 9 }}>
                    {[{ l: "Blood Pressure", v: vitals.bp, s: "g" }, { l: "Heart Rate", v: `${vitals.heart} bpm`, s: "g" },
                    { l: "Blood Sugar", v: `${vitals.sugar} mg/dL`, s: "g" }, { l: "Medication", v: medTaken ? "Taken ✓" : "Pending", s: medTaken ? "g" : "a" }
                    ].map(i => {
                        const c = i.s === "g" ? G.green : G.amber;
                        return (
                            <div key={i.l} style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "12px 11px", textAlign: "center" }}>
                                <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block", marginBottom: 6 }} />
                                <p style={{ color: th.sub, fontSize: 11, fontWeight: 700 }}>{i.l}</p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: c, marginTop: 3 }}>{i.v}</p>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card th={th} full d={1} show={show}>
                <CH th={th} icon={<Bell color={G.red} />} title="Recent Alerts">
                    <button style={{ background: 'none', border: 'none', color: th.sub, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
                </CH>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {logs.map(log => (
                        <div key={log.id} style={{ display: "flex", alignItems: "center", gap: 12, background: th.s2, border: `1px solid ${th.border}`, borderRadius: 14, padding: "12px 15px" }}>
                            <div style={{ fontSize: 18 }}>{log.type === 'food' ? '🍽️' : '💊'}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{log.msg}</p>
                                <p style={{ fontSize: 12, color: th.muted }}>{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card th={th} d={2} show={show}>
                <CH th={th} icon={<Send color={th.accent} />} title="Nudge Senior" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                    {['Water', 'Medicine', 'Walk', 'Food'].map(type => (
                        <button key={type} onClick={() => pushAlert(type, `Sent ${type} nudge`)} style={{ padding: '14px', borderRadius: '12px', background: th.s2, border: `1px solid ${th.border}`, color: th.text, fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                            Remind {type}
                        </button>
                    ))}
                </div>
            </Card>

            <Card th={th} d={3} show={show}>
                <CH th={th} icon={<Activity color={G.green} />} title="Weekly Stats" />
                <div style={{ height: 140, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '10px 0' }}>
                    {[65, 78, 82, 75, 88, 92, 82].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: i === 6 ? G.green : th.s3, height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d} style={{ fontSize: 11, color: th.muted, fontWeight: 800 }}>{d}</span>)}
                </div>
            </Card>

        </main>
    );
};

export default FamilyDashboard;
