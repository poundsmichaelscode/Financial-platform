import type { Metadata } from 'next';
import { WebVitals } from '@/components/monitoring/WebVitals';
import './globals.css';

export const metadata: Metadata = {
  title: 'High-Performance Financial Platform',
  description: 'Bloomberg-style real-time market dashboard built with Next.js 14.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
