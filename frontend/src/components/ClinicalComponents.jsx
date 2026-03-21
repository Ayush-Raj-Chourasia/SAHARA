import React from 'react';
import { G } from './DashboardComponents';
import { Pill, Check, X, Shield, Info, AlertTriangle } from './Icons';

export const MedicationCompliance = ({ th, dark }) => {
    const days = [
        { d: 'M', t: true }, { d: 'T', t: true }, { d: 'W', t: false },
        { d: 'T', t: true }, { d: 'F', t: true }, { d: 'S', t: true }, { d: 'S', t: null }
    ];

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: th.textMuted }}>This Week</h4>
                <span style={{ fontSize: 13, fontWeight: 800, color: G.green }}>85% Success</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                {days.map((day, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                            width: '100%', aspectRatio: '1/1', borderRadius: 12, 
                            background: day.t === true ? G.green : day.t === false ? G.red : th.s3,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
                            color: '#FFF'
                        }}>
                            {day.t === true && <Check w={16} />}
                            {day.t === false && <X w={16} />}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: th.textMuted }}>{day.d}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnaemiaRiskCard = ({ th, dark, G }) => {
    return (
        <div style={{ background: '#fef2f2', border: `1.5px solid #fee2e2`, borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#ef4444', color: '#FFF', padding: 6, borderRadius: 8 }}>
                    <Shield w={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#991b1b' }}>Anaemia Early Warning</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
                <div style={{ padding: '4px 12px', borderRadius: 99, background: '#ef4444', color: '#FFF', fontSize: 12, fontWeight: 900 }}>HIGH RISK</div>
                <span style={{ fontSize: 13, color: '#b91c1c', fontWeight: 700 }}>Declining Hb Trend</span>
            </div>

            <p style={{ fontSize: 14, color: '#7f1d1d', lineHeight: 1.5, marginBottom: 15 }}>
                Your haemoglobin has dropped <strong>1.2g/dL</strong> in 7 days. This is a significant decline even though it is still above 10.
            </p>

            <div style={{ background: '#FFF', padding: '12px 15px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Info size={16} color="#ef4444" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Recommendation: Consult a doctor.</span>
            </div>
        </div>
    );
};
