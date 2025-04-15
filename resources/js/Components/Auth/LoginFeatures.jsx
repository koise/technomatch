export default function LoginFeatures() {
    return (
      <div className="login-graphics">
        <div className="login-features">
          <div className="login-feature">
            <div className="feature-icon">
              {/* Lock Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M12 16v-4" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <div className="feature-text">
              <h3>Secure Authentication</h3>
              <p>Industry-standard encryption keeps your data protected</p>
            </div>
          </div>
  
          <div className="login-feature">
            <div className="feature-icon">
              {/* Brain/AI Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <path d="M9 9a3 3 0 0 0-6 0c0 2 2 3 2 3s-2 1-2 3a3 3 0 0 0 6 0m6-6a3 3 0 0 1 6 0c0 2-2 3-2 3s2 1 2 3a3 3 0 0 1-6 0" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            </div>
            <div className="feature-text">
              <h3>Advanced Matching</h3>
              <p>Our algorithm finds the perfect tech fit for your needs</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  