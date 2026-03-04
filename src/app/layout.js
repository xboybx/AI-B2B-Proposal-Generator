import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rayeva B2B Proposal Generator',
  description: 'AI-powered sustainable commerce proposal generator for B2B clients',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 z-10 flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-bold text-primary-600">
                      Rayeva
                    </span>
                  </div>
                  <div className="hidden md:block ml-4">
                    <span className="text-gray-500">|</span>
                    <span className="ml-4 text-gray-600 font-medium">
                      B2B Proposal Generator
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Sustainable Commerce Platform
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-sm font-semibold">
                      SG
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Body: Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  © 2026 Rayeva. All rights reserved.
                </p>
                <p className="text-sm text-gray-500">
                  Powered by OpenRouter AI
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
