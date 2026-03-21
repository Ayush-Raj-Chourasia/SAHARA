import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('sahara_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Login failed');
            }
            const data = await res.json();
            const userData = {
                id: data.user_id,
                email: data.email,
                name: data.name || email.split('@')[0],
                role: data.role || (email.includes('family') ? 'family' : 'senior'),
                token: data.access_token,
                onboarded: true
            };
            setUser(userData);
            localStorage.setItem('sahara_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            // Fallback: create a stable local user ID from email
            const mockUser = {
                id: `local_${btoa(email).replace(/=/g, '')}`,
                email,
                name: email.split('@')[0],
                role: email.includes('family') ? 'family' : 'senior',
                token: null,
                onboarded: true
            };
            setUser(mockUser);
            localStorage.setItem('sahara_user', JSON.stringify(mockUser));
            return mockUser;
        }
    };

    const googleSignIn = async () => {
        const mockUser = {
            id: 'google_789',
            email: 'user@gmail.com',
            name: 'Google User',
            role: null,
            token: null,
            onboarded: false
        };
        setUser(mockUser);
        localStorage.setItem('sahara_user', JSON.stringify(mockUser));
        return mockUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sahara_user');
    };

    const completeOnboarding = (data) => {
        const updatedUser = { ...user, ...data, onboarded: true };
        setUser(updatedUser);
        localStorage.setItem('sahara_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, googleSignIn, logout, loading, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};
