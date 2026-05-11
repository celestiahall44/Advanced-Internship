import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import loginImage from "../assets/login.png";
import { auth } from "./firebase";
import SearchHeader from "./SearchHeader";

function Settings() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const savedPlan = localStorage.getItem("subscriptionPlan");
  const subscriptionType = savedPlan ? savedPlan : "Basic";
  const userEmail = auth.currentUser?.email || "Guest user";

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="for-you-page settings-guest-page">
        <div className="settings-guest">
          <img className="settings-guest__image" src={loginImage} alt="Login required" />
          <h1 className="settings-guest__title">Log in to open Settings</h1>
          <p className="settings-guest__text">Sign in to manage account and reading preferences.</p>
          <div className="settings-guest__actions">
            <Link to="/login" className="btn settings-guest__btn">Log In</Link>
            <Link to="/" className="settings-guest__home-link">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="for-you-page">
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <SearchHeader query={query} setQuery={setQuery} onSubmit={handleSearch} />
          <main className="app-main">
            <section className="settings-page">
              <h1 className="settings-page__title">Settings</h1>
              <p className="settings-page__subtitle">Manage your subscription and account email.</p>

              <div className="settings-card">
                <h2 className="settings-card__title">Your Subscription Plan</h2>
                <p className="settings-card__text">{subscriptionType}</p>
                <Link to="/choose-plan" className="btn settings-card__upgrade-btn">
                  Upgrade to Premium
                </Link>
              </div>

              <div className="settings-card">
                <h2 className="settings-card__title">Email</h2>
                <p className="settings-card__text">{userEmail}</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Settings;
