import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ClockIcon,
  TrashIcon,
  SmartphoneIcon,
  KeyIcon,
  CheckCircleIcon,
  MailIcon,
  ExternalLinkIcon,
} from '../components/Icons';

interface Section {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    id: 'in-app-steps',
    title: '1. In-App Automated Deletion (Recommended)',
    summary: 'Direct self-service inside mobile Settings with automated instant wipe.',
    content:
      'The quickest and most secure way to delete your Streako account is directly within the mobile application. Navigating to Settings and tapping "Delete Account" automatically triggers an immediate, irreversible wipe of your local storage and purges your Single Sign-On (SSO) credentials.',
  },
  {
    id: 'sso-and-storage',
    title: '2. SSO Login & Local-First Storage Architecture',
    summary: 'Google SSO authentication with 100% local device database.',
    content:
      'Streako is built with privacy-by-design. We do not maintain passwords or personal routine databases on cloud servers. We use only Google Single Sign-On (SSO) powered by Firebase Authentication for identity. All habit definitions, frequency schedules, streak counters, and completion logs live exclusively inside sandboxed local Hive storage on your mobile device.',
  },
  {
    id: 'what-gets-deleted',
    title: '3. What Gets Deleted vs. What Is Retained',
    summary: 'Immediate wipe of all personal routines, zero cloud habit data retention.',
    content:
      'When you click "Delete Account", your local Hive database is permanently deleted, all scheduled exact alarms are unregistered from the OS, and your Firebase SSO user record is deleted immediately. Streako retains zero habit data on cloud servers.',
  },
  {
    id: 'manual-request',
    title: '4. Manual Deletion Request (Web / Email)',
    summary: 'For users who uninstalled the app or no longer have device access.',
    content:
      'If you have already uninstalled Streako or lost access to your mobile device, you can submit a manual account deletion request by emailing streakocloud@gmail.com from your registered Google SSO address.',
  },
  {
    id: 'google-revoke',
    title: '5. Revoking Google Account Permissions',
    summary: 'Sever third-party OAuth access directly from your Google security dashboard.',
    content:
      'In addition to in-app deletion, you can revoke Streako’s OAuth permissions directly in your Google Account dashboard at any time.',
  },
  {
    id: 'faq',
    title: '6. Frequently Asked Questions',
    summary: 'Common questions about data permanence, backups, and app uninstallation.',
    content:
      'Detailed answers to help you understand what happens to your habits, streaks, and account credentials when you delete your account.',
  },
];

