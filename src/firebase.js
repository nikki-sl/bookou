import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBphWEX4y8UZqcggR-cor7VDq8wAEch7a0",
  authDomain: "bookou-2026.firebaseapp.com",
  projectId: "bookou-2026",
  storageBucket: "bookou-2026.firebasestorage.app",
  messagingSenderId: "546117524651",
  appId: "1:546117524651:web:6528e33fd23b2cc999ebee"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);