import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// We load these from Vite environment variables for security and flexibility.
// You can define these in a '.env' file in the root of your project:
// VITE_FIREBASE_API_KEY=xxx
// VITE_FIREBASE_AUTH_DOMAIN=xxx
// ...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "PLACEHOLDER_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);
