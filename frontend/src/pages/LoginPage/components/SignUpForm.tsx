import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight } from 'lucide-react';
import { ANALYST_ROLES } from '../constants';

interface SignUpFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirm: string) => void;
  role: string;
  setRole: (role: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (agree: boolean) => void;
  passwordStrength: { score: number; label: string; color: string; percent?: string };
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  agreeTerms,
  setAgreeTerms,
  passwordStrength,
  onSubmit,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <form onSubmit={onSubmit}>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0a0d1d' }}>
          Create Analyst Account
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Get instant access to financial reporting & team transaction audits
        </p>
      </div>

      {/* Name Input */}
      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
          Full Name
        </label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            required
            className="input-control"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
          Work Email
        </label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="email"
            required
            className="input-control"
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Role Selector */}
      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
          Organization Role
        </label>
        <div style={{ position: 'relative' }}>
          <Briefcase size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <select
            className="input-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1', fontSize: '0.88rem' }}
          >
            {ANALYST_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Password & Confirm */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.6rem' }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '2.2rem', paddingRight: '2.2rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1', fontSize: '0.85rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
            Confirm
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              className="input-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ paddingLeft: '2.2rem', paddingRight: '2.2rem', backgroundColor: '#ffffff', color: '#0a0d1d', borderColor: '#cbd5e1', fontSize: '0.85rem' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div style={{ marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#64748b' }}>Security Strength:</span>
            <span style={{ color: passwordStrength.color, fontWeight: 700 }}>{passwordStrength.label}</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: passwordStrength.percent || '33%', height: '100%', backgroundColor: passwordStrength.color, transition: 'all 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Terms check */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', lineHeight: 1.4 }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ accentColor: '#3c4fc9', marginTop: '0.15rem' }}
          />
          <span>I accept the Loopr AI Terms of Service and Data Governance Policy.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.85rem',
          fontSize: '0.92rem',
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
        <span>{isLoading ? 'Creating Analyst Profile...' : 'Complete Registration'}</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
};
