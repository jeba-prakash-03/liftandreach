import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminGetMe, adminLogout } from '../services/api';

interface AdminUser {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  loginSuccess: (user: AdminUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetMe()
      .then((data) => {
        if (data && data.user) setAdmin(data.user);
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginSuccess = (user: AdminUser) => {
    setAdmin(user);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
