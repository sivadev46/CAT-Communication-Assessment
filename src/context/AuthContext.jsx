import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cat_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cat_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('cat_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Token invalid or expired
          authService.logout();
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const loginUser = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = async (userData) => {
    const res = await authService.updateProfile(userData);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
