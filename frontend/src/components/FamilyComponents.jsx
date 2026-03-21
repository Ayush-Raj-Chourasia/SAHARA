import React from 'react';
import { G, Label } from './DashboardComponents';
import { Sparkles, MapPin, AlertCircle, Clock } from './Icons';

export const AIWeeklySummary = ({ summaryText, nutritionAdherence, medsCompliance }) => {
    return (
        <div style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)', padding: 24, borderRadius: 28, border: '1px solid #E4E2DB', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}><Sparkles size={120} /></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#111827', color: '#FFF', padding: 8, borderRadius: 12 }}><Sparkles w={20} /></div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>AI Weekly Insight</h3>
            </div>

            <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.5, marginBottom: 20 }}>
                {summaryText}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: 15, borderRadius: 16 }}>
                    <Label>Nutrition Adherence</Label>
                    <p style={{ fontSize: 24, fontWeight: 900, color: G.green }}>{nutritionAdherence}%</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: 15, borderRadius: 16 }}>
                    <Label>Meds Compliance</Label>
                    <p style={{ fontSize: 24, fontWeight: 900, color: G.green }}>{medsCompliance}%</p>
                </div>
            </div>
        </div>
    );
};

export const SOSHistory = ({ th, events = [] }) => {
    const data = events;

    if (!data.length) {
        return (
            <div style={{ background: th.s2, borderRadius: 16, border: `1.5px solid ${th.border}`, padding: 16 }}>
                <p style={{ fontWeight: 700 }}>No SOS events found for the linked senior account.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map(ev => (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: th.s2, borderRadius: 18, border: `1.5px solid ${th.border}` }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ background: G.red, color: '#FFF', padding: 10, borderRadius: 12 }}><AlertCircle w={20} /></div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: 15 }}>{ev.loc}</p>
                            <p style={{ fontSize: 12, color: th.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {ev.time}</p>
                        </div>
                    </div>
                    <button onClick={() => window.open(`https://maps.google.com/?q=${ev.coord}`, '_blank')} style={{ background: th.accent, color: th.atext, border: 'none', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={16} /> View Map
                    </button>
                </div>
            ))}
        </div>
    );
};
