import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";
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
  setAuthSession(response.data.access_token, response.data.user);
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  setAuthSession(response.data.access_token, response.data.user);
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

export const getLesson = async (topic, week) => {
  const response = await api.get(
    `/learning/lesson?career=${encodeURIComponent(topic)}&week=${week}`,
  );
  return response.data;
};

export const getQuiz = async (topic, week) => {
  const response = await api.get(
    `/learning/quiz?career=${encodeURIComponent(topic)}&week=${week}`,
  );
  return response.data;
};

export default api;
