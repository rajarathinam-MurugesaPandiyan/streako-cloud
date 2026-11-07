import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ClockIcon, ScaleIcon, HandshakeIcon, FileTextIcon, ZapIcon } from '../components/Icons';

interface TermSection {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const TERM_SECTIONS: TermSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    summary: 'Binding legal contract established upon app access or download.',
    content:
      'By downloading, installing, accessing, or using Streako (Android package: com.ethicsofcoding.streako, "we", "us", or "our"), you represent that you have read, understood, and agreed to be bound by these Terms & Conditions and our Privacy Policy. If you do not accept these terms in full, you must refrain from using the application.',
  },
  {
    id: 'purpose',
    title: '2. Purpose of the Application',
    summary: 'Non-commercial personal organization and habit tracking.',
    content:
      'Streako is a personal ritual and habit tracking application designed to help individuals build, monitor, and sustain positive routines through streak counters and audio notifications. The platform is offered exclusively for personal, non-commercial self-improvement purposes.',
  },
  {
    id: 'accounts',
    title: '3. User Accounts & Authentication',
    summary: 'Guest local mode or optional Firebase Google Sign-In.',
    content:
      'You may utilize Streako anonymously in guest mode or authenticate via Google Sign-In powered by Firebase. You are solely responsible for maintaining the confidentiality of your device and login credentials, as well as all activities conducted under your profile.',
  },
  {
    id: 'ownership',
    title: '4. Data Ownership & User Content',
    summary: 'You retain 100% intellectual property ownership of your routines.',
    content:
      'You retain 100% intellectual property ownership of all custom habit titles, schedules, notes, and milestones entered into Streako. We do not claim any ownership rights, proprietary licenses, or distribution privileges over your personal self-improvement entries.',
  },
  {
    id: 'alarms',
    title: '5. Reminders & Alarm Delivery',
    summary: 'Hardware, battery savers, and OS permissions govern alert timing.',
    content:
      'Streako provides local AlarmKit audio alarms and scheduled reminders. Actual alert delivery is subject to device battery optimization settings, OS notification permissions, and physical hardware conditions. Streako cannot be held liable for any damages or missed appointments arising from missed habit alerts.',
  },
  {
    id: 'health-disclaimer',
    title: '6. Health & Wellness Disclaimer',
    summary: 'Productivity tool only; does not provide clinical or medical advice.',
    content:
      'Streako is an organizational and productivity utility. It does not provide clinical, psychological, diagnostic, or medical advice. Always consult a certified healthcare professional before undertaking strenuous physical fitness regimes or extreme fasting routines.',
  },
  {
    id: 'termination',
    title: '7. Termination & Account Erasure',
    summary: 'Unrestricted right to delete app and wipe all stored data instantly.',
    content:
      'You may terminate your agreement with Streako at any moment by deleting the app. You can also execute a full data wipe using the "Delete Account & Data" action in Settings, which permanently removes all database records and authentication credentials.',
  },
  {
    id: 'changes',
    title: '8. Changes to These Terms',
    summary: 'Periodic revisions with published modification timestamps.',
    content:
      'We reserve the right to amend these terms at our sole discretion. Any changes will be published here with an updated revision date. Your continued utilization of Streako following updates establishes your binding acceptance.',
  },
  {
    id: 'contact',
    title: '9. Contact Us',
    summary: 'Direct support channel for legal inquiries and clarifications.',
    content:
      'For inquiries, feedback, or legal notices concerning these Terms & Conditions, please contact us at streakocloud@gmail.com. We are dedicated to transparent, fair terms.',
  },
];

