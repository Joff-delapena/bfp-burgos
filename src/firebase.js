// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZisflUAeJjd3AiHuq3O4gHEfcmoboHnM",
  authDomain: "bfp-burgos.firebaseapp.com",
  projectId: "bfp-burgos",
  storageBucket: "bfp-burgos.firebasestorage.app",
  messagingSenderId: "636907653019",
  appId: "1:636907653019:web:25b210eec95e1f62f8c33e",
  measurementId: "G-4CY4R23F5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ ADD THESE EXPORTS (VERY IMPORTANT)
export const db = getFirestore(app);
export const storage = getStorage(app);