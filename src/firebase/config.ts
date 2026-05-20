'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSy...", // Placeholder, will be replaced by actual config if available
  authDomain: "espcloud-1f722.firebaseapp.com",
  databaseURL: "https://espcloud-1f722-default-rtdb.firebaseio.com/",
  projectId: "espcloud-1f722",
  storageBucket: "espcloud-1f722.appspot.com",
  messagingSenderId: "390945656991",
  appId: "1:390945656991:web:..."
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
