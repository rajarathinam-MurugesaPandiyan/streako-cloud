import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ClockIcon, ShieldIcon, LockIcon, BanIcon, TrashIcon } from '../components/Icons';

interface Section {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    id: 'info-collected',
    title: '1. Information We Collect',
    summary: 'Minimal identity profile and your routine preferences.',
    content:
      'This Privacy Policy applies to the Streako mobile application (Android package: com.ethicsofcoding.streako) and associated cloud services. When you choose to sign in using Google Authentication, we receive basic profile details including your name, email address, and profile photo provided by Google via Firebase Authentication. We also record the habit titles, target frequencies, reminder intervals, occurrence timestamps, and streak calculations you configure within the application.',
  },
  {
    id: 'local-first',
    title: '2. Local-First Storage Architecture',
    summary: 'Hive sandbox storage strictly on your local hardware.',
    content:
      'Streako prioritizes user privacy through a local-first design. Your habit data, tracking entries, and customized reminder times are stored primarily on your device in local sandboxed storage (Hive). We do not sell, rent, or monetize your personal tracking records with third-party advertising networks or data brokers.',
  },
  {
    id: 'notifications',
    title: '3. Notification & Alarm Permissions',
    summary: 'Exact alarm channels strictly for scheduled rituals.',
    content:
      'We request operating system permissions to post notifications and schedule exact alarms (iOS AlarmKit and Android Exact Alarm channels). These permissions are utilized strictly to trigger scheduled reminder alarms and notifications for your configured habits, cutting through system silencers when enabled by you.',
  },
  {
    id: 'third-party',
    title: '4. Third-Party Services',
    summary: 'Google Firebase Authentication for safe identity sync.',
    content:
      'We utilize Google Sign-In and Firebase Authentication to provide secure cloud identity and seamless device switching. These third-party services process authentication tokens according to Google\'s rigorous Privacy Policy and industry security benchmarks.',
  },
  {
    id: 'data-deletion',
    title: '5. Complete User Data Deletion',
    summary: '1-tap nuclear wipe in Settings erases all traces permanently.',
    content:
      'You maintain absolute sovereignty over your data. You may delete individual habits at any time, or use the "Delete Account & Data" action located inside the Settings menu to permanently erase all local database files, cancel all scheduled notifications, and purge your cloud identity profile.',
  },
  {
    id: 'security',
    title: '6. Data Security',
    summary: 'TLS 1.3 encryption and device sandbox isolation.',
    content:
      'We employ modern transport layer security (TLS 1.3 / HTTPS) for all network communication and sandbox-level isolation on your device to safeguard your routines against unauthorized access, corruption, or disclosure.',
  },
  {
    id: 'children',
    title: '7. Children\'s Privacy',
    summary: 'Streako is built for general audiences aged 13 and older.',
    content:
      'Streako is not directed toward children under 13 years of age. We do not knowingly collect personal identifiable information from children under 13. If you become aware that a child has provided us with personal information, please notify us immediately for swift removal.',
  },
  {
    id: 'changes',
    title: '8. Changes to This Privacy Policy',
    summary: 'Transparent revisions with updated timestamp.',
    content:
      'We may periodically revise our Privacy Policy to reflect evolving features or legal standards. Revisions will be posted here with an updated "Last updated" date. Continued use of Streako denotes consent to the updated terms.',
  },
  {
    id: 'contact',
    title: '9. Contact Us',
    summary: 'Direct human support for questions or data requests.',
    content:
      'If you have questions, feedback, or data requests regarding our Privacy Policy or privacy rights, please contact our team directly at streakocloud@gmail.com. We respond to all verified requests promptly.',
  },
];

export function PrivacyPolicy() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Privacy Policy — Streako Habit Tracker';

    // MANDATORY Accessibility Routing: Route focus to the newly revealed heading
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, []);

  const copySectionLink = async (sectionId: string) => {
    const url = `${window.location.origin}/privacy#${sectionId}`;
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
              aria-selected="true"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              viewTransition
              className={({ isActive }) => `legal-tab-pill ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected="false"
            >
              Terms of Service
            </NavLink>
          </div>
        </div>

        <div className="legal-brand-badge" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}assets/streako.png`} alt="" width="24" height="24" />
          <span>Streako Legal</span>
        </div>
      </nav>

      {/* Hero Banner Card */}
      <header className="legal-hero-card privacy-accent">
        <div className="legal-hero-top">
          <div className="legal-icon-box privacy-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>

          <div className="legal-hero-info">
            <div className="legal-pill-row">
              <span className="legal-status-pill">Official Policy</span>
              <span className="legal-read-time">
                <ClockIcon size={14} className="meta-icon" /> 3 min read
              </span>
              <span className="legal-badge-pill">
                <ShieldIcon size={14} className="meta-icon" /> Local-First Architecture
              </span>
            </div>

            <h1 ref={headingRef} tabIndex={-1} className="legal-title">
              Privacy Policy
            </h1>

            <p className="legal-subtitle">
              Your privacy is our core foundation. We believe self-improvement tools must never compromise personal autonomy or trade your behavioral habits with advertisers.
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
                <strong>Storage:</strong> Sandboxed Hive
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Key Guarantees Grid */}
      <section className="legal-guarantees-grid" aria-label="Key privacy principles">
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <LockIcon size={24} />
          </span>
          <h3>Local-First Storage</h3>
          <p>Habits, notes, and records remain sandboxed on your device storage without mandatory cloud exposure.</p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <BanIcon size={24} />
          </span>
          <h3>Zero Tracking Ads</h3>
          <p>We do not monetize with advertising networks, third-party analytics trackers, or user profiling.</p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon">
            <TrashIcon size={24} />
          </span>
          <h3>1-Tap Complete Wipe</h3>
          <p>Delete Account & Data removes local database files, purges credentials, and cancels scheduled notifications.</p>
        </div>
      </section>

      {/* Quick Jump Table of Contents */}
      <section className="legal-toc-bar" aria-label="Table of Contents">
        <span className="legal-toc-label">Jump to Section:</span>
        <div className="legal-toc-scroll">
          {SECTIONS.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className="legal-toc-pill">
              {sec.title}
            </a>
          ))}
        </div>
      </section>

      {/* Policy Content Sections */}
      <div className="legal-content-grid">
        {SECTIONS.map((sec) => (
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
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
                  If you have questions, feedback, or data requests regarding our Privacy Policy or privacy rights, please contact our team directly at{' '}
                  <a href="mailto:streakocloud@gmail.com" className="legal-link">
                    streakocloud@gmail.com
                  </a>
                  . We respond to all verified inquiries promptly.
                </>
              ) : sec.id === 'data-deletion' ? (
                <>
                  You maintain absolute sovereignty over your data. You may delete individual habits at any time, or use the{' '}
                  <strong>"Delete Account &amp; Data"</strong> action located inside the Settings menu to permanently erase all local database files, cancel all scheduled notifications, and purge your cloud identity profile.
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
            <h4>Questions regarding your personal privacy?</h4>
            <p>Our team is available 24/7 to resolve data concerns or explain architectural boundaries.</p>
          </div>
          <div className="legal-footer-actions">
            <Link to="/" viewTransition className="btn btn-secondary btn-sm">
              Return to Streako
            </Link>
            <Link to="/terms" viewTransition className="btn btn-primary btn-sm">
              View Terms &amp; Conditions →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
