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
    dinner: { label: "Dinner", emoji: "🌙", time: "8:00 PM", hour: 20 },
    medication: { label: "Metformin", emoji: "💊", time: "2:00 PM", hour: 14 },
};

function countdown(hour, sent, key, now) {
    if (sent[key]) return { text: "✓ Alert sent", color: G.green };
    const diff = hour - (now.getHours() + now.getMinutes() / 60);
    if (diff <= 0) return { text: "Due now!", color: G.red };
    return { text: `In ${Math.round(diff * 60)} min`, color: G.amber };
}

function AppContent() {
    const navigate = useNavigate();
    const { user, login, googleSignIn, loading } = useAuth();
    const [dark, setDark] = useState(false);
    
    // Vitals and other states
    const [vitals, setVitals] = useState({ bp: "120/80", sugar: "95", heart: "72" });
    const [medTaken, setMedTaken] = useState(false);
    const [sleep, setSleep] = useState(7);
    const [steps, setSteps] = useState(3200);
    const [foodLog, setFoodLog] = useState([]);
    const [showFood, setShowFood] = useState(false);
    const [sent, setSent] = useState({});
    const [logs, setLogs] = useState([]);
    const [now, setNow] = useState(new Date());
    const [show, setShow] = useState(true);

    const th = dark ? DARK : LIGHT;

    const kcal = foodLog.reduce((s, f) => s + f.kcal, 0);
    const prot = foodLog.reduce((s, f) => s + f.protein, 0);
    const score = 85; // Placeholder

    const pushAlert = (key, msg) => {
        setSent(s => ({ ...s, [key]: true }));
        setLogs(l => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString(), read: false }, ...l]);
    };

    const sharedProps = {
        th, dark, vitals, setVitals, medTaken, setMedTaken, sleep, setSleep,
        steps, setSteps, foodLog, setFoodLog, setShowFood, kcal, prot, score,
        sent, pushAlert, logs, setLogs, now, show, G, MEALS_CFG, countdown,
        setEditV: () => {}, setTmpV: () => {}, // Mocked for now
    };

    if (loading) return null;

    return (
        <div style={{ background: th.bg, minHeight: "100vh", color: th.text, transition: "background .35s" }}>
            <Routes>
                <Route path="/" element={<LandingPage onStart={() => navigate('/register')} onLogin={() => navigate('/login')} />} />
                <Route path="/login" element={<LoginPage onBack={() => navigate('/')} />} />
                <Route path="/register" element={<RegisterPage onBack={() => navigate('/')} />} />
                <Route path="/register/:role" element={<RegisterPage onBack={() => navigate('/')} />} />
                <Route path="/signup/:role" element={<RegisterPage onBack={() => navigate('/')} />} />
                <Route path="/onboarding" element={user ? <OnboardingPage /> : <Navigate to="/login" />} />
                
                <Route path="/senior" element={
                    <>
                        <Header dark={dark} setDark={setDark} th={th} logs={logs} setLogs={setLogs} navigate={navigate} />
                        <SeniorDashboard {...sharedProps} />
                    </>
                } />
                
                <Route path="/family" element={
                    <>
                        <Header dark={dark} setDark={setDark} th={th} logs={logs} setLogs={setLogs} navigate={navigate} />
                        <FamilyDashboard {...sharedProps} />
                    </>
                } />
                <Route path="/chat" element={user?.role === 'senior' ? <AIChat onBack={() => navigate('/senior')} th={th} G={G} /> : <Navigate to="/" />} />
            </Routes>

            {showFood && <FoodModal th={th} dark={dark} FOODS={FOODS} onClose={() => setShowFood(false)} onAdd={(f) => setFoodLog([...foodLog, f])} />}
        </div>
    );
}

function Header({ dark, setDark, th, logs, setLogs, navigate }) {
    const { logout } = useAuth();
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
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setDark(!dark)} style={{ width: 40, height: 40, borderRadius: 12, background: th.s2, border: 'none', cursor: 'pointer' }}>
                        {dark ? <Ic.Sun w={20} /> : <Ic.Moon w={20} />}
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ width: 40, height: 40, borderRadius: 12, background: th.accent, border: 'none', cursor: 'pointer', color: th.atext }}>
                        <Ic.User w={20} />
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
