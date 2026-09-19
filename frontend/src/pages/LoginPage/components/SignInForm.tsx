import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  onSubmit,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form onSubmit={onSubmit}>
      {/* Email Input */}
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
          Work Email Address
        </label>
        <div style={{ position: 'relative' }}>
          <Mail size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            id="signin-email-input"
            type="email"
            required
            className="input-control"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1' }}
          />
        </div>
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Password</label>
          <span style={{ fontSize: '0.75rem', color: '#3c4fc9', fontWeight: 600, cursor: 'pointer' }}>
            Forgot password?
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            id="signin-password-input"
            type={showPassword ? 'text' : 'password'}
            required
            className="input-control"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Remember me & submit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ accentColor: '#3c4fc9', cursor: 'pointer' }}
          />
          Remember my session for 7 days
        </label>
      </div>

      <button
        id="btn-sign-in-submit"
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.85rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #3c4fc9 0%, #2f3e9e 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(60, 79, 201, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <span>{isLoading ? 'Authorizing Session...' : 'Sign In to Workspace'}</span>
        <ArrowRight size={17} />
      </button>
    </form>
  );
};
