import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ata Lezzet | Yemekhane Menü Sistemi',
    short_name: 'Ata Lezzet',
    description: 'Ata Yayıncılık Günlük ve Aylık Tabldot Yemek Menüsü Takvimi',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfaf5',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    lang: 'tr',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
