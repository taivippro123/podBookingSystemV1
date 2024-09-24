import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCfPtpbLSwj4KIefldA0vu1ifxQ86ouAgw",
  authDomain: "pod-booking-system-50fd7.firebaseapp.com",
  projectId: "pod-booking-system-50fd7",
  storageBucket: "pod-booking-system-50fd7.appspot.com",
  messagingSenderId: "201848809653",
  appId: "1:201848809653:web:e961c235e18ff6d96876fc",
  measurementId: "G-B7PHS7M6FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };