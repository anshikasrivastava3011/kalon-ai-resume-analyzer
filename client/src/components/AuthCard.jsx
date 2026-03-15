import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signupUser, loginUser } from "../services/auth.js";
import "./AuthCard.css";

function AuthCard({ setUser, setIsAuthenticated, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");

    try {
      setLoading(true);

      let data;

      if (mode === "signup") {
        data = await signupUser(formData);
      } else {
        data = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(
        error.response?.data?.message || `${mode} failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="auth-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-toggle">
        <button
          className={mode === "login" ? "auth-tab active" : "auth-tab"}
          onClick={() => setMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={mode === "signup" ? "auth-tab active" : "auth-tab"}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <h2 className="auth-title">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </h2>

      <p className="auth-subtitle">
        {mode === "login"
          ? "Login to save and manage your resume analyses."
          : "Sign up to start analyzing resumes with AI."}
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {authError && <p className="auth-error">{authError}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Signing up..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>
    </motion.div>
  );
}

export default AuthCard;