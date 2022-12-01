// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwIvcqXtfTXvAIYg5EYwDQ7MZPiA5ZUmw",
  authDomain: "esp8266-device-db.firebaseapp.com",
  databaseURL: "https://esp8266-device-db-default-rtdb.firebaseio.com",
  projectId: "esp8266-device-db",
  storageBucket: "esp8266-device-db.appspot.com",
  messagingSenderId: "323422098096",
  appId: "1:323422098096:web:ff59a606ae40276efaa175",
  measurementId: "G-7L8D004HB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
