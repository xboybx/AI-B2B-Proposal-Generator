'use client';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h3>
          <p className="text-red-600 mt-1">{message}</p>

          {/* Troubleshooting Tips */}
          <div className="mt-4 bg-white rounded-lg p-4 border border-red-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Try these steps:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Check your internet connection
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Verify your OpenAI API key is configured correctly
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Make sure the budget amount is valid
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Try again with a shorter sustainability goals description
              </li>
            </ul>
          </div>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
