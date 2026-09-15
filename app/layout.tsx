import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daylist · A little more done',
  description: 'A simple place to plan your work and celebrate progress.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
