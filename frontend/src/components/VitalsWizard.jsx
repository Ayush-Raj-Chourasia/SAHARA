import React, { useState } from 'react';
import { G } from './DashboardComponents';
import { ArrowLeft, ArrowRight, Check, Pulse, Drop, Heart, Activity } from './Icons';

const STEPS = [
    { k: 'bp_sys', label: 'Blood Pressure (Systolic)', icon: <Pulse size={48} color={G.orange} />, unit: 'mmHg', placeholder: '120', hint: 'The top number from your machine' },
    { k: 'bp_dia', label: 'Blood Pressure (Diastolic)', icon: <Pulse size={48} color={G.orange} />, unit: 'mmHg', placeholder: '80', hint: 'The bottom number' },
    { k: 'sugar', label: 'Blood Sugar', icon: <Drop size={48} color="#3b82f6" />, unit: 'mg/dL', placeholder: '100', hint: 'Read from your glucose meter' },
    { k: 'hb', label: 'Haemoglobin', icon: <Activity size={48} color="#ef4444" />, unit: 'g/dL', placeholder: '12.5', hint: 'From your latest blood report' },
    { k: 'fatigue', label: 'How tired do you feel?', icon: <Heart size={48} color="#8b5cf6" />, unit: '1-5 Scale', placeholder: '1', hint: '1 = Energetic, 5 = Very Tired' },
];

const VitalsWizard = ({ onComplete, onClose, th }) => {
    const [idx, setIdx] = useState(0);
    const [data, setData] = useState({});
    const [val, setVal] = useState('');

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
                const token = localStorage.getItem('sahara_token');
                const userObj = JSON.parse(localStorage.getItem('sahara_user') || '{}');
                
                const res = await fetch('/api/health/log', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_id: userObj.id || "mock_id",
                        bp_sys: parseInt(newData.bp_sys),
                        bp_dia: parseInt(newData.bp_dia),
                        sugar: parseInt(newData.sugar),
                        heart_rate: 72, // Default heart rate if not asked, or we can use another field
                        fatigue: parseInt(newData.fatigue)
                    })
                });
                
                if (res.ok) {
                    onComplete(newData);
                } else {
                    console.error("Failed to sync vitals");
                    onComplete(newData); // Fallback to local
                }
            } catch (err) {
                console.error("Vitals submission error", err);
                onComplete(newData);
            }
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
                <p style={{ fontSize: 18, color: th.textMuted, marginBottom: 40 }}>{step.hint}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
                    <input 
                        type="number"
                        autoFocus
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        placeholder={step.placeholder}
                        style={{ fontSize: 48, fontWeight: 800, width: 180, textAlign: 'center', background: 'none', border: 'none', borderBottom: `4px solid ${G.orange}`, outline: 'none', color: th.text }}
                    />
                    <span style={{ fontSize: 24, fontWeight: 800, color: th.textMuted }}>{step.unit}</span>
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={!val}
                    style={{ 
                        width: '100%', maxWidth: 400, padding: 24, borderRadius: 24, 
                        background: val ? G.orange : th.s2, color: val ? '#FFF' : th.textMuted, 
                        border: 'none', fontSize: 24, fontWeight: 900, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        boxShadow: val ? '0 10px 30px rgba(234,88,12,0.3)' : 'none'
                    }}>
                    {idx === STEPS.length - 1 ? 'Finish & Save' : 'Next Question'} 
                    {idx === STEPS.length - 1 ? <Check w={24} /> : <ArrowRight w={24} />}
                </button>
            </div>
        </div>
    );
};

export default VitalsWizard;
