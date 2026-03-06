'use client';

import { useEffect, useState } from 'react';

export default function SavedProposalsSidebar({ isOpen, onSelectProposal, activeProposalId }) {
    const [savedProposals, setSavedProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/save-proposal');
            const data = await res.json();
            if (data.success) setSavedProposals(data.data || []);
        } catch (err) {
            console.error('Failed to fetch saved proposals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this proposal?')) return;

        try {
            const res = await fetch(`/api/save-proposal?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setSavedProposals(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('An error occurred while deleting.');
        }
    };

    useEffect(() => {
        fetchProposals();
        window.__refreshSidebar = fetchProposals;
        return () => { delete window.__refreshSidebar; };
    }, []);

    return (
        <aside
            className={`
        fixed top-24 left-6 bottom-6 z-40
        flex flex-col glass-card rounded-3xl
        w-80 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[calc(100%+24px)] opacity-0'}
      `}
        >
            {/* Header */}
            <div className="p-6 pb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">Cloud Library</h2>
                    <div className="px-2 py-0.5 rounded-full bg-rayeva-emerald text-white text-[9px] font-bold">
                        {savedProposals.length}
                    </div>
                </div>
                <p className="text-slate-900 font-display font-bold text-lg">Saved Proposals</p>
            </div>

            {/* Search Input (Placeholder for design) */}
            <div className="px-6 mb-4">
                <div className="relative group">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-rayeva-emerald transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Filter library..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs font-medium border-transparent focus:bg-white focus:border-rayeva-emerald/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar space-y-3">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 gap-3">
                        <div className="loader-generate">
                            <div className="bg-rayeva-emerald" /> <div className="bg-rayeva-emerald" /> <div className="bg-rayeva-emerald" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Syncing...</span>
                    </div>
                ) : savedProposals.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <span className="text-2xl">📁</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-widest leading-loose">No Records</p>
                        <p className="text-[10px] text-slate-400 font-medium px-4 leading-relaxed mt-2 uppercase">Your sustainable generations will appear here.</p>
                    </div>
                ) : (
                    savedProposals.map((p) => {
                        const isActive = p.id === activeProposalId;
                        return (
                            <div
                                key={p.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectProposal(p)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onSelectProposal(p);
                                    }
                                }}
                                className={`w-full text-left p-4 rounded-2xl transition-all border group relative overflow-hidden cursor-pointer ${isActive
                                    ? 'bg-white border-rayeva-emerald/20 shadow-lg shadow-rayeva-emerald/5 ring-1 ring-rayeva-emerald/5'
                                    : 'bg-white/30 border-slate-100 hover:bg-white hover:border-rayeva-emerald/20'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rayeva-emerald" />}
                                <div className="flex justify-between items-start">
                                    <p className={`text-xs font-bold truncate pr-6 leading-none transition-colors ${isActive ? 'text-rayeva-emerald' : 'text-slate-900 group-hover:text-rayeva-emerald'}`}>
                                        {p.clientName}
                                    </p>
                                    <button
                                        onClick={(e) => handleDelete(e, p.id)}
                                        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Record"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{formatCurrency(p.totalBudget)}</p>
                                    <p className="text-[10px] font-medium text-slate-300">
                                        {formatDate(p.createdAt || p.savedAt || p.generatedAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-2 flex-shrink-0">
                <button
                    onClick={fetchProposals}
                    className="w-full h-10 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Library
                </button>
            </div>
        </aside>
    );
}
