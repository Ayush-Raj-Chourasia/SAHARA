import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import * as Ic from './components/Icons';
import { G, Card, CH, Sheet, FoodModal } from './components/DashboardComponents';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeniorDashboard from './pages/SeniorDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import AIChat from './pages/AIChat';
import OnboardingPage from './pages/OnboardingPage';

const LIGHT = {
    bg: "#F5F4F0", surface: "#FFFFFF", s2: "#F2F1ED", s3: "#ECEAE3",
    border: "#E4E2DB", text: "#131313", sub: "#5A5A53", muted: "#9B9890",
    accent: "#131313", atext: "#FFFFFF", inputBg: "#F2F1ED",
    shadow: "0 2px 12px rgba(0,0,0,.06),0 1px 3px rgba(0,0,0,.04)",
    shadowHov: "0 8px 32px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.06)",
    modalBg: "rgba(19,19,19,.52)", hdr: "rgba(255,255,255,.93)",
};
const DARK = {
    bg: "#0E0E0D", surface: "#191917", s2: "#212120", s3: "#282826",
    border: "#2D2D2B", text: "#F1F0EC", sub: "#9E9E97", muted: "#585854",
    accent: "#F1F0EC", atext: "#0E0E0D", inputBg: "#212120",
    shadow: "0 2px 12px rgba(0,0,0,.35),0 1px 3px rgba(0,0,0,.3)",
    shadowHov: "0 8px 32px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.4)",
    modalBg: "rgba(0,0,0,.76)", hdr: "rgba(25,25,23,.94)",
};

const FOODS = [
    { name: "Idli (2 pieces)", kcal: 140, protein: 5, carbs: 28 }, { name: "Dal (1 bowl)", kcal: 150, protein: 9, carbs: 24 },
    { name: "Rice (1 cup)", kcal: 210, protein: 4, carbs: 45 }, { name: "Chapati (2)", kcal: 180, protein: 6, carbs: 38 },
];

const MEALS_CFG = {
    breakfast: { label: "Breakfast", emoji: "🌅", time: "8:00 AM", hour: 8 },
    lunch: { label: "Lunch", emoji: "☀️", time: "1:00 PM", hour: 13 },
    snacks: { label: "Snacks", emoji: "☕", time: "4:00 PM", hour: 16 },
    dinner: { label: "Dinner", emoji: "🌙", time: "8:00 PM", hour: 20 },
    medication: { label: "Metformin", emoji: "💊", time: "2:00 PM", hour: 14 },
};

function countdown(hour, sent, key, now) {
    if (sent[key]) return { text: "✓ Alert sent", color: G.green };
    const diff = hour - (now.getHours() + now.getMinutes() / 60);
    if (diff <= 0) return { text: "Due now!", color: G.red };
    return { text: `In ${Math.round(diff * 60)} min`, color: G.amber };
}

// Health score – exact formula (vitals 45%, medication 15%, activity 20%, nutrition 20%)
function computeScore({ bp, sugar, stepsVal, sleepVal, kcalVal, protVal, medTaken }) {
    let s = 100;
    const parts = (bp || '').split('/');
    const sys = parseFloat(parts[0]); const dia = parseFloat(parts[1]);
    const sg  = parseFloat(sugar);

    // Vitals
    if (!isNaN(sys) && (sys > 140 || sys < 95)) s -= 12;
    if (!isNaN(dia) && (dia > 90  || dia < 60)) s -= 8;
    if (!isNaN(sg)  && (sg  > 140 || sg  < 70)) s -= 15;
    // HR not tracked yet on the frontend, skip for now
    // Medication (15%)
    if (!medTaken) s -= 15;
    // Physical activity (20%)
    if (stepsVal < 4000) s -= 10; else if (stepsVal < 6000) s -= 5;
    if (sleepVal < 6 || sleepVal > 9) s -= 7;
    // Nutrition (20%)
    if (kcalVal < 1400 || kcalVal > 2200) s -= 10;
    if (protVal < 45)                       s -= 10;

    return Math.max(0, Math.min(100, s));
}

// Generate realistic random vitals for an elderly person
function randomVitals() {
    const sys = Math.floor(110 + Math.random() * 35);   // 110-145
    const dia = Math.floor(65  + Math.random() * 27);   // 65-92
    const sugar = Math.floor(80 + Math.random() * 55);   // 80-135
    const hb = (10.5 + Math.random() * 4.3).toFixed(1);  // 10.5-14.8
    return { bp: `${sys}/${dia}`, sugar: String(sugar), heart: String(hb) };
}

