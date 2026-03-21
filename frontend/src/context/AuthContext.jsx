import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for existing session
        const storedUser = localStorage.getItem('sahara_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        // In reality, this would call your backend /api/auth/login
        const mockUser = {
            id: '123',
            email,
            name: email.split('@')[0],
            role: email.includes('family') ? 'family' : 'senior',
            onboarded: true
        };
        setUser(mockUser);
        localStorage.setItem('sahara_user', JSON.stringify(mockUser));
        return mockUser;
    };

    const googleSignIn = async () => {
        // Simulate Firebase Google Sign-In
        const mockUser = {
            id: 'google_789',
            email: 'user@gmail.com',
            name: 'Google User',
            role: null, // First time user needs to pick role
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
