import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Ensure CNAME is copied to dist
const rootCname = path.join(rootDir, 'CNAME');
const publicCname = path.join(rootDir, 'public/CNAME');
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
  
  // Write route.html (e.g. dist/privacy.html)
  const singleFilePath = path.join(distDir, `${cleanPath}.html`);
  fs.writeFileSync(singleFilePath, htmlContent, 'utf-8');

  // Write route/index.html (e.g. dist/privacy/index.html)
  const dirPath = path.join(distDir, cleanPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf-8');
  console.log(`Generated route: /${cleanPath} (${singleFilePath} and ${path.join(dirPath, 'index.html')})`);
}

// Read full standalone HTML templates for guaranteed HTTP 200 and SEO/bot compliance
const privacyHtml = fs.existsSync(path.join(rootDir, 'privacy.html'))
  ? fs.readFileSync(path.join(rootDir, 'privacy.html'), 'utf-8')
  : baseIndexHtml;

const termsHtml = fs.existsSync(path.join(rootDir, 'terms.html'))
  ? fs.readFileSync(path.join(rootDir, 'terms.html'), 'utf-8')
  : baseIndexHtml;

const deleteAccountHtml = fs.existsSync(path.join(rootDir, 'delete-account.html'))
  ? fs.readFileSync(path.join(rootDir, 'delete-account.html'), 'utf-8')
  : baseIndexHtml;

// Write static routes
writeRoute('delete-account', deleteAccountHtml);
writeRoute('data-deletion', deleteAccountHtml);
writeRoute('account-deletion', deleteAccountHtml);
writeRoute('delete-data', deleteAccountHtml);

writeRoute('privacy', privacyHtml);
writeRoute('privacy-policy', privacyHtml);

writeRoute('terms', termsHtml);
writeRoute('terms-and-conditions', termsHtml);

console.log('Static route generation completed successfully.');