export function TermsAndConditions() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Terms & Conditions — Streako Habit Tracker';

    // MANDATORY Accessibility Routing: Route focus to the newly revealed heading
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, []);

  const copySectionLink = async (sectionId: string) => {
    const url = `${window.location.origin}/terms#${sectionId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSectionId(sectionId);
      setTimeout(() => setCopiedSectionId(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="legal-page-container">
      {/* Top Breadcrumb & Document Switcher Bar */}
      <nav className="legal-nav-bar" aria-label="Legal document breadcrumb navigation">
        <div className="legal-nav-left">
          <Link to="/" viewTransition className="legal-back-btn" aria-label="Return to Streako home page">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Home</span>
          </Link>

          <span className="legal-breadcrumb-sep" aria-hidden="true">/</span>

          {/* Quick Document Switcher Tabs */}
          <div className="legal-doc-switcher" role="tablist" aria-label="Legal documents">
            <NavLink
              to="/privacy"
              viewTransition
              className={({ isActive }) => `legal-tab-pill ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected="false"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              viewTransition
              className={({ isActive }) => `legal-tab-pill ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected="true"
            >
              Terms of Service
            </NavLink>
          </div>
        </div>

        <div className="legal-brand-badge" aria-hidden="true">
          <img src="/assets/streako.png" alt="" width="24" height="24" />
          <span>Streako Legal</span>
        </div>
      </nav>

      {/* Hero Banner Card */}
      <header className="legal-hero-card terms-accent">
        <div className="legal-hero-top">
          <div className="legal-icon-box terms-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>

          <div className="legal-hero-info">
            <div className="legal-pill-row">
              <span className="legal-status-pill terms-pill">Terms of Agreement</span>
              <span className="legal-read-time">
                <ClockIcon size={14} className="meta-icon" /> 4 min read
              </span>
              <span className="legal-badge-pill">
                <ScaleIcon size={14} className="meta-icon" /> Plain-Language Contract
              </span>
            </div>

            <h1 ref={headingRef} tabIndex={-1} className="legal-title">
              Terms &amp; Conditions
            </h1>

            <p className="legal-subtitle">
              Welcome to Streako. By utilizing our mobile application, audio alarms, or web resources, you agree to these clear and respectful conditions of use.
            </p>

            <div className="legal-meta-row">
              <span className="legal-meta-item">
                <strong>Package:</strong> <code>com.ethicsofcoding.streako</code>
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Contact:</strong>{' '}
                <a href="mailto:streakocloud@gmail.com" className="legal-meta-link">
                  streakocloud@gmail.com
                </a>
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Effective:</strong> October 2026
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Scope:</strong> Global
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Highlights Grid */}
      <section className="legal-guarantees-grid" aria-label="Key terms summary">
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <HandshakeIcon size={24} />
          </span>
          <h3>Fair &amp; Transparent</h3>
          <p>No predatory lock-ins, hidden recurring subscription traps, or non-negotiable data exploitation.</p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <FileTextIcon size={24} />
          </span>
          <h3>100% User Ownership</h3>
          <p>All habits, routines, streaks, and reflections remain your intellectual property unconditionally.</p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <ZapIcon size={24} />
          </span>
          <h3>Instant Termination</h3>
          <p>You can walk away anytime, delete your account, and take all data with you with zero obstacles.</p>
        </div>
      </section>

      {/* Quick Jump Table of Contents */}
      <section className="legal-toc-bar" aria-label="Table of Contents">
        <span className="legal-toc-label">Jump to Section:</span>
        <div className="legal-toc-scroll">
          {TERM_SECTIONS.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className="legal-toc-pill">
              {sec.title}
            </a>
          ))}
        </div>
      </section>

      {/* Terms Content Sections */}
      <div className="legal-content-grid">
        {TERM_SECTIONS.map((sec) => (
          <article key={sec.id} id={sec.id} className="legal-section-card">
            <div className="legal-sec-header">
              <div>
                <h2 className="legal-sec-title">
                  <a href={`#${sec.id}`} className="legal-sec-anchor">
                    {sec.title}
                  </a>
                </h2>
                <span className="legal-sec-summary">{sec.summary}</span>
              </div>

              <button
                type="button"
                onClick={() => copySectionLink(sec.id)}
                className="legal-copy-btn"
                aria-label={`Copy direct link to section ${sec.title}`}
                title="Copy link to this section"
              >
                {copiedSectionId === sec.id ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                    </svg>
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>

            <p className="legal-sec-text">
              {sec.id === 'contact' ? (
                <>
                  For inquiries, feedback, or legal notices concerning these Terms &amp; Conditions, please contact us at{' '}
                  <a href="mailto:streakocloud@gmail.com" className="legal-link">
                    streakocloud@gmail.com
                  </a>
                  . We are dedicated to providing fair, user-centric policies.
                </>
              ) : sec.id === 'termination' ? (
                <>
                  You may terminate your agreement with Streako at any moment by deleting the app. You can also execute a full data wipe using the{' '}
                  <strong>"Delete Account &amp; Data"</strong> action in Settings, which permanently removes all database records and authentication credentials.
                </>
              ) : (
                sec.content
              )}
            </p>
          </article>
        ))}
      </div>

      {/* Footer Navigation Bar */}
      <footer className="legal-footer-bar">
        <div className="legal-footer-content">
          <div>
            <h4>Questions regarding these terms?</h4>
            <p>Our team is always happy to clarify legal language or assist with user requests.</p>
          </div>
          <div className="legal-footer-actions">
            <Link to="/" viewTransition className="btn btn-secondary btn-sm">
              Return to Streako
            </Link>
            <Link to="/privacy" viewTransition className="btn btn-primary btn-sm">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TermsAndConditions;
