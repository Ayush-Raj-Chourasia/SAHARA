import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Family, ArrowRight, Shield, Heart, Activity } from '../components/Icons';

const OnboardingPage = () => {
    const { completeOnboarding, user } = useAuth();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState({
        age: '', gender: '', conditions: [], weight: '',
        emergencyContact: '', relation: ''
    });

    const handleComplete = () => {
        completeOnboarding({ ...profile, role });
    };

    if (step === 1) {
        return (
            <div style={{ minHeight: '100vh', background: '#F5F4F0', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12, color: '#131313' }}>Choose Your Role</h1>
                    <p style={{ color: '#5A5A53', fontSize: 18, marginBottom: 32 }}>Welcome to SAHARA. How will you be using the platform?</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button onClick={() => { setRole('senior'); setStep(2); }} style={{ padding: 24, borderRadius: 24, background: '#FFF', border: '2px solid #E4E2DB', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#EA580C', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User w={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>I am a Senior</h3>
                                <p style={{ color: '#5A5A53', fontSize: 14 }}>Monitor my health, log vitals, and get AI insights.</p>
                            </div>
                        </button>

                        <button onClick={() => { setRole('family'); setStep(2); }} style={{ padding: 24, borderRadius: 24, background: '#FFF', border: '2px solid #E4E2DB', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#131313', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Family w={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>I am a Family Member</h3>
                                <p style={{ color: '#5A5A53', fontSize: 14 }}>Monitor my parents remotely and receive SOS alerts.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F5F4F0', padding: '40px 20px' }}>
            <div style={{ maxWidth: 500, margin: '0 auto', background: '#FFF', borderRadius: 32, padding: 40, border: '1px solid #E4E2DB' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= (step-1) ? '#EA580C' : '#E4E2DB' }} />
                    ))}
                </div>

                <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{role === 'senior' ? 'Tell us about your health' : 'Family Setup'}</h2>
                <p style={{ color: '#5A5A53', marginBottom: 32 }}>We'll personalize your experience based on your details.</p>

                {role === 'senior' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Age</label>
                            <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} placeholder="e.g. 68" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Gender</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['Male', 'Female', 'Other'].map(g => (
                                    <button key={g} onClick={() => setProfile({...profile, gender: g})} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${profile.gender === g ? '#EA580C' : '#E4E2DB'}`, background: profile.gender === g ? '#EA580C' : 'transparent', color: profile.gender === g ? '#FFF' : '#131313', fontWeight: 700, cursor: 'pointer' }}>{g}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {role === 'family' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: 16, borderRadius: 16, fontSize: 14 }}>
                            <strong>Linking Code:</strong> After setup, you'll get a code to share with your senior parent to link accounts.
                        </p>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Your Relation to Senior</label>
                            <input value={profile.relation} onChange={e => setProfile({...profile, relation: e.target.value})} placeholder="e.g. Daughter, Son, Spouse" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                    </div>
                )}

                <button onClick={handleComplete} style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 20, background: '#131313', color: '#FFF', border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    Complete Setup <ArrowRight w={20} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingPage;
