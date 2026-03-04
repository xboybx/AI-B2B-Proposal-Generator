'use client';

import { useEffect, useState } from 'react';

export default function SavedProposalsSidebar({ isOpen, onSelectProposal, activeProposalId }) {
    const [savedProposals, setSavedProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

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

    useEffect(() => {
        fetchProposals();
        window.__refreshSidebar = fetchProposals;
        return () => { delete window.__refreshSidebar; };
    }, []);

    return (
        <aside
            className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
        flex flex-col bg-white border-r border-gray-200 shadow-lg
        w-72 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-primary-600 to-primary-700 flex-shrink-0">
                <div>
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">Saved Proposals</h2>
                    <p className="text-primary-200 text-xs mt-0.5">{savedProposals.length} proposals</p>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="loader-save" style={{ borderColor: '#d1fae5', borderLeftColor: '#10b981' }} />
                    </div>
                ) : savedProposals.length === 0 ? (
                    <div className="text-center py-10 px-4">
                        <p className="text-3xl mb-2">📋</p>
                        <p className="text-sm text-gray-500">No saved proposals yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Generate and save a proposal to see it here.</p>
                    </div>
                ) : (
                    savedProposals.map((p) => {
                        const isActive = p.id === activeProposalId;
                        return (
                            <button
                                key={p.id}
                                onClick={() => onSelectProposal(p)}
                                className={`w-full text-left px-4 py-3 transition-all border-l-4 ${isActive
                                        ? 'bg-primary-50 border-primary-500'
                                        : 'border-transparent hover:bg-gray-50 hover:border-primary-300'
                                    }`}
                            >
                                <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                                    {p.clientName}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(p.totalBudget)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(p.savedAt || p.generatedAt).toLocaleDateString()}
                                </p>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0">
                <button
                    onClick={fetchProposals}
                    className="w-full text-xs text-gray-500 hover:text-primary-600 flex items-center justify-center gap-1 py-1 transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </aside>
    );
}
