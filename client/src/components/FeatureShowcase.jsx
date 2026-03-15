import "./FeatureShowcase.css";

const featureList = [
  {
    title: "Resume Match Analysis",
    description:
      "Upload your resume and compare it against a job description to get an instant compatibility score with matched and missing skills.",
    icon: "📄",
  },
  {
    title: "ATS Score Simulation",
    description:
      "Understand how applicant tracking systems may view your resume with structured feedback, keyword insights, and optimization guidance.",
    icon: "🎯",
  },
  {
    title: "Multi Job Match",
    description:
      "Check one resume against multiple job descriptions at once and quickly find which opportunity fits your profile best.",
    icon: "📊",
  },
  {
    title: "Resume Comparison",
    description:
      "Compare two resumes for the same role and identify which one performs better for a given job description.",
    icon: "⚖️",
  },
  {
    title: "AI Bullet Improvement",
    description:
      "Rewrite weak resume bullet points into stronger, more professional, and impact-driven statements using AI assistance.",
    icon: "✨",
  },
  {
    title: "Analysis History",
    description:
      "Access your previous resume analyses anytime and keep track of improvements across different roles and applications.",
    icon: "🕘",
  },
];

function FeatureShowcase() {
  return (
    <section className="feature-showcase" id="features">
      <div className="feature-showcase-header">
        <p className="feature-showcase-tag">Platform Features</p>
        <h2>Everything you need to improve your resume strategically</h2>
        <p className="feature-showcase-subtitle">
          Built to help students, job seekers, and early professionals evaluate,
          compare, refine, and optimize resumes with a cleaner AI-powered
          workflow.
        </p>
      </div>

      <div className="feature-grid">
        {featureList.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>

      <div className="feature-auth-cta">
        <h3>Log in or sign up to continue</h3>
        <p>
          Start analyzing resumes, comparing applications, and improving your
          job readiness with AI-powered insights.
        </p>
      </div>
    </section>
  );
}

export default FeatureShowcase;