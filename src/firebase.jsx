import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTGgQZyXDbylE-Yi3SY_jqzFbCBXu8rgU",
  authDomain: "develpors-cohort.firebaseapp.com",
  databaseURL: "https://develpors-cohort-default-rtdb.firebaseio.com",
  projectId: "develpors-cohort",
  storageBucket: "develpors-cohort.firebasestorage.app",
  messagingSenderId: "863808627274",
  appId: "1:863808627274:web:1296b3c2f138bc1145bcb3",
  measurementId: "G-NED36NFDDJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };