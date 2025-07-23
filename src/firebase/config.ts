// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg2M75YLheNqv7KUAt58agzVnTXZWQUNc",
  authDomain: "security-system-6cff2.firebaseapp.com",
  databaseURL: "https://security-system-6cff2-default-rtdb.firebaseio.com",
  projectId: "security-system-6cff2",
  storageBucket: "security-system-6cff2.firebasestorage.app",
  messagingSenderId: "10913293973",
  appId: "1:10913293973:web:8d9e875ab6503a0be51d9c",
  measurementId: "G-CR8778JJRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { database, analytics };
export default app;