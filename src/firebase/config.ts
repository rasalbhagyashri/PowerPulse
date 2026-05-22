'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCARD_QK_S0yywo54qm-CKrG-Jl3TRuQFI",
  authDomain: "esp8266-4753b.firebaseapp.com",
  databaseURL: "https://esp8266-4753b-default-rtdb.firebaseio.com",
  projectId: "esp8266-4753b",
  storageBucket: "esp8266-4753b.firebasestorage.app",
  messagingSenderId: "504595904280",
  appId: "1:504595904280:web:ef313fad74fe765ef6906d",
  measurementId: "G-E1S7Q4NS4M"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
