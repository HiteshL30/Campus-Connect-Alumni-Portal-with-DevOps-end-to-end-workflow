import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      // Backend returns ApiResponse<AuthResponse> -> response.data.data
      const authData = response.data.data;
      if (!authData) throw new Error('No authentication data received');

      const { token, ...userData } = authData;
      // Normalize userId to id for frontend consistency
      const userWithId = { ...userData, id: userData.userId };

      if (token) localStorage.setItem('token', token);
      if (userWithId) {
        localStorage.setItem('user', JSON.stringify(userWithId));
        setUser(userWithId);
      }
      return userWithId;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await authAPI.register(data);
      const authData = response.data.data;
      const { token, ...userData } = authData;
      const userWithId = { ...userData, id: userData.userId };

      if (token) localStorage.setItem('token', token);
      if (userWithId) {
        localStorage.setItem('user', JSON.stringify(userWithId));
        setUser(userWithId);
      }
      return userWithId;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === 'STUDENT';
  const isAlumni = user?.role === 'ALUMNI';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated,
      isStudent,
      isAlumni,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
