interface TermsAndConditionsProps {
  onBack: () => void;
}

export function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
  return (
    <div className="legal-page-container">
      {/* Top Breadcrumb & Navigation */}
      <div className="legal-nav-bar">
        <button onClick={onBack} className="legal-back-btn" type="button" aria-label="Go back to home page">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Home</span>
        </button>

        <div className="legal-brand">
          <img src="/assets/streako.png" alt="Streako Logo" width="28" height="28" />
          <span>Streako Legal</span>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="legal-hero-card terms-accent">
        <div className="legal-icon-box terms-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div>
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <p className="legal-subtitle">
            Welcome to Streako. By utilizing our mobile application or web portal, you agree to these legal conditions.
          </p>
          <span className="legal-meta">Last updated: October 2026 • Version 1.0.0</span>
        </div>
      </div>

      {/* Terms Content Sections */}
      <div className="legal-content-grid">
        <article className="legal-section-card">
          <h2 className="legal-sec-title">1. Acceptance of Terms</h2>
          <p className="legal-sec-text">
            By downloading, installing, accessing, or using Streako ("we", "us", or "our"), you represent that you have read, understood, and agreed to be bound by these Terms &amp; Conditions and our Privacy Policy. If you do not accept these terms, you must refrain from using the application.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">2. Purpose of the Application</h2>
          <p className="legal-sec-text">
            Streako is a personal ritual and habit tracking application designed to help individuals build, monitor, and sustain positive routines through streak counters and audio notifications. The platform is offered exclusively for personal, non-commercial self-improvement purposes.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">3. User Accounts &amp; Authentication</h2>
          <p className="legal-sec-text">
            You may utilize Streako anonymously in guest mode or authenticate via Google Sign-In powered by Firebase. You are solely responsible for maintaining the confidentiality of your device and login credentials, as well as all activities conducted under your profile.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">4. Data Ownership &amp; User Content</h2>
          <p className="legal-sec-text">
            You retain 100% intellectual property ownership of all custom habit titles, schedules, notes, and milestones entered into Streako. We do not claim any ownership rights over your personal self-improvement entries.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">5. Reminders &amp; Alarm Delivery</h2>
          <p className="legal-sec-text">
            Streako provides local AlarmKit audio alarms and scheduled reminders. Actual alert delivery is subject to device battery optimization settings, OS notification permissions, and physical hardware conditions. Streako cannot be held liable for any damages arising from missed habit alerts.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">6. Health &amp; Wellness Disclaimer</h2>
          <p className="legal-sec-text">
            Streako is an organizational and productivity utility. It does not provide clinical, psychological, diagnostic, or medical advice. Always consult a certified healthcare professional before undertaking strenuous physical fitness or fasting routines.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">7. Termination &amp; Account Erasure</h2>
          <p className="legal-sec-text">
            You may terminate your agreement with Streako at any moment by deleting the app. You can also execute a full data wipe using the <strong>"Delete Account &amp; Data"</strong> action in Settings, which permanently removes all database records and authentication credentials.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">8. Changes to These Terms</h2>
          <p className="legal-sec-text">
            We reserve the right to amend these terms at our sole discretion. Any changes will be published here with an updated revision date. Your continued utilization of Streako following updates establishes your acceptance.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">9. Contact Us</h2>
          <p className="legal-sec-text">
            For inquiries, feedback, or legal notices concerning these Terms &amp; Conditions, please contact us at <a href="mailto:support@streako.app" className="legal-link">support@streako.app</a>.
          </p>
        </article>
      </div>

      {/* Footer Bar */}
      <div className="legal-footer-bar">
        <button onClick={onBack} className="btn btn-primary btn-sm" type="button">
          Return to Streako
        </button>
      </div>
    </div>
  );
}

export default TermsAndConditions;

