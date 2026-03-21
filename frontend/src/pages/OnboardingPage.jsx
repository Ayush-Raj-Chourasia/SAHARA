import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from '../components/Icons';

const OnboardingPage = () => {
    const { completeOnboarding, user } = useAuth();
    const [profile, setProfile] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        age: user?.age || '',
        gender: user?.gender || '',
        weight_kg: user?.weight_kg || '',
        conditions: user?.conditions || [],
        location: user?.location || '',
        language_preference: user?.language_preference || 'Hindi',
        living_status: user?.living_status || '',
        family_proximity: user?.family_proximity || '',
        relationship: user?.relationship || '',
        proximity: user?.proximity || '',
        invite_code: '',
        senior_email: '',
    });
    const [loading, setLoading] = useState(false);

    const role = user?.role || 'senior';

    const handleComplete = async () => {
        try {
            setLoading(true);
            const payload = {
                ...profile,
                age: profile.age ? Number(profile.age) : null,
                weight_kg: profile.weight_kg ? Number(profile.weight_kg) : null,
                conditions: profile.conditions.length > 0 ? profile.conditions : ['none'],
            };
            const result = await completeOnboarding(payload);
            if (result?.user?.role === 'senior' && result?.user?.invite_code) {
                alert(`Profile completed. Your family invite code is: ${result.user.invite_code}`);
            }
            window.location.href = role === 'senior' ? '/senior' : '/family';
        } catch (err) {
            console.error("Onboarding failed", err);
            alert('Please complete all required fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F5F4F0', padding: '40px 20px' }}>
            <div style={{ maxWidth: 500, margin: '0 auto', background: '#FFF', borderRadius: 32, padding: 40, border: '1px solid #E4E2DB' }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{role === 'senior' ? 'Complete Senior Profile' : 'Complete Family Profile'}</h2>
                <p style={{ color: '#5A5A53', marginBottom: 24 }}>Name is auto-filled and editable. Email comes from sign-in and is locked.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Name</label>
                        <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Email</label>
                        <input value={user?.email || ''} disabled style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none', background: '#F2F1ED', color: '#6b7280' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Phone Number</label>
                        <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91XXXXXXXXXX" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                    </div>
                </div>

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
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Weight (kg)</label>
                            <input type="number" value={profile.weight_kg} onChange={e => setProfile({...profile, weight_kg: e.target.value})} placeholder="e.g. 62" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Medical Conditions</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {['diabetes', 'hypertension', 'heart_disease', 'none'].map(item => {
                                    const active = profile.conditions.includes(item);
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                const next = item === 'none'
                                                    ? ['none']
                                                    : profile.conditions.filter(c => c !== 'none');
                                                const updated = next.includes(item)
                                                    ? next.filter(c => c !== item)
                                                    : [...next, item];
                                                setProfile({ ...profile, conditions: updated.length ? updated : ['none'] });
                                            }}
                                            style={{ padding: '10px 14px', borderRadius: 999, border: `2px solid ${active ? '#EA580C' : '#E4E2DB'}`, background: active ? '#FFF7ED' : '#FFF', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}
                                        >
                                            {item.replace('_', ' ')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Location (City)</label>
                            <input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="Bhubaneswar" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Language Preference</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['Hindi', 'English', 'Odia'].map(lang => (
                                    <button key={lang} type="button" onClick={() => setProfile({...profile, language_preference: lang})} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${profile.language_preference === lang ? '#EA580C' : '#E4E2DB'}`, background: profile.language_preference === lang ? '#EA580C' : 'transparent', color: profile.language_preference === lang ? '#FFF' : '#131313', fontWeight: 700, cursor: 'pointer' }}>{lang}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Living Situation</label>
                            <select value={profile.living_status} onChange={e => setProfile({...profile, living_status: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 16, outline: 'none' }}>
                                <option value="">Select</option>
                                <option value="alone">Alone</option>
                                <option value="with_family">With family</option>
                                <option value="with_caretaker">With caretaker</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Family Proximity</label>
                            <select value={profile.family_proximity} onChange={e => setProfile({...profile, family_proximity: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 16, outline: 'none' }}>
                                <option value="">Select</option>
                                <option value="same_house">Same house</option>
                                <option value="same_city">Same city</option>
                                <option value="different_city">Different city</option>
                            </select>
                        </div>
                    </div>
                )}

                {role === 'family' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Your Relation to Senior</label>
                            <select value={profile.relationship} onChange={e => setProfile({...profile, relationship: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 16, outline: 'none' }}>
                                <option value="">Select relationship</option>
                                <option value="son">Son</option>
                                <option value="daughter">Daughter</option>
                                <option value="caregiver">Caregiver</option>
                                <option value="relative">Relative</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Location (City)</label>
                            <input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="Bhubaneswar" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Proximity</label>
                            <select value={profile.proximity} onChange={e => setProfile({...profile, proximity: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 16, outline: 'none' }}>
                                <option value="">Select proximity</option>
                                <option value="same_house">Same house</option>
                                <option value="near">Near</option>
                                <option value="far">Far</option>
                                <option value="different_city">Different city</option>
                            </select>
                        </div>
                        <p style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: 16, borderRadius: 16, fontSize: 14 }}>
                            Connect with your senior using either invite code or senior email.
                        </p>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>Invite Code (Best)</label>
                            <input value={profile.invite_code} onChange={e => setProfile({...profile, invite_code: e.target.value.toUpperCase()})} placeholder="SAHARA1" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#9B9890', marginBottom: 8 }}>OR Senior Email</label>
                            <input value={profile.senior_email} onChange={e => setProfile({...profile, senior_email: e.target.value})} placeholder="senior@example.com" style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '2px solid #E4E2DB', fontSize: 18, outline: 'none' }} />
                        </div>
                    </div>
                )}

                <button onClick={handleComplete} disabled={loading} style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 20, background: '#131313', color: '#FFF', border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Saving...' : 'Complete Setup'} <ArrowRight w={20} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingPage;
