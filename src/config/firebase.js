// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDXvSiNUJpJAz_hCJ5-E4km8_nDZL1z5DM",
authDomain: "pos-sytem-de8cd.firebaseapp.com",
projectId: "pos-sytem-de8cd",
storageBucket: "pos-sytem-de8cd.firebasestorage.app",
messagingSenderId: "390880600758",
appId: "1:390880600758:web:111dd268edefe438453c17",
measurementId: "G-H9MYT97X9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage =getStorage(app);













// His credentials 
// apiKey: "AIzaSyBXYILTviGdxT_T0RyHeoaWcLbysujBVpA",
// authDomain: "food-order-d51fb.firebaseapp.com",
// projectId: "food-order-d51fb",
// storageBucket: "food-order-d51fb.appspot.com",
// messagingSenderId: "100874619758",
// appId: "1:100874619758:web:5e47d0dbc82514e3b6cf7f",
// measurementId: "G-8LPRFYYQJK",





//my creds
