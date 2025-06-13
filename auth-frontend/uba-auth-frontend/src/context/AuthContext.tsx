import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, AuthResult } from '../types/auth.types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await authService.login({ email, password });

      setUser(response.user);
      setToken(response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.roles){
        localStorage.setItem('roles', JSON.stringify(response.roles));
      }

      return { success: true, message: response.message };
    } catch (error) {
        return { success: false, message: 'Invalid credentials' };
      //const errorMessage = error instanceof Error ? error.message : 'Login failed';
      //return { success: false, message: errorMessage };
    }
  };

   
  // Register function
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });

      return { success: true, message: response.message };
    } catch (error) {
        return { success: false, message: 'User already exists' };
      //const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      //return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('roles')
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



export default AuthContext;