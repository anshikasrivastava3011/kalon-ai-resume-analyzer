import "./Navbar.css";

function Navbar({
  isAuthenticated,
  user,
  onLogout,
  onAuthModeChange,
  onShowAuth,
}) {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => scrollToSection("home")}
        role="button"
        tabIndex={0}
      >
        <span className="brand-badge">AI</span>

        <div className="brand-text">
          <h2>Kalon Resume Analyzer</h2>
          <p>AI Resume Match Platform</p>
        </div>
      </div>

      <div className="navbar-links">
        <button onClick={() => scrollToSection("home")}>Home</button>

        {!isAuthenticated && (
          <button onClick={() => scrollToSection("features")}>Features</button>
        )}

        {isAuthenticated && (
          <>
            <button onClick={() => scrollToSection("resume-match")}>
              Resume Match
            </button>
            <button onClick={() => scrollToSection("history")}>History</button>
            <button onClick={() => scrollToSection("bullet-improver")}>
              Bullet Improver
            </button>
            <button onClick={() => scrollToSection("multi-match")}>
              Multi Match
            </button>
            <button onClick={() => scrollToSection("resume-comparison")}>
              Resume Comparison
            </button>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <button
              className="nav-secondary-button"
              onClick={() => {
                onAuthModeChange("login");
                onShowAuth();
              }}
            >
              Log In
            </button>

            <button
              className="nav-primary-button"
              onClick={() => {
                onAuthModeChange("signup");
                onShowAuth();
              }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <div className="navbar-user">
              <span className="navbar-user-label">Hi,</span>
              <strong>{user?.name}</strong>
            </div>

            <button className="nav-primary-button" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;