import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Force refresh


const LandingIcons = {
  Shield: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Check: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: w, height: w, ...p.style }}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  ArrowRight: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
  Mic: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
  ),
  Activity: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  ),
  AlertTriangle: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
};

const LandingPage = ({ onStart, onLogin }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);
  return (
    <div className="min-h-screen bg-white text-[#111827] font-['Outfit',sans-serif] overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#EA580C]/20 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#16A34A]/10 to-transparent blur-[120px] rounded-full" />
      </div>
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#111827] text-white shadow-xl"><LandingIcons.Shield w={24} /></div>
          <span className="text-2xl font-extrabold tracking-tight">SAHARA</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-sm font-semibold hover:text-[#EA580C] transition-colors">Login</button>
          <button onClick={onStart} className="px-6 py-2.5 bg-[#111827] text-white rounded-full text-sm font-bold shadow-lg hover:shadow-[#111827]/30 hover:-translate-y-0.5 transition-all">Join Platform</button>
        </div>
      </nav>
      <section className="relative pt-20 pb-32 px-6 mx-auto max-w-7xl text-center">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-[-0.03em] mb-8">Don’t find out <br /><span className="text-[#EA580C]">too late.</span></h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#111827]/70 font-medium leading-relaxed mb-12">AI-powered remote health monitoring for India's 140M senior citizens. Know your parents' health <span className="text-[#111827] font-bold">before</span> it becomes a crisis.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onStart} className="w-full sm:w-auto px-10 py-5 bg-[#EA580C] text-white rounded-full text-lg font-black shadow-2xl shadow-[#EA580C]/30 hover:shadow-[#EA580C]/50 hover:-translate-y-1 transition-all">Start Monitoring</button>
            <button onClick={onStart} className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-[#111827] text-[#111827] rounded-full text-lg font-black hover:bg-[#111827] hover:text-white transition-all">View Demo</button>
          </div>
        </div>
        <div className={`relative mt-20 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="absolute inset-0 max-w-4xl mx-auto -translate-y-12 opacity-20 blur-3xl pointer-events-none">
            <img src="/images/hero.png" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="relative mx-auto max-w-md bg-white p-8 rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 rotate-[-2deg] hover:rotate-0 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
               <img src="/images/hero.png" alt="Hero" className="w-full h-full object-cover scale-150" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="text-left"><span className="text-xs font-black uppercase tracking-widest text-gray-400">Health Score</span><div className="flex items-baseline gap-2 mt-1"><span className="text-5xl font-black text-[#16A34A]">82</span><span className="text-lg font-bold text-gray-300">/100</span></div></div>
                <div className="p-3 bg-[#16A34A]/10 text-[#16A34A] rounded-2xl"><LandingIcons.Activity w={32} /></div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"><span className="font-bold text-gray-500">Last BP</span><span className="font-black">128/84</span></div>
                <div className="flex justify-between items-center p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"><div className="flex items-center gap-2"><LandingIcons.AlertTriangle w={18} /><span className="font-bold">Anaemia Risk</span></div><span className="font-black uppercase text-xs">Medium</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-[#111827] text-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">The crisis <br />no one hears.</h2>
              <p className="text-lg text-white/70 leading-relaxed font-medium">Most healthcare apps react after the problem. SAHARA is designed to prevent it by bridging the distance between families.</p>
              <div className="space-y-4">
                {["71% of elders live without active family support.","Undiagnosed Anaemia affects 50%+ elderly women.","Preventable hospitalizations cost ₹80,000+ per event."].map((text, i) => (
                  <div key={i} className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-[#EA580C]/20 text-[#EA580C] flex items-center justify-center flex-shrink-0"><LandingIcons.Check w={14} /></div><span className="font-bold text-white/90">{text}</span></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Missed health warning", image: "/images/missed_health.png", rotation: "-rotate-6" },
                { label: "Didn't know Hb was dropping", image: "/images/hb_dropping.png", rotation: "rotate-3" },
                { label: "No one tracking meals", image: "/images/no_meal.png", rotation: "rotate-6" },
                { label: "Emergency came too late", image: "/images/emergency.png", rotation: "-rotate-3" }
              ].map((card, i) => (
                <div key={i} className={`relative p-6 rounded-3xl aspect-square flex flex-col justify-end overflow-hidden ${card.rotation} group hover:rotate-0 transition-all duration-500 shadow-2xl border border-white/10`}>
                  <img src={card.image} alt={card.label} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
                  <span className="relative z-10 text-lg font-black leading-tight text-white drop-shadow-md">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="py-20 text-center px-6"><p className="text-2xl md:text-4xl font-black tracking-tight text-[#111827]/40 max-w-4xl mx-auto italic">“Most healthcare apps react after the problem. <br className="hidden md:block"/><span className="text-[#EA580C] underline decoration-4 underline-offset-8">SAHARA prevents it.</span>”</p></div>
      <section className="py-32 px-6 mx-auto max-w-7xl relative overflow-hidden">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-24 tracking-tight">How it works.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
          {[
            { step: "01", icon: <LandingIcons.Mic />, label: "Log food via Voice", color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
            { step: "02", icon: <LandingIcons.Activity />, label: "AI Analyzes Nutrition", color: "from-green-500 to-green-600", bg: "bg-green-50" },
            { step: "03", icon: <LandingIcons.Check />, label: "Score Updates", color: "from-gray-700 to-gray-900", bg: "bg-gray-50" },
            { step: "04", icon: <LandingIcons.AlertTriangle />, label: "Risk Detected", color: "from-red-500 to-red-600", bg: "bg-red-50" },
            { step: "05", icon: <LandingIcons.Shield />, label: "Family Notified", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
            { step: "06", icon: <LandingIcons.Activity />, label: "Care Provided", color: "from-amber-500 to-amber-600", bg: "bg-amber-50" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group relative"
            >
              <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center h-full">
                <div className={`w-20 h-20 rounded-[30px] ${item.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative`}>
                   <div className={`absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-br ${item.color} text-white text-xs font-black flex items-center justify-center shadow-lg border-4 border-white`}>
                     {item.step}
                   </div>
                   {React.cloneElement(item.icon, { w: 32, className: "group-hover:rotate-12 transition-transform duration-500" })}
                </div>
                <p className="font-bold text-lg leading-tight text-[#111827] mb-2">{item.label}</p>
                <div className={`mt-auto w-10 h-1 rounded-full bg-gradient-to-r ${item.color} opacity-20 group-hover:opacity-100 transition-all duration-500`} />
              </div>
              {i < 5 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-100 to-transparent -translate-y-12 opacity-50" />
              )}
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-32 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center mb-20"><h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Built for what matters.</h2><p className="text-lg text-gray-500 font-medium">Everything you need to care for your family, from anywhere.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{ icon: <LandingIcons.Activity />, title: "AI Nutrition", desc: "Indian food analysis via Gemini AI." },{ icon: <LandingIcons.Shield />, title: "Health Score", desc: "Predictive 0–100 overall score." },{ icon: <LandingIcons.AlertTriangle />, title: "Anaemia Engine", desc: "Early warning for iron deficiency." },{ icon: <LandingIcons.Activity />, title: "SOS Alerts", desc: "One-tap emergency SMS with GPS." },{ icon: <LandingIcons.Shield />, title: "Family Dashboard", desc: "Live monitoring from any city." },{ icon: <LandingIcons.Mic />, title: "Voice First", desc: "Supports Hindi & Odia inputs." }].map((feature, i) => (
              <div key={feature.title} className="p-10 bg-white rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"><div className="w-14 h-14 rounded-2xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center mb-8">{React.cloneElement(feature.icon, { w: 28 })}</div><h3 className="text-2xl font-black mb-3">{feature.title}</h3><p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-40 px-6 overflow-hidden relative">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-12 leading-[0.95] tracking-tight">Take care before <br />it’s too late.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"><button onClick={onStart} className="w-full sm:w-auto px-12 py-6 bg-[#EA580C] text-white rounded-full text-xl font-black shadow-2xl shadow-[#EA580C]/30 hover:shadow-[#EA580C]/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">Start Free Today <LandingIcons.ArrowRight w={24} /></button></div>
        </div>
      </section>
      <footer className="py-20 border-t border-gray-100 mt-20">
        <div className="px-6 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale"><LandingIcons.Shield w={20} /><span className="font-extrabold tracking-tight">SAHARA</span></div>
          <div className="flex gap-8 text-sm font-bold text-gray-400"><span>© 2026 Idiotics Team</span><span>Trithon Hackathon</span><span>ITER, SOA University</span></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
