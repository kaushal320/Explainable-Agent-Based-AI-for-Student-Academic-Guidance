import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock, Mail, User, KeyRound, ArrowLeft } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import {
  loginUser,
  registerUser,
  verifyEmail,
  resendVerification,
  googleLogin,
} from "../api";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

const LoginInner = ({ onAuthenticated, mode }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const isGoogleLoginConfigured =
    googleClientId && googleClientId !== "YOUR_GOOGLE_CLIENT_ID_HERE";
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    setLoading(true);
    setError("");
    try {
      // Send the OAuth2 access_token to backend — it will call Google's userinfo endpoint
      const data = await googleLogin(tokenResponse.access_token);
      onAuthenticated(data, false);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Google login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Google login failed. Please try again.");
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "implicit",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const payload = { email, password };
      const isRegister = mode === "register";
      if (isRegister) {
        payload.full_name = fullName;
      }

      if (isRegister) {
        const data = await registerUser(payload);
        setIsVerifying(true);
        setSuccessMsg(
          data.message || "Please check your email for the verification code.",
        );
      } else {
        const data = await loginUser(payload);
        onAuthenticated(data, false);
      }
    } catch (err) {
      if (
        err?.response?.status === 403 &&
        err?.response?.data?.detail === "Email not verified"
      ) {
        setIsVerifying(true);
        setSuccessMsg(
          "Please verify your email to continue. A code was sent during registration.",
        );
      } else {
        setError(
          err?.response?.data?.detail ||
            "Authentication failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const data = await verifyEmail({ email, code: verificationCode });
      onAuthenticated(data, false);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Verification failed. Please check your code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const data = await resendVerification({ email });
      setSuccessMsg(data.message || "A new code has been sent.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 site-container">
        <div className="scholar-card auth-card">
          <div className="scholar-header" style={{ padding: "2.25rem 2rem" }}>
            <h1
              className="scholar-h1 text-white mb-2"
              style={{ fontSize: "2rem" }}
            >
              Verify Email
            </h1>
            <p className="scholar-mini text-white opacity-70">
              We sent a 6-digit code to {email}
            </p>
          </div>

          <div className="p-10">
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded text-sm text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleVerify} className="auth-form">
              <label className="auth-field">
                <span className="scholar-label">Verification Code</span>
                <div className="auth-input-wrap">
                  <KeyRound size={18} className="text-indigo" />
                  <input
                    className="auth-input text-center tracking-widest text-lg font-bold"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>
              </label>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full mb-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  "Verify & Login"
                )}
              </button>
            </form>

            <div className="flex flex-col gap-2 items-center mt-4">
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-indigo hover:text-indigo-light transition-colors"
              >
                Didn't receive a code? Resend
              </button>

              <button
                onClick={() => {
                  setIsVerifying(false);
                  setError("");
                  setSuccessMsg("");
                }}
                disabled={loading}
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 mt-2"
              >
                <ArrowLeft size={14} /> Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 site-container">
      <div className="scholar-card auth-card">
        <div className="scholar-header" style={{ padding: "2.25rem 2rem" }}>
          <h1
            className="scholar-h1 text-white mb-2"
            style={{ fontSize: "2rem" }}
          >
            Scholar Access
          </h1>
          <p className="scholar-mini text-white opacity-70">
            Secure Student Login
          </p>
        </div>

        <div className="p-10">

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" && (
              <label className="auth-field">
                <span className="scholar-label">Full Name</span>
                <div className="auth-input-wrap">
                  <User size={18} className="text-indigo" />
                  <input
                    className="auth-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span className="scholar-label">Email</span>
              <div className="auth-input-wrap">
                <Mail size={18} className="text-indigo" />
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span className="scholar-label">Password</span>
              <div className="auth-input-wrap">
                <Lock size={18} className="text-indigo" />
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading} className="btn-premium">
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {mode === "login" && isGoogleLoginConfigured && (
              <div className="mt-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => triggerGoogleLogin()}
                    disabled={loading}
                    className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-colors shadow"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path
                          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                          fill="#4285F4"
                        />
                        <path
                          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                          fill="#34A853"
                        />
                        <path
                          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                          fill="#EA4335"
                        />
                      </g>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && !isGoogleLoginConfigured && (
              <p className="mt-6 text-sm text-amber-300/90 text-center">
                Google login is disabled until VITE_GOOGLE_CLIENT_ID is set to a
                valid Google OAuth client ID.
              </p>
            )}
            
            <div className="mt-6 text-center">
              {mode === "login" ? (
                <p className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo hover:text-indigo-light transition-colors font-medium">
                    Register here
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo hover:text-indigo-light transition-colors font-medium">
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onAuthenticated, mode = "login" }) => {
  if (!googleClientId || googleClientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    return <LoginInner onAuthenticated={onAuthenticated} mode={mode} />;
  }
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginInner onAuthenticated={onAuthenticated} mode={mode} />
    </GoogleOAuthProvider>
  );
};

export default Login;