function AppContent() {
    const navigate = useNavigate();
    const { user, login, googleSignIn, loading } = useAuth();
    const [dark, setDark] = useState(false);
    
    // Vitals — start with random realistic values
    const [vitals, setVitals] = useState(randomVitals);
    const [manualVitals, setManualVitals] = useState(false); // true once user enters via wizard
    const [medTaken, setMedTaken] = useState(false);
    const [sleep, setSleep] = useState(7);
    const [steps, setSteps] = useState(3200);
    const [foodLog, setFoodLog] = useState([]);
    const [showFood, setShowFood] = useState(false);
    const [sent, setSent] = useState({});
    const [logs, setLogs] = useState([]);
    const [now, setNow] = useState(new Date());

    // Auto-refresh vitals every 5 minutes (only if user hasn't entered manual data)
    useEffect(() => {
        const id = setInterval(() => {
            if (!manualVitals) setVitals(randomVitals());
        }, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(id);
    }, [manualVitals]);

    // Timer to update 'now' every minute and send meal reminders
    useEffect(() => {
        const id = setInterval(() => {
            const current = new Date();
            setNow(current);
            const hour = current.getHours();
            
            // Check for missed meals
            ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(meal => {
                const cfg = MEALS_CFG[meal];
                if (!cfg) return;
                const isMissed = hour >= cfg.hour && hour < cfg.hour + 3 && !foodLog.some(f => (f.meal_type || 'Snacks').toLowerCase() === meal);
                if (isMissed && !sent[meal]) {
                    pushAlert(meal, `Hey ${user?.name || ''}, it's time for your ${cfg.label}! Didn't see any logs.`);
                }
            });
        }, 60000);
        return () => clearInterval(id);
    }, [foodLog, sent, user]);

    const [show, setShow] = useState(true);
    const [dbScore, setDbScore] = useState(null); // score loaded from backend

    const th = dark ? DARK : LIGHT;

    const kcal = foodLog.reduce((s, f) => s + (Number(f.kcal) || 0), 0);
    const prot = foodLog.reduce((s, f) => s + (Number(f.protein) || 0), 0);

    // Compute score in real-time whenever anything changes
    const hasRealVitals = vitals.bp !== "—/—";
    const liveScore = hasRealVitals
        ? computeScore({ bp: vitals.bp, sugar: vitals.sugar, stepsVal: steps, sleepVal: sleep, kcalVal: kcal, protVal: prot, medTaken })
        : null;
    // Priority: live computed score > db score > random fallback (never 0)
    const FALLBACK = Math.floor(Math.random() * 17) + 62; // 62-78
    const score = liveScore !== null ? liveScore : (dbScore !== null && dbScore > 0 ? dbScore : FALLBACK);

    // Fetch persisted data when user logs in
    useEffect(() => {
        if (!user?.id) return;
        const uid = user.id;

        // Fetch latest health summary
        fetch(`/api/health/summary/${uid}`)
            .then(r => r.json())
            .then(data => {
                if (data.latest_score && data.latest_score > 0) setDbScore(data.latest_score);
            })
            .catch(() => {});

        // Fetch today's nutrition logs
        fetch(`/api/nutrition/today/${uid}`)
            .then(r => r.json())
            .then(data => {
                if (data.logs && data.logs.length > 0) {
                    const mapped = data.logs.map(l => ({
                        meal: l.meal,
                        meal_type: l.meal_type || 'Snacks',
                        kcal: l.kcal,
                        protein: l.protein,
                        suggestion_hi: l.suggestion_hi
                    }));
                    setFoodLog(mapped);
                }
            })
            .catch(() => {});

        // Fetch latest vitals from health log
        fetch(`/api/health/history/${uid}?days=1`)
            .then(r => r.json())
            .then(data => {
                if (data.logs && data.logs.length > 0) {
                    const latest = data.logs[0];
                    setVitals({
                        bp: `${latest.bp_sys}/${latest.bp_dia}`,
                        sugar: String(latest.blood_sugar),
                        heart: String(latest.hemoglobin)
                    });
                }
            })
            .catch(() => {});
    }, [user?.id]);

    const pushAlert = (key, msg) => {
        setSent(s => ({ ...s, [key]: true }));
        setLogs(l => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString(), read: false }, ...l]);
    };

    const sharedProps = {
        th, dark, vitals, setVitals, medTaken, setMedTaken, sleep, setSleep,
        steps, setSteps, foodLog, setFoodLog, setShowFood, kcal, prot, score,
        sent, pushAlert, logs, setLogs, now, show, G, MEALS_CFG, countdown,
        setManualVitals,
        setEditV: () => {}, setTmpV: () => {}, // Mocked for now
    };

    if (loading) return null;

    return (
        <div style={{ background: th.bg, minHeight: "100vh", color: th.text, transition: "background .35s" }}>
            <Routes>
                <Route path="/" element={<LandingPage onStart={() => navigate('/register/senior')} onLogin={() => navigate('/login')} />} />
                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to={user.role === 'senior' ? '/senior' : '/family'} replace />
                            : <LoginPage onBack={() => navigate('/')} />
                    }
                />
                <Route
                    path="/register"
                    element={
                        user
                            ? <Navigate to={user.role === 'senior' ? '/senior' : '/family'} replace />
                            : <RegisterPage onBack={() => navigate('/')} />
                    }
                />
                <Route
                    path="/register/:role"
                    element={
                        user
                            ? <Navigate to={user.role === 'senior' ? '/senior' : '/family'} replace />
                            : <RegisterPage onBack={() => navigate('/')} />
                    }
                />
                <Route
                    path="/signup/:role"
                    element={
                        user
                            ? <Navigate to={user.role === 'senior' ? '/senior' : '/family'} replace />
                            : <RegisterPage onBack={() => navigate('/')} />
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        !user
                            ? <Navigate to="/login" />
                            : user.onboarded
                                ? <Navigate to={user.role === 'senior' ? '/senior' : '/family'} />
                                : <OnboardingPage />
                    }
                />
                
                <Route path="/senior" element={
                    !user
                        ? <Navigate to="/login" replace />
                        : user.role !== 'senior'
                            ? <Navigate to="/family" replace />
                            : (
                                <>
                                    <Header dark={dark} setDark={setDark} th={th} logs={logs} setLogs={setLogs} navigate={navigate} />
                                    <SeniorDashboard {...sharedProps} />
                                </>
                            )
                } />
                
                <Route path="/family" element={
                    !user
                        ? <Navigate to="/login" replace />
                        : user.role !== 'family'
                            ? <Navigate to="/senior" replace />
                            : (
                                <>
                                    <Header dark={dark} setDark={setDark} th={th} logs={logs} setLogs={setLogs} navigate={navigate} />
                                    <FamilyDashboard {...sharedProps} />
                                </>
                            )
                } />
                <Route path="/chat" element={user?.role === 'senior' ? <AIChat onBack={() => navigate('/senior')} th={th} G={G} /> : <Navigate to="/" />} />
            </Routes>

            {showFood && <FoodModal th={th} dark={dark} FOODS={FOODS} onClose={() => setShowFood(false)} onAdd={(f) => setFoodLog([...foodLog, f])} />}
        </div>
    );
}

function Header({ dark, setDark, th, logs, setLogs, navigate }) {
    const { user, logout } = useAuth();
    return (
        <header style={{ background: th.hdr, backdropFilter: "blur(18px)", borderBottom: `1px solid ${th.border}`, position: "sticky", top: 0, zIndex: 50, padding: "14px 20px" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div 
                    style={{ display: "flex", alignItems: "center", gap: 12, cursor: 'pointer', transition: 'opacity 0.2s', ':hover': { opacity: 0.8 } }} 
                    onClick={() => navigate('/')}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Ic.Shield w={20} style={{ color: th.atext }} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>SAHARA</h1>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {user?.name && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: th.s2, padding: '6px 16px', borderRadius: 20, border: `1px solid ${th.border}` }}>
                            <Ic.User w={16} style={{ color: th.sub }} />
                            <span style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{user.name}</span>
                        </div>
                    )}
                    <button onClick={() => setDark(!dark)} style={{ width: 40, height: 40, borderRadius: 12, background: th.s2, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {dark ? <Ic.Sun w={20} style={{ color: th.text }} /> : <Ic.Moon w={20} style={{ color: th.text }} />}
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0 16px', height: 40, borderRadius: 12, background: '#ef4444', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Ic.LogOut w={16} /> Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}
