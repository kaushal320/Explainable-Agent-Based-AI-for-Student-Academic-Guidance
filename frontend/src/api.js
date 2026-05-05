import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";
export { API_BASE_URL };
const TOKEN_KEY = "career_tutor_token";
const AUTH_USER_KEY = "career_tutor_auth_user";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async ({ email, password, full_name }) => {
  const response = await api.post("/auth/register", {
    email,
    password,
    full_name,
  });
  // Do not set session yet since they are not verified
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  setAuthSession(response.data.access_token, response.data.user);
  return response.data;
};

export const googleLogin = async (token) => {
  const response = await api.post("/auth/google-login", { token });
  setAuthSession(response.data.access_token, response.data.user);
  return response.data;
};

export const verifyEmail = async ({ email, code }) => {
  const response = await api.post("/auth/verify-email", { email, code });
  setAuthSession(response.data.access_token, response.data.user);
  return response.data;
};

export const resendVerification = async ({ email }) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const predictCareer = async (studentData) => {
  const response = await api.post("/predict/", studentData);
  return response.data;
};

export const sendMessage = async (prompt, history, context) => {
  const response = await api.post("/chat/", { prompt, history, context });
  return response.data;
};

/** Multi-step tool agent (Groq tool calling + RAG + catalog tools). Non-streaming. */
export const sendAgentMessage = async (prompt, history, context) => {
  const response = await api.post("/chat/agent", { prompt, history, context });
  return response.data;
};

export const streamMessage = async (prompt, history, context, onChunk) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompt, history, context }),
  });

  if (!response.ok) {
    throw new Error("Streaming request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    if (chunkValue) {
      onChunk(chunkValue);
    }
  }
};

export const getLesson = async (skill, week) => {
  const response = await api.get('/learning/lesson', { params: { skill, week } });
  return response.data;
};

export const getQuiz = async (skill, week) => {
  const response = await api.get('/learning/quiz', { params: { skill, week } });
  return response.data;
};

/** Transcribe audio file to text using the backend speech-to-text service */
export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/stt/transcribe`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Transcription failed");
  }

  return response.json();
};

export default api;
