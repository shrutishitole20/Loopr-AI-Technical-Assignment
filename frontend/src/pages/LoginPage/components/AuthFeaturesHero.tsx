import React from 'react';
import { Cpu, Database, Zap, ShieldCheck } from 'lucide-react';

export const AuthFeaturesHero: React.FC = () => {
  return (
    <div
      className="auth-showcase-panel"
      style={{
        flex: '1 1 46%',
        background: 'linear-gradient(155deg, #f8faff 0%, #edf2fe 100%)',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #e2e8f4',
        position: 'relative'
      }}
    >
      <div>
        {/* Loopr AI Logo & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem 0.8rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f4',
              boxShadow: '0 4px 12px rgba(60, 79, 201, 0.08)'
            }}
          >
            <img
              src="https://cdn.prod.website-files.com/66277167814e4d9a6afc3ece/67bdafdc697cd6760bbb87bf_loopr-logo-final%201.svg"
              alt="Loopr AI"
              style={{ height: '26px', width: 'auto' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#0a0d1d' }}>
                Loopr <span style={{ color: '#3c4fc9' }}>AI</span>
              </h1>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  letterSpacing: '0.06em'
                }}
              >
                Enterprise AI
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#64748b', letterSpacing: '0.03em', fontWeight: 500 }}>
              Quality & Financial Intelligence Platform
            </span>
          </div>
        </div>

        {/* Loopr AI Tagline */}
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#0a0d1d', letterSpacing: '-0.02em' }}>
          Automate inspections, standardize workflows & capture audit-ready intelligence.
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '2.2rem' }}>
          Unify transaction ledgers, automate anomaly detection, and uncover systemic financial risks across accounts, users, and audit streams with Loopr AI.
        </p>

        {/* Loopr AI Capabilities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f4',
              boxShadow: '0 2px 8px rgba(60, 79, 201, 0.04)'
            }}
          >
            <div style={{ padding: '0.45rem', borderRadius: '8px', backgroundColor: 'rgba(60, 79, 201, 0.1)', color: '#3c4fc9' }}>
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0d1d' }}>Adaptive Intelligence Engine</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Human-in-the-loop and autonomous AI transaction audits</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f4',
              boxShadow: '0 2px 8px rgba(60, 79, 201, 0.04)'
            }}
          >
            <div style={{ padding: '0.45rem', borderRadius: '8px', backgroundColor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
              <Database size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0d1d' }}>Unified Audit & Ledger Data</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Consolidates live entries, categories, and payment statuses</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f4',
              boxShadow: '0 2px 8px rgba(60, 79, 201, 0.04)'
            }}
          >
            <div style={{ padding: '0.45rem', borderRadius: '8px', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0d1d' }}>Real-time Risk Intelligence</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Predictive cash flow insights, margin health & CSV exports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f4',
          fontSize: '0.74rem',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={17} color="#059669" />
          <span>SOC2-Compliant Bcrypt & JWT Authorization</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="pulse-live"></span>
          <span style={{ color: '#059669', fontWeight: 600 }}>v2.4 Active</span>
        </div>
      </div>
    </div>
  );
};
