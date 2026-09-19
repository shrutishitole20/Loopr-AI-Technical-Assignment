import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { DEMO_USER } from './constants';
import { AuthFeaturesHero } from './components/AuthFeaturesHero';
import { DemoCredentialsBanner } from './components/DemoCredentialsBanner';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';

export const LoginPage: React.FC = () => {
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In States
  const [signInEmail, setSignInEmail] = useState<string>(DEMO_USER.email);
  const [signInPassword, setSignInPassword] = useState<string>(DEMO_USER.password);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sign Up States
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string>(DEMO_USER.role);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = signUpPassword;
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#e11d48', percent: '33%' };
    if (score <= 4) return { score: 2, label: 'Good', color: '#d97706', percent: '66%' };
    return { score: 3, label: 'Strong', color: '#059669', percent: '100%' };
  }, [signUpPassword]);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword) {
      showError('Please enter both email and password.');
      return;
    }
    const ok = await login(signInEmail.trim(), signInPassword);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      showError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      showError('Please enter a valid work email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      showError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      showError('Please accept Loopr AI Terms of Service & Security Policy.');
      return;
    }

    const ok = await register(signUpName.trim(), signUpEmail.trim(), signUpPassword, role);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  // Quick Demo Auto-Fill
  const fillDemoCredentials = () => {
    setSignInEmail(DEMO_USER.email);
    setSignInPassword(DEMO_USER.password);
    showSuccess(`Demo credentials auto-filled: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% -10%, #e0e7ff 0%, #f8faff 50%, #edf2fb 100%)',
        color: '#0a0d1d'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(60, 79, 201, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }}
      />

      {/* Main Container Card */}
      <div
        style={{
          display: 'flex',
          maxWidth: '1060px',
          width: '100%',
          minHeight: '630px',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f4',
          boxShadow: '0 20px 50px -12px rgba(60, 79, 201, 0.12), 0 0 0 1px rgba(60, 79, 201, 0.04)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left Side: Loopr AI Brand & Intelligence Showcase */}
        <AuthFeaturesHero />

        {/* Right Side: Sign In / Sign Up Form */}
        <div
          style={{
            flex: '1 1 54%',
            padding: '2.75rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Header Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f4fd',
              padding: '0.35rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f4',
              marginBottom: '1.75rem',
              position: 'relative'
            }}
          >
            <button
              id="tab-sign-in"
              type="button"
              onClick={() => setMode('signin')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '9px',
                border: 'none',
                background: mode === 'signin' ? 'linear-gradient(135deg, #3c4fc9 0%, #303fa0 100%)' : 'transparent',
                color: mode === 'signin' ? '#ffffff' : '#4a5568',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: mode === 'signin' ? '0 4px 12px rgba(60, 79, 201, 0.25)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              id="tab-sign-up"
              type="button"
              onClick={() => setMode('signup')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '9px',
                border: 'none',
                background: mode === 'signup' ? 'linear-gradient(135deg, #3c4fc9 0%, #303fa0 100%)' : 'transparent',
                color: mode === 'signup' ? '#ffffff' : '#4a5568',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: mode === 'signup' ? '0 4px 12px rgba(60, 79, 201, 0.25)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form Content */}
          {mode === 'signin' ? (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem', color: '#0a0d1d', letterSpacing: '-0.02em' }}>
                  Welcome to Loopr AI
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Sign in with your enterprise credentials to access real-time financial intelligence
                </p>
              </div>

              <DemoCredentialsBanner
                onAutoFill={fillDemoCredentials}
                email={DEMO_USER.email}
                role={DEMO_USER.role}
              />

              <SignInForm
                email={signInEmail}
                setEmail={setSignInEmail}
                password={signInPassword}
                setPassword={setSignInPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onSubmit={handleSignIn}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <SignUpForm
                name={signUpName}
                setName={setSignUpName}
                email={signUpEmail}
                setEmail={setSignUpEmail}
                password={signUpPassword}
                setPassword={setSignUpPassword}
                confirmPassword={signUpConfirmPassword}
                setConfirmPassword={setSignUpConfirmPassword}
                role={role}
                setRole={setRole}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                passwordStrength={passwordStrength}
                onSubmit={handleSignUp}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
