import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import LoadingSteps from "./components/LoadingSteps.jsx";
import AnalysisHistory from "./components/AnalysisHistory.jsx";
import BulletImprover from "./components/BulletImprover.jsx";
import AuthCard from "./components/AuthCard.jsx";
import UserBar from "./components/UserBar.jsx";
import MultiJobMatch from "./components/MultiJobMatch.jsx";
import { fetchCurrentUser } from "./services/auth.js";


function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setResult(null);
  }

  if (authLoading) {
    return (
      <div className="page">
        <div className="container">
          <header className="hero">
            <p className="hero-tag">AI Resume Match Platform</p>
            <h1 className="hero-title">Kalon Resume Analyzer</h1>
            <p className="hero-subtitle">Loading your workspace...</p>
          </header>
          <LoadingSteps />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <header className="hero">
            <p className="hero-tag">AI Resume Match Platform</p>
            <h1 className="hero-title">Kalon Resume Analyzer</h1>
            <p className="hero-subtitle">
              Sign up or log in to save your resume analyses, AI feedback, and
              interview preparation history.
            </p>
          </header>

          <AuthCard
            setUser={setUser}
            setIsAuthenticated={setIsAuthenticated}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <p className="hero-tag">AI Resume Match Platform</p>
          <h1 className="hero-title">Kalon Resume Analyzer</h1>
          <p className="hero-subtitle">
            Upload your resume, paste a job description, and get a smart
            match score with AI-powered suggestions.
          </p>
        </header>

        <UserBar user={user} onLogout={handleLogout} />

        <UploadForm
          setResult={setResult}
          setLoading={setLoading}
          setError={setError}
          onAnalysisComplete={() =>
            setHistoryRefreshKey((previous) => previous + 1)
          }
        />

        {loading && <LoadingSteps />}
        {error && <p className="error-text">{error}</p>}

        <div className="dashboard-stack">
          <ResultCard result={result} />
          <AnalysisHistory refreshKey={historyRefreshKey} />
          <BulletImprover />
          <MultiJobMatch />
        </div>
      </div>
    </div>
  );
}

export default App;