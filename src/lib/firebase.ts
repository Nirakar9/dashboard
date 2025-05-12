import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3xk-98wced93dXycj9guATl1APxHsHQY",
  authDomain: "dashboard-40766.firebaseapp.com",
  projectId: "dashboard-40766",
  storageBucket: "dashboard-40766.appspot.com",
  messagingSenderId: "792342821991",
  appId: "1:792342821991:web:b49213c234663156be28c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth to use in login/signup
export const auth = getAuth(app);

// Initialize Firestore and export db
export const db = getFirestore(app);
