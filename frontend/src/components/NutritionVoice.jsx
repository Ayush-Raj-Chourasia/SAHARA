import React, { useState, useEffect } from 'react';
import { G } from './DashboardComponents';
import { Mic, X, Send, Sparkles, Volume2 } from './Icons';

const NutritionVoice = ({ onClose, onAdd, th, dark }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('tap_to_speak'); // tap_to_speak, listening, analyzing, success
    const [analysis, setAnalysis] = useState(null);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN'; // Default to Hindi-India as per README
        recognition.onstart = () => { setIsListening(true); setStatus('listening'); };
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            analyzeMeal(text);
        };
        recognition.onend = () => { setIsListening(false); };
        recognition.start();
    };

    const analyzeMeal = async (text) => {
        setStatus('analyzing');
        
        // In a real app, this would call /api/ai/nutrition-parse
        // For this phase, we simulate the AI logic but ENSURE the data 
        // structure matches our backend `NutritionLogCreate` model.
        setTimeout(() => {
            const mockResult = {
                meal: text,
                kcal: 450,
                protein: 15.5,
                iron_mg: 3.8,
                meal_type: "snack", // Default
                suggestion: "Good protein choice! Add a bowl of curd for better iron absorption.",
                suggestion_hi: "Accha meal hai! Thoda dahi bhi lijiye."
            };
            setAnalysis(mockResult);
            setStatus('success');
        }, 1500);
    };

    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('sahara_token');
            const userObj = JSON.parse(localStorage.getItem('sahara_user') || '{}');
            
            const res = await fetch('/api/nutrition/log', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userObj.id || "mock_id",
                    meal_type: analysis.meal_type || "snack",
                    food_name: analysis.meal,
                    kcal: analysis.kcal,
                    protein: analysis.protein,
                    iron_mg: analysis.iron_mg
                })
            });

            if (res.ok) {
                onAdd(analysis);
                onClose();
            } else {
                alert("Failed to sync nutrition log");
                onAdd(analysis);
                onClose();
            }
        } catch (err) {
            console.error("Nutrition Sync Error:", err);
            onAdd(analysis);
            onClose();
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <button onClick={onClose} style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 15, color: '#FFF', cursor: 'pointer' }}>
                <X w={24} />
            </button>

            <div style={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
                {status === 'tap_to_speak' && (
                    <div className="animate-in fade-in zoom-in">
                        <h2 style={{ color: '#FFF', fontSize: 32, fontWeight: 900, marginBottom: 10 }}>What did you eat?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 50 }}>Speak in Hindi, Odia, or English</p>
                        <button onClick={startListening} style={{ width: 120, height: 120, borderRadius: '50%', background: G.orange, border: 'none', color: '#FFF', cursor: 'pointer', boxShadow: '0 0 50px rgba(234,88,12,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <Mic size={48} />
                        </button>
                    </div>
                )}

                {status === 'listening' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, height: 60, alignItems: 'center', marginBottom: 40 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ width: 8, height: 20, background: G.orange, borderRadius: 4, animation: `pulsate 0.5s ease-in-out infinite alternate ${i * 0.1}s` }} />
                            ))}
                        </div>
                        <h2 style={{ color: '#FFF', fontSize: 24, fontWeight: 800 }}>Listening...</h2>
                    </div>
                )}

                {status === 'analyzing' && (
                    <div>
                        <div style={{ animation: 'spin 2s linear infinite', marginBottom: 30 }}>
                            <Sparkles size={64} color={G.orange} />
                        </div>
                        <h2 style={{ color: '#FFF', fontSize: 24, fontWeight: 800 }}>SAHARA AI is analyzing...</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>Calculating nutrition metrics</p>
                    </div>
                )}

                {status === 'success' && analysis && (
                    <div className="animate-in slide-in-from-bottom-8">
                        <div style={{ background: '#FFF', borderRadius: 32, padding: 30, textAlign: 'left', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                                <div style={{ background: '#f0fdf4', padding: 8, borderRadius: 12 }}><Sparkles color={G.green} /></div>
                                <h3 style={{ fontWeight: 900, fontSize: 18 }}>Analysis Complete</h3>
                            </div>
                            <p style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 20 }}>"{analysis.meal}"</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25 }}>
                                <div style={{ background: '#F5F4F0', padding: 15, borderRadius: 20 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#9B9890', textTransform: 'uppercase' }}>Calories</span>
                                    <p style={{ fontSize: 24, fontWeight: 900 }}>{analysis.kcal} <span style={{ fontSize: 14 }}>kcal</span></p>
                                </div>
                                <div style={{ background: '#F5F4F0', padding: 15, borderRadius: 20 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#9B9890', textTransform: 'uppercase' }}>Protein</span>
                                    <p style={{ fontSize: 24, fontWeight: 900 }}>{analysis.protein} <span style={{ fontSize: 14 }}>g</span></p>
                                </div>
                            </div>

                            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: 20, borderRadius: 20, display: 'flex', gap: 12 }}>
                                <Volume2 color={G.orange} style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#9a3412', lineHeight: 1.4 }}>{analysis.suggestion_hi}</p>
                            </div>
                        </div>

                        <button onClick={handleConfirm} style={{ width: '100%', padding: 22, borderRadius: 24, background: G.orange, color: '#FFF', border: 'none', fontSize: 20, fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 30px rgba(234,88,12,0.3)' }}>
                            Add to My Diary
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulsate { from { height: 10px; opacity: 0.5; } to { height: 60px; opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default NutritionVoice;
