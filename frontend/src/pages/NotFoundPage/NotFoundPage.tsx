import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow decoration */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(60, 79, 201, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '520px',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}
      >
        {/* Icon & Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(60, 79, 201, 0.25) 0%, rgba(9, 18, 61, 0.6) 100%)',
            border: '1px solid rgba(122, 199, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7ac7ff',
            boxShadow: '0 8px 32px rgba(60, 79, 201, 0.3)'
          }}
        >
          <Compass size={36} />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          Error 404 • Route Not Found
        </div>

        {/* Heading & description */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            margin: 0
          }}
        >
          Lost in Financial Coordinates?
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0
          }}
        >
          The page or analytics resource you requested does not exist or has been relocated to another route.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <LayoutDashboard size={16} />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <LogIn size={16} />
              <span>Sign In to Continue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
