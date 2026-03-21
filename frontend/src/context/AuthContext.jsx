import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const persistUser = (nextUser) => {
        if (nextUser) {
            localStorage.setItem('sahara_user', JSON.stringify(nextUser));
        } else {
            localStorage.removeItem('sahara_user');
        }
        setUser(nextUser);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('sahara_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await apiFetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const userData = await res.json();
                    const normalizedUser = {
                        id: userData._id,
                        email: userData.email,
                        name: userData.name,
                        role: userData.role,
                        onboarded: userData.onboarded
                    };
                    persistUser(normalizedUser);
                } else {
                    localStorage.removeItem('sahara_token');
                    localStorage.removeItem('sahara_user');
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
            setLoading(false);
        };

        const localUser = localStorage.getItem('sahara_user');
        if (localUser) {
            try {
                setUser(JSON.parse(localUser));
            } catch {
                localStorage.removeItem('sahara_user');
            }
        }

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await apiFetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) throw new Error("Login failed");
        
        const data = await res.json();
        localStorage.setItem('sahara_token', data.access_token);
        persistUser(data.user);
        return data.user;
    };

    const register = async (userData) => {
        const res = await apiFetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            const message = await res.text();
            throw new Error(message || "Registration failed");
        }
        const data = await res.json();
        localStorage.setItem('sahara_token', data.access_token);
        const newUser = data.user || { ...userData, onboarded: false };
        persistUser(newUser);
        return newUser;
    };

    const googleSignIn = async (role = 'senior') => {
        try {
            console.log('Starting Firebase Google sign-in...');
            const credential = await signInWithPopup(auth, googleProvider);
            console.log('Firebase sign-in successful:', credential.user.email);
            
            const token = await credential.user.getIdToken();
            console.log('ID token obtained');
            
            const res = await apiFetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_token: token,
                    google_uid: credential.user.uid,
                    name: credential.user.displayName || '',
                    email: credential.user.email || '',
                    photo_url: credential.user.photoURL,
                    role,
                }),
            });

            if (!res.ok) {
                const message = await res.text();
                console.error('Backend error:', message);
                throw new Error(message || 'Backend authentication failed');
            }

            const data = await res.json();
            localStorage.setItem('sahara_token', data.access_token);
            persistUser(data.user);
            return data.user;
        } catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code === 'auth/popup-blocked') {
                throw new Error('Popup blocked! Please enable popups for this site.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Google sign-in cancelled.');
            } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
                throw new Error('Google sign-in not available in this environment.');
            }
            throw error;
        }
    };

    const logout = () => {
        signOut(auth).catch(() => {});
        persistUser(null);
        localStorage.removeItem('sahara_token');
    };

    const completeOnboarding = async (data) => {
        const token = localStorage.getItem('sahara_token');
        const res = await apiFetch('/api/auth/complete-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const message = await res.text();
            throw new Error(message || 'Profile completion failed');
        }
        const payload = await res.json();
        persistUser(payload.user);
        return payload;
    };

    const linkFamily = async (data) => {
        const token = localStorage.getItem('sahara_token');
        const res = await apiFetch('/api/auth/family/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const message = await res.text();
            throw new Error(message || 'Family linking failed');
        }
        const payload = await res.json();
        persistUser(payload.user);
        return payload;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleSignIn, logout, loading, completeOnboarding, linkFamily }}>
            {children}
        </AuthContext.Provider>
    );
};
