import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// We load these from Vite environment variables for security and flexibility.
// You can define these in a '.env' file in the root of your project:
// VITE_FIREBASE_API_KEY=xxx
// VITE_FIREBASE_AUTH_DOMAIN=xxx
// ...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDMbYCwfd9rophWQbYpklp6zNJ_IW3GKp4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexosia-cd5ca.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexosia-cd5ca",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexosia-cd5ca.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "653315282768",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:653315282768:web:0094d9277c79c8a5fafe55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
