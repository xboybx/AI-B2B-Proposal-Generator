import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Rayeva B2B Proposal Generator | Sustainable B2B Commerce',
  description: 'The future of AI-powered sustainable commerce proposal generation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
