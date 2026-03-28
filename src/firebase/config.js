// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJFwnRmt0gDgJBy8BpgZq6fVhIy3iFXdU",
  authDomain: "hospital-d942b.firebaseapp.com",
  projectId: "hospital-d942b",
  storageBucket: "hospital-d942b.firebasestorage.app",
  messagingSenderId: "971782431060",
  appId: "1:971782431060:web:2bf65e71ec1c278c39a8c1"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;