import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-badge">AI</span>

              <div>
                <h3>Kalon Resume Analyzer</h3>
                <p>AI Resume Match Platform</p>
              </div>
            </div>

            <p className="footer-description">
              Analyze resume-job fit, compare resumes, improve bullet points,
              and optimize your applications with AI-powered insights.
            </p>
          </div>

          <div className="footer-links">
            <h4>Platform</h4>
            <a href="#resume-match">Resume Match</a>
            <a href="#history">Analysis History</a>
            <a href="#bullet-improver">Bullet Improver</a>
            <a href="#multi-match">Multi Job Match</a>
            <a href="#resume-comparison">Resume Comparison</a>
            <a href="#about-us">About Us</a>
          </div>

          <div className="footer-links">
            <h4>Contact Us</h4>

            <p className="footer-contact-text">
              Have feedback or questions?
            </p>

            <a
              href="mailto:kalon.resume.analyzer@gmail.com"
              className="footer-email"
            >
              kalon.resume.analyzer@gmail.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Kalon Resume Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;