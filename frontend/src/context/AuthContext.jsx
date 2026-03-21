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
        try {
            console.log('[AUTH] Login attempt for:', email);
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!res.ok) {
                const message = await res.text();
                console.error('[AUTH] Login failed:', message);
                throw new Error(`Login failed: ${message || 'Invalid credentials'}`);
            }
            
            const data = await res.json();
            localStorage.setItem('sahara_token', data.access_token);
            persistUser(data.user);
            console.log('[AUTH] Login successful for:', email);
            return data.user;
        } catch (error) {
            console.error('[AUTH] Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log('[AUTH] Register attempt for:', userData.email, 'role:', userData.role);
            const res = await apiFetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            if (!res.ok) {
                const message = await res.text();
                console.error('[AUTH] Register failed:', message);
                throw new Error(message || "Registration failed");
            }
            
            const data = await res.json();
            localStorage.setItem('sahara_token', data.access_token);
            const newUser = data.user || { ...userData, onboarded: false };
            persistUser(newUser);
            console.log('[AUTH] Registration successful');
            return newUser;
        } catch (error) {
            console.error('[AUTH] Register error:', error);
            throw error;
        }
    };

    const googleSignIn = async (role = 'senior') => {
        try {
            console.log('[AUTH] Starting Firebase Google sign-in for role:', role);
            const credential = await signInWithPopup(auth, googleProvider);
            console.log('[AUTH] Firebase sign-in successful:', credential.user.email);
            
            const token = await credential.user.getIdToken();
            console.log('[AUTH] ID token obtained, length:', token.length);
            
            const payloadData = {
                id_token: token,
                google_uid: credential.user.uid,
                name: credential.user.displayName || '',
                email: credential.user.email || '',
                photo_url: credential.user.photoURL,
                role,
            };
            console.log('[AUTH] Sending to backend:', { ...payloadData, id_token: '[REDACTED]' });
            
            const res = await apiFetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData),
            });

            console.log('[AUTH] Backend response status:', res.status);
            
            if (!res.ok) {
                const message = await res.text();
                console.error('[AUTH] Backend error response:', message);
                throw new Error(`Backend error (${res.status}): ${message || 'Unknown error'}`);
            }

            const data = await res.json();
            console.log('[AUTH] Received user data:', { id: data.user?.id, email: data.user?.email, role: data.user?.role });
            
            localStorage.setItem('sahara_token', data.access_token);
            persistUser(data.user);
            return data.user;
        } catch (error) {
            console.error('[AUTH] Google sign-in error:', error);
            
               // Firebase config errors
               if (error.code === 'auth/auth-domain-config-required') {
                   throw new Error('❌ Firebase not configured: OAuth consent screen needs setup in Firebase Console. Contact admin.');
               } else if (error.code === 'auth/operation-not-allowed') {
                   throw new Error('❌ Google sign-in is disabled in Firebase. Admin needs to enable it in Authentication settings.');
               }
           
            // Network/CORS errors
            if (error.message?.includes('Failed to fetch')) {
                   throw new Error('❌ Network error: Cannot reach backend. Backend may have crashed. Check server status.');
            } else if (error.message?.includes('CORS')) {
                   throw new Error('❌ CORS error: Backend not properly configured. Admin needs to enable CORS.');
            } else if (error.message?.includes('net::ERR_FAILED')) {
                   throw new Error('❌ Connection failed: Backend server error (500). Try again in a moment.');
            } else if (error.message?.includes('timeout')) {
                throw new Error('❌ Request timeout: Backend server is taking too long. Please try again.');
            }
            
            // Firebase-specific errors
            if (error.code === 'auth/popup-blocked') {
                throw new Error('❌ Popup blocked! Please enable popups for this site and restart.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('❌ Google sign-in was cancelled. Please try again.');
            } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
                throw new Error('❌ Google sign-in not available. Browser may not support required features.');
            } else if (error.code === 'auth/unauthorized-domain') {
                throw new Error('❌ This domain is not authorized for Google sign-in. Contact support.');
            } else if (error.code === 'auth/invalid-api-key') {
                throw new Error('❌ Firebase configuration invalid. Contact support.');
            } else if (error.message) {
                throw new Error(`❌ Sign-in failed: ${error.message}`);
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
        try {
            console.log('[AUTH] Completing onboarding with fields:', Object.keys(data));
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
                console.error('[AUTH] Profile completion failed:', message);
                throw new Error(message || 'Profile completion failed');
            }
            
            const payload = await res.json();
            persistUser(payload.user);
            console.log('[AUTH] Onboarding completed successfully');
            return payload;
        } catch (error) {
            console.error('[AUTH] Onboarding error:', error);
            throw error;
        }
    };

    const linkFamily = async (data) => {
        try {
            console.log('[AUTH] Linking family with:', { invite_code: data.invite_code ? '[PROVIDED]' : 'N/A', senior_email: data.senior_email });
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
                console.error('[AUTH] Family linking failed:', message);
                throw new Error(message || 'Family linking failed');
            }
            
            const payload = await res.json();
            persistUser(payload.user);
            console.log('[AUTH] Family linked successfully');
            return payload;
        } catch (error) {
            console.error('[AUTH] Link family error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleSignIn, logout, loading, completeOnboarding, linkFamily }}>
            {children}
        </AuthContext.Provider>
    );
};
