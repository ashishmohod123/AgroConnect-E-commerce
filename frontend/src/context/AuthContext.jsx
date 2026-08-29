import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agroconnect_token') || null);
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState([]);

  // Fetch initial profile and demo accounts
  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.error('Failed to load profile from token:', err);
          logout();
        }
      }
      try {
        const demos = await api.getDemoAccounts();
        setDemoAccounts(demos);
      } catch (err) {
        console.error('Failed to fetch demo accounts:', err);
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('agroconnect_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('agroconnect_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('agroconnect_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (email) => {
    return login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoAccounts,
        isFarmer: user?.role === 'FARMER' || user?.role === 'ADMIN',
        isRetailer: user?.role === 'RETAILER' || user?.role === 'ADMIN',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
