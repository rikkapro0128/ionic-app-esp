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

const firebaseConfigAuthWeb = {
  apiKey: "AIzaSyBuRUejKkZ8ffQmn4XI_wfOuOKaFIX5VOg",
  authDomain: "esp8266-credentials.firebaseapp.com",
  databaseURL: "https://esp8266-credentials-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266-credentials",
  storageBucket: "esp8266-credentials.appspot.com",
  messagingSenderId: "850158074973",
  appId: "1:850158074973:web:bab741af4069438fede1b4",
  measurementId: "G-LN4VZY2QSM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuthWeb = initializeApp(firebaseConfigAuthWeb, 'auth-web');

export {
  appAuthWeb,
}

export default app;
