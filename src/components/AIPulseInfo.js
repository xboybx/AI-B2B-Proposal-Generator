'use client';

import { useState, useRef, useEffect } from 'react';

export default function AIPulseInfo() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="fixed top-24 right-4 md:right-6 lg:right-12 z-30" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all shadow-md shadow-red-500/5 relative group active:scale-95 animate-blink-10s"
                aria-label="AI Performance Information"
            >
                <span className="font-display font-bold text-base italic">i</span>
            </button>

            {/* Floating Info Box */}
            {isOpen && (
                <div className="absolute top-10 right-0 w-72 md:w-80 glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl border-red-100/50 shadow-2xl animate-fade-in z-50">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                            <span className="text-red-500 text-lg">⚙️</span>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                System Status
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            </h4>
                            <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                If any unexpected error occurs during generation, please <span className="text-red-500 font-bold decoration-red-200 decoration-2 underline-offset-2">retry again</span>.
                            </p>
                            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed italic">
                                    "If the Pulse engine is taking more time, it means the model is <span className="text-rayeva-emerald font-bold not-italic">carefully thinking</span> and cross-referencing global sustainability data to deliver your optimal answer."
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-5 w-full py-2 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            )}
        </div>
    );
}
