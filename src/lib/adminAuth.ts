// Admin authentication utilities
import { authAPI } from './api';

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    await authAPI.login(username, password);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = (): void => {
  authAPI.logout();
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('admin_token');
};

export const verifyAuth = async (): Promise<boolean> => {
  try {
    await authAPI.verify();
    return true;
  } catch (error) {
    return false;
  }
};
