import React, { useState } from 'react';
import { G } from './DashboardComponents';
import { ArrowLeft, ArrowRight, Check, Pulse, Drop, Heart, Activity } from './Icons';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STEPS = [
    { k: 'bp_sys', label: 'Blood Pressure (Systolic)', icon: <Pulse size={48} color={G.orange} />, unit: 'mmHg', placeholder: '120', hint: 'The top number from your machine' },
    { k: 'bp_dia', label: 'Blood Pressure (Diastolic)', icon: <Pulse size={48} color={G.orange} />, unit: 'mmHg', placeholder: '80', hint: 'The bottom number' },
    { k: 'sugar', label: 'Blood Sugar', icon: <Drop size={48} color="#3b82f6" />, unit: 'mg/dL', placeholder: '100', hint: 'Read from your glucose meter' },
    { k: 'heart_rate', label: 'Heart Rate', icon: <Heart size={48} color="#ef4444" />, unit: 'bpm', placeholder: '72', hint: 'Read from your pulse monitor' },
    { k: 'haemoglobin', label: 'Haemoglobin', icon: <Activity size={48} color="#8b5cf6" />, unit: 'g/dL', placeholder: '12.5', hint: 'From your latest blood report' },
    { k: 'fatigue', label: 'How tired do you feel?', icon: <Heart size={48} color="#8b5cf6" />, unit: '1-10 Scale', placeholder: '4', hint: '1 = Energetic, 10 = Very Tired' },
];

const VitalsWizard = ({ onComplete, onClose, th }) => {
    const { user } = useAuth();
    const [idx, setIdx] = useState(0);
    const [data, setData] = useState({});
    const [val, setVal] = useState('');
    const [busy, setBusy] = useState(false);

    const step = STEPS[idx];

    const handleNext = async () => {
        const newData = { ...data, [step.k]: val };
        setData(newData);
        setVal('');
        if (idx < STEPS.length - 1) {
            setIdx(idx + 1);
        } else {
            // Final Step - Submit to Backend
            try {
                setBusy(true);
                const token = localStorage.getItem('sahara_token');
                const userObj = JSON.parse(localStorage.getItem('sahara_user') || '{}');
                const uid = user?.id || userObj.id;
                
                const res = await apiFetch('/api/health/log', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_id: uid,
                        bp_sys: parseInt(newData.bp_sys),
                        bp_dia: parseInt(newData.bp_dia),
                        sugar: parseInt(newData.sugar),
                        heart_rate: parseInt(newData.heart_rate),
                        haemoglobin: parseFloat(newData.haemoglobin),
                        fatigue: parseInt(newData.fatigue)
                    })
                });
                
                if (res.ok) {
                    onComplete(newData);
                } else {
                    alert('Failed to sync vitals. Please retry.');
                }
            } catch (err) {
                console.error("Vitals submission error", err);
                alert('Vitals submission failed. Please retry.');
            } finally {
                setBusy(false);
            }
        }
    };

    const autoFetch = async () => {
        try {
            setBusy(true);
            const token = localStorage.getItem('sahara_token');
            const userObj = JSON.parse(localStorage.getItem('sahara_user') || '{}');
            const uid = user?.id || userObj.id;
            const res = await apiFetch(`/api/health/auto-log/${uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const out = await res.json();
            if (!res.ok) {
                throw new Error(out?.detail || 'Auto-fetch failed');
            }
            onComplete(out);
        } catch (err) {
            console.error('Auto vitals fetch failed', err);
            alert('Auto fetch failed. Try manual entry.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: th.bg, zIndex: 100, display: 'flex', flexDirection: 'column', p: 20 }}>
            {/* Header */}
            <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 15, borderBottom: `1px solid ${th.border}` }}>
                <button onClick={idx === 0 ? onClose : () => setIdx(idx - 1)} style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer' }}>
                    <ArrowLeft w={24} />
                </button>
                <div style={{ flex: 1, height: 8, background: th.s2, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${((idx + 1) / STEPS.length) * 100}%`, height: '100%', background: G.orange, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontWeight: 800, fontSize: 14, color: th.text }}>{idx + 1}/{STEPS.length}</span>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
                <div style={{ marginBottom: 30, padding: 30, borderRadius: 32, background: th.s2 }}>
                    {step.icon}
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>{step.label}</h1>
                <p style={{ fontSize: 18, color: th.textMuted || th.muted, marginBottom: 40 }}>{step.hint}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
                    <input 
                        type="number"
                        autoFocus
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        placeholder={step.placeholder}
                        style={{ fontSize: 48, fontWeight: 800, width: 180, textAlign: 'center', background: 'none', border: 'none', borderBottom: `4px solid ${G.orange}`, outline: 'none', color: th.text }}
                    />
                    <span style={{ fontSize: 24, fontWeight: 800, color: th.textMuted || th.muted }}>{step.unit}</span>
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={!val || busy}
                    style={{ 
                        width: '100%', maxWidth: 400, padding: 24, borderRadius: 24, 
                        background: val && !busy ? G.orange : th.s2, color: val && !busy ? '#FFF' : (th.textMuted || th.muted), 
                        border: 'none', fontSize: 24, fontWeight: 900, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        boxShadow: val && !busy ? '0 10px 30px rgba(234,88,12,0.3)' : 'none'
                    }}>
                    {busy ? 'Saving...' : idx === STEPS.length - 1 ? 'Finish & Save' : 'Next Question'} 
                    {idx === STEPS.length - 1 ? <Check w={24} /> : <ArrowRight w={24} />}
                </button>
                <button
                    onClick={autoFetch}
                    disabled={busy}
                    style={{
                        marginTop: 12,
                        width: '100%',
                        maxWidth: 400,
                        padding: 14,
                        borderRadius: 18,
                        border: `1.5px solid ${th.border}`,
                        background: th.s2,
                        color: th.text,
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: 'pointer',
                    }}
                >
                    Auto Fetch from Sensor (Simulated)
                </button>
            </div>
        </div>
    );
};

export default VitalsWizard;
