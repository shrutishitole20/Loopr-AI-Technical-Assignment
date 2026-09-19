import React from 'react';
import { EXPORT_PRESETS, ExportPreset } from '../constants';
import { Sparkles, Check } from 'lucide-react';

interface ExportPresetsProps {
  selectedColumns: string[];
  onSelectPreset: (columns: string[]) => void;
}

export const ExportPresets: React.FC<ExportPresetsProps> = ({
  selectedColumns,
  onSelectPreset
}) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
        <Sparkles size={14} color="#3c4fc9" />
        <span
          style={{
            fontSize: '0.76rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)'
          }}
        >
          Quick Schema Presets
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {EXPORT_PRESETS.map((preset: ExportPreset) => {
          const isActive =
            selectedColumns.length === preset.columns.length &&
            preset.columns.every((c) => selectedColumns.includes(c));

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.columns)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)'
              }}
            >
              {isActive && <Check size={12} strokeWidth={3} />}
              <span>{preset.name}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  opacity: 0.8,
                  padding: '0.05rem 0.35rem',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(60, 79, 201, 0.15)' : 'var(--border-subtle)'
                }}
              >
                {preset.columns.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
