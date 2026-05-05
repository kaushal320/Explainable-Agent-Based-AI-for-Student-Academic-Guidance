import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home";
import Feedback from "./components/Feedback";
import PublicLearning from "./components/PublicLearning";
import PublicRoadmap from "./components/PublicRoadmap";
import Navbar from "./components/Navbar";
import { clearAuthSession, getAuthToken, getAuthUser, getMe } from "./api";
import "./App.css";

const USER_PROFILE_KEY_PREFIX = "career_tutor_user";

const getUserProfileKey = (email) =>
  email ? `${USER_PROFILE_KEY_PREFIX}:${email.toLowerCase().trim()}` : USER_PROFILE_KEY_PREFIX;

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authFlow, setAuthFlow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    const cachedAuthUser = getAuthUser();

    if (!token) {
      setAuthLoading(false);
      return;
    }

    if (cachedAuthUser) setAuthUser(cachedAuthUser);

    getMe()
      .then((serverUser) => setAuthUser(serverUser))
      .catch(() => {
        clearAuthSession();
        setAuthUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleAuthenticated = (authData, isRegister = false) => {
    const authUserData = authData.user || authData;
    setAuthUser(authUserData);
    setAuthFlow(isRegister ? "register" : "login");

    // Navigate to /app; the route decides whether onboarding is needed.
    setTimeout(() => navigate("/app", { replace: true }), 0);
  };

  const handleOnboardingComplete = (userData) => {
    const nameFromAuth =
      authUser?.full_name || authUser?.email?.split("@")[0] || "Scholar";
    const mergedUser = { ...userData, name: nameFromAuth };
    const profileKey = getUserProfileKey(authUser?.email);
    localStorage.setItem(profileKey, JSON.stringify(mergedUser));
    localStorage.setItem("career_tutor_user", JSON.stringify(mergedUser));
    setRefreshKey((k) => k + 1);
    setAuthFlow("login");
  };

  const handleLogout = () => {
    setAuthUser(null);
    clearAuthSession();
  };

  // Get user profile directly from localStorage
  const getUserProfile = () => {
    try {
      const emailKey = getUserProfileKey(authUser?.email);
      const saved = localStorage.getItem(emailKey) || localStorage.getItem("career_tutor_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const getDashboardUser = () => {
    const savedProfile = getUserProfile();
    if (savedProfile) return savedProfile;

    const displayName =
      authUser?.full_name ||
      authUser?.name ||
      authUser?.email?.split("@")[0] ||
      "Scholar";
    return {
      name: displayName,
      prediction: {
        career: "Software Engineer",
        plan: { weakness_rank: [["General Skills", 1]] },
        skills: {},
        explanation:
          "Complete onboarding to generate a personalized career prediction.",
      },
    };
  };

  if (authLoading) {
    return (
      <div className="App auth-loading-shell">
        <div className="auth-loading-card">Loading secure session...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar isAuthenticated={!!authUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<PublicLearning />} />
        <Route path="/resources" element={<PublicRoadmap />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route
          path="/login"
          element={<Login onAuthenticated={handleAuthenticated} mode="login" />}
        />
        <Route
          path="/register"
          element={<Login onAuthenticated={handleAuthenticated} mode="register" />}
        />

        <Route
          path="/app/*"
          element={
            !authUser ? (
              <Navigate to="/login" replace />
            ) : !getUserProfile() ? (
              <Onboarding onComplete={handleOnboardingComplete} />
            ) : (
              <Dashboard
                key={refreshKey}
                user={getDashboardUser()}
                onLogout={handleLogout}
              />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
