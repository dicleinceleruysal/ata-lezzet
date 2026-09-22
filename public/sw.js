// Ata Lezzet PWA Service Worker
const CACHE_NAME = 'ata-lezzet-v1.4.2';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/ata-logo.png',
  '/ata-lezzet-logo.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
];

// 1. Kurulum (Install)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Precache kısmi uyarı:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Etkinleştirme (Activate & Eski Cache Temizliği)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. İstekleri Karşılama (Fetch Strategy)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Yalnızca GET isteklerini önbellekle
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Chrome eklentileri veya harici protokolleri atla
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // A) API İstekleri: Network-First (Ağ öncelikli, bağlantı yoksa son önbellek)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // B) Statik Yemek Fotoğrafları & İkonlar: Cache-First (Hızlı açılış, yoksa ağdan çek ve sakla)
  if (
    url.pathname.startsWith('/dishes/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // C) HTML Sayfaları & Genel İstekler: Network-First (Çevrimdışıysa anasayfayı ver)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // D) Diğer Statik JS/CSS Varlıkları: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
