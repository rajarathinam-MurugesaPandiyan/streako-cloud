interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
      <div className="legal-hero-card privacy-accent">
        <div className="legal-icon-box privacy-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </div>
        <div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">
            Your privacy is our core foundation. We believe self-improvement tools must never compromise personal autonomy.
          </p>
          <span className="legal-meta">Last updated: October 2026 • Effective immediately</span>
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="legal-content-grid">
        <article className="legal-section-card">
          <h2 className="legal-sec-title">1. Information We Collect</h2>
          <p className="legal-sec-text">
            When you sign in using Google Authentication, we receive basic profile details including your name, email address, and profile photo provided by Google via Firebase Authentication. We also record the habit titles, target frequencies, reminder intervals, occurrence timestamps, and streak calculations you create within the application.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">2. Local-First Storage Architecture</h2>
          <p className="legal-sec-text">
            Streako prioritizes user privacy through a local-first design. Your habit data, tracking entries, and customized reminder times are stored primarily on your device in local sandboxed storage (Hive). We do not sell, rent, or monetize your personal tracking records with third-party advertising networks or data brokers.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">3. Notification & Alarm Permissions</h2>
          <p className="legal-sec-text">
            We request operating system permissions to post notifications and schedule exact alarms (iOS AlarmKit and Android Exact Alarm channels). These permissions are utilized strictly to trigger scheduled reminder alarms and notifications for your configured habits.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">4. Third-Party Services</h2>
          <p className="legal-sec-text">
            We utilize Google Sign-In and Firebase Authentication to provide secure cloud identity and seamless device switching. These third-party services process authentication tokens according to Google's rigorous Privacy Policy and industry security benchmarks.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">5. Complete User Data Deletion</h2>
          <p className="legal-sec-text">
            You maintain absolute sovereignty over your data. You may delete individual habits at any time, or use the <strong>"Delete Account &amp; Data"</strong> action located inside the Settings menu to permanently erase all local database files, cancel all scheduled notifications, and purge your cloud identity profile.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">6. Data Security</h2>
          <p className="legal-sec-text">
            We employ modern transport layer security (TLS 1.3 / HTTPS) for all network communication and sandbox-level isolation on your device to safeguard your routines against unauthorized access, corruption, or disclosure.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">7. Children's Privacy</h2>
          <p className="legal-sec-text">
            Streako is not directed toward children under 13 years of age. We do not knowingly collect personal identifiable information from children under 13. If you become aware that a child has provided us with personal information, please notify us immediately for swift removal.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">8. Changes to This Privacy Policy</h2>
          <p className="legal-sec-text">
            We may periodically revise our Privacy Policy to reflect evolving features or legal standards. Revisions will be posted here with an updated "Last updated" date. Continued use of Streako denotes consent to the updated terms.
          </p>
        </article>

        <article className="legal-section-card">
          <h2 className="legal-sec-title">9. Contact Us</h2>
          <p className="legal-sec-text">
            If you have questions, feedback, or data requests regarding our Privacy Policy or privacy rights, please contact our team directly at <a href="mailto:privacy@streako.app" className="legal-link">privacy@streako.app</a>.
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

export default PrivacyPolicy;

