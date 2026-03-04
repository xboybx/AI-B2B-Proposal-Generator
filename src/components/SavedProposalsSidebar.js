'use client';

import { useEffect, useState } from 'react';

export default function SavedProposalsSidebar({ onSelectProposal, activeProposalId }) {
    const [savedProposals, setSavedProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/save-proposal');
            const data = await res.json();
            if (data.success) {
                setSavedProposals(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch saved proposals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    // Expose refresh so parent can call after saving
    useEffect(() => {
        window.__refreshSidebar = fetchProposals;
        return () => { delete window.__refreshSidebar; };
    }, []);

    return (
        <aside
            className={`transition-all duration-300 flex flex-col bg-white border-r border-gray-200 shadow-sm ${collapsed ? 'w-14' : 'w-72'
                } min-h-screen`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-primary-700">
                {!collapsed && (
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide uppercase">Saved Proposals</h2>
                        <p className="text-primary-200 text-xs mt-0.5">{savedProposals.length} proposals</p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-white hover:text-primary-200 transition-colors flex-shrink-0"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {collapsed ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Proposal List */}
            <div className="flex-1 overflow-y-auto py-2">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="loader-save" style={{ borderColor: '#d1fae5', borderLeftColor: '#10b981' }} />
                    </div>
                ) : savedProposals.length === 0 ? (
                    !collapsed && (
                        <div className="text-center py-10 px-4">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-sm text-gray-500">No saved proposals yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Generate and save a proposal to see it here.</p>
                        </div>
                    )
                ) : (
                    savedProposals.map((p) => {
                        const isActive = p.id === activeProposalId;
                        return (
                            <button
                                key={p.id}
                                onClick={() => onSelectProposal(p)}
                                title={collapsed ? p.clientName : undefined}
                                className={`w-full text-left px-3 py-3 transition-all border-l-4 ${isActive
                                        ? 'bg-primary-50 border-primary-500'
                                        : 'border-transparent hover:bg-gray-50 hover:border-primary-300'
                                    }`}
                            >
                                {collapsed ? (
                                    <div className="flex justify-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {p.clientName?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                                            {p.clientName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(p.totalBudget)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(p.savedAt || p.generatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Refresh Button */}
            {!collapsed && (
                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={fetchProposals}
                        className="w-full text-xs text-gray-500 hover:text-primary-600 flex items-center justify-center gap-1 py-1 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            )}
        </aside>
    );
}
