import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import LoadingSteps from "./components/LoadingSteps.jsx";
import AnalysisHistory from "./components/AnalysisHistory.jsx";
import BulletImprover from "./components/BulletImprover.jsx";
import AuthCard from "./components/AuthCard.jsx";
import MultiJobMatch from "./components/MultiJobMatch.jsx";
import ResumeComparison from "./components/ResumeComparison.jsx";
import Navbar from "./components/Navbar.jsx";
import FeatureShowcase from "./components/FeatureShowcase.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Footer from "./components/Footer.jsx";
import { fetchCurrentUser } from "./services/auth.js";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentUser(token);
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (showAuth) {
      const section = document.getElementById("auth-section");

      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [showAuth]);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setResult(null);
    setAuthMode("login");
    setShowAuth(false);
  }

  if (authLoading) {
    return (
      <div className="page">
        <div className="container">
          <Navbar
            isAuthenticated={false}
            user={null}
            onLogout={handleLogout}
            onAuthModeChange={setAuthMode}
            onShowAuth={() => setShowAuth(true)}
          />

          <header className="hero" id="home">
            <p className="hero-tag">AI Resume Match Platform</p>
            <h1 className="hero-title">Kalon Resume Analyzer</h1>
            <p className="hero-subtitle">Loading your workspace...</p>
          </header>

          <LoadingSteps />
          <AboutUs />
        </div>

        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <Navbar
            isAuthenticated={false}
            user={null}
            onLogout={handleLogout}
            onAuthModeChange={setAuthMode}
            onShowAuth={() => setShowAuth(true)}
          />

          <header className="hero" id="home">
            <p className="hero-tag">AI Resume Match Platform</p>
            <h1 className="hero-title">Kalon Resume Analyzer</h1>
            <p className="hero-subtitle">
              Analyze resume-job fit, compare multiple resumes, improve bullet
              points with AI, simulate ATS feedback, and track your previous
              analyses in one clean platform.
            </p>
          </header>

          <FeatureShowcase />

          {showAuth && (
            <section id="auth-section">
              <AuthCard
                setUser={setUser}
                setIsAuthenticated={setIsAuthenticated}
                defaultMode={authMode}
              />
            </section>
          )}

          <AboutUs />
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          onAuthModeChange={setAuthMode}
          onShowAuth={() => {}}
        />

        <header className="hero" id="home">
          <p className="hero-tag">AI Resume Match Platform</p>
          <h1 className="hero-title">Kalon Resume Analyzer</h1>
          <p className="hero-subtitle">
            Upload your resume, compare it with job descriptions, improve weak
            resume points, and make your applications more ATS-friendly with
            AI-powered insights.
          </p>
        </header>

        <section id="resume-match">
          <UploadForm
            setResult={setResult}
            setLoading={setLoading}
            setError={setError}
            onAnalysisComplete={() =>
              setHistoryRefreshKey((previous) => previous + 1)
            }
          />
        </section>

        {loading && <LoadingSteps />}
        {error && <p className="error-text">{error}</p>}

        <div className="dashboard-stack">
          <section>
            <ResultCard result={result} />
          </section>

          <section id="history">
            <AnalysisHistory refreshKey={historyRefreshKey} />
          </section>

          <section id="bullet-improver">
            <BulletImprover />
          </section>

          <section id="multi-match">
            <MultiJobMatch />
          </section>

          <section id="resume-comparison">
            <ResumeComparison />
          </section>
        </div>

        <AboutUs />
      </div>

      <Footer />
    </div>
  );
}

export default App;