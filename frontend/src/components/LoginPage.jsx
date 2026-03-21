import React, { useState } from 'react';

const Ic = {
  Shield: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  ArrowLeft: ({ w = 24, ...p }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: w, height: w, ...p.style }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  ),
};

const LoginPage = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-['Outfit',sans-serif] flex flex-col items-center justify-center p-6 selection:bg-[#EA580C] selection:text-white">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#EA580C]/10 to-transparent blur-[120px] rounded-full" />
      </div>

      <button onClick={onBack} className="absolute top-10 left-10 p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 font-bold text-sm">
        <Ic.ArrowLeft w={20} /> Back
      </button>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-12">
          <div className="p-4 rounded-[24px] bg-[#111827] text-white shadow-2xl mb-6">
            <Ic.Shield w={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back.</h1>
          <p className="text-gray-400 font-medium">Continue monitoring with SAHARA AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full py-5 bg-[#111827] text-white rounded-full text-lg font-black shadow-2xl shadow-[#111827]/20 hover:shadow-[#111827]/40 hover:-translate-y-1 transition-all">
            Login to Dashboard
          </button>
        </form>

        <div className="mt-12 text-center text-sm font-bold text-gray-400">
          New to SAHARA? <button className="text-[#EA580C] hover:underline decoration-2">Create an account</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
