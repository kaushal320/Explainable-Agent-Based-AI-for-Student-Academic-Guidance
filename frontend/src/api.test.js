import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { 
  setAuthSession, 
  getAuthToken, 
  getAuthUser, 
  clearAuthSession,
  registerUser,
  loginUser,
  verifyEmail,
  predictCareer,
  sendMessage,
  getLesson,
  getQuiz
} from './api';

// ------------------------------------------------------------------
// 1. Setup Mocks (LocalStorage & API calls)
// ------------------------------------------------------------------
const mockStorage = {};
global.localStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value.toString(); }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { for (let key in mockStorage) delete mockStorage[key]; })
};

// Mock the axios instance methods
api.post = vi.fn();
api.get = vi.fn();

describe('Frontend Unit Testing Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ------------------------------------------------------------------
  // 2. Authentication & Session Management
  // ------------------------------------------------------------------
  describe('Authentication & Session Management', () => {
    it('should successfully save JWT token to localStorage', () => {
      setAuthSession('mock-jwt-token', { id: 1, name: 'Student' });
      expect(getAuthToken()).toBe('mock-jwt-token');
    });

    it('should successfully parse and retrieve the User object from localStorage', () => {
      const mockUser = { id: 1, email: 'test@student.com' };
      setAuthSession('mock-jwt-token', mockUser);
      expect(getAuthUser()).toEqual(mockUser);
    });

    it('should completely clear session credentials upon logout', () => {
      setAuthSession('token', { name: 'User' });
      clearAuthSession();
      expect(getAuthToken()).toBeNull();
      expect(getAuthUser()).toBeNull();
    });

    it('should securely handle missing or corrupted user session data', () => {
      localStorage.setItem('career_tutor_auth_user', 'invalid-json-{]');
      expect(getAuthUser()).toBeNull();
    });
  });

  // ------------------------------------------------------------------
  // 3. User Registration & Verification Flows
  // ------------------------------------------------------------------
  describe('User Registration & Verification API', () => {
    it('should correctly format the registerUser API payload', async () => {
      api.post.mockResolvedValueOnce({ data: { status: 'success' } });
      await registerUser({ email: 'test@test.com', password: '123', full_name: 'Test' });
      
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@test.com',
        password: '123',
        full_name: 'Test'
      });
    });

    it('should establish a session when loginUser succeeds', async () => {
      const mockResponse = { access_token: 'new-token', user: { id: 2 } };
      api.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await loginUser({ email: 'test@test.com', password: '123' });
      expect(result).toEqual(mockResponse);
      expect(getAuthToken()).toBe('new-token');
    });

    it('should establish a session after successful OTP email verification', async () => {
      const mockResponse = { access_token: 'verified-token', user: { id: 2, verified: true } };
      api.post.mockResolvedValueOnce({ data: mockResponse });
      
      await verifyEmail({ email: 'test@test.com', code: '123456' });
      expect(getAuthToken()).toBe('verified-token');
    });
  });

  // ------------------------------------------------------------------
  // 4. AI Machine Learning Predictions
  // ------------------------------------------------------------------
  describe('AI Career Prediction Engine', () => {
    it('should submit structured student data to the ML model', async () => {
      api.post.mockResolvedValueOnce({ data: { career: 'Software Engineer' } });
      
      const studentData = { gpa: 3.8, python_exp: 'Advanced', sql_exp: 'Basic', java_exp: 'None', domain: 'IT' };
      await predictCareer(studentData);
      
      expect(api.post).toHaveBeenCalledWith('/predict/', studentData);
    });

    it('should throw an error if the ML model prediction fails', async () => {
      api.post.mockRejectedValueOnce(new Error('Model timeout'));
      await expect(predictCareer({})).rejects.toThrow('Model timeout');
    });
  });

  // ------------------------------------------------------------------
  // 5. Live Class Chat Interface
  // ------------------------------------------------------------------
  describe('Live Class AI Tutor (Chat)', () => {
    it('should append chat history context when sending a message', async () => {
      api.post.mockResolvedValueOnce({ data: { reply: 'Hello Student!' } });
      
      await sendMessage('Hi', [{ role: 'user', content: 'prev' }], 'Context string');
      expect(api.post).toHaveBeenCalledWith('/chat/', {
        prompt: 'Hi',
        history: [{ role: 'user', content: 'prev' }],
        context: 'Context string'
      });
    });
  });

  // ------------------------------------------------------------------
  // 6. Resource Hub & Learning Materials
  // ------------------------------------------------------------------
  describe('Resource Hub (RAG Integration)', () => {
    it('should fetch the correct lesson module for a specific skill and week', async () => {
      api.get.mockResolvedValueOnce({ data: { title: 'Python Basics' } });
      await getLesson('Python', 1);
      expect(api.get).toHaveBeenCalledWith('/learning/lesson?skill=Python&week=1');
    });

    it('should request the correct assessment quiz for a skill', async () => {
      api.get.mockResolvedValueOnce({ data: { questions: [] } });
      await getQuiz('SQL');
      expect(api.get).toHaveBeenCalledWith('/learning/quiz?skill=SQL');
    });
  });
});
