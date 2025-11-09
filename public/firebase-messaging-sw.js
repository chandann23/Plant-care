// Firebase Cloud Messaging Service Worker

// Try to import Firebase scripts
try {
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

  // Initialize Firebase in the service worker
  firebase.initializeApp({
    apiKey: 'AIzaSyCYydkEIo-TPoEjeuHdDoBWQNhDEnP51RA',
    authDomain: 'plant-care-a5d3e.firebaseapp.com',
    projectId: 'plant-care-a5d3e',
    storageBucket: 'plant-care-a5d3e.firebasestorage.app',
    messagingSenderId: '305509589045',
    appId: '1:305509589045:web:62eac32c90cb2cdd4a117c',
  });

  const messaging = firebase.messaging();
} catch (error) {
  console.error('Error loading Firebase in service worker:', error);
}

// Handle background messages
if (typeof messaging !== 'undefined') {
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Plant Care Reminder';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a plant care task',
      icon: payload.notification?.icon || '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: payload.data?.scheduleId || 'plant-care',
      data: {
        url: payload.data?.url || '/tasks',
        scheduleId: payload.data?.scheduleId,
        plantId: payload.data?.plantId,
      },
      requireInteraction: false,
      vibrate: [200, 100, 200],
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/tasks';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open a new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
