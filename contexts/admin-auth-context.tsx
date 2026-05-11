import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated on mount
    if (typeof window !== 'undefined') {
      const adminAuth = sessionStorage.getItem('adminAuth');
      setIsAuthenticated(adminAuth === 'true');
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Hardcoded credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = '123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true');
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth');
    }
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
