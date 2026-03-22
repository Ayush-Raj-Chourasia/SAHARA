import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Shield, Pulse, Drop, Pill, Bell, MessageSquare, Activity, Mic, Camera } from '../components/Icons';
import VitalsWizard from '../components/VitalsWizard';
import NutritionVoice from '../components/NutritionVoice';
import { MedicationCompliance } from '../components/ClinicalComponents';
import { Card, CH, Label, G } from '../components/DashboardComponents';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const SeniorDashboard = ({ th, dark, show, foodLog, setFoodLog }) => {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latestLog, setLatestLog] = useState(null);
  const [history, setHistory] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({ kcal: 0, protein: 0, logs: [], meal_status: [] });
  const [refreshTick, setRefreshTick] = useState(0);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const sosIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const score = latestLog?.score ?? 0;
  const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
  const lbl = score >= 80 ? 'Good Condition' : score >= 60 ? 'Monitor Closely' : 'Needs Attention';
  const circ = 2 * Math.PI * 50;

  const vitals = useMemo(() => ({
    bp: latestLog ? `${latestLog.bp_sys}/${latestLog.bp_dia}` : '--/--',
    sugar: latestLog?.sugar ?? '--',
    hr: latestLog?.heart_rate ?? '--',
    hb: latestLog?.haemoglobin ?? '--',
  }), [latestLog]);

  const missedMeals = useMemo(
    () => (nutritionSummary?.meal_status || []).filter((m) => m.missed),
    [nutritionSummary]
  );

  const alerts = useMemo(() => {
    if (!latestLog) {
      return [{ severity: 'info', title: 'No readings yet', message: 'Log today\'s vitals to enable risk analysis and personalized AI guidance.' }];
    }
    if (latestLog?.anomalies?.length) {
      return latestLog.anomalies.map((a) => ({
        severity: 'high',
        title: a.param || 'Anomaly detected',
        message: a.message || 'Recent readings show an unusual pattern.',
      }));
    }
    return [{ severity: 'ok', title: 'No active risk flags', message: 'Your latest readings are stable based on available trend data.' }];
  }, [latestLog]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      if (!user?.id) {
        if (active) setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('sahara_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [hRes, nRes] = await Promise.all([
          apiFetch(`/api/health/history/${user.id}?limit=7`, { headers }),
          apiFetch(`/api/nutrition/today/${user.id}`, { headers }),
        ]);

        if (active && hRes.ok) {
          const rows = await hRes.json();
          setHistory(rows || []);
          setLatestLog(rows?.[0] || null);
        }

        if (active && nRes.ok) {
          const n = await nRes.json();
          setNutritionSummary({
            kcal: n?.summary?.kcal || 0,
            protein: n?.summary?.protein || 0,
            logs: n?.logs || [],
            meal_status: n?.meal_status || [],
          });
        }
      } catch (err) {
        console.error('Senior dashboard fetch failed', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    const id = setInterval(loadData, 15000);
    return () => {
      active = false;
      clearInterval(id);
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    };
  }, [user?.id, refreshTick]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (ev) => {
       const base64Str = ev.target.result;
       try {
         alert('Processing food image... Please wait.');
         const token = localStorage.getItem('sahara_token');
         const res = await apiFetch(`/api/nutrition/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ prompt: "Analyze this Indian food visually", image: base64Str, meal_type: "snacks" })
         });
         const data = await res.json();
         if (data.results && data.results.length > 0) {
            for (let m of data.results) {
               await apiFetch(`/api/nutrition/log`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ user_id: user.id, ...m })
               });
            }
            alert(`✅ Visual AI Logged: ${data.results.map(r => r.name).join(', ')}`);
            setRefreshTick(v => v + 1);
         } else {
            alert('AI could not recognize any edible food in this image.');
         }
       } catch (err) {
         console.error(err);
         alert('Visual processing failed. Try again.');
       }
    };
    reader.readAsDataURL(file);
  };

  const autoAddMeal = async (mealType) => {
    try {
      const token = localStorage.getItem('sahara_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await apiFetch(`/api/nutrition/auto-log/${user?.id}?meal_type=${mealType}`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.detail || 'Auto meal log failed');
      }
      setRefreshTick((v) => v + 1);
    } catch (err) {
      console.error('Auto meal add failed', err);
      alert('Could not auto log meal right now.');
    }
  };

  const startSOSLoop = () => {
    setIsSOSActive(true);

    const sendAlert = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const token = localStorage.getItem('sahara_token');
            const res = await apiFetch('/api/emergency/sos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ user_id: user?.id, latitude, longitude }),
            });
            if (!res.ok) console.warn('SOS iteration failed');
          } catch (err) {
            console.error('SOS Error:', err);
          }
        },
        () => console.warn('Location unavailable for SOS')
      );
    };

    sendAlert(); // Initial burst
    alert('SOS SENT! Your location is being shared with your family continuously.');

    sosIntervalRef.current = setInterval(sendAlert, 60000); // Pulse every 1 min to respect Twilio limits
  };

  const stopSOSLoop = () => {
    setIsSOSActive(false);
    if (sosIntervalRef.current) {
      clearInterval(sosIntervalRef.current);
      sosIntervalRef.current = null;
    }
    alert('SOS alerts stopped.');
  };

  const toggleSOS = () => {
    if (isSOSActive) stopSOSLoop();
    else startSOSLoop();
  };

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 18px 150px' }}>
      {isSOSActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1001, background: '#dc2626', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>EMERGENCY ALARM ACTIVATED</h2>
          <p style={{ fontSize: 20, marginBottom: 40, textAlign: 'center', maxWidth: 600 }}>Your location is being transmitted to your emergency contacts continuously. Help is on the way.</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={stopSOSLoop}
              style={{ padding: '24px 48px', fontSize: 24, fontWeight: 900, background: '#fff', color: '#dc2626', border: 'none', borderRadius: 48, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            >
              STOP SOS
            </button>
            <button
              onClick={() => window.location.href = 'tel:108'}
              style={{ padding: '24px 48px', fontSize: 24, fontWeight: 900, background: '#000', color: '#fff', border: 'none', borderRadius: 48, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            >
              CALL 108 (AMBULANCE)
            </button>
          </div>
        </div>
      )}
      {showWizard && <VitalsWizard th={th} onClose={() => setShowWizard(false)} onComplete={() => { setShowWizard(false); setRefreshTick((v) => v + 1); }} />}
      {showVoice && <NutritionVoice th={th} dark={dark} onClose={() => setShowVoice(false)} onAdd={(f) => { setFoodLog([...(foodLog || []), f]); setRefreshTick((v) => v + 1); }} />}

      {missedMeals.length > 0 && (
        <div style={{ marginBottom: 16, background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14, padding: 12 }}>
          <p style={{ fontWeight: 900, color: '#991b1b' }}>Meal Reminder</p>
          <p style={{ color: '#991b1b', marginTop: 4 }}>
            You have missed: {missedMeals.map((m) => m.meal_type).join(', ')}. Please log meal intake.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,480px),1fr))', gap: 18 }}>
        <Card th={th} full d={0} show={show}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 116, height: 116, flexShrink: 0 }}>
              <svg width={116} height={116} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={58} cy={58} r={50} fill="none" stroke={th.s3} strokeWidth={9} />
                <circle
                  cx={58}
                  cy={58}
                  r={50}
                  fill="none"
                  stroke={col}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  style={{ strokeDashoffset: show ? circ - (score / 100) * circ : circ, transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: col, lineHeight: 1 }}>{score || '--'}</span>
                <span style={{ fontSize: 10, color: th.muted, letterSpacing: '.06em' }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Label>Today's Health Status</Label>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: col, marginTop: 4 }}>{loading ? 'Loading...' : lbl}</h2>
              <p style={{ color: th.sub, fontSize: 14, marginTop: 4 }}>
                {latestLog ? 'Based on your latest real readings from backend analysis.' : 'No readings logged yet for today.'}
              </p>
            </div>
          </div>
        </Card>

        <Card th={th} full d={0.5} show={show}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
            <button onClick={() => setShowWizard(true)} style={{ background: G.orange, color: '#fff', border: 'none', borderRadius: 24, padding: '24px 20px', fontSize: 20, fontWeight: 900, cursor: 'pointer', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 10px 30px rgba(234,88,12,0.3)' }}>
              <Activity size={24} /> Log My Health
            </button>
            <button onClick={() => fileInputRef.current?.click()} style={{ background: th.s2, color: th.text, border: `1.5px solid ${th.border}`, borderRadius: 20, padding: '18px', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Camera size={20} color={G.green} /> Snap Food
            </button>
            <button onClick={() => setShowVoice(true)} style={{ background: th.s2, color: th.text, border: `1.5px solid ${th.border}`, borderRadius: 20, padding: '18px', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Mic size={20} color={G.orange} /> Nutrition AI
            </button>
            <button onClick={() => (window.location.href = '/chat')} style={{ background: th.s2, color: th.text, border: `1.5px solid ${th.border}`, borderRadius: 20, padding: '18px', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <MessageSquare size={20} color={th.accent} /> AI Chat
            </button>
          </div>
        </Card>

        <Card th={th} d={1} show={show}>
          <CH th={th} icon={<Pulse color={G.green} />} title="Recent Readings" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { l: 'Blood Pressure', v: vitals.bp, u: 'mmHg', i: <Pulse color={G.green} /> },
              { l: 'Blood Sugar', v: vitals.sugar, u: 'mg/dL', i: <Drop color="#3b82f6" /> },
              { l: 'Heart Rate', v: vitals.hr, u: 'bpm', i: <Activity color="#ef4444" /> },
              { l: 'Haemoglobin', v: vitals.hb, u: 'g/dL', i: <Activity color="#8b5cf6" /> },
            ].map((v) => (
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
          <p style={{ marginTop: 12, fontSize: 12, color: th.muted }}>
            Backend logs loaded: {history.length}
          </p>
        </Card>

        <Card th={th} d={1.2} show={show}>
          <CH th={th} icon={<Drop color={G.red} />} title="Anaemia Risk Analysis" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: latestLog?.anaemia_risk === 'HIGH' ? '#fef2f2' : latestLog?.anaemia_risk === 'MEDIUM' ? '#fffbeb' : '#f0fdf4', border: `1px solid ${latestLog?.anaemia_risk === 'HIGH' ? '#fecaca' : latestLog?.anaemia_risk === 'MEDIUM' ? '#fde68a' : '#bbf7d0'}`, padding: 20, borderRadius: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: latestLog?.anaemia_risk === 'HIGH' ? G.red : latestLog?.anaemia_risk === 'MEDIUM' ? G.amber : G.green, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              {latestLog?.anaemia_risk || 'N/A'}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: th.text }}>WHO Standard Assessment</h3>
              <p style={{ fontSize: 13, color: th.sub, marginTop: 4 }}>
                {latestLog?.anaemia_risk === 'HIGH' ? 'Critical anaemia risk detected. Please consult a doctor and increase iron intake instantly.' : latestLog?.anaemia_risk === 'MEDIUM' ? 'Moderate risk. Include more iron-rich foods like spinach and legumes.' : latestLog?.anaemia_risk === 'LOW' ? 'Your haemoglobin levels are looking healthy.' : 'Log your vitals to calculate risk.'}
              </p>
            </div>
          </div>
        </Card>

        <Card th={th} d={1.5} show={show}>
          <CH th={th} icon={<Pill color="#3b82f6" />} title="Medication & Nutrition" />
          <div style={{ background: dark ? '#12181f' : '#eff6ff', padding: 20, borderRadius: 20 }}>
            <h4 style={{ fontSize: 18, fontWeight: 900 }}>Today's Nutrition Summary</h4>
            <p style={{ fontSize: 14, color: '#3b82f6', fontWeight: 700 }}>
              {nutritionSummary.kcal} kcal · {nutritionSummary.protein} g protein
            </p>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(nutritionSummary?.meal_status || []).map((m) => (
              <div key={m.meal_type} style={{ border: `1px solid ${th.border}`, borderRadius: 12, padding: 10, background: m.logged ? '#f0fdf4' : m.missed ? '#fef2f2' : th.s2 }}>
                <p style={{ fontWeight: 800, textTransform: 'capitalize' }}>{m.meal_type}</p>
                <p style={{ fontSize: 12, color: m.logged ? '#166534' : th.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.logged && m.entry ? `${m.entry.food_name} (${m.entry.kcal} kcal)` : ''}>
                  {m.logged ? (m.entry?.food_name ? `${m.entry.food_name} • ${m.entry.kcal} kcal` : 'Logged') : m.missed ? 'Missed' : `Due by ${m.due_hour}:00`}
                </p>
                {!m.logged && (
                  <button
                    onClick={() => autoAddMeal(m.meal_type)}
                    style={{ marginTop: 8, border: 'none', background: G.orange, color: '#fff', borderRadius: 10, padding: '6px 10px', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
                  >
                    Auto Add
                  </button>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            {(nutritionSummary?.logs || []).slice(0, 6).map((l) => (
              <div key={l._id} style={{ background: th.s2, borderRadius: 12, padding: 10, border: `1px solid ${th.border}` }}>
                <p style={{ fontWeight: 800, textTransform: 'capitalize' }}>{l.meal_type}: {l.food_name}</p>
                <p style={{ fontSize: 12, color: th.muted }}>{l.kcal} kcal · {l.protein} g protein</p>
              </div>
            ))}
          </div>
          <MedicationCompliance th={th} dark={dark} />
        </Card>

        <Card th={th} full d={2} show={show}>
          <CH th={th} icon={<Bell color={G.red} />} title="Health Alerts" />
          <div style={{ display: 'grid', gap: 10 }}>
            {alerts.map((a, idx) => {
              const tone = a.severity === 'high' ? { bg: '#fef2f2', bd: '#fecaca', tx: '#991b1b' } : a.severity === 'ok' ? { bg: '#f0fdf4', bd: '#bbf7d0', tx: '#166534' } : { bg: th.s2, bd: th.border, tx: th.text };
              return (
                <div key={idx} style={{ background: tone.bg, border: `1.5px solid ${tone.bd}`, borderRadius: 14, padding: 14 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: tone.tx }}>{a.title}</p>
                  <p style={{ fontSize: 13, marginTop: 6, color: tone.tx }}>{a.message}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <button
        onClick={toggleSOS}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: G.red,
          color: '#FFF',
          border: '8px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSOSActive ? '0 0 50px rgba(220,38,38,0.9)' : '0 16px 36px rgba(220,38,38,0.45)',
          animation: isSOSActive ? 'pulse 1s infinite' : 'none',
        }}
      >
        <Shield size={28} />
        <span style={{ fontSize: isSOSActive ? 14 : 20, fontWeight: 900, marginTop: 2 }}>{isSOSActive ? 'STOP SOS' : 'SOS'}</span>
      </button>
    </main>
  );
};

export default SeniorDashboard;
