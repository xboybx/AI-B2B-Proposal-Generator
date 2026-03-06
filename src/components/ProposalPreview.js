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
    <div className="glass-card rounded-[24px] md:rounded-[32px] overflow-hidden border-none shadow-2xl flex flex-col h-[650px] md:h-[850px]">
      {/* Premium Header */}
      <div className="p-5 md:p-8 pb-3 md:pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rayeva-lime/10 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="relative flex flex-col xs:flex-row justify-between items-start gap-4">
          <div className="w-full xs:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rayeva-emerald animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rayeva-emerald">Draft Proposal</span>
            </div>
            <h2 className="text-xl md:text-3xl font-display font-bold text-slate-900 leading-tight break-words">
              {proposal.clientName}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium line-clamp-2 md:line-clamp-none">
              {proposal.sustainabilityGoals.substring(0, 60)}...
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 border-t xs:border-t-0 border-slate-100 pt-3 xs:pt-0 w-full xs:w-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Budget</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-rayeva-emerald">
              {formatCurrency(proposal.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Sophisticated Tabs */}
      <div className="px-5 md:px-8 mb-4">
        <div className="flex bg-slate-100/50 p-1 rounded-2xl gap-0.5 md:gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 md:py-2.5 rounded-xl text-[9px] md:text-xs font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-rayeva-emerald shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
              <span className="opacity-70 text-sm md:text-base mb-0.5">{tab.icon}</span>
              <span className="uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 px-5 md:px-8 py-3 md:py-4 overflow-y-auto custom-scrollbar">
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
      <div className="p-5 md:p-8 pt-3 md:pt-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSave}
            disabled={saving || saved}
            className={`flex-[2] sm:flex-[2] h-14 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 glow-on-hover px-4 ${saved
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
                <span className="hidden sm:inline">Synchronized</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2M9 12h6m-6 3h6" />
                </svg>
                <span className="hidden sm:inline">Secure to Cloud</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 shadow-xl shadow-slate-900/10 px-4"
          >
            {exporting ? (
              <div className="loader-export" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
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

        <div className="mt-6 flex justify-center items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Estimated Delivery</span>
          <div className="h-px w-8 bg-slate-100" />
          <span className="text-xs font-bold text-slate-500 uppercase">{proposal.timeline}</span>
        </div>
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
    <div className="space-y-6 md:space-y-8 py-2 md:py-4">
      {/* Dynamic Statistics */}
      <div className="grid grid-cols-1 xxs:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-rayeva-lime/10 border border-rayeva-lime/20 group hover:scale-[1.02] transition-transform">
          <p className="text-3xl md:text-4xl font-display font-bold text-rayeva-emerald mb-1">
            {proposal.productMix?.length || 0}
          </p>
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-rayeva-emerald/60">Product Categories</p>
        </div>
        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-indigo-50 border border-indigo-100 group hover:scale-[1.02] transition-transform">
          <p className="text-3xl md:text-4xl font-display font-bold text-indigo-600 mb-1">
            {totalProducts}
          </p>
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-indigo-400">Total Items</p>
        </div>
      </div>

      {/* Sustainable Vision */}
      <div className="space-y-2 md:space-y-3">
        <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Project Goals</h4>
        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rayeva-emerald opacity-20 group-hover:opacity-100 transition-opacity" />
          <p className="text-slate-600 font-medium leading-relaxed italic text-base md:text-lg">"{proposal.sustainabilityGoals}"</p>
        </div>
      </div>

      {/* Value Proposition */}
      {proposal.impactPositioningSummary?.keyMessage && (
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Executive Summary</h4>
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative group overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rayeva-lime/10 rounded-full blur-3xl" />
            <div className="flex gap-3 md:gap-4 items-start relative overflow-hidden">
              <span className="text-xl md:text-2xl mt-1">✨</span>
              <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">
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
    <div className="space-y-6 md:space-y-8 py-2 md:py-4">
      {proposal.productMix?.map((category, catIndex) => (
        <div key={catIndex} className="space-y-4">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-rayeva-emerald">{category.category}</h4>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid gap-4">
            {category.products?.map((product, prodIndex) => (
              <div key={prodIndex} className="p-4 md:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl hover:border-rayeva-emerald/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="flex flex-col xs:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h5 className="font-display font-bold text-slate-900 text-base md:text-lg group-hover:text-rayeva-emerald transition-colors break-words">{product.name}</h5>
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
                  <div className="text-left xs:text-right shrink-0">
                    <p className="text-base md:text-lg font-display font-bold text-slate-900">
                      {formatCurrency(product.totalPrice)}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
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
    <div className="space-y-6 md:space-y-10 py-2 md:py-4">
      {/* Fiscal Matrix */}
      <div className="p-5 md:p-8 rounded-[24px] md:rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rayeva-emerald opacity-20 blur-[100px]" />

        <div className="grid grid-cols-2 gap-4 md:gap-12 relative overflow-hidden">
          <div>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Total Budget</p>
            <p className="text-base xxs:text-xl md:text-3xl font-display font-bold">{formatCurrency(proposal.totalBudget)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Available Funds</p>
            <p className="text-base xxs:text-xl md:text-3xl font-display font-bold text-rayeva-lime">
              {formatCurrency(proposal.totalBudget - totalAllocated)}
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-10 space-y-2">
          <div className="flex justify-between text-[9px] md:text-[11px] font-bold uppercase tracking-widest">
            <span>Budget Allocation Progress</span>
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
      <div className="space-y-4 md:space-y-6">
        <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Budget Breakdown</h4>
        <div className="space-y-4 md:space-y-6">
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

        {/* Total Allocated Summary */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center group">
          <div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-rayeva-emerald transition-colors">
              Total Budget Used
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Final Execution Sum</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-display font-bold text-slate-900">
              {formatCurrency(totalAllocated)}
            </span>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Budget Utilization</p>
          </div>
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
    { label: 'Plastic Saved', value: impact.plasticSavedKg, unit: 'KG', icon: '♻️', style: 'bg-white border-slate-100' },
    { label: 'Carbon Offset', value: impact.carbonOffsetKg, unit: 'CO2e', icon: '☁️', style: 'bg-white border-slate-100' },
    { label: 'Trees Equiv.', value: impact.treesEquivalent, unit: '🌿', icon: '', style: 'bg-white border-slate-100' },
    { label: 'Water Saved', value: impact.waterSavedLiters, unit: 'L', icon: '💧', style: 'bg-white border-slate-100' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 py-2 md:py-4">
      {/* Metrics Hex-Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {impactMetrics.map((metric, index) => metric.value && (
          <div key={index} className={`p-3 xxs:p-4 md:p-6 rounded-2xl md:rounded-[32px] border ${metric.style} shadow-sm group hover:-translate-y-1 transition-all duration-300`}>
            {metric.icon && <span className="text-base md:text-2xl mb-1 md:mb-4 block filter grayscale group-hover:grayscale-0 transition-all">{metric.icon}</span>}
            <div className="flex flex-col items-baseline gap-0.5 mb-1">
              <span className="text-sm xxs:text-xl md:text-3xl font-display font-bold text-slate-900 truncate w-full">
                {metric.value > 1000 ? `${(metric.value / 1000).toFixed(1)}k` : metric.value.toLocaleString()}
              </span>
              <span className="text-[8px] md:text-[10px] font-bold text-slate-400">{metric.unit}</span>
            </div>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight line-clamp-2">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Narrative Position */}
      {impact.keyMessage && (
        <div className="p-6 md:p-8 rounded-[30px] md:rounded-[40px] bg-rayeva-emerald text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rayeva-lime/20 rounded-full blur-[60px]" />
          <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-rayeva-lime mb-3 md:mb-4">Pulse Environmental Statement</h4>
          <p className="text-base md:text-lg font-medium leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
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

