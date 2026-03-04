'use client';

import { useState } from 'react';

export default function ProposalPreview({
  proposal,
  onSave,
  onReset,
  saving,
  saved,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'impact', label: 'Impact', icon: '🌱' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Proposal Preview
            </h2>
            <p className="text-secondary-100 text-sm mt-1">
              {proposal.clientName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-secondary-100 text-sm">Total Budget</p>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(proposal.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
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

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex space-x-3">
          <button
            onClick={onSave}
            disabled={saving || saved}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400'
            }`}
          >
            {saving ? (
              <>
                <div className="loading-spinner border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : saved ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Saved!</span>
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Save to Database</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={saving}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            New Proposal
          </button>
        </div>

        {proposal.timeline && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            <span className="font-medium">Estimated Timeline:</span>{' '}
            {proposal.timeline}
          </p>
        )}
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
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-primary-600">
            {proposal.productMix?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Product Categories</p>
        </div>
        <div className="bg-secondary-50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-secondary-600">
            {totalProducts}
          </p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
      </div>

      {/* Sustainability Goals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">
          Sustainability Goals
        </h4>
        <p className="text-gray-700">{proposal.sustainabilityGoals}</p>
      </div>

      {/* Key Message */}
      {proposal.impactPositioningSummary?.keyMessage && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <span className="mr-2">🌟</span> Impact Highlight
          </h4>
          <p className="text-green-700">
            {proposal.impactPositioningSummary.keyMessage}
          </p>
        </div>
      )}

      {/* Notes */}
      {proposal.notes && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            Additional Notes
          </h4>
          <p className="text-blue-700">{proposal.notes}</p>
        </div>
      )}
    </div>
  );
}

function ProductsTab({ proposal, formatCurrency }) {
  return (
    <div className="space-y-6">
      {proposal.productMix?.map((category, catIndex) => (
        <div key={catIndex} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">{category.category}</h4>
          </div>
          <div className="divide-y divide-gray-100">
            {category.products?.map((product, prodIndex) => (
              <div key={prodIndex} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{product.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-3">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {product.sustainabilityFeature}
                      </span>
                      <span className="text-xs text-gray-500">
                        Qty: {product.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(product.totalPrice)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(product.unitPrice)} each
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
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Budget</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(proposal.totalBudget)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Allocated</span>
          <span className="font-semibold text-primary-600">
            {formatCurrency(totalAllocated)}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(proposal.totalBudget - totalAllocated)}
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
        <div className="space-y-3">
          {proposal.costBreakdown?.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(item.allocatedAmount)} ({item.percentageOfBudget}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentageOfBudget}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Allocation Table */}
      {proposal.budgetAllocation && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Budget Allocation by Category
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Category</th>
                  <th className="px-4 py-2 text-right text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(proposal.budgetAllocation).map(
                  ([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(value)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ImpactTab({ proposal }) {
  const impact = proposal.impactPositioningSummary;

  if (!impact) {
    return (
      <div className="text-center py-8 text-gray-500">
        No impact data available
      </div>
    );
  }

  const impactMetrics = [
    {
      label: 'Plastic Saved',
      value: impact.plasticSavedKg,
      unit: 'kg',
      icon: '🥤',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Carbon Offset',
      value: impact.carbonOffsetKg,
      unit: 'kg CO₂',
      icon: '🌬️',
      color: 'bg-gray-50 text-gray-700',
    },
    {
      label: 'Trees Equivalent',
      value: impact.treesEquivalent,
      unit: 'trees',
      icon: '🌳',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Water Saved',
      value: impact.waterSavedLiters,
      unit: 'liters',
      icon: '💧',
      color: 'bg-cyan-50 text-cyan-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {impactMetrics.map(
          (metric, index) =>
            metric.value && (
              <div
                key={index}
                className={`${metric.color} p-4 rounded-lg text-center`}
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                <p className="text-sm opacity-80">{metric.unit}</p>
                <p className="text-xs mt-1 opacity-60">{metric.label}</p>
              </div>
            )
        )}
      </div>

      {/* Key Message */}
      {impact.keyMessage && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white">
          <h4 className="font-semibold mb-2 flex items-center">
            <span className="mr-2">🌍</span> Environmental Impact
          </h4>
          <p className="text-green-100">{impact.keyMessage}</p>
        </div>
      )}

      {/* Impact Context */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">
          What This Means
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {impact.plasticSavedKg > 0 && (
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                Eliminates {impact.plasticSavedKg.toLocaleString()} kg of plastic waste
              </span>
            </li>
          )}
          {impact.carbonOffsetKg > 0 && (
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                Offsets {impact.carbonOffsetKg.toLocaleString()} kg of CO₂ emissions
              </span>
            </li>
          )}
          {impact.treesEquivalent > 0 && (
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                Equivalent to planting {impact.treesEquivalent.toLocaleString()} trees
              </span>
            </li>
          )}
          {impact.waterSavedLiters > 0 && (
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                Saves {impact.waterSavedLiters.toLocaleString()} liters of water
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
