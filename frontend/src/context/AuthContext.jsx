import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    setUser(normalizedUser);
                    localStorage.setItem('sahara_user', JSON.stringify(normalizedUser));
                } else {
                    localStorage.removeItem('sahara_token');
                    localStorage.removeItem('sahara_user');
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
            setLoading(false);
        };
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
        localStorage.setItem('sahara_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const register = async (userData) => {
        const res = await apiFetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) throw new Error("Registration failed");
        const data = await res.json();
        localStorage.setItem('sahara_token', data.access_token);
        // After register, user is not onboarded
        const newUser = { ...userData, onboarded: false };
        localStorage.setItem('sahara_user', JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
    };

    const googleSignIn = async () => {
        // Simulate Firebase Google Sign-In but for this phase we keep it simple
        // In a real prod app, you'd get the ID token from Google and send to backend
        const mockUser = {
            id: 'google_' + Date.now(),
            email: 'user@gmail.com',
            role: null,
            onboarded: false
        };
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sahara_token');
        localStorage.removeItem('sahara_user');
    };

    const completeOnboarding = async (data) => {
        // This will eventually call /api/profiles/update
        const updatedUser = { ...user, ...data, onboarded: true };
        setUser(updatedUser);
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleSignIn, logout, loading, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};
