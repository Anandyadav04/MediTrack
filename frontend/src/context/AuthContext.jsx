import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await client.get('auth/profile/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const exp = decoded.exp * 1000;
        if (Date.now() < exp) {
          fetchProfile();
          return;
        }
      } catch (e) {
        // Invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await client.post('auth/token/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      await fetchProfile();
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.detail || 'Invalid credentials',
      };
    }
  };

  const register = async (username, email, password, isDoctor) => {
    setLoading(true);
    try {
      const endpoint = isDoctor ? 'auth/register/doctor/' : 'auth/register/';
      await client.post(endpoint, { username, email, password });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      // Django rest framework usually returns field errors like { username: ["User with this username already exists."] }
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed';
      if (errorData) {
        if (errorData.error) errorMessage = errorData.error;
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (typeof errorData === 'object') {
          // Get the first error message from the first field
          const firstKey = Object.keys(errorData)[0];
          if (Array.isArray(errorData[firstKey])) {
            errorMessage = errorData[firstKey][0];
          }
        }
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
