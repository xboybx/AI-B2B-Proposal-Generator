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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Client Information
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          Enter client details to generate a customized proposal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Client Name */}
        <div>
          <label
            htmlFor="clientName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="e.g., GreenTech Solutions Inc."
            disabled={disabled}
            className={`w-full px-4 py-3 text-gray-900 rounded-lg border ${errors.clientName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
          )}
        </div>

        {/* Total Budget */}
        <div>
          <label
            htmlFor="totalBudget"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Budget (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              id="totalBudget"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="e.g., 50000"
              min="1"
              step="0.01"
              disabled={disabled}
              className={`w-full pl-8 pr-4 py-3 text-gray-900 rounded-lg border ${errors.totalBudget
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
                } focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.totalBudget && (
            <p className="mt-1 text-sm text-red-500">{errors.totalBudget}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter the total budget available for sustainable products
          </p>
        </div>

        {/* Sustainability Goals */}
        <div>
          <label
            htmlFor="sustainabilityGoals"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sustainability Goals <span className="text-red-500">*</span>
          </label>
          <textarea
            id="sustainabilityGoals"
            name="sustainabilityGoals"
            value={formData.sustainabilityGoals}
            onChange={handleChange}
            placeholder="e.g., Reduce plastic waste, achieve carbon neutrality, switch to recycled materials..."
            rows={4}
            disabled={disabled}
            className={`w-full px-4 py-3 text-gray-900 rounded-lg border ${errors.sustainabilityGoals
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
          {errors.sustainabilityGoals && (
            <p className="mt-1 text-sm text-red-500">
              {errors.sustainabilityGoals}
            </p>
          )}

          {/* Goal Presets */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
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
                  className="text-xs px-3 py-1 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="loading-spinner" />
              <span>Generating Proposal...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Generate Proposal</span>
            </>
          )}
        </button>

        {/* Info Note */}
        <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-blue-700">
            Our AI will analyze your requirements and generate a comprehensive
            proposal with sustainable product recommendations, budget allocation,
            and environmental impact metrics.
          </p>
        </div>
      </form>
    </div>
  );
}
