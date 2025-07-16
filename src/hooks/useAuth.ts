import { useState, useEffect, useCallback } from 'react';
import { LoginCredentials, RegisterData, User } from '@/types';
import { useAppDispatch, useAppSelector } from './redux';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const response = await authAPI.login(credentials);
      dispatch(loginSuccess(response));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      dispatch(loginStart());
      const response = await authAPI.register(data);
      dispatch(loginSuccess(response));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      dispatch(logout());
    }
  }, [dispatch]);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {
      const user = await authAPI.getCurrentUser();
      dispatch(loginSuccess({ user, token }));
    } catch (err) {
      console.error('Auth check failed:', err);
      dispatch(logout());
    } finally {
      setIsInitialized(true);
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      // Dispatch action to update user in store
      // dispatch(setUser(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login,
    register,
    logout: logoutUser,
    updateProfile,
    checkAuthStatus,
  };
};
