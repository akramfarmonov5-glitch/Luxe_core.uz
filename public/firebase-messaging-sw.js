importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyB51ZGJCZGPJBo5Twwd2NKkPwT1XxQCE2w",
    authDomain: "luxecore-uz.firebaseapp.com",
    projectId: "luxecore-uz",
    storageBucket: "luxecore-uz.firebasestorage.app",
    messagingSenderId: "511112045205",
    appId: "1:511112045205:web:84a73da5ac99b27518719c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'LuxeCore';
    const notificationOptions = {
        body: payload.notification?.body || 'Yangi xabar!',
        icon: '/logo.png',
        badge: '/logo.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://luxe-core-uz-three.vercel.app/')
    );
});
