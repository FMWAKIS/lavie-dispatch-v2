import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2-Hx_lNRXShgoKv3IOavHXr9_uAxqtMI",

  authDomain: "la-vie-mobile-e5c3e.firebaseapp.com",

  projectId: "la-vie-mobile-e5c3e",

  storageBucket: "la-vie-mobile-e5c3e.firebasestorage.app",

  messagingSenderId: "401950271070",

  appId: "1:401950271070:web:e9d82e90a669e4d9fb76cf",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);