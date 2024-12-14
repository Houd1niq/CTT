declare const self: ServiceWorkerGlobalScope;
import {precacheAndRoute} from 'workbox-precaching'
import {clientsClaim} from 'workbox-core'

// cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

self.addEventListener('install', () => {
  console.log('[Service Worker] Installed');
});

self.addEventListener('activate', () => {
  self.registration.showNotification('PWA Ready', {
    body: 'Service Worker is active!',
    icon: '/android-chrome-192x192.png',
  })
});

setInterval(() => {
  self.registration.showNotification('Проверьте информацию о патентах', {
    icon: '/android-chrome-192x192.png',
    tag: 'hourly-notification',
  })
}, 60 * 1000);

