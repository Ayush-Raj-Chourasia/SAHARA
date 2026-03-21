import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, User, Mail, Lock, Phone, Activity } from 'lucide-react';

const RegisterPage = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'senior', age: '', gender: 'male', weight_kg: '',
    conditions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleCondition = (condition) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-['Outfit',sans-serif] flex flex-col items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none opacity-20"><div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#EA580C]/10 to-transparent blur-[120px] rounded-full" /></div>
      
      <button onClick={step === 1 ? onBack : prevStep} className="absolute top-10 left-10 p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 font-bold text-sm">
        <ArrowLeft size={20} /> {step === 1 ? 'Back' : 'Back to Step ' + (step - 1)}
      </button>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-[24px] bg-[#111827] text-white shadow-2xl mb-6">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Join SAHARA.</h1>
          <p className="text-gray-400 font-medium">Protecting what matters most.</p>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${step >= s ? 'bg-[#EA580C]' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="Ratan Kumar Ji" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="••••••••" required />
              </div>
              <button type="button" onClick={nextStep} className="w-full py-5 bg-[#111827] text-white rounded-full text-lg font-black shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Next <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData(prev => ({...prev, role: 'senior'}))} className={`py-4 rounded-[20px] font-bold border-2 transition-all ${formData.role === 'senior' ? 'border-[#EA580C] bg-[#EA580C]/5 text-[#EA580C]' : 'border-gray-100 text-gray-400'}`}>Senior Citizen</button>
                  <button type="button" onClick={() => setFormData(prev => ({...prev, role: 'family'}))} className={`py-4 rounded-[20px] font-bold border-2 transition-all ${formData.role === 'family' ? 'border-[#EA580C] bg-[#EA580C]/5 text-[#EA580C]' : 'border-gray-100 text-gray-400'}`}>Family Member</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="+91-XXXXXXXXXX" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="72" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Weight (kg)</label>
                  <input name="weight_kg" type="number" value={formData.weight_kg} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-[20px] outline-none transition-all font-bold" placeholder="68" required />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full py-5 bg-[#111827] text-white rounded-full text-lg font-black shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Medical Profile <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Select Health Conditions</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hypertension', 'Diabetes', 'Anaemia', 'Joint Pain', 'Heart Concern', 'Low Vision'].map(c => (
                    <button key={c} type="button" onClick={() => handleToggleCondition(c)} className={`px-4 py-3 rounded-xl font-bold border-2 transition-all text-sm ${formData.conditions.includes(c) ? 'border-[#EA580C] bg-[#EA580C] text-white' : 'border-gray-100 text-gray-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-[#EA580C] text-white rounded-full text-xl font-black shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:-translate-y-1 transition-all">
                Complete Setup
              </button>
              <p className="text-center text-xs text-gray-400 px-4 font-medium">By registering, you agree to SAHARA’s Terms of Service and Privacy Policy for elderly data protection.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
