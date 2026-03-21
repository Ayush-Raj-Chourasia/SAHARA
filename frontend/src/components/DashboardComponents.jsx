import React, { useState, useRef, useEffect } from 'react';
import * as Ic from './Icons';

// Re-exporting G for consistency
export const G = {
    green: "#16a34a", gBg: "#f0fdf4", gBd: "#bbf7d0", gBgD: "#052e16", gBdD: "#166534",
    amber: "#b45309", aBg: "#fffbeb", aBd: "#fcd34d", aBgD: "#1c1200", aBdD: "#92400e",
    red: "#dc2626", rBg: "#fff1f2", rBd: "#fecada", rBgD: "#1c0404", rBdD: "#991b1b",
    blue: "#2563eb", bBg: "#eff6ff", bBd: "#bfdbfe", bBgD: "#0a1628", bBdD: "#1d4ed8",
    orange: "#ea580c", oBg: "#fff7ed", oBd: "#fed7aa", oBgD: "#1c0a00", oBdD: "#9a3412",
    purple: "#7c3aed", pBg: "#faf5ff", pBd: "#ddd6fe",
    wa: "#25D366",
};

export function Card({ th, children, style = {}, full, d = 0, show }) {
    const ref = useRef();
    useEffect(() => { if (show && ref.current) ref.current.classList.add("in"); }, [show]);
    return (
        <div ref={ref} className="c si"
            style={{ background: th.surface, border: `1.5px solid ${th.border}`, borderRadius: 23, padding: "22px 22px", boxShadow: th.shadow, gridColumn: full ? "1/-1" : "auto", transitionDelay: `${d * 0.07}s`, ...style }}>
            {children}
        </div>
    );
}

export function CH({ th, icon, title, children }) {
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

export function Label({ children }) {
    return (
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "inherit", opacity: 0.6 }}>{children}</p>
    );
}

export function Sheet({ th, title, onClose, children, wide }) {
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

export function FoodModal({ th, dark, onClose, onAdd, FOODS }) {
    const [tab, setTab] = useState("manual");
    const [search, setS] = useState("");
    const [sels, setSels] = useState([]); 
    const [meal, setMeal] = useState("Breakfast");
    const [loading, setLoading] = useState(false);
    const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
    const nowT = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const ready = (tab === "manual" ? sels.length > 0 : false); // Placeholder for others
    const inp = { background: th.inputBg, border: `2px solid ${th.border}`, color: th.text, borderRadius: 13, padding: "12px 15px", fontSize: 19, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" };

    function doAdd() {
        if (tab === "manual") sels.forEach(s => onAdd({ ...s, meal, time: nowT(), type: "manual" }));
        onClose();
    }

    return (
        <Sheet th={th} title="Add Food" onClose={onClose} wide>
            <div style={{ display: "flex", gap: 8, marginBottom: 17 }}>
                <button className="b" onClick={() => setTab("manual")} style={{ flex: 1, padding: "12px 8px", borderRadius: 13, border: "none", fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", background: tab === "manual" ? th.accent : th.s2, color: tab === "manual" ? th.atext : th.sub }}>🍽️ Search</button>
            </div>
             <input value={search} onChange={e => setS(e.target.value)} style={{ ...inp, marginBottom: 10 }} placeholder="🔍  Search food..." />
             <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 230, overflowY: "auto" }}>
                {filtered.map(f => {
                    const isSel = sels.some(s => s.name === f.name);
                    return (
                        <button key={f.name} className="b" onClick={() => setSels(isSel ? sels.filter(x => x.name !== f.name) : [...sels, f])}
                            style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderRadius: 11, border: `2px solid ${isSel ? th.accent : th.border}`, background: isSel ? (dark ? "#1a2218" : "#f0fdf4") : "transparent", cursor: "pointer", textAlign: "left", transition: "all .14s" }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: th.text }}>{f.name}</span>
                        </button>
                    );
                })}
            </div>
            <button className="b" onClick={doAdd} disabled={!ready} style={{ width: "100%", marginTop: 19, padding: 16, borderRadius: 13, fontSize: 18, fontWeight: 700, border: "none", background: th.accent, color: th.atext, opacity: ready ? 1 : .3 }}>
                Add to Diary
            </button>
        </Sheet>
    );
}
