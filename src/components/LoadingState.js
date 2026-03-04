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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse-green" />
            <div className="absolute inset-4 bg-primary-200 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Proposal
          </h3>

          {/* Loading Message */}
          <p className="text-gray-600 mb-6 h-6 transition-all duration-500">
            {loadingMessages[messageIndex]}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Progress Percentage */}
          <p className="text-sm text-gray-500 mt-2">
            {Math.min(Math.round(progress), 100)}% complete
          </p>

          {/* Info Note */}
          <p className="text-xs text-gray-400 mt-6">
            This may take up to 30 seconds. Please don&apos;t close this window.
          </p>
        </div>
      </div>
    </div>
  );
}
