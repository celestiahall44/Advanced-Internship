import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIsv7QK4v5Gt86gSJuX2wG5k4UjCyg-YE",
  authDomain: "advanced-internship-72587.firebaseapp.com",
  projectId: "advanced-internship-72587",
  storageBucket: "advanced-internship-72587.firebasestorage.app",
  messagingSenderId: "705605728237",
  appId: "1:705605728237:web:b170cba4bbf3ce1cc519e4",
  measurementId: "G-Z4KPV3NKXS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
