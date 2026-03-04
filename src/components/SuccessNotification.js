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
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-sm">
        <div className="flex items-start">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
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
            </div>
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-semibold text-gray-900">{message}</h4>
            {proposalId && (
              <p className="text-xs text-gray-500 mt-1">
                Proposal ID: {proposalId}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
