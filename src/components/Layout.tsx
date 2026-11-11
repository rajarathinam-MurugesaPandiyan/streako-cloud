import { useState, useEffect, useRef, type PointerEvent } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate, ScrollRestoration } from 'react-router-dom';

type ThemeMode = 'system' | 'light' | 'dark';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  try {
    const savedTheme = localStorage.getItem('streako-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // Ignore storage access restrictions
  }
  return 'system';
};

const applyThemeToDocument = (nextTheme: ThemeMode) => {
  try {
    if (nextTheme === 'system') {
      localStorage.removeItem('streako-theme');
    } else {
      localStorage.setItem('streako-theme', nextTheme);
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', nextTheme === 'system' ? 'light dark' : nextTheme);
  }
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Theme state: 'system' | 'light' | 'dark', tracking rendered scheme
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileDialogRef = useRef<HTMLDialogElement | null>(null);
  const pointerDownOnBackdropRef = useRef(false);

  const isDarkRendered = theme === 'dark' || (theme === 'system' && systemIsDark);

  const routeAnnouncement = (() => {
    if (location.pathname === '/privacy') return 'Navigated to Privacy Policy page';
    if (location.pathname === '/terms') return 'Navigated to Terms and Conditions page';
    if (location.pathname === '/delete-account') return 'Navigated to Delete Account and Data page';
    if (location.pathname === '/') return 'Navigated to Streako Home page';
    return 'Page loaded';
  })();

  // Synchronize Theme meta tag, OS preference changes, and cross-tab storage updates
  useEffect(() => {
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', theme === 'system' ? 'light dark' : theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemIsDark(event.matches);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'streako-theme') return;
      const syncedTheme: ThemeMode =
        event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system';
      setTheme(syncedTheme);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Synchronize native top-layer mobile navigation dialog state
  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;

    dialog.setAttribute('closedby', 'any');

    if (mobileMenuOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [mobileMenuOpen]);

  // Handle Legacy Hash URLs (#privacy, #terms, #delete-account) and smooth scrolling for #anchors
  useEffect(() => {
    const hash = location.hash;

    // Backward compatibility for legacy hash URLs
    if (hash === '#privacy') {
      navigate('/privacy', { replace: true, viewTransition: true });
      return;
    }
    if (hash === '#terms') {
      navigate('/terms', { replace: true, viewTransition: true });
      return;
    }
    if (hash === '#delete-account' || hash === '#delete') {
      navigate('/delete-account', { replace: true, viewTransition: true });
      return;
    }

    const scrollBehavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    // Scroll to section when hash is present
    if (hash && hash !== '#top') {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: scrollBehavior });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else if (!hash) {
      // Scroll to top on page navigation without hash
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }, [location.pathname, location.hash, navigate]);

  // 2-state opposite-of-rendered theme toggle; returns cleanly to 'system' when matching OS
  const toggleTheme = () => {
    const nextRenderedDark = !isDarkRendered;
    const nextTheme: ThemeMode =
      nextRenderedDark === systemIsDark ? 'system' : nextRenderedDark ? 'dark' : 'light';

    setTheme(nextTheme);
    applyThemeToDocument(nextTheme);
  };

  const isHome = location.pathname === '/';

  // Smooth scroll handler for anchor links
  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    const scrollBehavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    if (isHome) {
      if (anchor === '#top') {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      } else {
        const id = anchor.replace('#', '');
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: scrollBehavior });
        }
      }
    }
  };

  const handleMobileDialogPointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    if ('closedBy' in HTMLDialogElement.prototype) return;
    const dialog = mobileDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    pointerDownOnBackdropRef.current = !inside;
  };

  const handleMobileDialogPointerUp = (e: PointerEvent<HTMLDialogElement>) => {
    if ('closedBy' in HTMLDialogElement.prototype || !pointerDownOnBackdropRef.current) return;
    pointerDownOnBackdropRef.current = false;
    const dialog = mobileDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="streako-app-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Native React Router 7 Scroll Restoration */}
      <ScrollRestoration />

      {/* Accessible Route Change Announcement for Screen Readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {routeAnnouncement}
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <header className="site-header" id="top">
        <div className="header-container">
          <Link
            to="/"
            viewTransition
            onClick={() => handleNavClick('#top')}
            className="brand-logo"
            aria-label="Streako Home"
          >
            <img src={`${import.meta.env.BASE_URL}assets/streako.png`} alt="Streako Logo" className="logo-image" width="38" height="38" />
            <span className="logo-text">Streako</span>
            <span className="logo-badge">v1.0</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                {isHome ? (
                  <a href="#features" onClick={() => handleNavClick('#features')} className="nav-link">
                    Features
                  </a>
                ) : (
                  <Link to="/#features" viewTransition className="nav-link">
                    Features
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#interactive-demo" onClick={() => handleNavClick('#interactive-demo')} className="nav-link">
                    Live Demo
                  </a>
                ) : (
                  <Link to="/#interactive-demo" viewTransition className="nav-link">
                    Live Demo
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#soundscapes" onClick={() => handleNavClick('#soundscapes')} className="nav-link">
                    Soundscapes
                  </a>
                ) : (
                  <Link to="/#soundscapes" viewTransition className="nav-link">
                    Soundscapes
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#awards" onClick={() => handleNavClick('#awards')} className="nav-link">
                    Awards
                  </a>
                ) : (
                  <Link to="/#awards" viewTransition className="nav-link">
                    Awards
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#science" onClick={() => handleNavClick('#science')} className="nav-link">
                    Habit Science
                  </a>
                ) : (
                  <Link to="/#science" viewTransition className="nav-link">
                    Habit Science
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#faq" onClick={() => handleNavClick('#faq')} className="nav-link">
                    FAQ
                  </a>
                ) : (
                  <Link to="/#faq" viewTransition className="nav-link">
                    FAQ
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              type="button"
              aria-label={isDarkRendered ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDarkRendered ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDarkRendered ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {isHome ? (
              <a href="#download" onClick={() => handleNavClick('#download')} className="btn btn-primary btn-sm cta-header-btn">
                <span>Get Streako</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            ) : (
              <Link to="/#download" viewTransition className="btn btn-primary btn-sm cta-header-btn">
                <span>Get Streako</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="mobile-menu-btn"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-dialog"
              aria-label="Open navigation menu"
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>

        {/* Native Top-Layer Mobile Navigation Drawer */}
        <dialog
          id="mobile-nav-dialog"
          ref={mobileDialogRef}
          className="mobile-nav-dialog"
          aria-labelledby="mobile-nav-title"
          onClose={() => setMobileMenuOpen(false)}
          onPointerDown={handleMobileDialogPointerDown}
          onPointerUp={handleMobileDialogPointerUp}
        >
          <div className="mobile-nav-header">
            <span id="mobile-nav-title" className="logo-text">
              Streako Menu
            </span>
            <button
              type="button"
              className="mobile-nav-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              &times;
            </button>
          </div>
          <nav aria-label="Mobile Navigation">
            <ul className="mobile-nav-links">
              <li>
                {isHome ? (
                  <a href="#features" onClick={() => handleNavClick('#features')} className="mobile-nav-link">
                    Features
                  </a>
                ) : (
                  <Link to="/#features" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    Features
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#interactive-demo" onClick={() => handleNavClick('#interactive-demo')} className="mobile-nav-link">
                    Live Demo
                  </a>
                ) : (
                  <Link to="/#interactive-demo" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    Live Demo
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#soundscapes" onClick={() => handleNavClick('#soundscapes')} className="mobile-nav-link">
                    Soundscapes
                  </a>
                ) : (
                  <Link to="/#soundscapes" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    Soundscapes
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#awards" onClick={() => handleNavClick('#awards')} className="mobile-nav-link">
                    Awards
                  </a>
                ) : (
                  <Link to="/#awards" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    Awards
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#science" onClick={() => handleNavClick('#science')} className="mobile-nav-link">
                    Habit Science
                  </a>
                ) : (
                  <Link to="/#science" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    Habit Science
                  </Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#faq" onClick={() => handleNavClick('#faq')} className="mobile-nav-link">
                    FAQ
                  </a>
                ) : (
                  <Link to="/#faq" viewTransition onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                    FAQ
                  </Link>
                )}
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  viewTransition
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  viewTransition
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/delete-account"
                  viewTransition
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  Delete Account
                </NavLink>
              </li>
            </ul>
          </nav>
          {isHome ? (
            <a href="#download" onClick={() => handleNavClick('#download')} className="btn btn-primary btn-block">
              Get Streako
            </a>
          ) : (
            <Link to="/#download" viewTransition onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
              Get Streako
            </Link>
          )}
        </dialog>
      </header>

      {/* PAGE VIEW OUTLET */}
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <Link
              to="/"
              viewTransition
              onClick={() => handleNavClick('#top')}
              className="brand-logo footer-logo"
            >
              <img src={`${import.meta.env.BASE_URL}assets/streako.png`} alt="Streako Logo" width="32" height="32" />
              <span className="logo-text">Streako</span>
            </Link>
            <p className="footer-tagline">
              Tap &bull; Track &bull; Triumph.
            </p>
            <p className="footer-desc">
              The minimalist audio-first habit tracker engineered around loss aversion and circadian daytime rhythms.
            </p>
            <div className="footer-badges">
              <span className="footer-chip">v1.0.0</span>
              <span className="footer-chip">Android &bull; iOS Soon</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <h2 className="footer-col-title">Product</h2>
            <ul className="footer-links">
              <li>
                {isHome ? (
                  <a href="#features" onClick={() => handleNavClick('#features')}>Features</a>
                ) : (
                  <Link to="/#features" viewTransition>Features</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#interactive-demo" onClick={() => handleNavClick('#interactive-demo')}>Live Simulator</a>
                ) : (
                  <Link to="/#interactive-demo" viewTransition>Live Simulator</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#soundscapes" onClick={() => handleNavClick('#soundscapes')}>AlarmKit Sounds</a>
                ) : (
                  <Link to="/#soundscapes" viewTransition>AlarmKit Sounds</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#awards" onClick={() => handleNavClick('#awards')}>Streak Awards</a>
                ) : (
                  <Link to="/#awards" viewTransition>Streak Awards</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#science" onClick={() => handleNavClick('#science')}>Habit Science</a>
                ) : (
                  <Link to="/#science" viewTransition>Habit Science</Link>
                )}
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h2 className="footer-col-title">Resources</h2>
            <ul className="footer-links">
              <li>
                {isHome ? (
                  <a href="#faq" onClick={() => handleNavClick('#faq')}>FAQ & Support</a>
                ) : (
                  <Link to="/#faq" viewTransition>FAQ & Support</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#download" onClick={() => handleNavClick('#download')}>App Downloads</a>
                ) : (
                  <Link to="/#download" viewTransition>App Downloads</Link>
                )}
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.ethicsofcoding.streako"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Android (Google Play)
                </a>
              </li>
              <li>
                <a href="https://github.com/rajarathinam-MurugesaPandiyan/streako" target="_blank" rel="noopener noreferrer">
                  GitHub Repo
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h2 className="footer-col-title">Legal & Trust</h2>
            <ul className="footer-links">
              <li>
                <NavLink
                  to="/privacy"
                  viewTransition
                  className={({ isActive }) => `footer-legal-link ${isActive ? 'active-legal' : ''}`}
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  viewTransition
                  className={({ isActive }) => `footer-legal-link ${isActive ? 'active-legal' : ''}`}
                >
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/delete-account"
                  viewTransition
                  className={({ isActive }) => `footer-legal-link ${isActive ? 'active-legal' : ''}`}
                >
                  Delete Account
                </NavLink>
              </li>
              <li><span className="badge-offline">Local-First Storage</span></li>
              <li><span className="badge-offline">Zero Tracking Ads</span></li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Streako. Built with privacy-first principles. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" viewTransition>Privacy</Link>
            <span>•</span>
            <Link to="/terms" viewTransition>Terms</Link>
            <span>•</span>
            <Link to="/delete-account" viewTransition>Delete Account</Link>
            <span>•</span>
            <a href="mailto:streakocloud@gmail.com">Security Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

