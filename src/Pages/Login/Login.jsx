import googleLogo from "../../../assets/google.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import "./Login.css";

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address is not valid.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/cancelled-popup-request":
      return "Only one popup can be open at a time.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function Login() {
  const navigate = useNavigate();
  // mode: "login" | "register" | "forgotPassword"
  const [mode, setMode] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => navigate("/");

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authMode", "auth");
      navigate("/for-you");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const confirm = event.target.confirm.value;
    if (!email || !password || !confirm) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authMode", "auth");
      navigate("/for-you");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authMode", "auth");
      navigate("/for-you");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Log in to Summarist",
    register: "Create your account",
    forgotPassword: "Reset your password",
  };

  return (
    <section className="login-modal" onClick={closeModal}>
      <div className="login-card" onClick={(event) => event.stopPropagation()}>
        <button className="login-close" type="button" onClick={closeModal} aria-label="Close">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="login-title">{titles[mode]}</h1>

        {errorMessage && (
          <div className="login-error" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="login-success" role="status">
            {successMessage}
          </div>
        )}

        {mode === "forgotPassword" && (
          <>
            <form className="login-form" onSubmit={handleForgotPassword} autoComplete="off">
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email Address"
                autoComplete="off"
              />
              <button className="btn login-submit" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
            <div className="login-actions">
              <button className="login-action-link" type="button" onClick={() => switchMode("login")}>
                Back to Login
              </button>
            </div>
          </>
        )}

        {mode === "register" && (
          <>
            <div className="login-options">
              <button
                className="login-option login-option--google"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img className="login-option__icon" src={googleLogo} alt="Google" />
                Sign up with Google
              </button>
            </div>
            <div className="login-divider">
              <span>or</span>
            </div>
            <form className="login-form" onSubmit={handleRegister} autoComplete="off">
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email Address"
                autoComplete="off"
              />
              <input
                className="login-input"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
              <input
                className="login-input"
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
              />
              <button className="btn login-submit" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            <div className="login-actions">
              <button className="login-action-link" type="button" onClick={() => switchMode("login")}>
                Already have an account? Log in
              </button>
            </div>
          </>
        )}

        {mode === "login" && (
          <>
            <div className="login-options">
              <Link
                className="login-option login-option--guest"
                to="/for-you"
                onClick={() => {
                  localStorage.setItem("isLoggedIn", "true");
                  localStorage.setItem("authMode", "guest");
                }}
              >
                Login as Guest
              </Link>
              <div className="login-divider login-divider--compact">
                <span>or</span>
              </div>
              <button
                className="login-option login-option--google"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img className="login-option__icon" src={googleLogo} alt="Google" />
                {loading ? "Signing in..." : "Log in with Google"}
              </button>
            </div>
            <div className="login-divider">
              <span>or</span>
            </div>
            <form className="login-form" onSubmit={handleLogin} autoComplete="off">
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email Address"
                autoComplete="off"
              />
              <input
                className="login-input"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
              <button className="btn login-submit" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="login-actions">
              <button className="login-action-link" type="button" onClick={() => switchMode("forgotPassword")}>
                Forgot Password?
              </button>
              <button className="login-action-link" type="button" onClick={() => switchMode("register")}>
                Don't Have an Account?
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Login;
