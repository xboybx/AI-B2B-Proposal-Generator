'use client';

import { useEffect, useState } from 'react';

export default function SuccessNotification({ message, proposalId, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed top-24 right-8 z-50 transition-all duration-500 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
      <div className="glass-card !bg-white/90 rounded-3xl p-5 shadow-2xl border-none flex items-center gap-4 min-w-[320px] group overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-rayeva-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Success Icon */}
        <div className="shrink-0 relative">
          <div className="w-12 h-12 bg-rayeva-emerald rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
            <svg
              className="w-6 h-6 text-rayeva-lime"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rayeva-lime rounded-full border-2 border-white animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <h4 className="text-sm font-display font-bold text-slate-900 leading-none mb-1.5">{message}</h4>
          {proposalId && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Entry ID</span>
              <span className="text-[10px] font-bold text-rayeva-emerald font-mono bg-rayeva-emerald/5 px-1.5 py-0.5 rounded">
                {proposalId.substring(0, 8)}
              </span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 w-8 h-8 rounded-xl bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center active:scale-90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
