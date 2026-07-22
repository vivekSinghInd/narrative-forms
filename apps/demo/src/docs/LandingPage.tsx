import { useEffect, useState } from "react";
import NarrativeForm from "../engine/NarrativeForm";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 1800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setHeroVisible(true));
  }, []);

  return (
    <div className="landing">
      {/* ───── HERO ───── */}
      <section className={`landing-hero${heroVisible ? " landing-hero--visible" : ""}`}>
        <div className="hero-grid-bg" />
        <div className="hero-container">
          {/* Left side — text + CTAs */}
          <div className="hero-left">
            <span className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              v1.0.9 — Now Available
            </span>
            <h1 className="hero-title">
              The Most Complete<br /><span className="hero-highlight">Narrative Form</span><br />Library
            </h1>
            <p className="hero-desc">
              Replace rigid, boring forms with a flowing, typewriter-driven experience.
              Your users fill sentences — not boxes. Zero dependencies. Framework agnostic.
            </p>
            <div className="hero-actions">
              <button className="hero-cta hero-cta--primary" onClick={onGetStarted} type="button">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <a className="hero-cta hero-cta--star" href="https://github.com/vivekSinghInd/narrative-forms" target="_blank" rel="noreferrer">
                Give a Star
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Right side — showcase cards */}
          <div className="hero-right">
            {/* Card 1: Live typewriter demo */}
            <div className="hero-card hero-card--main">
              <NarrativeForm
                layout="lines"
                fields={[
                  { key: "name", type: "text", prefix: "Hi! My name is", placeholder: "your name" },
                  { key: "role", type: "chips", prefix: "and I am here as", options: ["a Developer", "a Designer", "a Founder"] },
                  { key: "email", type: "email", prefix: "You can reach me at", placeholder: "email address" },
                ]}
                welcomeHeading="Let's build something."
                doneMessage={() => "Thanks! We'll be in touch."}
              />
            </div>

            {/* Card 2: Code snippet */}
            <div className="hero-card hero-card--code">
              <div className="hc-dots">
                <span /><span /><span />
              </div>
              <pre className="hc-code">
{`<NarrativeForm
  fields={[
    { key: "name",
      type: "text",
      prefix: "My name is" },
    { key: "role",
      type: "chips",
      options: ["Dev", "Designer"] }
  ]}
/>`}
              </pre>
            </div>

            {/* Card 3: Field types + validation */}
            <div className="hero-card hero-card--fields">
              <p className="hc-label">10+ Field Types</p>
              <div className="hc-field-list">
                {["Text", "Email", "Chips", "OTP", "Select", "Date"].map((f) => (
                  <span className="hc-field-tag" key={f}>{f}</span>
                ))}
              </div>
              <div className="hc-validators">
                <div className="hc-validator">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>email</span>
                </div>
                <div className="hc-validator">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>indianPhone</span>
                </div>
                <div className="hc-validator">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>aadhaar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* ───── STATS BAR ───── */}
      <section className="landing-stats">
        <div className="landing-stats-inner">
          {[
            { value: 10, suffix: "+", label: "Field Types" },
            { value: 0, suffix: "KB", label: "Dependencies", displayValue: "0" },
            { value: 4, suffix: "", label: "Frameworks" },
            { value: 100, suffix: "%", label: "Accessible" },
          ].map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-value">
                {stat.displayValue !== undefined
                  ? stat.displayValue
                  : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="landing-features">
        <div className="landing-section-inner">
          <p className="section-eyebrow">WHY NARRATIVE FORM</p>
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg>
                ),
                title: "Typewriter Effect",
                desc: "Text types itself out character by character. Users complete sentences, not fields.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                ),
                title: "Zero Dependencies",
                desc: "Under 10KB gzipped. No lodash, no animation libraries, no bloat. Just your framework.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                title: "Built-in Validation",
                desc: "Email, phone, PAN, Aadhaar, GST and more. Sync, async, and server-side.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                ),
                title: "Framework Agnostic",
                desc: "React, Vue, Angular, and React Native. One API, consistent behavior everywhere.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" /></svg>
                ),
                title: "Fully Themeable",
                desc: "CSS variables, dark mode, ns- class contract. Customize every pixel with ease.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                ),
                title: "Accessible",
                desc: "ARIA attributes, keyboard navigation, reduced-motion support. Inclusive by default.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMPONENT SHOWCASE ───── */}
      <section className="landing-components">
        <div className="landing-section-inner">
          <p className="section-eyebrow">COMPONENTS</p>
          <h2 className="section-title">10+ field types, ready to use</h2>
          <p className="section-desc">Every field you need for onboarding, sign-up, and data collection flows.</p>
          <div className="component-chips">
            {["Text", "Email", "Password", "Number", "Tel", "Chips", "Multi-Chips", "Select", "Date", "OTP"].map((c) => (
              <span className="component-chip" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="landing-cta-section">
        <div className="landing-cta-inner">
          <h2 className="cta-title">Ready to ditch boring forms?</h2>
          <p className="cta-desc">Get started in under 2 minutes. Install, configure, and ship.</p>
          <div className="cta-actions">
            <button className="hero-cta hero-cta--primary" onClick={onGetStarted} type="button">
              Read the Docs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <div className="cta-install">
              <code>npm i narrative-form</code>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">N</span>
            <span className="brand-name">
              NARRATIVE<span className="brand-thin">FORM</span>
            </span>
          </div>
          <p className="footer-copy">
            Built by <a href="https://www.linkedin.com/in/vivek-singh2984/" target="_blank" rel="noopener noreferrer">Vivek Singh</a> · Laxsarica Technologies LLP
          </p>
          <div className="footer-links">
            <a href="https://github.com/vivekSinghInd/narrative-forms" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#docs/overview">Docs</a>
            <a href="#docs/installation">Install</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
