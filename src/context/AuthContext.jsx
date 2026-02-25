import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch user profile
  const loadUser = async () => {
    try {
      const response = await API.get('/auth/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      logout(); // Token invalid, clear it
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, phone) => {
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        phone
      });

      const { token, ...userData } = response.data;

      // Save token
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;

      // Save token
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const response = await API.put('/auth/profile', updates);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      };
    }
  };

  // Add address
  const addAddress = async (address) => {
    try {
      const response = await API.post('/auth/addresses', address);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add address'
      };
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      const response = await API.delete(`/auth/addresses/${addressId}`);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete address'
      };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;