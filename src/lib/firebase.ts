import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "**********************************",
  authDomain: "*************************",
  projectId: "*******************",
  storageBucket: "*****************************",
  messagingSenderId: "*********************",
  appId: "************************************"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth to use in login/signup
export const auth = getAuth(app);

// Initialize Firestore and export db
export const db = getFirestore(app);
