import { describe, it, expect, beforeEach } from 'vitest';
import { 
  setAuthSession, 
  getAuthToken, 
  getAuthUser, 
  clearAuthSession 
} from './api';

describe('Auth Session Management (api.js)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should save token and user to localStorage', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'mock-jwt-token';

    setAuthSession(mockToken, mockUser);

    expect(getAuthToken()).toBe(mockToken);
    expect(getAuthUser()).toEqual(mockUser);
  });

  it('should clear session from localStorage', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'mock-jwt-token';

    setAuthSession(mockToken, mockUser);
    clearAuthSession();

    expect(getAuthToken()).toBeNull();
    expect(getAuthUser()).toBeNull();
  });

  it('should return null for getAuthUser if no user is set', () => {
    expect(getAuthUser()).toBeNull();
  });
});
