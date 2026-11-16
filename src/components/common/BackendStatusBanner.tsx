import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';

export const BackendStatusBanner: React.FC = () => {
  const { isBackendConnected } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const envSnippet = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-actual-anon-key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isBackendConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Connected to Live Supabase PostgreSQL & Auth
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              Interactive Sandbox Database Mode (Supabase Integration Ready)
            </span>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-slate-400 hover:text-white underline flex items-center gap-1 transition"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isBackendConnected ? 'Backend Status' : 'Configure Live Supabase'}</span>
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Supabase PostgreSQL Integration"
        maxWidth="lg"
      >
        <div className="space-y-4 text-sm text-slate-600">
          <div className={`p-4 rounded-xl border ${isBackendConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            <div className="flex items-start gap-3">
              {isBackendConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold">
                  {isBackendConnected
                    ? 'Connected to Live Supabase'
                    : 'Currently Running in Interactive Sandbox Mode'}
                </h4>
                <p className="mt-1 text-xs leading-relaxed">
                  {isBackendConnected
                    ? 'All database queries, authentication requests, and mutations are communicating with your PostgreSQL database.'
                    : 'The frontend application is completely integrated with the Supabase client SDK and ready for live credentials. In sandbox mode, all features (shipments, quotations, bookings, tracking, vehicles, admin) work with in-memory & local state.'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-slate-900 mb-1">To connect to your own Supabase project:</h5>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
              <li>
                Create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a>
              </li>
              <li>
                Open the <strong>SQL Editor</strong> in Supabase and execute the script found in:
                <code className="block mt-1 p-2 bg-slate-100 rounded text-slate-800 font-mono text-[11px]">
                  supabase/schema.sql
                </code>
              </li>
              <li>
                Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> into the <code className="text-slate-800 font-mono">.env</code> file:
              </li>
            </ol>
          </div>

          <div className="relative">
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
              {envSnippet}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy snippet"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-right pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

