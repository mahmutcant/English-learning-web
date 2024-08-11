// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqEQF0heatiYwvZcoobhMnk6iJ3UXEBRw",
  authDomain: "reminder-english-learn.firebaseapp.com",
  databaseURL: "https://reminder-english-learn-default-rtdb.firebaseio.com",
  projectId: "reminder-english-learn",
  storageBucket: "reminder-english-learn.appspot.com",
  messagingSenderId: "934145013483",
  appId: "1:934145013483:web:d05f6095e2a94531b8f0ae"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
export {app, auth,db}