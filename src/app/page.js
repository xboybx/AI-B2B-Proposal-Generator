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
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white shadow-sm border-b border-gray-200 flex items-center px-4 sm:px-6 lg:px-8">
        {/* Hamburger — toggles sidebar */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="mr-3 p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle saved proposals sidebar"
        >
          {sidebarOpen ? (
            /* X icon when open */
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger icon when closed */
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Brand */}
        <span className="text-2xl font-bold text-primary-600">Rayeva</span>
        <span className="hidden md:block ml-3 text-gray-400">|</span>
        <span className="hidden md:block ml-3 text-gray-600 font-medium text-sm">B2B Proposal Generator</span>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden sm:block text-sm text-gray-500">Sustainable Commerce Platform</span>
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 text-sm font-semibold">SG</span>
          </div>
        </div>
      </header>

      {/* ── Sidebar (slides in/out, no backdrop, no overlay) ─── */}
      <SavedProposalsSidebar
        isOpen={sidebarOpen}
        onSelectProposal={handleSelectSavedProposal}
        activeProposalId={activeProposalId}
      />

      {/* ── Main content (offset for fixed navbar) ───────────── */}
      <main className="flex-1 pt-16 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-8">

          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">B2B Proposal Generator</h1>
            <p className="mt-2 text-gray-600">Create AI-powered sustainable product proposals for your clients</p>
          </div>

          {/* Notifications */}
          {saveSuccess && (
            <SuccessNotification
              message="Proposal saved successfully!"
              proposalId={savedProposalId}
              onClose={() => setSaveSuccess(false)}
            />
          )}
          {error && <ErrorState message={error} onRetry={handleReset} />}
          {generating && <LoadingState />}

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fade-in">
              <ProposalForm
                onSubmit={handleGenerate}
                loading={generating}
                disabled={generating}
              />
            </div>

            <div className="animate-fade-in">
              {proposal ? (
                <ProposalPreview
                  proposal={proposal}
                  onSave={handleSave}
                  onReset={handleReset}
                  saving={saving}
                  saved={saveSuccess}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Proposal Selected</h3>
                  <p className="text-gray-500 max-w-sm">
                    Generate a new proposal using the form, or open the sidebar to load a saved one.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Feature cards */}
          {!proposal && !generating && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon="🌱" title="Sustainable Products"
                description="Access our curated catalog of eco-friendly products with verified sustainability credentials." />
              <FeatureCard icon="💰" title="Smart Budgeting"
                description="AI-optimized budget allocation across product categories to maximize value." />
              <FeatureCard icon="📊" title="Impact Metrics"
                description="Quantified environmental impact with plastic saved, carbon offset, and more." />
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2026 Rayeva. All rights reserved.</p>
          <p className="text-sm text-gray-500">Powered by OpenRouter AI</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
