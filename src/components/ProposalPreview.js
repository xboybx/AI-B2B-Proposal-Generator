'use client';

import { useState } from 'react';
import { exportProposalToPDF } from '@/lib/pdfExport';

export default function ProposalPreview({
  proposal,
  onSave,
  onReset,
  saving,
  saved,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [exporting, setExporting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExportPDF = () => {
    setExporting(true);
    try {
      exportProposalToPDF(proposal, formatCurrency);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'impact', label: 'Impact', icon: '🌱' },
  ];

  return (
    <div className="glass-card rounded-[32px] overflow-hidden border-none shadow-2xl flex flex-col h-[850px]">
      {/* Premium Header */}
      <div className="p-8 pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rayeva-lime/10 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="relative flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rayeva-emerald animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rayeva-emerald">Draft Proposal</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 leading-tight">
              {proposal.clientName}
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">{proposal.sustainabilityGoals.substring(0, 60)}...</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Allotment</p>
            <p className="text-3xl font-display font-bold text-rayeva-emerald">
              {formatCurrency(proposal.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Sophisticated Tabs */}
      <div className="px-8 mb-4">
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-rayeva-emerald shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
              <span className="opacity-70 text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 px-8 py-4 overflow-y-auto custom-scrollbar">
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <OverviewTab proposal={proposal} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'products' && (
            <ProductsTab proposal={proposal} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'budget' && (
            <BudgetTab proposal={proposal} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'impact' && <ImpactTab proposal={proposal} />}
        </div>
      </div>

      {/* Premium Action Bar */}
      <div className="p-8 pt-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSave}
            disabled={saving || saved}
            className={`flex-[2] h-14 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 glow-on-hover ${saved
              ? 'bg-rayeva-emerald text-white'
              : 'bg-rayeva-emerald text-white hover:shadow-xl hover:shadow-rayeva-emerald/20 disabled:bg-slate-300'
              }`}
          >
            {saving ? (
              <div className="loader-save" />
            ) : saved ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>Synchronized</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Secure to Cloud</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 shadow-xl shadow-slate-900/10"
          >
            {exporting ? (
              <div className="loader-export" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={saving}
            className="w-14 h-14 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-rayeva-emerald hover:border-rayeva-emerald transition-all flex items-center justify-center shrink-0"
            title="Reset Canvas"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {proposal.timeline && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Target Delivery</span>
            <div className="h-px w-8 bg-slate-100" />
            <span className="text-xs font-bold text-slate-500 uppercase">{proposal.timeline}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ proposal, formatCurrency }) {
  const totalProducts = proposal.productMix?.reduce(
    (acc, cat) => acc + (cat.products?.length || 0),
    0
  );

  return (
    <div className="space-y-8 py-4">
      {/* Dynamic Statistics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-rayeva-lime/10 border border-rayeva-lime/20 group hover:scale-[1.02] transition-transform">
          <p className="text-4xl font-display font-bold text-rayeva-emerald mb-1">
            {proposal.productMix?.length || 0}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-rayeva-emerald/60">Key Clusters</p>
        </div>
        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 group hover:scale-[1.02] transition-transform">
          <p className="text-4xl font-display font-bold text-indigo-600 mb-1">
            {totalProducts}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Total Asset Mix</p>
        </div>
      </div>

      {/* Sustainable Vision */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Sustainable Vision</h4>
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rayeva-emerald opacity-20 group-hover:opacity-100 transition-opacity" />
          <p className="text-slate-600 font-medium leading-relaxed italic text-lg">"{proposal.sustainabilityGoals}"</p>
        </div>
      </div>

      {/* Value Proposition */}
      {proposal.impactPositioningSummary?.keyMessage && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Strategic Positioning</h4>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative group overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rayeva-lime/10 rounded-full blur-3xl" />
            <div className="flex gap-4 items-start relative overflow-hidden">
              <span className="text-2xl mt-1">✨</span>
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                {proposal.impactPositioningSummary.keyMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsTab({ proposal, formatCurrency }) {
  return (
    <div className="space-y-8 py-4">
      {proposal.productMix?.map((category, catIndex) => (
        <div key={catIndex} className="space-y-4">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-rayeva-emerald">{category.category}</h4>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid gap-4">
            {category.products?.map((product, prodIndex) => (
              <div key={prodIndex} className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-rayeva-emerald/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h5 className="font-display font-bold text-slate-900 text-lg group-hover:text-rayeva-emerald transition-colors">{product.name}</h5>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center mt-4 gap-3">
                      <span className="text-[10px] font-bold bg-rayeva-lime/20 text-rayeva-emerald px-2.5 py-1 rounded-full uppercase tracking-tight">
                        {product.sustainabilityFeature}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Units: {product.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-display font-bold text-slate-900">
                      {formatCurrency(product.totalPrice)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {formatCurrency(product.unitPrice)} / Unit
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetTab({ proposal, formatCurrency }) {
  const totalAllocated = proposal.costBreakdown?.reduce(
    (acc, item) => acc + (item.allocatedAmount || 0),
    0
  );

  return (
    <div className="space-y-10 py-4">
      {/* Fiscal Matrix */}
      <div className="p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rayeva-emerald opacity-20 blur-[100px]" />

        <div className="grid grid-cols-2 gap-12 relative overflow-hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Portfolio Cap</p>
            <p className="text-3xl font-display font-bold">{formatCurrency(proposal.totalBudget)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Operational Float</p>
            <p className="text-3xl font-display font-bold text-rayeva-lime">
              {formatCurrency(proposal.totalBudget - totalAllocated)}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
            <span>Execution Velocity</span>
            <span className="text-rayeva-lime">{Math.round((totalAllocated / proposal.totalBudget) * 100)}% Usage</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rayeva-emerald transition-all duration-1000 shadow-[0_0_15px_rgba(6,78,59,0.5)]"
              style={{ width: `${(totalAllocated / proposal.totalBudget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categorical Breakdown */}
      <div className="space-y-6">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Asset Allocation</h4>
        <div className="space-y-6">
          {proposal.costBreakdown?.map((item, index) => (
            <div key={index} className="group">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-rayeva-emerald transition-colors">
                    {item.category}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{item.percentageOfBudget}% Mix</p>
                </div>
                <span className="text-sm font-display font-bold text-slate-900">
                  {formatCurrency(item.allocatedAmount)}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 group-hover:bg-rayeva-emerald transition-all duration-500"
                  style={{ width: `${item.percentageOfBudget}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpactTab({ proposal }) {
  const impact = proposal.impactPositioningSummary;

  if (!impact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-300">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-widest">Awaiting Analysis</span>
      </div>
    );
  }

  const impactMetrics = [
    { label: 'Plastic Prevention', value: impact.plasticSavedKg, unit: 'KG', icon: '♻️', style: 'bg-white border-slate-100' },
    { label: 'Cloud Carbon Offset', value: impact.carbonOffsetKg, unit: 'CO2e', icon: '☁️', style: 'bg-white border-slate-100' },
    { label: 'Regenerative Equivalent', value: impact.treesEquivalent, unit: 'TREES', icon: '🌿', style: 'bg-white border-slate-100' },
    { label: 'Reserves Preserved', value: impact.waterSavedLiters, unit: 'LITERS', icon: '💧', style: 'bg-white border-slate-100' },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Metrics Hex-Grid */}
      <div className="grid grid-cols-2 gap-4">
        {impactMetrics.map((metric, index) => metric.value && (
          <div key={index} className={`p-6 rounded-[32px] border ${metric.style} shadow-sm group hover:-translate-y-1 transition-all duration-300`}>
            <span className="text-2xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">{metric.icon}</span>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-display font-bold text-slate-900">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{metric.unit}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Narrative Position */}
      {impact.keyMessage && (
        <div className="p-8 rounded-[40px] bg-rayeva-emerald text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rayeva-lime/20 rounded-full blur-[60px]" />
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-rayeva-lime mb-4">Pulse Environmental Statement</h4>
          <p className="text-lg font-medium leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
            "{impact.keyMessage}"
          </p>
        </div>
      )}

      {/* Sustainable Certification */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="text-rayeva-emerald text-xl">✓</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 uppercase">Verified Sustainability</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">ID: PULSE-2026-RAY-882</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-rayeva-lime" />)}
        </div>
      </div>
    </div>
  );
}

