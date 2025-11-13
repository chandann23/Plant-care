// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCYydkEIo-TPoEjeuHdDoBWQNhDEnP51RA',
  authDomain: 'plant-care-a5d3e.firebaseapp.com',
  projectId: 'plant-care-a5d3e',
  storageBucket: 'plant-care-a5d3e.firebasestorage.app',
  messagingSenderId: '305509589045',
  appId: '1:305509589045:web:62eac32c90cb2cdd4a117c',
});

var messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  var notificationTitle = 'Plant Care Reminder';
  var notificationOptions = {
    body: 'You have a plant care task',
    icon: '/icon-192x192.png',
  };

  if (payload.notification) {
    notificationTitle = payload.notification.title || notificationTitle;
    notificationOptions.body = payload.notification.body || notificationOptions.body;
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://localhost:3000/tasks')
  );
});