export function DeleteAccount() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    document.title = 'Delete Account & Data — Streako Habit Tracker';

    // Route focus to the newly revealed heading for screen reader accessibility
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, []);

  const copySectionLink = async (sectionId: string) => {
    const url = `${window.location.origin}/delete-account#${sectionId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSectionId(sectionId);
      setTimeout(() => setCopiedSectionId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const copyEmailTemplate = async () => {
    const template = `To: streakocloud@gmail.com\nSubject: [Streako Account Deletion Request] - com.ethicsofcoding.streako\n\nHello Streako Support Team,\n\nI request the permanent deletion of my Streako account and associated Firebase SSO profile. Please purge all records linked to this email address.\n\nRegistered Google SSO Email: [Your Email Address Here]\nDate: ${new Date().toISOString().split('T')[0]}`;
    try {
      await navigator.clipboard.writeText(template);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
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

          {/* Quick Document Switcher Tabs (3 Documents) */}
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
              aria-selected="false"
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/delete-account"
              viewTransition
              className={({ isActive }) => `legal-tab-pill ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected="true"
            >
              Delete Account
            </NavLink>
          </div>
        </div>

        <div className="legal-brand-badge" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}assets/streako.png`} alt="" width="24" height="24" />
          <span>Streako Legal</span>
        </div>
      </nav>

      {/* Hero Banner Card */}
      <header className="legal-hero-card delete-accent">
        <div className="legal-hero-top">
          <div className="legal-icon-box delete-icon">
            <TrashIcon size={32} />
          </div>

          <div className="legal-hero-info">
            <div className="legal-pill-row">
              <span className="legal-status-pill delete-pill">Account &amp; Data Deletion</span>
              <span className="legal-read-time">
                <ClockIcon size={14} className="meta-icon" /> 2 min read
              </span>
              <span className="legal-badge-pill">
                <CheckCircleIcon size={14} className="meta-icon" /> 1-Tap Automated Purge
              </span>
            </div>

            <h1 ref={headingRef} tabIndex={-1} className="legal-title">
              Delete Streako Account &amp; Data
            </h1>

            <p className="legal-subtitle">
              We respect your right to be forgotten. In Streako, we rely only on Google Single Sign-On (SSO) login and store all your habit data locally on your mobile device. Clicking <strong>"Delete Account"</strong> in Settings automatically deletes your account details, purges local storage, and revokes your session immediately.
            </p>

            <div className="legal-meta-row">
              <span className="legal-meta-item">
                <strong>Application:</strong> Streako
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Developer:</strong> Ethics of Coding
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Package ID:</strong> <code>com.ethicsofcoding.streako</code>
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Contact Email:</strong>{' '}
                <a href="mailto:streakocloud@gmail.com" className="legal-meta-link">
                  streakocloud@gmail.com
                </a>
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Data Retention Period:</strong> 0 Days (Immediate Purge)
              </span>
              <span className="legal-meta-dot">•</span>
              <span className="legal-meta-item">
                <strong>Data Kept:</strong> None
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Key Guarantees Grid */}
      <section className="legal-guarantees-grid" aria-label="Key deletion guarantees">
        <div className="guarantee-card">
          <span className="guarantee-icon" style={{ color: '#fa5252' }}>
            <TrashIcon size={26} />
          </span>
          <h3>100% Automated Wipe</h3>
          <p>
            Tapping <strong>"Delete Account"</strong> in the app settings triggers immediate automated erasure with zero waiting periods.
          </p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon" style={{ color: 'var(--color-brand-accent)' }}>
            <SmartphoneIcon size={26} />
          </span>
          <h3>Local Storage Purge</h3>
          <p>
            All habit boxes, streak counters, reminder intervals, and custom schedules are completely wiped from your device.
          </p>
        </div>
        <div className="guarantee-card">
          <span className="guarantee-icon" style={{ color: 'var(--color-brand-blue)' }}>
            <KeyIcon size={26} />
          </span>
          <h3>SSO Profile Revocation</h3>
          <p>
            Your Google Single Sign-On identity token and Firebase Authentication profile are permanently deleted from our system.
          </p>
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

      {/* Main Content Sections */}
      <div className="legal-content-grid">
        {/* Section 1: In-App Automated Deletion */}
        <article id="in-app-steps" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#in-app-steps" className="legal-sec-anchor">
                  1. In-App Automated Deletion (Recommended)
                </a>
              </h2>
              <span className="legal-sec-summary">
                Direct self-service inside mobile Settings with automated instant wipe.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('in-app-steps')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 1"
              title="Copy link to this section"
            >
              {copiedSectionId === 'in-app-steps' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <p className="legal-sec-text">
            If you have the Streako app installed on your phone, you do not need to wait or email anyone. You can complete the deletion process directly in a few taps:
          </p>

          <div className="deletion-steps-container">
            <div className="deletion-step-card">
              <div className="step-badge">Step 1</div>
              <div className="step-body">
                <h4>Open Streako &amp; Go to Settings</h4>
                <p>Launch the Streako app on your mobile device and tap the <strong>Settings</strong> icon (gear icon) in the navigation bar.</p>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="step-badge">Step 2</div>
              <div className="step-body">
                <h4>Scroll to "Account &amp; Data"</h4>
                <p>Scroll down to the bottom of the Settings page to locate the <strong>Account &amp; Privacy / Danger Zone</strong> section.</p>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="step-badge">Step 3</div>
              <div className="step-body">
                <h4>Tap "Delete Account"</h4>
                <p>Tap the red <strong>"Delete Account"</strong> (or "Delete Account &amp; Data") button.</p>
              </div>
            </div>

            <div className="deletion-step-card step-highlight">
              <div className="step-badge">Step 4</div>
              <div className="step-body">
                <h4>Confirm Automated Wipe</h4>
                <p>
                  A confirmation prompt will appear informing you that this action is permanent and cannot be undone. Once you confirm, Streako will automatically:
                </p>
                <ul className="step-checklist">
                  <li>Permanently erase all local Hive database boxes (habits, history, streaks, and preferences).</li>
                  <li>Cancel and unregister all scheduled AlarmKit tones and exact alarm notifications with the operating system.</li>
                  <li>Call the Firebase Authentication service to permanently delete your SSO account record.</li>
                  <li>Destroy active session tokens and return you to a fresh first-launch state.</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Section 2: SSO Login & Local-First Storage Architecture */}
        <article id="sso-and-storage" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#sso-and-storage" className="legal-sec-anchor">
                  2. SSO Login &amp; Local-First Storage Architecture
                </a>
              </h2>
              <span className="legal-sec-summary">
                Google SSO authentication with 100% local device database.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('sso-and-storage')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 2"
              title="Copy link to this section"
            >
              {copiedSectionId === 'sso-and-storage' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <p className="legal-sec-text">
            Understanding Streako’s technical architecture makes account deletion transparent and straightforward:
          </p>

          <div className="architecture-cards-grid">
            <div className="arch-card">
              <div className="arch-icon"><KeyIcon size={22} /></div>
              <h4>SSO-Only Login</h4>
              <p>
                Streako offers authentication exclusively through <strong>Google Single Sign-On (SSO)</strong> via Firebase Authentication. Streako never asks for, manages, or stores passwords. We only receive your basic Google profile details (name, email address, profile picture URL, and a unique UID) to authenticate your session.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-icon"><SmartphoneIcon size={22} /></div>
              <h4>Local-First Storage (Hive)</h4>
              <p>
                Your personal routine data—including habit titles, tracking frequencies, occurrence timestamps, and streak milestones—is stored strictly in your phone’s local sandboxed memory using Hive. We do not sync your habit history to an external database server.
              </p>
            </div>
          </div>

          <p className="legal-sec-text" style={{ marginTop: '1rem' }}>
            Because your habit data lives locally on your device, when you execute the in-app delete action, the data is destroyed on the device itself. No remote database copies exist to linger or leak.
          </p>
        </article>

        {/* Section 3: What Gets Deleted vs. What Is Retained */}
        <article id="what-gets-deleted" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#what-gets-deleted" className="legal-sec-anchor">
                  3. What Gets Deleted vs. What Is Retained
                </a>
              </h2>
              <span className="legal-sec-summary">
                Immediate wipe of all personal routines, zero cloud habit data retention.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('what-gets-deleted')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 3"
              title="Copy link to this section"
            >
              {copiedSectionId === 'what-gets-deleted' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <p className="legal-sec-text">
            In compliance with Google Play Store and Apple App Store user data deletion policies, here is an explicit breakdown of all data types handled by Streako and what happens upon deletion:
          </p>

          <div className="data-table-wrapper">
            <table className="legal-data-table" aria-label="Data retention and deletion breakdown">
              <thead>
                <tr>
                  <th scope="col">Data Category</th>
                  <th scope="col">Storage Location</th>
                  <th scope="col">What Happens Upon Deletion</th>
                  <th scope="col">Retention Window</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Habits, Streaks &amp; Logs</strong>
                    <span className="table-subtext">Titles, completion marks, streak records</span>
                  </td>
                  <td>Local device memory (Hive Box)</td>
                  <td><span className="badge-deleted">Wiped Immediately</span></td>
                  <td>0 seconds (Immediate local destruction)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Scheduled Alarms &amp; Tones</strong>
                    <span className="table-subtext">AlarmKit sounds, exact alarm notifications</span>
                  </td>
                  <td>Local device OS Scheduler</td>
                  <td><span className="badge-deleted">Cancelled Immediately</span></td>
                  <td>0 seconds (Unregistered from OS)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Google SSO Account Profile</strong>
                    <span className="table-subtext">Email, display name, Firebase UID</span>
                  </td>
                  <td>Firebase Authentication</td>
                  <td><span className="badge-deleted">Permanently Purged</span></td>
                  <td>0 seconds (Deleted via Auth API)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Cloud Habit Backups</strong>
                    <span className="table-subtext">Remote server records</span>
                  </td>
                  <td>None</td>
                  <td><span className="badge-na">Not Applicable</span></td>
                  <td>Zero cloud storage retained (Local-First)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ephemeral Server Access Logs</strong>
                    <span className="table-subtext">Standard HTTP server connection IP &amp; time</span>
                  </td>
                  <td>Google Cloud / Firebase Edge Logs</td>
                  <td><span className="badge-retained">Temporary Security Logs</span></td>
                  <td>Up to 30 days (Automatically rotated &amp; purged for anti-abuse/DDoS protection)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Section 4: Manual Deletion Request (Web / Email) */}
        <article id="manual-request" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#manual-request" className="legal-sec-anchor">
                  4. Manual Deletion Request (Web / Email)
                </a>
              </h2>
              <span className="legal-sec-summary">
                For users who uninstalled the app or no longer have device access.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('manual-request')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 4"
              title="Copy link to this section"
            >
              {copiedSectionId === 'manual-request' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <p className="legal-sec-text">
            If you have uninstalled Streako, switched phones, or cannot access the in-app settings, you can submit a manual deletion request directly to our developer team. To protect account security, deletion requests must be sent from the same Google email address used to sign in to Streako.
          </p>

          <div className="manual-request-box">
            <div className="manual-request-header">
              <MailIcon size={24} color="#fa5252" />
              <div>
                <h4>Request Manual Account Deletion via Email</h4>
                <p>We process all verified manual deletion requests within <strong>48 to 72 hours</strong>.</p>
              </div>
            </div>

            <div className="manual-request-body">
              <p>
                Click below to launch your default email client with a pre-filled deletion request addressed to <code>streakocloud@gmail.com</code>:
              </p>

              <div className="manual-request-actions">
                <a
                  href={`mailto:streakocloud@gmail.com?subject=${encodeURIComponent(
                    '[Streako Account Deletion Request] - com.ethicsofcoding.streako'
                  )}&body=${encodeURIComponent(
                    'Hello Streako Support Team,\n\nI request the permanent deletion of my Streako account and associated Firebase SSO profile. Please purge all records linked to this email address.\n\nRegistered Google SSO Email: [Enter Your Google Email Here]\nPackage: com.ethicsofcoding.streako\nDate: ' +
                      new Date().toISOString().split('T')[0]
                  )}`}
                  className="btn btn-primary btn-sm"
                >
                  <MailIcon size={16} />
                  <span>Launch Pre-Filled Email</span>
                </a>

                <button
                  type="button"
                  onClick={copyEmailTemplate}
                  className="btn btn-secondary btn-sm"
                  title="Copy email template to clipboard"
                >
                  {copiedEmail ? 'Template Copied!' : 'Copy Email Template'}
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Section 5: Revoking Google Account Permissions */}
        <article id="google-revoke" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#google-revoke" className="legal-sec-anchor">
                  5. Revoking Google Account Permissions
                </a>
              </h2>
              <span className="legal-sec-summary">
                Sever third-party OAuth access directly from your Google security dashboard.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('google-revoke')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 5"
              title="Copy link to this section"
            >
              {copiedSectionId === 'google-revoke' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <p className="legal-sec-text">
            Because Streako authenticates via Google Single Sign-On, you can also manage and revoke Streako's authorization directly through your Google account security settings:
          </p>

          <ol className="google-revoke-list">
            <li>
              Visit your Google Account Third-Party Permissions portal at{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                myaccount.google.com/permissions <ExternalLinkIcon size={14} />
              </a>
              .
            </li>
            <li>Locate <strong>Streako</strong> (or <em>Ethics of Coding / com.ethicsofcoding.streako</em>) in your list of apps with account access.</li>
            <li>Select Streako and click <strong>"Remove Access"</strong> or <strong>"Delete all connections"</strong>.</li>
          </ol>

          <p className="legal-sec-text" style={{ marginTop: '0.75rem' }}>
            This immediately revokes Google’s authorization token, ensuring Streako cannot read your profile even if the app remains on your device.
          </p>
        </article>

        {/* Section 6: Frequently Asked Questions */}
        <article id="faq" className="legal-section-card">
          <div className="legal-sec-header">
            <div>
              <h2 className="legal-sec-title">
                <a href="#faq" className="legal-sec-anchor">
                  6. Frequently Asked Questions
                </a>
              </h2>
              <span className="legal-sec-summary">
                Common questions about data permanence, backups, and app uninstallation.
              </span>
            </div>

            <button
              type="button"
              onClick={() => copySectionLink('faq')}
              className="legal-copy-btn"
              aria-label="Copy link to Section 6"
              title="Copy link to this section"
            >
              {copiedSectionId === 'faq' ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <div className="deletion-faq-list">
            <div className="deletion-faq-item">
              <h4>Can I recover my habit streaks after deleting my account?</h4>
              <p>
                No. Because Streako operates on a local-first architecture and does not keep remote copies of your habits on our servers, account deletion is immediate, permanent, and completely irreversible.
              </p>
            </div>

            <div className="deletion-faq-item">
              <h4>What happens if I just uninstall the Streako app?</h4>
              <p>
                Uninstalling Streako will delete the app's local Hive database on your phone. However, your Firebase SSO authentication token may remain active in the cloud until you reinstall and tap <strong>"Delete Account"</strong> or email us at <code>streakocloud@gmail.com</code> for a manual purge.
              </p>
            </div>

            <div className="deletion-faq-item">
              <h4>Will my scheduled alarms and reminders continue to ring?</h4>
              <p>
                No. When you tap "Delete Account" in Settings, Streako automatically cancels and unregisters all AlarmKit and Android exact alarm channels before wiping the database.
              </p>
            </div>

            <div className="deletion-faq-item">
              <h4>Are there any fees or penalties for deleting my account?</h4>
              <p>
                Never. Streako is completely free to use and delete. You maintain full sovereignty over your routines and data at all times.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="legal-footer-bar">
        <div className="legal-footer-content">
          <div>
            <h4>Need assistance with account or data deletion?</h4>
            <p>Our team responds to all data erasure inquiries promptly at streakocloud@gmail.com.</p>
          </div>
          <div className="legal-footer-actions">
            <Link to="/" viewTransition className="btn btn-secondary btn-sm">
              Return to Streako
            </Link>
            <Link to="/privacy" viewTransition className="btn btn-secondary btn-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" viewTransition className="btn btn-primary btn-sm">
              Terms of Service →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DeleteAccount;

