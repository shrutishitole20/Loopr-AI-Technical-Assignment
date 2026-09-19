import React, { useState } from 'react';
import { TransactionFilters } from '../../types';
import { transactionService } from '../../services/transactionService';
import { useAlert } from '../../context/AlertContext';
import { AVAILABLE_COLUMNS } from './constants';
import { ScopeSelector } from './components/ScopeSelector';
import { ColumnSelector } from './components/ColumnSelector';
import { ExportPresets } from './components/ExportPresets';
import { LiveCSVPreview } from './components/LiveCSVPreview';
import {
  X,
  Download,
  FileSpreadsheet,
  Calendar,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: TransactionFilters;
  totalFilteredCount: number;
  totalDbCount?: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  totalFilteredCount,
  totalDbCount = 300
}) => {
  const { showSuccess, showError } = useAlert();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id',
    'date',
    'amount',
    'category',
    'status',
    'user_id'
  ]);
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered');
  const [fileName, setFileName] = useState<string>('financial-transactions-export');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');

  if (!isOpen) return null;

  const targetCount = exportScope === 'filtered' ? totalFilteredCount : totalDbCount;

  const toggleColumn = (colId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const selectAll = () => setSelectedColumns(AVAILABLE_COLUMNS.map((c) => c.id));
  const deselectAll = () => setSelectedColumns([]);

  const appendCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!fileName.includes(today)) {
      setFileName((prev) => `${prev.replace(/-\d{4}-\d{2}-\d{2}$/, '')}-${today}`);
    }
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      showError('Please select at least one column to include in the CSV export.');
      return;
    }

    try {
      setIsExporting(true);
      const filtersToUse = exportScope === 'filtered' ? currentFilters : {};
      const result = await transactionService.exportCSV(
        selectedColumns,
        filtersToUse,
        true,
        fileName
      );

      showSuccess(`File "${result.filename}" (${targetCount} records) downloaded successfully!`);
      onClose();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(10, 13, 29, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 30px rgba(60, 79, 201, 0.15)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3c4fc9 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(60, 79, 201, 0.35)'
              }}
            >
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  CSV Export Studio
                </h2>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(5, 150, 105, 0.12)',
                    color: '#059669',
                    border: '1px solid rgba(5, 150, 105, 0.25)'
                  }}
                >
                  RFC 4180
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Configure schema, inspect live row previews, and export directly to spreadsheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close export dialog"
          >
            <X size={17} />
          </button>
        </div>

        {/* View Mode Segmented Tabs */}
        <div
          style={{
            padding: '0.65rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.25rem', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'config' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'config' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'config' ? '0 2px 8px rgba(60, 79, 201, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Fields & Scope</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'preview' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'preview' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'preview' ? '0 2px 8px rgba(60, 79, 201, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={14} />
              <span>Live CSV Preview</span>
              <span
                style={{
                  fontSize: '0.66rem',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'preview' ? 'rgba(255, 255, 255, 0.2)' : 'var(--border-subtle)'
                }}
              >
                {selectedColumns.length}
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <HardDrive size={14} color="#0284c7" />
            <span>Target: <strong>{targetCount}</strong> rows</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.35rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeTab === 'config' ? (
            <>
              {/* 1-Click Schema Presets */}
              <ExportPresets
                selectedColumns={selectedColumns}
                onSelectPreset={(cols) => setSelectedColumns(cols)}
              />

              {/* Scope Selector */}
              <ScopeSelector
                exportScope={exportScope}
                setExportScope={setExportScope}
                totalFilteredCount={totalFilteredCount}
                totalDbCount={totalDbCount}
              />

              {/* Column Selector */}
              <ColumnSelector
                selectedColumns={selectedColumns}
                toggleColumn={toggleColumn}
                selectAll={selectAll}
                deselectAll={deselectAll}
              />

              {/* File Name Configuration */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  3. Export File Name
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-control"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="financial-transactions-export"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>.csv</span>
                  <button
                    type="button"
                    onClick={appendCurrentDate}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem', fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                    title="Append today's date stamp to file name"
                  >
                    <Calendar size={13} />
                    <span>Add Date</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Live Interactive Preview Tab */
            <LiveCSVPreview
              selectedColumns={selectedColumns}
              totalRows={targetCount}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.1rem 1.75rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={15} color="#059669" />
            <span>Ready to stream <strong>{targetCount} records</strong> across <strong>{selectedColumns.length} fields</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              id="confirm-export-btn"
              onClick={handleExport}
              disabled={isExporting || selectedColumns.length === 0}
              className="btn btn-primary"
              style={{ gap: '0.45rem', padding: '0.625rem 1.35rem' }}
            >
              <Download size={16} />
              <span>{isExporting ? 'Generating & Downloading...' : `Download CSV (${targetCount})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
