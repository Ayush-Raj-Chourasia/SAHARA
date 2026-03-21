const { useState, useEffect, useRef } = React;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`;

// ─── Theme ───────────────────────────────────────────────────────────────────
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

// ─── Semantic colours ────────────────────────────────────────────────────────
const G = {
    green: "#16a34a", gBg: "#f0fdf4", gBd: "#bbf7d0", gBgD: "#052e16", gBdD: "#166534",
    amber: "#b45309", aBg: "#fffbeb", aBd: "#fcd34d", aBgD: "#1c1200", aBdD: "#92400e",
    red: "#dc2626", rBg: "#fff1f2", rBd: "#fecada", rBgD: "#1c0404", rBdD: "#991b1b",
    blue: "#2563eb", bBg: "#eff6ff", bBd: "#bfdbfe", bBgD: "#0a1628", bBdD: "#1d4ed8",
    wa: "#25D366",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function Svg({ children, ...p }) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ display: "block", width: p.w || 20, height: p.w || 20, ...(p.style || {}) }}>{children}</svg>;
}
const Ic = {
    Heart: p => <Svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Svg>,
    Drop: p => <Svg {...p}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></Svg>,
    Pulse: p => <Svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>,
    Moon: p => <Svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Svg>,
    Sun: p => <Svg {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Svg>,
    Pill: p => <Svg {...p}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></Svg>,
    Bell: p => <Svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Svg>,
    User: p => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>,
    Phone: p => <svg viewBox="0 0 24 24" fill="currentColor" style={{ display: "block", width: p.w || 20, height: p.w || 20, ...(p.style || {}) }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z" /></svg>,
    Camera: p => <Svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></Svg>,
    Mic: p => <Svg {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Svg>,
    Fork: p => <Svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></Svg>,
    Edit: p => <Svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>,
    X: p => <Svg {...p} strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>,
    Plus: p => <Svg {...p} strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>,
    Steps: p => <Svg {...p}><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5c0 1.1-.1 2-.1 3.5 0 1.71.49 2.5 2.1 2.5h2c1.2 0 1.99.5 2.5 1.5" /><path d="M12 22v-5" /></Svg>,
    Send: p => <Svg {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Svg>,
    Trash: p => <Svg {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Svg>,
    Family: p => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Svg>,
    Alert: p => <Svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Svg>,
    Shield: p => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Svg>,
    Check: p => <Svg {...p} strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></Svg>,
    Wa: p => <svg viewBox="0 0 24 24" fill="currentColor" style={{ display: "block", width: p.w || 20, height: p.w || 20, ...(p.style || {}) }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>,
};

// ─── Food DB ─────────────────────────────────────────────────────────────────
const FOODS = [
    { name: "Idli (2 pieces)", kcal: 140, protein: 5, carbs: 28 }, { name: "Dosa (plain)", kcal: 120, protein: 3, carbs: 20 },
    { name: "Upma (1 bowl)", kcal: 200, protein: 5, carbs: 30 }, { name: "Poha (1 bowl)", kcal: 180, protein: 4, carbs: 35 },
    { name: "Oats porridge", kcal: 160, protein: 6, carbs: 27 }, { name: "Chapati (2)", kcal: 180, protein: 6, carbs: 38 },
    { name: "Dal (1 bowl)", kcal: 150, protein: 9, carbs: 24 }, { name: "Rice (1 cup)", kcal: 210, protein: 4, carbs: 45 },
    { name: "Sabzi (mixed veg)", kcal: 120, protein: 3, carbs: 18 }, { name: "Curd / Yogurt", kcal: 80, protein: 5, carbs: 6 },
    { name: "Milk (1 glass)", kcal: 120, protein: 8, carbs: 12 }, { name: "Boiled egg", kcal: 70, protein: 6, carbs: 1 },
    { name: "Banana", kcal: 90, protein: 1, carbs: 23 }, { name: "Apple", kcal: 80, protein: 0.4, carbs: 21 },
    { name: "Sprouts (1 cup)", kcal: 110, protein: 9, carbs: 14 }, { name: "Sambar (1 cup)", kcal: 90, protein: 4, carbs: 16 },
    { name: "Paneer (50g)", kcal: 140, protein: 9, carbs: 2 }, { name: "Tea / Coffee", kcal: 15, protein: 1, carbs: 2 },
    { name: "Moong dal khichdi", kcal: 200, protein: 8, carbs: 36 }, { name: "Pongal (1 cup)", kcal: 220, protein: 7, carbs: 40 },
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
    if (diff < 0.5) return { text: `In ${Math.round(diff * 60)} min`, color: G.red };
    if (diff < 2) return { text: `In ${Math.round(diff * 60)} min`, color: G.amber };
    const h = Math.floor(diff), m = Math.round((diff - h) * 60);
    return { text: `In ${h > 0 ? h + "hr " : ""}${m > 0 ? m + "min" : ""}`, color: G.amber };
}

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY USERS DATABASE
// ─────────────────────────────────────────────────────────────────────────────
const USERS = [
    { id: 1, name: "Raj Kumar",    email: "raj@sahara.health",   pass: "senior123", role: "senior", age: 68, city: "Mumbai",    avatar: "👴", color: "#2563eb" },
    { id: 2, name: "Priya Kumar",  email: "priya@sahara.health", pass: "family123", role: "family",  age: 38, city: "Pune",      avatar: "👩", color: "#16a34a" },
    { id: 3, name: "Arjun Kumar",  email: "arjun@sahara.health", pass: "family456", role: "family",  age: 34, city: "Bengaluru", avatar: "👨", color: "#b45309" },
    { id: 4, name: "Sunita Devi",  email: "sunita@sahara.health",pass: "senior456", role: "senior",  age: 72, city: "Delhi",     avatar: "👵", color: "#dc2626" },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [fillUser, setFillUser] = useState(null);

    useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

    function handleLogin(e) {
        e.preventDefault();
        setErr("");
        setLoading(true);
        setTimeout(() => {
            const user = USERS.find(u => u.email === email.trim().toLowerCase() && u.pass === pass);
            if (user) {
                onLogin(user);
            } else {
                setErr("Invalid email or password. Please try again.");
                setLoading(false);
            }
        }, 900);
    }

    function quickFill(u) {
        setFillUser(u.id);
        setEmail(u.email);
        setPass(u.pass);
        setErr("");
    }

    const inp = {
        width: "100%", padding: "14px 16px", borderRadius: 14,
        border: `2px solid #E4E2DB`, background: "#F2F1ED",
        fontSize: 16, fontFamily: "'Outfit', sans-serif",
        color: "#131313", outline: "none", transition: "border-color .2s",
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0f0e 0%,#1a1a18 50%,#0f1a0e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden" }}>
            {/* Animated background orbs */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "-10%", left: "15%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)", animation: "float1 8s ease-in-out infinite" }} />
                <div style={{ position: "absolute", bottom: "-5%", right: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(22,163,74,.14) 0%,transparent 70%)", animation: "float2 10s ease-in-out infinite" }} />
                <div style={{ position: "absolute", top: "40%", right: "30%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,38,38,.1) 0%,transparent 70%)", animation: "float3 7s ease-in-out infinite" }} />
            </div>
            <style>{`
                @keyframes float1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.05)}}
                @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,30px) scale(1.08)}}
                @keyframes float3{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-25px)}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
                @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(37,99,235,.4)}70%{box-shadow:0 0 0 14px rgba(37,99,235,0)}100%{box-shadow:0 0 0 0 rgba(37,99,235,0)}}
                .lgn-inp:focus{border-color:#2563eb !important;background:#fff !important}
                .lgn-btn:hover{opacity:.92;transform:translateY(-1px)}
                .lgn-btn:active{transform:scale(.98)}
                .uc:hover{border-color:#2563eb !important;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.25)}
            `}</style>

            <div style={{ display: "flex", gap: 0, width: "100%", maxWidth: 980, borderRadius: 28, overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,.55)", opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity .5s ease, transform .5s ease" }}>

                {/* LEFT PANEL — Branding */}
                <div style={{ flex: "0 0 42%", background: "linear-gradient(160deg,#131313 0%,#1e2a1c 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
                            <div style={{ width: 50, height: 50, borderRadius: 15, background: "linear-gradient(140deg,#2563eb,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,99,235,.4)", animation: "pulse-ring 2.5s infinite" }}>
                                <Ic.Shield w={24} style={{ color: "#fff" }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.01em", lineHeight: 1 }}>SAHARA</p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", letterSpacing: ".08em", marginTop: 2 }}>ELDERLY HEALTH COMPANION</p>
                            </div>
                        </div>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 14 }}>Your health,<br /><span style={{ color: "#60a5fa" }}>always with you.</span></h2>
                        <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 32 }}>Real-time health monitoring for seniors with smart AI-powered nutrition analysis and family alerts.</p>

                        {/* Feature pills */}
                        {[
                            { icon: "🩺", label: "Clinical Health Score" },
                            { icon: "🎙️", label: "Hindi & English Voice Logging" },
                            { icon: "🚨", label: "Emergency SOS + GPS" },
                            { icon: "👨‍👩‍👧", label: "Family Dashboard & Alerts" },
                        ].map(f => (
                            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <span style={{ fontSize: 18 }}>{f.icon}</span>
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,.65)", fontWeight: 500 }}>{f.label}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)", marginTop: 24 }}>© 2025 SAHARA Health · Powered by Gemini AI</p>
                </div>

                {/* RIGHT PANEL — Login Form */}
                <div style={{ flex: 1, background: "#fff", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto", maxHeight: "90vh" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "#9B9890", textTransform: "uppercase", marginBottom: 6 }}>Welcome back</p>
                    <h1 style={{ fontSize: 30, fontWeight: 800, color: "#131313", marginBottom: 6 }}>Sign in to SAHARA</h1>
                    <p style={{ color: "#9B9890", fontSize: 14, marginBottom: 28 }}>Use a demo account below or enter your credentials.</p>

                    {/* Demo accounts */}
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "#9B9890", textTransform: "uppercase", marginBottom: 10 }}>🚀 Demo Accounts — click to fill</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 24 }}>
                        {USERS.map(u => (
                            <button key={u.id} className="uc" onClick={() => quickFill(u)}
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 13, border: `2px solid ${fillUser === u.id ? "#2563eb" : "#E4E2DB"}`, background: fillUser === u.id ? "#eff6ff" : "#F9F8F5", cursor: "pointer", textAlign: "left", fontFamily: "'Outfit', sans-serif", transition: "all .2s" }}>
                                <span style={{ fontSize: 24, flexShrink: 0 }}>{u.avatar}</span>
                                <div style={{ overflow: "hidden" }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#131313", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
                                    <p style={{ fontSize: 11, color: u.color, fontWeight: 700 }}>{u.role === "senior" ? "👤 Senior" : "👨‍👩‍👧 Family"} · {u.city}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <div style={{ flex: 1, height: 1, background: "#E4E2DB" }} />
                        <span style={{ fontSize: 12, color: "#9B9890", fontWeight: 600 }}>OR ENTER MANUALLY</span>
                        <div style={{ flex: 1, height: 1, background: "#E4E2DB" }} />
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#5A5A53", display: "block", marginBottom: 6 }}>Email Address</label>
                            <input id="login-email" className="lgn-inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sahara.health" style={inp} required />
                        </div>
                        <div style={{ marginBottom: 8, position: "relative" }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#5A5A53", display: "block", marginBottom: 6 }}>Password</label>
                            <input id="login-pass" className="lgn-inp" type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingRight: 50 }} required />
                            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, bottom: 14, background: "none", border: "none", cursor: "pointer", color: "#9B9890", fontSize: 13, fontWeight: 700 }}>{showPass ? "Hide" : "Show"}</button>
                        </div>
                        {err && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", borderRadius: 11, padding: "10px 14px", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>⚠️ {err}</div>}
                        <button id="login-submit" className="lgn-btn" type="submit" disabled={loading}
                            style={{ width: "100%", padding: "16px", borderRadius: 14, background: loading ? "#9B9890" : "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", fontSize: 17, fontWeight: 800, fontFamily: "'Outfit', sans-serif", cursor: loading ? "not-allowed" : "pointer", transition: "all .2s", marginTop: 4, letterSpacing: ".01em", boxShadow: loading ? "none" : "0 6px 20px rgba(37,99,235,.35)" }}>
                            {loading ? "✨ Signing in..." : "Sign In →"}
                        </button>
                    </form>

                    {/* Credentials cheatsheet */}
                    <div style={{ marginTop: 22, background: "#F2F1ED", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E4E2DB" }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#9B9890", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 9 }}>📋 Test Credentials</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {USERS.map(u => (
                                <div key={u.id} style={{ background: "#fff", borderRadius: 10, padding: "8px 11px", border: "1.5px solid #E4E2DB" }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: "#131313" }}>{u.avatar} {u.name}</p>
                                    <p style={{ fontSize: 11, color: "#9B9890", marginTop: 2 }}>📧 {u.email}</p>
                                    <p style={{ fontSize: 11, color: "#9B9890" }}>🔑 {u.pass}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT (with Login Gate)
// ─────────────────────────────────────────────────────────────────────────────
function AppRoot() {
    const [user, setUser] = useState(null);
    if (!user) return <LoginPage onLogin={setUser} />;
    return <SAHARA currentUser={user} onLogout={() => setUser(null)} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
function SAHARA({ currentUser, onLogout }) {
    const [dark, setDark] = useState(false);
    const [view, setView] = useState("senior");
    const [vitals, setVitals] = useState({ bp: "120/80", sugar: "95", heart: "72", hb: "12.5" });
    const [vMode, setVMode] = useState("auto");
    const [editV, setEditV] = useState(null);
    const [tmpV, setTmpV] = useState("");
    const [medTaken, setMedTaken] = useState(false);
    const [sleep, setSleep] = useState(7);
    const [steps, setSteps] = useState(3200);
    const [editAct, setEditAct] = useState(null);
    const [foodLog, setFoodLog] = useState([
        { id: 1, name: "Idli (2 pieces)", kcal: 140, protein: 5, meal: "Breakfast", time: "7:30 AM", type: "manual" },
        { id: 2, name: "Tea / Coffee", kcal: 15, protein: 1, meal: "Breakfast", time: "8:00 AM", type: "manual" },
    ]);
    const [showFood, setShowFood] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [sent, setSent] = useState({});
    const [logs, setLogs] = useState([
        { id: 1, type: "food", msg: "Breakfast reminder sent to your family members", time: "7:45 AM", read: false },
    ]);
    const [now, setNow] = useState(new Date());
    const [show, setShow] = useState(false);
    const [isCloud, setIsCloud] = useState(false);
    const [sos, setSos] = useState(null); // 'active', 'calling', null
    const [sosTime, setSosTime] = useState(5);
    const cloudRef = useRef();
    const initRef = useRef(false);

    // 1. Puter Persistence (Load)
    useEffect(() => {
        const load = async () => {
            try {
                const data = await puter.kv.get("sahara_v1");
                if (data) {
                    const d = JSON.parse(data);
                    if (d.vitals) setVitals(d.vitals);
                    if (d.medTaken !== undefined) setMedTaken(d.medTaken);
                    if (d.sleep !== undefined) setSleep(d.sleep);
                    if (d.steps !== undefined) setSteps(d.steps);
                    if (d.foodLog) setFoodLog(d.foodLog);
                    if (d.sent) setSent(d.sent);
                    if (d.logs) setLogs(d.logs);
                    if (d.dark !== undefined) setDark(d.dark);
                }
            } catch (e) { console.warn("Puter Load Error", e); }
            initRef.current = true;
        };
        load();
    }, []);

    // 2. Puter Persistence (Save)
    useEffect(() => {
        if (!initRef.current) return;
        if (cloudRef.current) clearTimeout(cloudRef.current);
        cloudRef.current = setTimeout(async () => {
            setIsCloud(true);
            try {
                const payload = { vitals, medTaken, sleep, steps, foodLog, sent, logs, dark };
                await puter.kv.set("sahara_v1", JSON.stringify(payload));
            } catch (e) { console.warn("Puter Save Error", e); }
            setTimeout(() => setIsCloud(false), 1200);
        }, 800);
    }, [vitals, medTaken, sleep, steps, foodLog, sent, logs, dark]);

    // 3. Vitals Simulator (Auto Mode)
    useEffect(() => {
        if (vMode !== "auto") return;
        const drift = setInterval(() => {
            setVitals(v => {
                const [sys, dia] = v.bp.split("/").map(Number);
                const s = sys + (Math.random() > 0.5 ? 1 : -1);
                const d = dia + (Math.random() > 0.5 ? 1 : -1);
                const h = Number(v.heart) + (Math.random() > 0.5 ? 1 : -1);
                const sug = Number(v.sugar) + (Math.random() > 0.5 ? 2 : -2);
                return { ...v, bp: `${s}/${d}`, heart: String(Math.min(100, Math.max(60, h))), sugar: String(Math.min(180, Math.max(70, sug))) };
            });
        }, 12000);
        return () => clearInterval(drift);
    }, [vMode]);

    // 4. SOS Countdown Logic & Geolocation
    useEffect(() => {
        if (sos !== "active") return;
        if (sosTime === 5) {
            // Fetch GPS on SOS start
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const loc = `@${pos.coords.latitude},${pos.coords.longitude}`;
                    console.log("SOS Location:", loc);
                    // In a real app, this would be sent to the family via SMS/Puter
                });
            }
        }
        if (sosTime <= 0) { setSos("calling"); return; }
        const t = setTimeout(() => setSosTime(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [sos, sosTime]);

    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);

    const th = dark ? DARK : LIGHT;
    const kcal = foodLog.reduce((s, f) => s + f.kcal, 0);
    const prot = foodLog.reduce((s, f) => s + f.protein, 0);
    const score = (() => {
        let s = 100;
        // 🩸 Vitals: Penalties for BP, Sugar, Heart Rate out of range
        const [sys, dia] = vitals.bp.split("/").map(Number);
        if (sys > 140 || sys < 95) s -= 12; 
        if (dia > 90 || dia < 60) s -= 8;
        if (vitals.sugar > 140 || vitals.sugar < 70) s -= 15;
        if (vitals.heart > 105 || vitals.heart < 55) s -= 10;
        
        // 🧪 Lab Parameters (ICMR specific)
        const hbVal = Number(vitals.hb);
        if (hbVal < 9) s -= 30; // 🚨 CRITICAL Anaemia
        else if (hbVal < 11) s -= 15; 
        else if (hbVal < 13) s -= 5;
        
        // 💊 Meds: Critical penalty if missed
        if (!medTaken) s -= 15;

        // 🏃 Activity: Steps and Sleep targets (ICMR Activity Guidelines)
        if (steps < 4000) s -= 10; else if (steps < 6000) s -= 5;
        if (sleep < 6 || sleep > 9) s -= 7;

        // 🍎 Nutrition: Optimal calorie and protein intake (ICMR 1800-2000 kcal)
        if (kcal < 1400 || kcal > 2200) s -= 10;
        if (prot < 45) s -= 10;
        
        return Math.max(15, Math.min(100, s));
    })();
    const unread = logs.filter(l => !l.read).length;

    function pushAlert(key, msg) {
        setSent(s => ({ ...s, [key]: true }));
        setLogs(l => [{
            id: Date.now(), type: key.includes("med") ? "med" : "food", msg,
            time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), read: false
        }, ...l]);
    }

    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    const waText = encodeURIComponent(
        `*SAHARA Health Report* 🏥
👤 Raj Kumar | Age 68 | ${now.toLocaleDateString("en-IN")}

📊 *Health Score:* ${score}/100 — ${score >= 80 ? "Good" : score >= 60 ? "Monitor" : "Needs Attention"}

❤️ *Vitals*
• BP: ${vitals.bp} mmHg
• Sugar: ${vitals.sugar} mg/dL
• HR: ${vitals.heart} bpm
• Hb: ${vitals.hb} g/dL (Iron)

🍽️ *Nutrition*
• Calories: ${kcal} / 1800 kcal
• Protein: ${prot} / 60 g

💊 *Medication*
• Metformin: ${medTaken ? "✅ Taken" : "⏳ Pending"}

🏃 *Activity*
• Sleep: ${sleep} hrs  |  Steps: ${steps.toLocaleString()}

_Via SAHARA Health Companion · ${timeStr}_`);

    const sp = {
        th, dark, vitals, setVitals, vMode, setVMode, editV, setEditV, tmpV, setTmpV,
        medTaken, setMedTaken, sleep, setSleep, steps, setSteps, editAct, setEditAct,
        foodLog, setFoodLog, showFood, setShowFood, kcal, prot, score, sent, pushAlert, logs, setLogs, now, show
    };

    return (
        <>
            <style>{`
        ${FONTS}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Outfit', sans-serif;background:${th.bg};overflow-x:hidden}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${th.border};border-radius:99px}
        input[type=range]{-webkit-appearance:none;appearance:none;height:8px;border-radius:99px;background:${th.s3};outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:${th.accent};cursor:pointer;transition:transform .15s;box-shadow:0 2px 8px rgba(0,0,0,.2)}
        input[type=range]:active::-webkit-slider-thumb{transform:scale(1.18)}
        input:focus{border-color:${th.sub} !important;outline:none}
        .c{transition:box-shadow .25s,transform .25s}
        .c:hover{box-shadow:${th.shadowHov};transform:translateY(-2px)}
        .b{transition:transform .12s,opacity .12s}
        .b:active{transform:scale(.95);opacity:.8}
        .si{opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease}
        .si.in{opacity:1;transform:translateY(0)}
        .ra{transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)}
        .ba{transition:width 1.1s cubic-bezier(.4,0,.2,1)}
        .sh{position:relative;overflow:hidden}
        .sh::after{content:'';position:absolute;top:0;left:-60%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:shim 2.8s ease-in-out infinite}
        @keyframes shim{0%{left:-60%}100%{left:140%}}
        .br{animation:br 2.8s ease-in-out infinite}
        @keyframes br{0%,100%{opacity:1}50%{opacity:.2}}
        .sos{animation:sos 2.4s ease-in-out infinite}
        @keyframes sos{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.55),0 6px 28px rgba(220,38,38,.28)}55%{box-shadow:0 0 0 22px rgba(220,38,38,0),0 6px 28px rgba(220,38,38,.28)}}
        .ve{animation:ve .3s cubic-bezier(.4,0,.2,1)}
        @keyframes ve{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
        .se{animation:se .3s cubic-bezier(.4,0,.2,1)}
        @keyframes se{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:translateY(0)}}
        .nd{animation:np .3s cubic-bezier(.34,1.56,.64,1)}
        @keyframes np{from{transform:scale(0)}to{transform:scale(1)}}
        .wa:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(37,211,102,.42)!important}
        .wa:active{transform:scale(.96)}
        .wa{transition:transform .2s,box-shadow .2s}
        .tb{transition:background .22s,border-color .22s,box-shadow .22s}
        .tb:active{transform:scale(.98)}
      `}</style>

            <div style={{ background: th.bg, minHeight: "100vh", color: th.text, fontFamily: "'Outfit', sans-serif", transition: "background .35s,color .25s" }}>

                {/* ── HEADER ── */}
                <header style={{ background: th.hdr, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: `1px solid ${th.border}`, position: "sticky", top: 0, zIndex: 50, boxShadow: th.shadow, transition: "background .35s" }}>
                    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 10px", gap: 10, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: `linear-gradient(140deg,${th.accent},${dark ? "#777" : "#444"})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,.18)" }}>
                                    <Ic.Shield w={20} style={{ stroke: th.atext }} />
                                </div>
                                <div>
                                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, color: th.text, letterSpacing: "-.01em", lineHeight: 1 }}>SAHARA</h1>
                                    <p style={{ color: th.muted, fontSize: 11, fontWeight: 500, letterSpacing: ".07em", marginTop: 1 }}>ELDERLY HEALTH COMPANION</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                <div style={{ textAlign: "right", marginRight: 4 }}>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: th.text }}>{timeStr}</div>
                                    <div style={{ fontSize: 11, color: th.muted, letterSpacing: ".04em" }}>{dateStr}</div>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <button className="b" onClick={() => { setView("family"); setLogs(l => l.map(x => ({ ...x, read: true }))); }}
                                        style={{ width: 44, height: 44, borderRadius: 13, background: th.s2, border: `1.5px solid ${th.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: th.sub }}>
                                        <Ic.Bell w={20} />
                                    </button>
                                    {unread > 0 && <span className="nd" style={{ position: "absolute", top: -5, right: -5, width: 19, height: 19, background: G.red, borderRadius: "50%", fontSize: 10, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${th.bg}` }}>{unread}</span>}
                                </div>
                                <button className="b" onClick={() => setDark(d => !d)}
                                    style={{ width: 44, height: 44, borderRadius: 13, background: th.s2, border: `1.5px solid ${th.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: th.sub, transition: "all .2s" }}>
                                    {dark ? <Ic.Sun w={20} /> : <Ic.Moon w={20} />}
                                </button>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "5px 12px 5px 6px" }}>
                                        <span style={{ fontSize: 26 }}>{currentUser?.avatar || "👤"}</span>
                                        <div style={{ lineHeight: 1.2 }}>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{currentUser?.name || "Guest"}</p>
                                            <p style={{ fontSize: 11, color: th.muted, textTransform: "capitalize" }}>{currentUser?.role || "user"}</p>
                                        </div>
                                    </div>
                                    <button className="b" onClick={onLogout} title="Sign Out"
                                        style={{ width: 44, height: 44, borderRadius: 13, background: dark ? "#2c0808" : "#fef2f2", border: `1.5px solid ${G.red}44`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.red }}
                                        >
                                        <Svg w={18}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Svg>
                                    </button>
                                {isCloud && (
                                    <div className="nd" style={{ position: "fixed", bottom: 100, right: 24, background: th.surface, padding: "8px 16px", borderRadius: 12, border: `1.5px solid ${th.border}`, boxShadow: th.shadow, display: "flex", alignItems: "center", gap: 8, zIndex: 1000 }}>
                                        <span className="br" style={{ width: 8, height: 8, borderRadius: "50%", background: G.green }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: th.text }}>✨ Synced to Cloud</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* View switcher */}
                        <div style={{ display: "flex", gap: 8, paddingBottom: 13 }}>
                            {[{ id: "senior", ic: <Ic.Shield w={19} />, lbl: "For Seniors", sub: "Your health dashboard" },
                            { id: "family", ic: <Ic.Family w={19} />, lbl: "For Family", sub: "Monitor & alerts", badge: unread || null }].map(t => (
                                <button key={t.id} className="tb"
                                    onClick={() => setView(t.id)}
                                    style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "11px 15px", borderRadius: 14, border: `1.5px solid ${view === t.id ? th.accent : th.border}`, background: view === t.id ? th.accent : "transparent", cursor: "pointer", fontFamily: "'Outfit', sans-serif", textAlign: "left", position: "relative", boxShadow: view === t.id ? "0 3px 14px rgba(0,0,0,.11)" : "none" }}>
                                    <span style={{ color: view === t.id ? th.atext : th.sub, flexShrink: 0 }}>{t.ic}</span>
                                    <div>
                                        <p style={{ fontSize: 15, fontWeight: 700, color: view === t.id ? th.atext : th.text, lineHeight: 1.2 }}>{t.lbl}</p>
                                        <p style={{ fontSize: 11, color: view === t.id ? (dark ? "rgba(14,14,13,.5)" : "rgba(255,255,255,.55)") : th.muted, marginTop: 2 }}>{t.sub}</p>
                                    </div>
                                    {t.badge && <span className="nd" style={{ position: "absolute", top: 7, right: 9, background: G.red, color: "#fff", borderRadius: 99, padding: "2px 7px", fontSize: 11, fontWeight: 800, border: `2px solid ${th.bg}` }}>{t.badge}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ── VIEWS ── */}
                <div className="ve" key={view}>
                    {view === "senior"
                        ? <SeniorView  {...sp} setShowShare={setShowShare} />
                        : <FamilyView  {...sp} setShowShare={setShowShare} />}
                </div>

                {/* ── MODALS ── */}
                {showFood && <FoodModal th={th} dark={dark} onClose={() => setShowFood(false)}
                    onAdd={e => { setFoodLog(fl => [...fl, { ...e, id: Date.now() }]); setShowFood(false); }} />}

                {editV && (
                    <Sheet th={th} title={editV === "bp" ? "Edit Blood Pressure" : editV === "sugar" ? "Edit Blood Sugar" : "Edit Heart Rate"} onClose={() => setEditV(null)}>
                        <p style={{ color: th.sub, fontSize: 17, marginBottom: 13 }}>{editV === "bp" ? "Format: 120/80  (Systolic / Diastolic)" : editV === "sugar" ? "In mg/dL  e.g. 95" : "In bpm  e.g. 72"}</p>
                        <input value={tmpV} onChange={e => setTmpV(e.target.value)} placeholder={editV === "bp" ? "120/80" : editV === "sugar" ? "95" : "72"}
                            style={{ background: th.inputBg, border: `2px solid ${th.border}`, color: th.text, borderRadius: 13, padding: "13px 15px", fontSize: 20, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" }} />
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <button className="b" onClick={() => setEditV(null)} style={{ flex: 1, padding: 15, borderRadius: 13, fontSize: 17, fontWeight: 600, fontFamily: "'Outfit', sans-serif", background: th.s2, border: `1.5px solid ${th.border}`, color: th.text, cursor: "pointer" }}>Cancel</button>
                            <button className="b" onClick={() => { setVitals(v => ({ ...v, [editV]: tmpV })); setEditV(null); }} style={{ flex: 2, padding: 15, borderRadius: 13, fontSize: 17, fontWeight: 700, fontFamily: "'Outfit', sans-serif", background: th.accent, color: th.atext, border: "none", cursor: "pointer" }}>Save Reading</button>
                        </div>
                    </Sheet>
                )}

                {showShare && (
                    <Sheet th={th} title="Share Health Report" onClose={() => setShowShare(false)}>
                        <div style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 14, padding: "15px 17px", marginBottom: 18, fontSize: 13, color: th.sub, lineHeight: 1.75, maxHeight: 210, overflowY: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                            {`SAHARA Health Report 🏥
Raj Kumar · Age 68 · ${now.toLocaleDateString("en-IN")}

Health Score: ${score}/100 — Good Condition

Vitals
  BP: ${vitals.bp} mmHg · Sugar: ${vitals.sugar} mg/dL · HR: ${vitals.heart} bpm

Nutrition
  Calories: ${kcal} / 1800 kcal
  Protein:  ${prot} / 60 g

Medication
  Metformin: ${medTaken ? "✅ Taken" : "⏳ Pending"}

Activity
  Sleep: ${sleep} hrs  |  Steps: ${steps.toLocaleString()}

Generated at ${timeStr}`}
                        </div>
                        <p style={{ color: th.muted, fontSize: 13, textAlign: "center", marginBottom: 16 }}>Share this summary with family or your doctor</p>
                        <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer" className="wa b"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 11, width: "100%", padding: "18px", borderRadius: 15, fontSize: 19, fontWeight: 700, fontFamily: "'Outfit', sans-serif", background: G.wa, color: "#fff", textDecoration: "none", boxShadow: "0 6px 22px rgba(37,211,102,.3)" }}>
                            <Ic.Wa w={26} /> Share on WhatsApp
                        </a>
                        <p style={{ color: th.muted, fontSize: 12, textAlign: "center", marginTop: 10 }}>Opens pre-filled WhatsApp message · Full integration coming soon</p>
                    </Sheet>
                )}

                {/* ── SOS TRIGGER ── */}
                {view === "senior" && (
                    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "16px 20px 20px", background: `linear-gradient(transparent,${th.bg} 50%)`, zIndex: 50, pointerEvents: "none" }}>
                        <button className="sos b" onClick={() => { setSos("active"); setSosTime(5); }}
                            style={{ pointerEvents: "all", display: "flex", alignItems: "center", gap: 13, background: G.red, color: "#fff", border: "none", borderRadius: 99, padding: "16px 40px", fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", letterSpacing: ".02em" }}>
                            <Ic.Phone w={24} /> Emergency SOS
                        </button>
                    </div>
                )}

                {/* ── SOS OVERLAY ── */}
                {sos && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(180, 0, 0, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center", color: "#fff" }}>
                        <div className="sos" style={{ width: 140, height: 140, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
                            <Ic.Phone w={60} style={{ color: G.red }} />
                        </div>
                        {sos === "active" ? (
                            <>
                                <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 15 }}>EMERGENCY SOS</h2>
                                <p style={{ fontSize: 22, opacity: 0.9, marginBottom: 40 }}>Contacting help in <span style={{ fontSize: 48, fontWeight: 900 }}>{sosTime}</span> seconds...</p>
                                <button className="b" onClick={() => setSos(null)} style={{ background: "transparent", border: "3px solid #fff", color: "#fff", padding: "18px 50px", borderRadius: 18, fontSize: 24, fontWeight: 800, cursor: "pointer" }}>CANCEL SOS</button>
                            </>
                        ) : (
                            <>
                                <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 15 }}>CALLING NOW...</h2>
                                <p style={{ fontSize: 22, opacity: 0.9, marginBottom: 40 }}>Emergency services and your family have been notified.</p>
                                <div style={{ background: "#fff", color: G.red, padding: "20px 40px", borderRadius: 20, fontSize: 24, fontWeight: 800 }}>HELP IS ON THE WAY</div>
                                <p style={{ marginTop: 15, fontSize: 16, opacity: 0.8 }}>SMS Alerts sent to Rajat and Sneha via Twilio.</p>
                                <button className="b" onClick={() => setSos(null)} style={{ marginTop: 40, opacity: 0.7, color: "#fff", background: "none", border: "none", textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>End Call</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR VIEW
// ─────────────────────────────────────────────────────────────────────────────
function SeniorView({ th, dark, vitals, setVitals, vMode, setVMode, setEditV, setTmpV, medTaken, setMedTaken,
    sleep, setSleep, steps, setSteps, editAct, setEditAct, foodLog, setFoodLog, setShowFood,
    kcal, prot, score, sent, pushAlert, now, show, setShowShare }) {

    const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
    const lbl = score >= 80 ? "Good Condition" : score >= 60 ? "Monitor Closely" : "Needs Attention";
    const circ = 2 * Math.PI * 50;

    return (
        <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 180px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>

            {/* Score */}
            <Card th={th} full d={0} show={show}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                    <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
                        <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
                            <circle cx={58} cy={58} r={50} fill="none" stroke={th.s3} strokeWidth={9} />
                            <circle cx={58} cy={58} r={50} fill="none" stroke={col} strokeWidth={9}
                                strokeLinecap="round" strokeDasharray={circ} className="ra"
                                style={{ strokeDashoffset: show ? circ - (score / 100) * circ : circ, filter: `drop-shadow(0 0 7px ${col}55)` }} />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, color: col, lineHeight: 1 }}>{score}</span>
                            <span style={{ fontSize: 10, color: th.muted, letterSpacing: ".06em" }}>/100</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 170 }}>
                        <Label>Health Score</Label>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8, marginBottom: 6 }}>
                            <span style={{ width: 11, height: 11, borderRadius: "50%", background: col, display: "inline-block", boxShadow: `0 0 9px ${col}80` }} />
                            <span style={{ fontSize: 21, fontWeight: 700, color: col }}>{lbl}</span>
                        </div>
                        <div style={{ background: th.s3, borderRadius: 99, height: 9, overflow: "hidden", marginBottom: 14 }}>
                            <div className="ba sh" style={{ width: show ? `${score}%` : "0%", height: 9, borderRadius: 99, background: `linear-gradient(90deg,${col}CC,${col})` }} />
                        </div>
                        {[{ l: "Last Checked", v: "8:30 AM" }, { l: "Trend", v: "↑ Improving" }, { l: "Next Check", v: "2:00 PM" }].map(r => (
                            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                                <span style={{ color: th.sub, fontSize: 15 }}>{r.l}</span>
                                <span style={{ color: th.text, fontWeight: 600, fontSize: 15 }}>{r.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Vitals */}
            <Card th={th} full d={1} show={show}>
                <CH th={th} icon={<Ic.Pulse w={20} />} title="Vitals">
                    <ModeToggle th={th} vMode={vMode} setVMode={setVMode} />
                </CH>
                {vMode === "manual" && <Banner col={G.amber} bg={dark ? G.aBgD : G.aBg} bd={dark ? G.aBdD : G.aBd} mt={13} mb={15}>✏️  Manual mode — tap Edit on any vital to update</Banner>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12, marginTop: 16 }}>
                    {[{ k: "bp", label: "Blood Pressure", unit: "mmHg", ic: <Ic.Pulse w={24} />, tint: dark ? "#1a2820" : "#f0fdf4" },
                    { k: "sugar", label: "Blood Sugar", unit: "mg/dL", ic: <Ic.Drop w={24} />, tint: dark ? "#0e1828" : "#eff6ff" },
                    { k: "heart", label: "Heart Rate", unit: "bpm", ic: <Ic.Heart w={24} />, tint: dark ? "#28100e" : "#fff1f2" },
                    { k: "hb", label: "Haemoglobin", unit: "g/dL", ic: <Ic.Shield w={24} />, tint: dark ? "#1a1a24" : "#f5f5ff" }].map(v => (
                        <div key={v.k} style={{ borderRadius: 18, padding: "18px 16px", position: "relative", background: v.tint, border: `1.5px solid ${th.border}`, transition: "border-color .2s" }}>
                            <span style={{ color: G.blue }}>{v.ic}</span>
                            <p style={{ color: th.sub, fontSize: 14, fontWeight: 600, marginTop: 9, letterSpacing: ".03em" }}>{v.label}</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, color: th.text, lineHeight: 1 }}>{vitals[v.k]}</span>
                                <span style={{ fontSize: 13, color: th.muted }}>{v.unit}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 9 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: (v.k === "hb" && Number(vitals.hb) < 12) ? G.amber : G.green, display: "inline-block", boxShadow: `0 0 6px ${(v.k === "hb" && Number(vitals.hb) < 12) ? G.amber : G.green}80` }} />
                                <span style={{ fontSize: 12, color: (v.k === "hb" && Number(vitals.hb) < 12) ? G.amber : G.green, fontWeight: 600 }}>{(v.k === "hb" && Number(vitals.hb) < 12) ? "Low" : "Optimal"}</span>
                            </div>
                            {vMode === "manual" && (
                                <button className="b" onClick={() => { 
                                    setEditV(v.k); 
                                    setTmpV(vitals[v.k]); 
                                }}
                                    style={{ position: "absolute", top: 11, right: 11, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 9, padding: "6px 10px", cursor: "pointer", color: th.sub, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
                                    <Ic.Edit w={12} /> Edit
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {vMode === "auto" && (
                    <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 8, color: th.muted, fontSize: 13 }}>
                        <span className="br" style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, display: "inline-block" }} />
                        Auto-monitoring active · Syncing every 15 minutes
                    </div>
                )}
            </Card>

            {/* Food Diary */}
            <Card th={th} full d={2} show={show}>
                <CH th={th} icon={<Ic.Fork w={20} />} title="Food Diary">
                    <button className="b" onClick={() => setShowFood(true)}
                        style={{ display: "flex", alignItems: "center", gap: 7, background: th.accent, color: th.atext, border: "none", borderRadius: 13, padding: "11px 20px", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 3px 12px rgba(0,0,0,.12)" }}>
                        <Ic.Plus w={19} /> Add Food
                    </button>
                </CH>

                <div style={{ display: "flex", gap: 11, margin: "17px 0", flexWrap: "wrap" }}>
                    {[{ l: "Calories", v: kcal, u: "kcal", max: 1800, warn: kcal > 1800 }, { l: "Protein", v: prot, u: "g", max: 60, warn: prot < 40 }].map(s => (
                        <div key={s.l} style={{ flex: 1, minWidth: 148, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 16, padding: "15px 17px" }}>
                            <p style={{ color: th.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>{s.l}</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, color: s.warn ? G.amber : th.text, lineHeight: 1 }}>{s.v}</span>
                                <span style={{ fontSize: 14, color: th.muted }}>{s.u}</span>
                            </div>
                            <div style={{ background: th.border, borderRadius: 99, height: 6, marginTop: 9, overflow: "hidden" }}>
                                <div className="ba sh" style={{ width: show ? `${Math.min(100, (s.v / s.max) * 100)}%` : "0%", height: 6, borderRadius: 99, background: `linear-gradient(90deg,${s.warn ? G.amber : G.green}99,${s.warn ? G.amber : G.green})` }} />
                            </div>
                            <p style={{ color: th.muted, fontSize: 12, marginTop: 5 }}>Goal: {s.max} {s.u}</p>
                        </div>
                    ))}
                </div>

                {["breakfast", "lunch", "dinner"].map(key => {
                    const m = MEALS_CFG[key]; const eaten = foodLog.some(f => f.meal.toLowerCase() === key);
                    const cd = countdown(m.hour, sent, key, now);
                    return (
                        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "12px 15px", gap: 9, marginBottom: 8, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 17, fontWeight: 700, color: th.text }}>{m.label}</span>
                                        <span style={{ fontSize: 12, color: th.muted }}>{m.time}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: cd.color, fontWeight: 700, marginTop: 2 }}>{cd.text}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                <StatusPill eaten={eaten} dark={dark} />
                                <button className="b" onClick={() => pushAlert(key, `${m.label} reminder sent to family`)}
                                    disabled={!!sent[key]}
                                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10, border: `1.5px solid ${sent[key] ? G.gBd : th.border}`, background: sent[key] ? (dark ? G.gBgD : G.gBg) : th.s2, color: sent[key] ? G.green : th.sub, fontSize: 12, fontWeight: 700, cursor: sent[key] ? "default" : "pointer", fontFamily: "'Outfit', sans-serif", transition: "all .2s" }}>
                                    {sent[key] ? <Ic.Check w={13} /> : <Ic.Send w={13} />}
                                    {sent[key] ? "Sent" : "Alert"}
                                </button>
                            </div>
                        </div>
                    );
                })}

                {prot < 40 && <Banner col={G.amber} bg={dark ? G.aBgD : G.aBg} bd={dark ? G.aBdD : G.aBd} mb={13}>⚠️  Protein is low — add dal, eggs, or curd to your next meal.</Banner>}

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {foodLog.length === 0 && <p style={{ color: th.muted, fontSize: 17, textAlign: "center", padding: "16px 0" }}>No food logged yet. Tap "Add Food" above.</p>}
                    {foodLog.map(f => (
                        <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 11, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "11px 14px" }}>
                            <span style={{ fontSize: 22 }}>{f.type === "photo" ? "📷" : f.type === "voice" ? "🎙️" : "🍽️"}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 16, fontWeight: 600, color: th.text }}>{f.name}</p>
                                <p style={{ fontSize: 12, color: th.muted, marginTop: 2 }}>{f.meal} · {f.time} · {f.kcal} kcal · {f.protein}g protein</p>
                            </div>
                            <button className="b" onClick={() => setFoodLog(fl => fl.filter(x => x.id !== f.id))} style={{ background: "none", border: "none", cursor: "pointer", color: th.muted, padding: 4 }}>
                                <Ic.Trash w={17} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Medication */}
            <Card th={th} d={3} show={show}>
                <CH th={th} icon={<Ic.Pill w={20} />} title="Medication" />
                <div style={{ marginTop: 15, background: dark ? "#12181f" : "linear-gradient(135deg,#f8f8ff,#eef4ff)", border: `1.5px solid ${th.border}`, borderRadius: 18, padding: "17px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div>
                            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 27, fontWeight: 700, color: th.text }}>Metformin</p>
                            <p style={{ color: th.sub, fontSize: 16, marginTop: 4 }}>After Lunch · 2:00 PM</p>
                            <p style={{ fontSize: 12, color: countdown(MEALS_CFG.medication.hour, sent, "medication", now).color, fontWeight: 700, marginTop: 5 }}>
                                {countdown(MEALS_CFG.medication.hour, sent, "medication", now).text}
                            </p>
                        </div>
                        <span style={{
                            padding: "6px 13px", borderRadius: 99, fontSize: 13, fontWeight: 700,
                            background: medTaken ? (dark ? G.gBgD : G.gBg) : (dark ? G.aBgD : G.aBg),
                            color: medTaken ? G.green : G.amber,
                            border: `1.5px solid ${medTaken ? (dark ? G.gBdD : G.gBd) : (dark ? G.aBdD : G.aBd)}`
                        }}>
                            {medTaken ? "✓ Taken" : "Pending"}
                        </span>
                    </div>
                    <button className="b" onClick={() => { setMedTaken(m => !m); if (!medTaken) pushAlert("medication", "Metformin marked as taken"); }}
                        style={{ width: "100%", padding: "16px", borderRadius: 14, fontSize: 19, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", border: medTaken ? `1.5px solid ${th.border}` : "none", background: medTaken ? th.s2 : th.accent, color: medTaken ? th.sub : th.atext, boxShadow: medTaken ? "none" : "0 4px 14px rgba(0,0,0,.13)", transition: "all .22s" }}>
                        {medTaken ? "✓ Medication Taken" : "Mark as Taken"}
                    </button>
                </div>
                <button className="b" onClick={() => pushAlert("med_r", "Metformin reminder sent to family")}
                    style={{ marginTop: 10, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 13, border: `1.5px solid ${th.border}`, background: "transparent", color: th.sub, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all .2s" }}>
                    <Ic.Send w={16} /> Remind Family
                    {sent["med_r"] && <span style={{ fontSize: 12, color: G.green, fontWeight: 700 }}>✓ Sent</span>}
                </button>
            </Card>

            {/* Activity */}
            <Card th={th} d={4} show={show}>
                <CH th={th} icon={<Ic.Moon w={20} />} title="Activity" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 15 }}>
                    <div style={{ background: th.accent, borderRadius: 18, padding: "17px 15px", color: th.atext, boxShadow: "0 6px 22px rgba(0,0,0,.18)" }}>
                        <Ic.Moon w={24} />
                        {editAct === "sleep"
                            ? <><input type="range" min="3" max="12" step="0.5" value={sleep} onChange={e => setSleep(Number(e.target.value))} style={{ width: "100%", marginTop: 12, marginBottom: 6 }} />
                                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 700 }}>{sleep} hrs</p>
                                <button onClick={() => setEditAct(null)} style={{ marginTop: 8, background: "rgba(255,255,255,.18)", border: "none", borderRadius: 9, padding: "7px 14px", color: "inherit", fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Done ✓</button></>
                            : <><p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 700, marginTop: 9, lineHeight: 1 }}>{sleep} hrs</p>
                                <p style={{ opacity: .6, fontSize: 13, marginTop: 2 }}>SLEEP</p>
                                <div style={{ marginTop: 9, background: "rgba(255,255,255,.15)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                                    <div className="sh" style={{ width: `${Math.min(100, (sleep / 8) * 100)}%`, height: 6, borderRadius: 99, background: "rgba(74,222,128,.8)" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                                    <span style={{ opacity: .5, fontSize: 11 }}>Goal: 8 hrs</span>
                                    <span style={{ opacity: .5, fontSize: 11 }}>{Math.round((sleep / 8) * 100)}%</span>
                                </div>
                                <button className="b" onClick={() => setEditAct("sleep")} style={{ marginTop: 11, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 9, padding: "6px 12px", color: "inherit", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Ic.Edit w={12} /> Edit
                                </button></>
                        }
                    </div>
                    <div style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 18, padding: "17px 15px" }}>
                        <Ic.Steps w={24} style={{ color: th.sub }} />
                        {editAct === "steps"
                            ? <><input type="range" min="0" max="10000" step="100" value={steps} onChange={e => setSteps(Number(e.target.value))} style={{ width: "100%", marginTop: 12, marginBottom: 6 }} />
                                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 700, color: th.text }}>{steps.toLocaleString()}</p>
                                <button onClick={() => setEditAct(null)} style={{ marginTop: 8, background: th.border, border: "none", borderRadius: 9, padding: "7px 14px", color: th.text, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Done ✓</button></>
                            : <><p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 700, marginTop: 9, color: th.text, lineHeight: 1 }}>{steps.toLocaleString()}</p>
                                <p style={{ color: th.sub, fontSize: 13, marginTop: 2 }}>STEPS</p>
                                <div style={{ marginTop: 9, background: th.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
                                    <div className="sh" style={{ width: `${Math.min(100, (steps / 5000) * 100)}%`, height: 6, borderRadius: 99, background: `linear-gradient(90deg,${G.amber}99,${G.amber})` }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                                    <span style={{ color: th.muted, fontSize: 11 }}>Goal: 5,000</span>
                                    <span style={{ color: th.muted, fontSize: 11 }}>{Math.round((steps / 5000) * 100)}%</span>
                                </div>
                                <button className="b" onClick={() => setEditAct("steps")} style={{ marginTop: 11, background: th.s3, border: `1px solid ${th.border}`, borderRadius: 9, padding: "6px 12px", color: th.text, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Ic.Edit w={12} /> Edit
                                </button></>
                        }
                    </div>
                </div>
            </Card>

            {/* Health Alerts */}
            <Card th={th} d={5} show={show}>
                <CH th={th} icon={<Ic.Bell w={20} />} title="Health Alerts" />
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 15 }}>
                    {Number(vitals.hb) < 9 && <AlertRow th={th} dark={dark} sev="crit" title="CRITICAL Anaemia Danger" desc="HB levels are dangerously low (<9.0). Please seek immediate clinical attention or contact your doctor now." />}
                    {Number(vitals.hb) >= 9 && Number(vitals.hb) < 12 && <AlertRow th={th} dark={dark} sev="warn" title="Anaemia Risk Detected" desc="HB levels are low. Consider iron-rich foods like spinach, lentils, and dates. Consult your doctor." />}
                    {Number(vitals.sugar) > 160 && <AlertRow th={th} dark={dark} sev="crit" title="High Blood Sugar" desc="Sugar is above safe threshold. Check if medication was missed or consult a specialist." />}
                    {steps < 2000 && <AlertRow th={th} dark={dark} sev="info" title="Very Low Activity" desc="Try a 5-minute walk inside the house to keep circulation healthy." />}
                    <AlertRow th={th} dark={dark} sev="info" title="Metric Sync Active" desc="All parameters are currently being monitored and synced to your family dashboard." />
                </div>
            </Card>

            {/* Share Report */}
            <Card th={th} full d={6} show={show}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <Label>Daily Health Report</Label>
                        <p style={{ fontSize: 19, fontWeight: 700, color: th.text, marginTop: 6 }}>Share your summary with family or doctor</p>
                        <p style={{ color: th.sub, fontSize: 14, marginTop: 4 }}>All vitals, nutrition and medication in one message</p>
                    </div>
                    <button className="wa b" onClick={() => setShowShare(true)}
                        style={{ display: "flex", alignItems: "center", gap: 11, background: G.wa, color: "#fff", border: "none", borderRadius: 15, padding: "15px 28px", fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", boxShadow: "0 6px 22px rgba(37,211,102,.28)", flexShrink: 0 }}>
                        <Ic.Wa w={24} /> Share via WhatsApp
                    </button>
                </div>
            </Card>

        </main>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY VIEW
// ─────────────────────────────────────────────────────────────────────────────
function FamilyView({ th, dark, vitals, medTaken, kcal, prot, sleep, steps, score, logs, setLogs, sent, pushAlert, foodLog, now, show, setShowShare }) {
    const col = score >= 80 ? G.green : score >= 60 ? G.amber : G.red;
    return (
        <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 18px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 18 }}>

            <Card th={th} full d={0} show={show}>
                <div style={{ display: "flex", alignItems: "center", gap: 15, flexWrap: "wrap", marginBottom: 17 }}>
                    <div style={{ width: 62, height: 62, borderRadius: 17, background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>👴</div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, fontWeight: 700, color: th.text }}>Raj Kumar</p>
                        <p style={{ color: th.sub, fontSize: 14, marginTop: 2 }}>Age 68 · Mumbai · Last sync: Today 8:30 AM</p>
                    </div>
                    <div style={{ textAlign: "center", background: `${col}12`, border: `1.5px solid ${col}28`, borderRadius: 15, padding: "11px 19px" }}>
                        <p style={{ fontSize: 10, color: th.muted, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Score</p>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, color: col, lineHeight: 1 }}>{score}</p>
                        <p style={{ fontSize: 11, color: col, fontWeight: 700, marginTop: 2 }}>Good</p>
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))", gap: 9 }}>
                    {[{ l: "Blood Pressure", v: vitals.bp, s: "g" }, { l: "Heart Rate", v: `${vitals.heart} bpm`, s: "g" },
                    { l: "Blood Sugar", v: `${vitals.sugar} mg/dL`, s: "g" }, { l: "Medication", v: medTaken ? "Taken ✓" : "Pending", s: medTaken ? "g" : "a" },
                    { l: "Calories", v: `${kcal} kcal`, s: kcal >= 1200 ? "g" : "a" }, { l: "Protein", v: `${prot}g`, s: prot >= 40 ? "g" : "a" },
                    { l: "Sleep", v: `${sleep} hrs`, s: sleep >= 6 ? "g" : "a" }, { l: "Steps", v: steps.toLocaleString(), s: steps >= 3000 ? "g" : "a" },
                    ].map(i => {
                        const c = i.s === "g" ? G.green : G.amber;
                        return (
                            <div key={i.l} style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "12px 11px", textAlign: "center" }}>
                                <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block", marginBottom: 6, boxShadow: `0 0 7px ${c}70` }} />
                                <p style={{ color: th.sub, fontSize: 11, fontWeight: 600, letterSpacing: ".03em" }}>{i.l}</p>
                                <p style={{ fontSize: 16, fontWeight: 700, color: c, marginTop: 3 }}>{i.v}</p>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card th={th} full d={1} show={show}>
                <CH th={th} icon={<Ic.Bell w={20} />} title="Alert Log">
                    <button onClick={() => setLogs(l => l.map(x => ({ ...x, read: true })))} style={{ fontSize: 13, fontWeight: 700, color: th.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Mark all read</button>
                </CH>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 15 }}>
                    {logs.length === 0 && <p style={{ color: th.muted, fontSize: 17, textAlign: "center", padding: 17 }}>No alerts yet.</p>}
                    {logs.map(a => {
                        const isMed = a.type === "med";
                        const c = isMed ? G.blue : G.green;
                        const bg = isMed ? (dark ? G.bBgD : G.bBg) : (dark ? G.gBgD : G.gBg);
                        const bd = isMed ? (dark ? G.bBdD : G.bBd) : (dark ? G.gBdD : G.gBd);
                        return (
                            <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: a.read ? th.s2 : bg, border: `1.5px solid ${a.read ? th.border : bd}`, borderRadius: 13, padding: "12px 15px", transition: "all .3s" }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{isMed ? "💊" : "🍽️"}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: a.read ? th.sub : c }}>{a.msg}</p>
                                    <p style={{ fontSize: 12, color: th.muted, marginTop: 3 }}>{a.time}</p>
                                </div>
                                {!a.read && <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block", marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${c}70` }} />}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card th={th} d={2} show={show}>
                <CH th={th} icon={<Ic.Send w={20} />} title="Remind Senior" />
                <p style={{ color: th.sub, fontSize: 15, marginTop: 5, marginBottom: 14 }}>Send a gentle nudge to Raj</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[{ k: "f_b", e: "🌅", l: "Remind: Have Breakfast" }, { k: "f_l", e: "☀️", l: "Remind: Have Lunch" },
                    { k: "f_d", e: "🌙", l: "Remind: Have Dinner" }, { k: "f_m", e: "💊", l: "Remind: Take Metformin" },
                    { k: "f_w", e: "💧", l: "Remind: Drink Water" }, { k: "f_wk", e: "🚶", l: "Remind: Short Walk" },
                    ].map(r => (
                        <button key={r.k} className="b" onClick={() => pushAlert(r.k, r.l.replace("Remind: ", "") + " reminder by family")}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px", borderRadius: 13, border: `1.5px solid ${sent[r.k] ? G.gBd : th.border}`, background: sent[r.k] ? (dark ? G.gBgD : G.gBg) : th.s2, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: sent[r.k] ? G.green : th.text, transition: "all .2s" }}>
                            {r.e}  {r.l}
                            <span style={{ fontSize: 11, color: sent[r.k] ? G.green : th.muted, fontWeight: 700 }}>{sent[r.k] ? "✓ Sent" : "Tap →"}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <Card th={th} d={3} show={show}>
                <CH th={th} icon={<Ic.Fork w={20} />} title="Meal Compliance" />
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 15 }}>
                    {["breakfast", "lunch", "dinner"].map(m => {
                        const eaten = foodLog.some(f => f.meal.toLowerCase() === m);
                        const s = MEALS_CFG[m]; const cd = countdown(s.hour, sent, m, now);
                        return (
                            <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "13px 15px" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 20 }}>{s.emoji}</span>
                                        <p style={{ fontSize: 18, fontWeight: 700, color: th.text }}>{s.label}</p>
                                        <span style={{ fontSize: 12, color: th.muted }}>{s.time}</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: cd.color, fontWeight: 700, marginTop: 3 }}>{cd.text}</p>
                                </div>
                                <StatusPill eaten={eaten} dark={dark} />
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card th={th} full d={4} show={show}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <Label>Health Report</Label>
                        <p style={{ fontSize: 19, fontWeight: 700, color: th.text, marginTop: 6 }}>Share Raj's health summary</p>
                        <p style={{ color: th.sub, fontSize: 14, marginTop: 4 }}>Send to family members or the doctor</p>
                    </div>
                    <button className="wa b" onClick={() => setShowShare(true)}
                        style={{ display: "flex", alignItems: "center", gap: 11, background: G.wa, color: "#fff", border: "none", borderRadius: 15, padding: "15px 28px", fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", boxShadow: "0 6px 22px rgba(37,211,102,.28)", flexShrink: 0 }}>
                        <Ic.Wa w={24} /> Share via WhatsApp
                    </button>
                </div>
            </Card>
        </main>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOD MODAL
// ─────────────────────────────────────────────────────────────────────────────
function FoodModal({ th, dark, onClose, onAdd }) {
    const [tab, setTab] = useState("manual");
    const [search, setS] = useState("");
    const [sels, setSels] = useState([]); 
    const [meal, setMeal] = useState("Breakfast");
    const [photo, setPh] = useState(null);
    const [pEntries, setPe] = useState([]); 
    const [pManual, setPM] = useState({ name: "", kcal: "", protein: "" });
    const [rec, setRec] = useState(false);
    const [vtxt, setVt] = useState(""); const [vEntries, setVe] = useState([]); 
    const [vLang, setVLang] = useState("hi-IN"); // 🌐 State for EN/HI toggle
    const [loading, setLoading] = useState(false);
    const fRef = useRef(); const rRef = useRef();
    const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
    const nowT = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const ready = (tab === "manual" ? sels.length > 0 : tab === "camera" ? ((pEntries.length > 0 || pManual.name) && !loading) : (vEntries.length > 0 && !loading));
    const inp = { background: th.inputBg, border: `2px solid ${th.border}`, color: th.text, borderRadius: 13, padding: "12px 15px", fontSize: 19, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" };

    function doAdd() {
        if (tab === "manual") sels.forEach(s => onAdd({ ...s, meal, time: nowT(), type: "manual" }));
        if (tab === "camera") {
            if (pEntries.length > 0) pEntries.forEach(e => onAdd({ ...e, meal, time: nowT(), type: "photo" }));
            else if (pManual.name) onAdd({ ...pManual, kcal: +pManual.kcal || 0, protein: +pManual.protein || 0, meal, time: nowT(), type: "manual_photo" });
        }
        if (tab === "voice") vEntries.forEach(e => onAdd({ ...e, meal, time: nowT(), type: "voice" }));
        onClose();
    }
    function startVoice() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Voice recognition requires Chrome browser."); return; }
        const r = new SR(); 
        // Use user-selected language (HI or EN)
        r.lang = vLang; 
        r.continuous = false; r.interimResults = false;
        r.onresult = async e => { 
            const text = e.results[0][0].transcript; 
            setVt(text); setLoading(true);
            try {
                const pr = `Detect food items from: '${text}'. Reply ONLY with valid JSON array, e.g. [{"name": "Idli", "kcal": 140, "protein": 5}]. No extra text. If no food found, return []. Focus on Indian cuisine.`;
                const resp = await puter.ai.chat(pr);
                const results = JSON.parse(resp.substring(resp.indexOf('['), resp.lastIndexOf(']') + 1));
                if (Array.isArray(results) && results.length > 0) {
                    // 🚀 AUTO-ADD logic: Adds and closes modal with feedback
                    setVe(results);
                    setTimeout(() => {
                        results.forEach(it => onAdd({ ...it, meal, time: nowT(), type: "voice" }));
                        onClose(); 
                    }, 1200);
                } else if (results.length === 0) {
                    setVe([{ name: "No food detected. Please try again.", kcal: 0, protein: 0 }]);
                }
            } catch(err) { console.error("Voice AI Error:", err); }
            setLoading(false);
        };
        r.onend = () => setRec(false); r.onerror = () => setRec(false); r.start(); rRef.current = r; setRec(true);
    }

    return (
        <Sheet th={th} title="Add Food" onClose={onClose} wide>
            <div style={{ display: "flex", gap: 8, marginBottom: 17 }}>
                {["manual", "camera", "voice"].map((t, i) => (
                    <button key={t} className="b" onClick={() => setTab(t)}
                        style={{ flex: 1, padding: "12px 8px", borderRadius: 13, border: "none", fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", background: tab === t ? th.accent : th.s2, color: tab === t ? th.atext : th.sub, transition: "all .2s" }}>
                        {t === "manual" ? "🍽️ Search" : t === "camera" ? "📷 Photo" : "🎙️ Voice"}
                    </button>
                ))}
            </div>
            <div style={{ marginBottom: 15 }}>
                <p style={{ color: th.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Which Meal?</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["Breakfast", "Lunch", "Dinner", "Snack"].map(m => (
                        <button key={m} className="b" onClick={() => setMeal(m)} style={{ padding: "10px 17px", borderRadius: 11, border: `2px solid ${meal === m ? th.accent : th.border}`, background: meal === m ? th.accent : "transparent", color: meal === m ? th.atext : th.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all .2s" }}>{m}</button>
                    ))}
                </div>
            </div>

            {tab === "manual" && (
                <>
                    <input value={search} onChange={e => setS(e.target.value)} style={{ ...inp, marginBottom: 10 }} placeholder="🔍  Search (e.g. Idli, Dal, Rice, Chapati...)" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 230, overflowY: "auto" }}>
                        {filtered.map(f => {
                            const isSel = sels.some(s => s.name === f.name);
                            return (
                                <button key={f.name} className="b" onClick={() => setSels(isSel ? sels.filter(x => x.name !== f.name) : [...sels, f])}
                                    style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderRadius: 11, border: `2px solid ${isSel ? th.accent : th.border}`, background: isSel ? (dark ? "#1a2218" : "#f0fdf4") : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "'Outfit', sans-serif", transition: "all .14s" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${isSel ? th.accent : th.muted}`, background: isSel ? th.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {isSel && <Ic.Check w={13} style={{ strokeWidth: 3, color: th.atext }} />}
                                        </div>
                                        <span style={{ fontSize: 16, fontWeight: 700, color: th.text }}>{f.name}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: th.muted, whiteSpace: "nowrap" }}>{f.kcal} kcal · {f.protein}g</span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {tab === "camera" && (
                <>
                    <input type="file" accept="image/*" capture="environment" ref={fRef} style={{ display: "none" }} onChange={e => { 
                        const f = e.target.files[0]; 
                        if (f) { 
                            const reader = new FileReader();
                            reader.onload = async (ev) => {
                                const dataUrl = ev.target.result;
                                setPh(dataUrl); setLoading(true); setPe([]);
                                setPM({ name: "", kcal: "", protein: "" });
                                try {
                                    const prompt = `Act as an Indian nutrition expert. Analyze this photo of food. Reply ONLY with a valid JSON array of objects, e.g. [{"name": "Poha", "kcal": 180, "protein": 4}]. Detect all visible items. No extra text.`;
                                    const resp = await puter.ai.chat(prompt, dataUrl);
                                    const start = resp.indexOf('[');
                                    const end = resp.lastIndexOf(']') + 1;
                                    if (start === -1 || end === 0) throw new Error("No JSON array found");
                                    const results = JSON.parse(resp.substring(start, end));
                                    setPe(Array.isArray(results) ? results : [results]); 
                                } catch(err) {
                                    console.error("AI Analysis Error:", err);
                                    setPe([]); 
                                }
                                setLoading(false);
                            };
                            reader.readAsDataURL(f);
                        } 
                    }} />
                    {!photo
                        ? <button className="b" onClick={() => fRef.current.click()} style={{ width: "100%", padding: "32px 20px", borderRadius: 18, border: `3px dashed ${th.border}`, background: th.s2, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 11 }}>
                            <Ic.Camera w={48} style={{ color: th.sub }} /><p style={{ fontSize: 18, fontWeight: 700, color: th.text }}>Take / Upload Photo</p><p style={{ fontSize: 13, color: th.muted }}>Tap to open camera or gallery</p>
                        </button>
                        : <>
                            <img src={photo} alt="food" style={{ width: "100%", maxHeight: 190, objectFit: "cover", borderRadius: 15, marginBottom: 11 }} />
                            <button onClick={() => { setPh(null); setPe([]); setPM({name:"",kcal:"",protein:""}); fRef.current.click(); }} style={{ marginBottom: 9, background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 9, padding: "8px 15px", fontSize: 14, color: th.text, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>📷 Retake</button>
                            {loading && <p style={{ color: th.accent, fontSize: 15, fontWeight: 700, textAlign: "center", padding: 10 }}>✨ AI is detecting food items...</p>}
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                {pEntries.map((e, i) => (
                                    <div key={i} style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                                        <p style={{ fontWeight: 700 }}>{e.name}</p>
                                        <p style={{ color: th.muted, fontSize: 13 }}>{e.kcal} kcal · {e.protein}g</p>
                                    </div>
                                ))}
                            </div>
                            {(!loading && photo && pEntries.length === 0) && (
                                <div style={{ borderTop: `1px solid ${th.border}`, marginTop: 15, paddingTop: 15 }}>
                                    <p style={{ color: th.sub, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>AI detection failed. Add manually:</p>
                                    <input value={pManual.name} onChange={e => setPM(v => ({ ...v, name: e.target.value }))} style={{ ...inp, marginBottom: 8 }} placeholder="Food Name (e.g. Roti)" />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input value={pManual.kcal} onChange={e => setPM(v => ({ ...v, kcal: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="Calories" type="number" />
                                        <input value={pManual.protein} onChange={e => setPM(v => ({ ...v, protein: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="Prot(g)" type="number" />
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </>
            )}

            {tab === "voice" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
                    <div style={{ display: "flex", gap: 10, background: th.s2, padding: 6, borderRadius: 12, border: `1.5px solid ${th.border}` }}>
                        {[{ id: "hi-IN", l: "हिन्दी" }, { id: "en-IN", l: "English" }].map(l => (
                            <button key={l.id} className="b" onClick={() => setVLang(l.id)}
                                style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", background: vLang === l.id ? th.accent : "transparent", color: vLang === l.id ? th.atext : th.sub, transition: "all .2s" }}>
                                {l.l}
                            </button>
                        ))}
                    </div>
                    <p style={{ color: th.sub, fontSize: 17, textAlign: "center", lineHeight: 1.6 }}>{vLang === "hi-IN" ? "मदद के लिए कहें कि आपने क्या खाया" : "Say what you ate today"}<br /><span style={{ fontSize: 13, color: th.muted }}>{vLang === "hi-IN" ? `"मैने दाल और रोटी खाई"` : `"I had rice and dal"`}</span></p>
                    <button className="b" onClick={rec ? () => { rRef.current?.stop(); setRec(false); } : startVoice}
                        style={{ width: 104, height: 104, borderRadius: "50%", border: "none", cursor: "pointer", background: rec ? G.red : th.accent, color: rec ? "#fff" : th.atext, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: rec ? `0 0 0 14px ${dark ? "#2a0808" : "#fee2e2"},0 8px 28px rgba(220,38,38,.35)` : th.shadow, transition: "all .25s" }}>
                        <Ic.Mic w={36} />
                    </button>
                    <p style={{ fontSize: 17, fontWeight: 700, color: rec ? G.red : th.muted }}>{rec ? "🔴 Listening… tap to stop" : "Tap to speak"}</p>
                    {vtxt && (
                        <div style={{ width: "100%", background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 13, padding: "12px 15px" }}>
                            <p style={{ color: th.muted, fontSize: 12, marginBottom: 4 }}>You said:</p>
                            <p style={{ fontSize: 17, fontWeight: 700, color: th.text }}>"{vtxt}"</p>
                            {loading && <p style={{ color: th.accent, fontSize: 15, marginTop: 4, fontWeight: 600 }}>✨ AI is analyzing items...</p>}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                                {vEntries.map((e, i) => (
                                    <div key={i} className="nd" style={{ padding: "8px 12px", background: dark ? G.gBgD : G.gBg, borderRadius: 9, border: `1.5px solid ${G.green}`, color: G.green, fontSize: 14, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
                                        <span>✓ {e.name}</span>
                                        <span>Added!</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {vtxt && vEntries.length === 0 && !loading && (
                        <p style={{ color: th.sub, fontSize: 15 }}>No items detected. Try speaking again or use search.</p>
                    )}
                </div>
            )}

            <button className="b" onClick={doAdd} disabled={!ready}
                style={{ width: "100%", marginTop: 19, padding: 16, borderRadius: 13, fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", border: "none", background: th.accent, color: th.atext, opacity: ready ? 1 : .3, transition: "opacity .2s", boxShadow: ready ? "0 4px 14px rgba(0,0,0,.12)" : "none" }}>
                ＋ Add {(tab === "manual" ? sels : tab === "camera" ? pEntries : vEntries).length} Items to Food Diary
            </button>
        </Sheet>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function Card({ th, children, style = {}, full, d = 0, show }) {
    const ref = useRef();
    useEffect(() => { if (show && ref.current) ref.current.classList.add("in"); }, [show]);
    return (
        <div ref={ref} className="c si"
            style={{ background: th.surface, border: `1.5px solid ${th.border}`, borderRadius: 23, padding: "22px 22px", boxShadow: th.shadow, gridColumn: full ? "1/-1" : "auto", transitionDelay: `${d * 0.07}s`, ...style }}>
            {children}
        </div>
    );
}

function CH({ th, icon, title, children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: th.muted }}>{icon}</span>
                <span style={{ color: th.sub, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{title}</span>
            </div>
            {children}
        </div>
    );
}

function Sheet({ th, title, onClose, children, wide }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: th.modalBg, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="se" style={{ background: th.surface, borderRadius: "23px 23px 0 0", padding: "8px 20px 36px", width: "100%", maxWidth: wide ? 640 : 500, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -10px 50px rgba(0,0,0,.2)" }}>
                <div style={{ width: 36, height: 4, borderRadius: 99, background: th.border, margin: "10px auto 17px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 19 }}>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, fontWeight: 700, color: th.text }}>{title}</h2>
                    <button className="b" onClick={onClose} style={{ background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: "50%", width: 39, height: 39, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: th.text }}>
                        <Ic.X w={17} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function AlertRow({ th, dark, sev, title, desc }) {
    const [gone, setGone] = useState(false);
    if (gone) return null;
    const c = sev === "warn" ? G.amber : sev === "crit" ? G.red : G.blue;
    const bg = sev === "warn" ? (dark ? G.aBgD : G.aBg) : sev === "crit" ? (dark ? G.rBgD : G.rBg) : (dark ? G.bBgD : G.bBg);
    const bd = sev === "warn" ? (dark ? G.aBdD : G.aBd) : sev === "crit" ? (dark ? G.rBdD : G.rBd) : (dark ? G.bBdD : G.bBd);
    return (
        <div style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 15, padding: "13px 15px", display: "flex", gap: 12 }}>
            <span style={{ color: c, flexShrink: 0 }}><Ic.Alert w={22} /></span>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: c }}>{title}</p>
                <p style={{ fontSize: 15, color: c, opacity: .8, marginTop: 4, lineHeight: 1.5 }}>{desc}</p>
            </div>
            <button className="b" onClick={() => setGone(true)} style={{ background: "none", border: "none", cursor: "pointer", color: c, padding: 3, flexShrink: 0 }}>
                <Ic.X w={17} />
            </button>
        </div>
    );
}

function StatusPill({ eaten, dark }) {
    return eaten
        ? <span style={{ background: dark ? G.gBgD : G.gBg, color: G.green, border: `1.5px solid ${dark ? G.gBdD : G.gBd}`, borderRadius: 99, padding: "5px 12px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>✓ Done</span>
        : <span style={{ background: dark ? G.aBgD : G.aBg, color: G.amber, border: `1.5px solid ${dark ? G.aBdD : G.aBd}`, borderRadius: 99, padding: "5px 12px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>Pending</span>;
}

function ModeToggle({ th, vMode, setVMode }) {
    return (
        <div style={{ display: "flex", background: th.s2, border: `1.5px solid ${th.border}`, borderRadius: 11, padding: 3, gap: 3 }}>
            {["auto", "manual"].map(m => (
                <button key={m} className="b" onClick={() => setVMode(m)}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", background: vMode === m ? th.accent : "transparent", color: vMode === m ? th.atext : th.sub, transition: "all .2s", textTransform: "capitalize" }}>
                    {m}
                </button>
            ))}
        </div>
    );
}

function Banner({ col, bg, bd, children, mt = 0, mb = 0 }) {
    return <div style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 12, padding: "10px 14px", fontSize: 15, color: col, fontWeight: 600, marginTop: mt, marginBottom: mb }}>{children}</div>;
}

function Label({ children }) {
    return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "inherit" }}>{children}</p>;
}
