'use client';

import { useState, useEffect } from 'react';

const loadingMessages = [
  'Analyzing sustainability goals...',
  'Curating eco-friendly products...',
  'Calculating budget allocation...',
  'Generating impact metrics...',
  'Optimizing product mix...',
  'Finalizing your proposal...',
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-rayeva-sand/40 backdrop-blur-md flex items-center justify-center z-[100] page-fade-in transition-all duration-500">
      <div className="glass-card rounded-[40px] p-12 max-w-md w-full mx-4 shadow-2xl border-none relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rayeva-lime/20 rounded-full blur-3xl animate-slow-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rayeva-emerald/10 rounded-full blur-3xl animate-slow-pulse" />

        <div className="text-center relative">
          {/* AI Orb Loader - Re-imagined for 2026 */}
          <div className="ai-orb-container group">
            <div className="ai-orb-glow" />
            <div className="ai-orb-core">
              <div className="ai-orb-layer" />
              <div className="ai-orb-layer-alt" />
              <div className="ai-orb-inner-ring" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-700">
                  <div className="w-6 h-6 bg-rayeva-emerald rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-rayeva-lime font-bold text-xs uppercase">R</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy Loading Pulse (Commented for fallback)
          <div className="relative w-32 h-32 mx-auto mb-10 group">
            <div className="absolute inset-0 bg-rayeva-emerald/5 rounded-full scale-150 animate-pulse" />
            <div className="absolute inset-0 border-2 border-rayeva-emerald/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border border-rayeva-lime/30 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-xl shadow-rayeva-emerald/10 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-700">
                <div className="w-8 h-8 bg-rayeva-emerald rounded-lg flex items-center justify-center">
                  <span className="text-rayeva-lime font-bold text-lg">R</span>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Title and Messaging */}
          <div className="space-y-3 mb-10">
            <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Calibrating Data
            </h3>
            <p className="text-sm font-bold text-slate-400 h-6 transition-all duration-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rayeva-emerald animate-pulse" />
              {loadingMessages[messageIndex]}
            </p>
          </div>

          {/* Elegant Progress Bar */}
          <div className="relative px-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rayeva-emerald h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_10px_rgba(6,78,59,0.3)]"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Progress Info */}
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Engine Load: {Math.min(Math.round(progress), 100)}%
              </span>
              <span className="text-[10px] font-bold text-rayeva-emerald uppercase tracking-widest animate-pulse">
                Processing v4.0.2
              </span>
            </div>
          </div>

          {/* Discreet Notice */}
          <div className="mt-12 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Neural Pipeline
          </div>
        </div>
      </div>
    </div>
  );
}
