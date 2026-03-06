'use client';

import { useState } from 'react';
import ProposalForm from '@/components/ProposalForm';
import ProposalPreview from '@/components/ProposalPreview';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import SuccessNotification from '@/components/SuccessNotification';
import SavedProposalsSidebar from '@/components/SavedProposalsSidebar';

export default function Home() {
  const [proposal, setProposal] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedProposalId, setSavedProposalId] = useState(null);
  const [activeProposalId, setActiveProposalId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGenerate = async (formData) => {
    setGenerating(true);
    setError(null);
    setProposal(null);
    setSaveSuccess(false);
    setSavedProposalId(null);
    setActiveProposalId(null);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to generate proposal');
      setProposal(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!proposal) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/save-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to save proposal');
      setSaveSuccess(true);
      setSavedProposalId(result.data.id);
      setActiveProposalId(result.data.id);
      if (window.__refreshSidebar) window.__refreshSidebar();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setProposal(null);
    setError(null);
    setSaveSuccess(false);
    setSavedProposalId(null);
    setActiveProposalId(null);
  };

  const handleSelectSavedProposal = (savedProposal) => {
    setProposal(savedProposal.proposal || savedProposal);
    setActiveProposalId(savedProposal.id);
    setError(null);
    setSaveSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-rayeva-lime/30">
      <div className="pulse-bg" />

      {/* ── Top Navigation ─────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center px-6 lg:px-12">
        <div className="w-full h-16 glass-card rounded-2xl flex items-center px-6 transition-all duration-500 hover:shadow-2xl hover:shadow-rayeva-emerald/5">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="mr-4 p-2.5 rounded-xl text-slate-600 hover:text-rayeva-emerald hover:bg-rayeva-lime/20 transition-all active:scale-95"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rayeva-emerald rounded-lg flex items-center justify-center rotate-3">
              <span className="text-rayeva-lime font-bold">R</span>
            </div>
            <span className="text-xl font-display font-bold text-slate-900">Rayeva</span>
          </div>

          <div className="hidden md:flex ml-10 gap-6">
            <nav className="flex gap-4">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-rayeva-emerald transition-colors">Generator</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-rayeva-emerald transition-colors">Catalog</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-rayeva-emerald transition-colors">Analytics</a>
            </nav>
          </div>

          {/* User Profile */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rayeva-emerald/60">Professional Plan</span>
              <span className="text-xs font-semibold text-slate-400">Sustainable Goods Ltd.</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rayeva-emerald to-rayeva-forest flex items-center justify-center shadow-lg shadow-rayeva-emerald/20 text-white font-bold border border-white/20">
              SG
            </div>
          </div>
        </div>
      </header>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <SavedProposalsSidebar
        isOpen={sidebarOpen}
        onSelectProposal={handleSelectSavedProposal}
        activeProposalId={activeProposalId}
      />

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 pt-28 pb-12 px-6 lg:px-12 max-w-[1440px] mx-auto w-full page-fade-in">

        {/* Intro Section */}
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rayeva-lime/20 border border-rayeva-lime/30 text-rayeva-emerald text-[11px] font-bold uppercase tracking-widest mb-6 animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-rayeva-emerald animate-pulse" />
            AI-Powered Transformation
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 leading-[1.1]">
            Create Proposals that <span className="bg-gradient-to-r from-rayeva-emerald to-rayeva-indigo bg-clip-text text-transparent italic">Matter.</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Generating high-impact, sustainable product proposals in seconds with Rayeva's 2026 Pulse engine.
          </p>
        </section>

        {/* Notifications */}
        <div className="max-w-4xl mx-auto mb-8">
          {saveSuccess && (
            <SuccessNotification
              message="Proposal saved to your cloud library."
              proposalId={savedProposalId}
              onClose={() => setSaveSuccess(false)}
            />
          )}
          {error && <ErrorState message={error} onRetry={handleReset} />}
        </div>

        {generating && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-rayeva-sand/80 backdrop-blur-md">
            <div className="text-center">
              <LoadingState />
              <p className="mt-4 font-display font-medium text-rayeva-emerald animate-pulse">Designing your sustainable future...</p>
            </div>
          </div>
        )}

        {/* Dynamic Canvas */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Form Side - The Input engine */}
          <div className="xl:col-span-5">
            <div className="bento-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rayeva-lime/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rayeva-lime/20 transition-all duration-700" />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-display font-bold text-slate-900">Proposal Engine</h2>
                  <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">v4.0.2</span>
                </div>
                <ProposalForm
                  onSubmit={handleGenerate}
                  loading={generating}
                  disabled={generating}
                />
              </div>
            </div>
          </div>

          {/* Preview Side - The Output Canvas */}
          <div className="xl:col-span-7">
            {proposal ? (
              <div className="animate-fade-in h-full">
                <ProposalPreview
                  proposal={proposal}
                  onSave={handleSave}
                  onReset={handleReset}
                  saving={saving}
                  saved={saveSuccess}
                />
              </div>
            ) : (
              <div className="bento-card h-[600px] flex flex-col items-center justify-center text-center group border-dashed border-2 border-slate-200 bg-slate-50/50">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-16 h-16 text-rayeva-emerald/20 group-hover:text-rayeva-emerald/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Ready for Design</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  Configure the engine on the left to generate your custom sustainability proposal.
                </p>
                <div className="flex gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/32?img=${i + 10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium self-center">+120 teams using this engine</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Bento Grid */}
        {!proposal && !generating && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 bento-card bg-rayeva-emerald text-white group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="text-4xl mb-6">🌱</div>
              <h3 className="text-xl font-display font-bold mb-2">Sustainable Core</h3>
              <p className="text-emerald-50/80 text-sm">Verified eco-credentials for every product in our 2026 catalog.</p>
            </div>
            <div className="md:col-span-4 bento-card hover:bg-white group cursor-pointer transition-all">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Impact Analytics</h3>
              <p className="text-slate-500 text-sm">Real-time projection of carbon savings and plastic reduction.</p>
            </div>
            <div className="md:col-span-4 bento-card hover:bg-white group cursor-pointer transition-all">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Instant Flow</h3>
              <p className="text-slate-500 text-sm">Automated budget allocation based on your client's unique needs.</p>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
              <span className="text-slate-500 text-[10px] font-bold">R</span>
            </div>
            <span className="text-slate-900 font-display font-bold tracking-tight">Rayeva</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Rayeva Technologies. Designed for the Future.</p>
          <div className="flex gap-6">
            <span className="text-xs font-bold text-rayeva-emerald">SYSTEM STATUS: OPTIMAL</span>
            <span className="text-xs font-bold text-slate-400 underline cursor-pointer">PRIVACY</span>
            <span className="text-xs font-bold text-slate-400 underline cursor-pointer">TERMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bento-card group hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-display font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
