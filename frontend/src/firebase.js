import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseFallbackConfig = {
  apiKey: 'AIzaSyDtbUt71NyOO5W4h-_3lrhuc1sx35tBDfc',
  authDomain: 'project2-22717.firebaseapp.com',
  projectId: 'project2-22717',
  storageBucket: 'project2-22717.appspot.com',
  messagingSenderId: '435431535588',
  appId: '1:435431535588:web:5b1fd69e82d19fd535cdf1',
};

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || firebaseFallbackConfig.apiKey).trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseFallbackConfig.authDomain).trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseFallbackConfig.projectId).trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseFallbackConfig.storageBucket).trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseFallbackConfig.messagingSenderId).trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || firebaseFallbackConfig.appId).trim(),
};

console.log('Firebase Config Loaded:', {
  apiKey: firebaseConfig.apiKey ? '[set]' : '[missing]',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? '[set]' : '[missing]',
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with required scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'consent'
});
