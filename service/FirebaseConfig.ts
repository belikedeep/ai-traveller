import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMQ523HDl0LFcMYz3fRuqek6P8WeRfJo4",
  authDomain: "ai-trip-planner-4bc3a.firebaseapp.com",
  projectId: "ai-trip-planner-4bc3a",
  storageBucket: "ai-trip-planner-4bc3a.firebasestorage.app",
  messagingSenderId: "1097529601117",
  appId: "1:1097529601117:web:97dc319591f898974631b4",
  measurementId: "G-ZQ8X2E7DHX",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
