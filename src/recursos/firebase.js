// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe5xaVV0uyTfoKLcQcOw-jYYaA12i8aug",
  authDomain: "chatbot-d9174.firebaseapp.com",
  projectId: "chatbot-d9174",
  storageBucket: "chatbot-d9174.appspot.com",
  messagingSenderId: "278828509732",
  appId: "1:278828509732:web:194b1d15fbe1ba079f06b1",
  measurementId: "G-G9S3H42KS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);