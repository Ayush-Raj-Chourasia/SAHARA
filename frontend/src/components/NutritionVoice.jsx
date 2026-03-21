import React, { useState } from 'react';
import { G } from './DashboardComponents';
import { Mic, X, Send, Sparkles, Volume2 } from './Icons';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

const NutritionVoice = ({ onClose, onAdd, th, dark }) => {
    const { user } = useAuth();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('tap_to_speak'); // tap_to_speak, listening, analyzing, success
    const [analysis, setAnalysis] = useState(null);
    const [mealType, setMealType] = useState('snacks');

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

        try {
            const response = await apiFetch('/api/nutrition/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: text,
                    image: null,
                    meal_type: mealType,
                    user_id: user?.id || 'default_user'
                })
            });

            const data = await response.json();
            const meals = data?.results || [];

            if (!response.ok) {
                throw new Error(data?.detail || 'No nutrition analysis received');
            }

            if (meals.length === 0) {
                setAnalysis({
                    meal: text,
                    kcal: '—',
                    protein: '—',
                    iron_mg: '—',
                    meal_type: mealType,
                    suggestion: data?.note || 'No edible item detected in speech.',
                    suggestion_hi: data?.note || 'Koi khaane ki item detect nahi hui.',
                });
                setStatus('success');
                return;
            }

            const totalKcal = meals.reduce((sum, m) => sum + (Number(m.kcal) || 0), 0);
            const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein_g) || 0), 0);
            const totalIron = meals.reduce((sum, m) => sum + (Number(m.iron_mg) || 0), 0);

            const dynamicTip = meals[0]?.care_tip ||
                `Good meal choice: ${text}. Keep hydration and balanced portions in mind.`;

            const result = {
                meal: text,
                kcal: totalKcal,
                protein: Number(totalProtein.toFixed(1)),
                iron_mg: Number(totalIron.toFixed(1)),
                meal_type: mealType,
                suggestion: dynamicTip,
                suggestion_hi: dynamicTip,
                parsed_meals: meals,
                source: data?.source || 'api'
            };

            setAnalysis(result);
            setStatus('success');
        } catch (err) {
            console.error('Nutrition analysis failed:', err);
            setAnalysis({
                meal: text,
                kcal: '—',
                protein: '—',
                iron_mg: '—',
                meal_type: 'snack',
                suggestion: 'Could not analyze meal right now. Please try again.',
                suggestion_hi: 'Abhi analysis nahi ho paaya. Kripya phir se try karein.'
            });
            setStatus('success');
        }
    };

    const handleConfirm = async () => {
        if (!analysis || analysis.kcal === '—' || analysis.protein === '—') {
            alert('No valid food item detected. Please try speaking a food name.');
            return;
        }
        try {
            const token = localStorage.getItem('sahara_token');
            const userObj = JSON.parse(localStorage.getItem('sahara_user') || '{}');
            
            const res = await apiFetch('/api/nutrition/log', {
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
                const errorText = await res.text();
                if (res.status === 503) {
                    alert('Database unavailable on backend (503). Nutrition log was not saved.');
                    return;
                }
                alert(errorText || 'Failed to sync nutrition log');
                return;
            }
        } catch (err) {
            console.error("Nutrition Sync Error:", err);
            const message = String(err?.message || '');
            if (message.includes('Failed to fetch')) {
                alert('Network/CORS error while saving nutrition. Please refresh and retry.');
            } else {
                alert('Nutrition sync failed. Please retry.');
            }
            return;
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                            {['breakfast', 'lunch', 'snacks', 'dinner'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMealType(m)}
                                    style={{
                                        border: 'none',
                                        borderRadius: 12,
                                        padding: '10px 12px',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        background: mealType === m ? G.orange : 'rgba(255,255,255,0.15)',
                                        color: '#fff',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
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
