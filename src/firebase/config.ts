'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXTz_U-fZSzdaQtiUpZY18a_tpmhmS9S0",
  authDomain: "esp-cloud-4f474.firebaseapp.com",
  databaseURL: "https://esp-cloud-4f474-default-rtdb.firebaseio.com",
  projectId: "esp-cloud-4f474",
  storageBucket: "esp-cloud-4f474.firebasestorage.app",
  messagingSenderId: "912836456618",
  appId: "1:912836456618:web:9fc332be7b8a5569a1a0d3",
  measurementId: "G-2WT4NBB8WP"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
