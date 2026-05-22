'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSy...", // Using existing placeholder or generic key
  authDomain: "esp-cloud-4f474.firebaseapp.com",
  databaseURL: "https://esp-cloud-4f474-default-rtdb.firebaseio.com",
  projectId: "esp-cloud-4f474",
  storageBucket: "esp-cloud-4f474.appspot.com",
  messagingSenderId: "390945656991",
  appId: "1:390945656991:web:..."
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
