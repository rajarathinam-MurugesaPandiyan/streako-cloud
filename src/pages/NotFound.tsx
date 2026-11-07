import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CompassIcon } from '../components/Icons';

export function NotFound() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    document.title = '404 - Page Not Found — Streako';
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <CompassIcon size={52} />
        </div>
        <span className="not-found-badge">Error 404</span>
        <h1 ref={headingRef} tabIndex={-1} className="not-found-title">
          Page Off The Streak Track
        </h1>
        <p className="not-found-desc">
          The habit or page you are looking for does not exist or has been relocated. Let’s get you back on course.
        </p>

        <div className="not-found-actions">
          <Link to="/" viewTransition className="btn btn-primary btn-md">
            Return to Home
          </Link>
          <Link to="/privacy" viewTransition className="btn btn-secondary btn-md">
            Privacy Policy
          </Link>
          <Link to="/terms" viewTransition className="btn btn-ghost btn-md">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

