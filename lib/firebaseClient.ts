import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = typeof window !== 'undefined' && getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : null);

/**
 * Gets the Firebase Messaging instance, safely checking for SSR and browser compatibility.
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined' || !app) return null;
  
  try {
    const { isSupported } = await import('firebase/messaging');
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM is not supported in this browser.");
      return null;
    }
    return getMessaging(app);
  } catch (error) {
    console.error("FCM isSupported check failed:", error);
    return null;
  }
};

/**
 * Requests notification permissions and returns the FCM registration token.
 */
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission was not granted.");
      return null;
    }

    const queryParams = new URLSearchParams({
      apiKey: firebaseConfig.apiKey || '',
      authDomain: firebaseConfig.authDomain || '',
      projectId: firebaseConfig.projectId || '',
      storageBucket: firebaseConfig.storageBucket || '',
      messagingSenderId: firebaseConfig.messagingSenderId || '',
      appId: firebaseConfig.appId || '',
    }).toString();

    // Register dynamic Service Worker
    const swRegistration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${queryParams}`
    );

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
