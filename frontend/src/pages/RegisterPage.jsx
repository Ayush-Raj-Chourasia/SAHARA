import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft } from '../components/Icons';

const RegisterPage = ({ onBack }) => {
  const { googleSignIn, register, login } = useAuth();
  const navigate = useNavigate();
  const { role: routeRole } = useParams();
  const role = routeRole === 'family' ? 'family' : 'senior';
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const user = await googleSignIn(role);
      if (user?.__isNew === false) {
        alert('Account already exists. Signed you in directly.');
      }
      navigate(user?.onboarded ? (user.role === 'senior' ? '/senior' : '/family') : '/onboarding');
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMsg = err.message || 'Google Sign-In failed. Please check browser console for details.';
      alert(errorMsg);
    }
    setLoading(false);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        phone,
        role,
        conditions: [],
      });
      navigate(user?.onboarded ? (user.role === 'senior' ? '/senior' : '/family') : '/onboarding');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Email already registered')) {
        try {
          const existingUser = await login(email, password);
          alert('Account already exists. Signed you in directly.');
          navigate(existingUser?.onboarded ? (existingUser.role === 'senior' ? '/senior' : '/family') : '/onboarding');
        } catch {
          alert('Account already exists. Please sign in with your correct password.');
          navigate('/login');
        }
      } else {
        alert('Registration failed. Please check details and try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#111827] font-['Outfit',sans-serif] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/auth_bg.png" alt="" className="w-full h-full object-cover opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F4F0]/80 to-[#F5F4F0]/40" />
      </div>
      <button onClick={onBack} className="absolute top-10 left-10 p-2 hover:bg-white rounded-full transition-colors flex items-center gap-2 font-bold text-sm z-10">
        <ArrowLeft w={20} /> Back
      </button>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-[40px] shadow-2xl border border-[#E4E2DB]">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 rounded-[20px] bg-[#EA580C] text-white shadow-lg mb-6">
            <Shield w={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Create Account.</h1>
          <p className="text-gray-400 font-bold">Start your SAHARA journey today.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 bg-[#F5F4F0] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => navigate('/register/senior')}
            className={`py-3 rounded-xl font-black text-sm ${role === 'senior' ? 'bg-white text-[#111827] shadow' : 'text-gray-500'}`}
          >
            Senior Signup
          </button>
          <button
            type="button"
            onClick={() => navigate('/register/family')}
            className={`py-3 rounded-xl font-black text-sm ${role === 'family' ? 'bg-white text-[#111827] shadow' : 'text-gray-500'}`}
          >
            Family Signup
          </button>
        </div>

        <button onClick={handleGoogle} disabled={loading} className="w-full py-5 bg-white border-2 border-[#E4E2DB] text-[#111827] rounded-[24px] text-lg font-black flex items-center justify-center gap-4 hover:bg-gray-50 transition-all mb-8">
          <img src="/google_icon.png" alt="Google" style={{ width: 28, height: 28 }} />
          Sign up with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E4E2DB]"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400"><span className="bg-white px-4">Or use your email</span></div>
        </div>

        <form className="space-y-5" onSubmit={handleEmailSignup}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="Your full name" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
             <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="+91XXXXXXXXXX" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-[#F5F4F0] border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-5 bg-[#111827] text-white rounded-[24px] text-lg font-black shadow-xl hover:-translate-y-1 transition-all disabled:opacity-60">
            {loading ? 'Creating Account...' : 'Continue with Email'}
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
