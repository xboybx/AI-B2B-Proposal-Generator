'use client';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card !bg-red-50/50 border-red-100/50 rounded-3xl p-8 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Error Pulse */}
        <div className="shrink-0">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-red-500/5 rounded-full animate-ping" />
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <h3 className="text-xl font-display font-bold text-red-900 mb-1">
              Engine Interrupt
            </h3>
            <p className="text-red-700 font-medium text-sm">{message}</p>
          </div>

          {/* Troubleshooting Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 group hover:bg-white transition-colors">
              <span className="text-red-400 group-hover:rotate-12 transition-transform">🌐</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Check Network Bridge</span>
            </div>
            <div className="bg-white/50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 group hover:bg-white transition-colors">
              <span className="text-red-400 group-hover:rotate-12 transition-transform">🔑</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Verify API Token</span>
            </div>
            <div className="bg-white/50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 group hover:bg-white transition-colors">
              <span className="text-red-400 group-hover:rotate-12 transition-transform">📊</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Validate Parameters</span>
            </div>
            <div className="bg-white/50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 group hover:bg-white transition-colors">
              <span className="text-red-400 group-hover:rotate-12 transition-transform">📝</span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Simplify Mission</span>
            </div>
          </div>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="mt-8 h-12 px-8 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto md:mx-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Restart Engine
          </button>
        </div>
      </div>
    </div>
  );
}
