import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft } from '../components/Icons';

const RegisterPage = ({ onBack }) => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigate('/onboarding');
    } catch (err) {
      alert("Google Sign-In failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#111827] font-['Outfit',sans-serif] flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-10 left-10 p-2 hover:bg-white rounded-full transition-colors flex items-center gap-2 font-bold text-sm">
        <ArrowLeft w={20} /> Back
      </button>

      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-xl border border-[#E4E2DB]">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 rounded-[20px] bg-[#EA580C] text-white shadow-lg mb-6">
            <Shield w={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Create Account.</h1>
          <p className="text-gray-400 font-bold">Start your SAHARA journey today.</p>
        </div>

        <button onClick={handleGoogle} disabled={loading} className="w-full py-5 bg-white border-2 border-[#E4E2DB] text-[#111827] rounded-[24px] text-lg font-black flex items-center justify-center gap-4 hover:bg-gray-50 transition-all mb-8">
          <img src="/google_icon.png" alt="Google" style={{ width: 28, height: 28 }} />
          Sign up with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E4E2DB]"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400"><span className="bg-white px-4">Or use your email</span></div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="••••••••" />
          </div>
          <button type="button" onClick={() => alert("Registration via email coming soon. Please use Google Sign-up for now.")} className="w-full py-5 bg-[#111827] text-white rounded-[24px] text-lg font-black shadow-xl hover:-translate-y-1 transition-all">
            Continue with Email
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Already have an account? <button onClick={() => navigate('/login')} className="text-[#EA580C] hover:underline decoration-2">Log in here</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
