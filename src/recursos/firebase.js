// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-sVDItNU-6BHaqhmqAiiyUTEditNcA7o",
  authDomain: "chatbotsito-7deb6.firebaseapp.com",
  projectId: "chatbotsito-7deb6",
  storageBucket: "chatbotsito-7deb6.appspot.com",
  messagingSenderId: "511212019411",
  appId: "1:511212019411:web:d9d2c4e2f6ff3a2150fe26",
  measurementId: "G-HB0YYW6H45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//npm install firebase

//npm install -g firebase-tools

//firebase login

//firebase init

//firebase deploy