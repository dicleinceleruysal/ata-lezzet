import type { Metadata, Viewport } from 'next';
import './globals.css';
import PwaRegister from '@/components/PwaRegister';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f59e0b',
};

export const metadata: Metadata = {
  title: 'Ata Lezzet | Yemek Menüsü',
  description: 'Ata Yayıncılık günlük ve aylık yemek listesi takvimi.',
  applicationName: 'Ata Lezzet',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ata Lezzet',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased selection:bg-amber-100 selection:text-amber-900">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
