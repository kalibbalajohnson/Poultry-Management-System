// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA2zsvdgELSuJEDi4Q3sMmaRqf7Gxxr88",
  authDomain: "poultry-pal-09.firebaseapp.com",
  projectId: "poultry-pal-09",
  storageBucket: "poultry-pal-09.firebasestorage.app",
  messagingSenderId: "646867194696",
  appId: "1:646867194696:web:496ac2e2bce2ec52e7597d",
  measurementId: "G-PNLM0BCNEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
