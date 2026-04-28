import React from 'react';
import { auth, googleProvider } from '../services/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { translations } from '../utils/languageData';

const Auth = ({ language, onLoginSuccess }) => {
  const t = translations[language].auth;

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in popup closed. Please try again.');
      } else if (error.code === 'auth/cancelled-by-user') {
        alert('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Pop-up blocked by browser. Please allow pop-ups for this site.');
      } else {
        alert('Sign-in failed: ' + error.message);
      }
    }
  };

  return (
    <div className="auth-container slide-in">
      <div className="auth-card glassmorphism">
        <div className="auth-brand">
          <div className="brand-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#39FF14"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.8 7.9A7 7 0 0 1 11 20Z"></path>
            </svg>
          </div>
          <h1 className="brand-name neon-text">AgroPulse AI</h1>
        </div>

        <h2 className="auth-subtitle">{t.login}</h2>
        <p className="auth-description">
          Experience the future of farming with AI-driven insights.
        </p>

        <button className="google-btn" onClick={handleGoogleSignIn} aria-label={t.googleSignIn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="google-icon"
          />
          <span>{t.googleSignIn}</span>
        </button>

        <div className="auth-footer">
          <p>Secure authentication powered by Google</p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #000;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(57, 255, 20, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(27, 94, 32, 0.1) 0%, transparent 40%);
          padding: 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 48px 32px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
          text-align: center;
        }
        .auth-brand {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          padding: 12px;
          background: rgba(57, 255, 20, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(57, 255, 20, 0.2);
        }
        .brand-name {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -2px;
          margin: 0;
        }
        .auth-subtitle {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .auth-description {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 40px;
          line-height: 1.5;
        }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 12px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .google-btn:hover {
          transform: translateY(-4px);
          background: #f8f8f8;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.2),
            0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }
        .google-btn:active {
          transform: translateY(-1px);
        }
        .google-icon {
          width: 24px;
          height: 24px;
        }
        .auth-footer {
          margin-top: 40px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .neon-text {
          text-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
          color: #39ff14;
        }
        .slide-in {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;
