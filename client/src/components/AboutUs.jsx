import "./AboutUs.css";

function AboutUs() {
  return (
    <section className="about-us-section" id="about-us">
      <div className="about-us-card">
        <p className="about-us-tag">About Us</p>

        <h2 className="about-us-title">Why Kalon Resume Analyzer?</h2>

        <p className="about-us-text">
          Kalon Resume Analyzer is an AI-powered resume analysis platform built
          to help students, freshers, and job seekers improve their resumes in a
          smarter and more strategic way. The platform allows users to match
          resumes against job descriptions, compare multiple resumes, evaluate
          ATS readiness, improve resume bullet points, and explore how well
          their profile fits different job roles.
        </p>

        <p className="about-us-text">
          Our goal is to help users look beyond a basic resume score and
          understand the deeper quality of their application through meaningful,
          skill-based, and AI-assisted insights.
        </p>

        <div className="about-us-meaning-box">
          <h3>Meaning of “Kalon”</h3>
          <p>
            <strong>Kalon</strong> is a Greek word that refers to a form of
            beauty that is more than skin deep. It represents deeper worth,
            goodness, and value beyond what is immediately visible.
          </p>
          <p>
            That idea perfectly matches our platform’s purpose: looking beyond
            the paper resume and understanding the true strength, relevance, and
            potential of a candidate’s profile.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;