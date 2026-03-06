'use client';

import { useState } from 'react';

export default function ProposalForm({ onSubmit, loading, disabled }) {
  const [formData, setFormData] = useState({
    clientName: '',
    totalBudget: '',
    sustainabilityGoals: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.totalBudget) {
      newErrors.totalBudget = 'Budget is required';
    } else if (parseFloat(formData.totalBudget) <= 0) {
      newErrors.totalBudget = 'Budget must be greater than 0';
    }

    if (!formData.sustainabilityGoals.trim()) {
      newErrors.sustainabilityGoals = 'Sustainability goals are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        clientName: formData.clientName.trim(),
        totalBudget: parseFloat(formData.totalBudget),
        sustainabilityGoals: formData.sustainabilityGoals.trim(),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const goalPresets = [
    'Reduce plastic waste by 50%',
    'Achieve carbon neutrality',
    'Switch to 100% recycled materials',
    'Eliminate single-use plastics',
    'Support circular economy initiatives',
    'Meet ESG compliance standards',
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-rayeva-emerald mb-1">Configuration</h3>
        <p className="text-slate-400 text-xs md:text-sm">Define the parameters for your next sustainable venture.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Client Name */}
        <div className="group">
          <label
            htmlFor="clientName"
            className="block text-[10px] md:text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight group-focus-within:text-rayeva-emerald transition-colors"
          >
            Partner / Client Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="e.g. EcoSphere Logistics"
            disabled={disabled}
            className={`premium-input text-sm ${errors.clientName ? 'border-red-300 bg-red-50/30' : ''}`}
          />
          {errors.clientName && (
            <p className="mt-1.5 text-[10px] md:text-xs font-medium text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.clientName}
            </p>
          )}
        </div>

        {/* Total Budget */}
        <div className="group">
          <label
            htmlFor="totalBudget"
            className="block text-[10px] md:text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight group-focus-within:text-rayeva-emerald transition-colors"
          >
            Investment Scale (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              $
            </span>
            <input
              type="number"
              id="totalBudget"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="0.00"
              min="1"
              step="0.01"
              disabled={disabled}
              className={`premium-input pl-8 text-sm ${errors.totalBudget ? 'border-red-300 bg-red-50/30' : ''}`}
            />
          </div>
          {errors.totalBudget && (
            <p className="mt-1.5 text-[10px] md:text-xs font-medium text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.totalBudget}
            </p>
          )}
        </div>

        {/* Sustainability Goals */}
        <div className="group">
          <label
            htmlFor="sustainabilityGoals"
            className="block text-[10px] md:text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight group-focus-within:text-rayeva-emerald transition-colors"
          >
            Mission Objectives
          </label>
          <textarea
            id="sustainabilityGoals"
            name="sustainabilityGoals"
            value={formData.sustainabilityGoals}
            onChange={handleChange}
            placeholder="Describe the desired environmental impact..."
            rows={window.innerWidth < 350 ? 3 : 4}
            disabled={disabled}
            className={`premium-input resize-none text-sm ${errors.sustainabilityGoals ? 'border-red-300 bg-red-50/30' : ''}`}
          />

          {/* Goal Chips */}
          <div className="mt-3 md:mt-4">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-2 md:mb-3 uppercase tracking-widest">Suggested Milestones</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {goalPresets.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      sustainabilityGoals: goal,
                    }))
                  }
                  disabled={disabled}
                  className="text-[10px] md:text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 hover:bg-rayeva-lime/20 hover:text-rayeva-emerald hover:border-rayeva-lime/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 md:pt-4">
          <button
            type="submit"
            disabled={disabled || loading}
            className="btn-primary w-full group py-3 md:py-4 h-12 md:h-14 flex items-center justify-center glow-on-hover"
          >
            {loading ? (
              <div className="loader-generate">
                <div /> <div /> <div />
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Initialize Generation</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* AI Assurance */}
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 flex items-start gap-3 md:gap-4 border border-slate-100">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
            <span className="text-rayeva-emerald text-sm animate-pulse">✨</span>
          </div>
          <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed italic">
            "The Pulse engine will cross-reference 4,000+ sustainable data points to design an optimal strategy based on your mission objectives."
          </p>
        </div>
      </form>
    </div>
  );
}
