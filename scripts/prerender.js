import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Ensure public CNAME is in dist
const rootCname = path.resolve(__dirname, '../CNAME');
const publicCname = path.resolve(__dirname, '../public/CNAME');
const distCname = path.join(distDir, 'CNAME');

if (fs.existsSync(publicCname)) {
  fs.copyFileSync(publicCname, distCname);
} else if (fs.existsSync(rootCname)) {
  fs.copyFileSync(rootCname, distCname);
}

// 1. Generate 404.html for SPA fallback
fs.writeFileSync(path.join(distDir, '404.html'), baseIndexHtml, 'utf-8');

// Helper to write both route.html and route/index.html
function writeRoute(routePath, htmlContent) {
  const cleanPath = routePath.replace(/^\//, '').replace(/\/$/, '');
  
  // Write route.html (e.g. dist/delete-account.html)
  const singleFilePath = path.join(distDir, `${cleanPath}.html`);
  fs.writeFileSync(singleFilePath, htmlContent, 'utf-8');

  // Write route/index.html (e.g. dist/delete-account/index.html)
  const dirPath = path.join(distDir, cleanPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf-8');
  console.log(`Generated route: /${cleanPath} (${singleFilePath} and ${path.join(dirPath, 'index.html')})`);
}

// Pre-render Delete Account semantic HTML for Google Play crawler / bots
const deleteAccountPrerender = `
  <div class="legal-page-container">
    <nav class="legal-nav-bar" aria-label="Breadcrumb">
      <div class="legal-nav-left">
        <a href="/" class="legal-back-btn">Back to Home</a>
        <span class="legal-breadcrumb-sep">/</span>
        <div class="legal-doc-switcher">
          <a href="/privacy" class="legal-tab-pill">Privacy Policy</a>
          <a href="/terms" class="legal-tab-pill">Terms of Service</a>
          <a href="/delete-account" class="legal-tab-pill active">Delete Account</a>
        </div>
      </div>
      <div class="legal-brand-badge">
        <img src="/assets/streako.png" alt="Streako Logo" width="24" height="24" />
        <span>Streako Legal</span>
      </div>
    </nav>

    <header class="legal-hero-card delete-accent">
      <div class="legal-hero-top">
        <div class="legal-hero-info">
          <div class="legal-pill-row">
            <span class="legal-status-pill delete-pill">Account &amp; Data Deletion Policy</span>
            <span class="legal-badge-pill">Google Play Compliant</span>
          </div>
          <h1 class="legal-title">Delete Streako Account &amp; Data</h1>
          <p class="legal-subtitle">
            Official account and data deletion instructions for <strong>Streako</strong> (Google Play Package ID: <code>com.ethicsofcoding.streako</code>) by <strong>Ethics of Coding</strong>.
          </p>
          <div class="legal-meta-row">
            <span class="legal-meta-item"><strong>Application:</strong> Streako</span>
            <span class="legal-meta-dot">•</span>
            <span class="legal-meta-item"><strong>Developer:</strong> Ethics of Coding</span>
            <span class="legal-meta-dot">•</span>
            <span class="legal-meta-item"><strong>Package ID:</strong> <code>com.ethicsofcoding.streako</code></span>
            <span class="legal-meta-dot">•</span>
            <span class="legal-meta-item"><strong>Contact Email:</strong> <a href="mailto:streakocloud@gmail.com" class="legal-meta-link">streakocloud@gmail.com</a></span>
            <span class="legal-meta-dot">•</span>
            <span class="legal-meta-item"><strong>Data Retention Period:</strong> 0 Days (Immediate Local Wipe / 48h Cloud SSO Purge)</span>
          </div>
        </div>
      </div>
    </header>

    <section class="legal-section-card" id="in-app-steps" style="margin-top: 1.5rem;">
      <h2 class="legal-sec-title">1. Steps to Request In-App Account Deletion (Recommended)</h2>
      <p>Users can permanently delete their Streako account and all associated habit tracking data directly inside the mobile app at any time:</p>
      <ol class="deletion-steps-list" style="margin-top: 1rem;">
        <li class="deletion-step-item">
          <span class="deletion-step-num">1</span>
          <div><strong>Open Streako:</strong> Launch the Streako habit tracker app on your mobile device.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">2</span>
          <div><strong>Access Settings:</strong> Tap the Settings gear icon located in the upper header.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">3</span>
          <div><strong>Locate Danger Zone:</strong> Scroll down to the bottom of the Settings view to the Danger Zone section.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">4</span>
          <div><strong>Tap "Delete Account":</strong> Tap the red "Delete Account &amp; Data" action button.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">5</span>
          <div><strong>Confirm Deletion:</strong> Tap "Delete Everything" on the confirmation prompt. Your local database is erased instantly, scheduled alarms are cancelled, and your session is destroyed.</div>
        </li>
      </ol>
    </section>

    <section class="legal-section-card" id="manual-request" style="margin-top: 1.5rem;">
      <h2 class="legal-sec-title">2. Steps to Request Account Deletion Without the App (Web / Email Request)</h2>
      <p>If you have uninstalled Streako or no longer have physical access to your device, you can request account deletion by emailing our support desk:</p>
      <ol class="deletion-steps-list" style="margin-top: 1rem;">
        <li class="deletion-step-item">
          <span class="deletion-step-num">1</span>
          <div><strong>Recipient:</strong> Send an email to <code>streakocloud@gmail.com</code>.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">2</span>
          <div><strong>Subject Line:</strong> <code>Streako Account &amp; Data Deletion Request (com.ethicsofcoding.streako)</code></div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">3</span>
          <div><strong>Details:</strong> Specify the Google account email address associated with your Streako login.</div>
        </li>
        <li class="deletion-step-item">
          <span class="deletion-step-num">4</span>
          <div><strong>Processing Time:</strong> Our security team will verify your identity, delete your Firebase authentication credentials, and confirm the deletion within 48 to 72 hours.</div>
        </li>
      </ol>
      <div style="margin-top: 1rem;">
        <a href="mailto:streakocloud@gmail.com?subject=Streako%20Account%20and%20Data%20Deletion%20Request&body=Please%20delete%20my%20Streako%20account%20and%20all%20associated%20data.%0A%0AApp%3A%20Streako%20(com.ethicsofcoding.streako)%0ADeveloper%3A%20Ethics%20of%20Coding%0ARegistered%20Google%20Email%3A%20" class="deletion-action-btn">
          Launch Email Deletion Request (streakocloud@gmail.com)
        </a>
      </div>
    </section>

    <section class="legal-section-card" id="data-categories" style="margin-top: 1.5rem;">
      <h2 class="legal-sec-title">3. Types of Data Deleted vs. Data Kept</h2>
      <p>Streako complies strictly with Google Play Data Safety policies:</p>
      <div style="margin-top: 1rem;">
        <h3 style="font-size: 1rem; color: #fa5252;">Types of Data That Are Permanently Deleted:</h3>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem 0; line-height: 1.7;">
          <li><strong>User Profile &amp; Identity:</strong> Google Single Sign-On UID, email address, display name, and avatar URL stored in Firebase Authentication.</li>
          <li><strong>Habit Definitions &amp; Schedules:</strong> All custom habit titles, descriptions, frequency targets, and time intervals stored in local Hive storage.</li>
          <li><strong>Streak &amp; Completion History:</strong> Historical completion timestamps, check-in logs, current streaks, best streak counters, and milestone awards.</li>
          <li><strong>Notification Permissions &amp; Alarms:</strong> All scheduled AlarmKit exact alarms and OS notification channels are permanently deregistered.</li>
          <li><strong>Cached Preferences:</strong> Light/dark theme toggles, audio playback settings, and local device configuration tokens.</li>
        </ul>

        <h3 style="font-size: 1rem; color: #10B981;">Types of Data That Are Kept:</h3>
        <p style="margin: 0.5rem 0 1rem 0;"><strong>NONE.</strong> Streako retains zero personal data, habit entries, or identifier logs once your account is deleted.</p>

        <h3 style="font-size: 1rem; color: #3B82F6;">Additional Retention Period:</h3>
        <p style="margin: 0.5rem 0 0 0;"><strong>Zero Days.</strong> In-app deletion executes immediately. Manual email requests are completely processed and purged within 48 to 72 business hours. No backup retention queues or archive silos exist.</p>
      </div>
    </section>
  </div>
`;

// Build delete-account HTML
let deleteAccountHtml = baseIndexHtml.replace(
  '<title>Streako — Tap • Track • Triumph | The Habit Tracker That Sticks</title>',
  '<title>Delete Account &amp; Data — Streako Habit Tracker | Ethics of Coding</title>'
);

deleteAccountHtml = deleteAccountHtml.replace(
  '<div id="root"></div>',
  `<div id="root">${deleteAccountPrerender}</div>`
);

writeRoute('delete-account', deleteAccountHtml);
writeRoute('data-deletion', deleteAccountHtml);
writeRoute('account-deletion', deleteAccountHtml);
writeRoute('privacy', baseIndexHtml);
writeRoute('terms', baseIndexHtml);

console.log('Static route generation completed successfully.');
