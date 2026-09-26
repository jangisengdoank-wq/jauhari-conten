import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBy1Q1bhwO01ONo2qugZL4dcuUfCnMwlI0",
  authDomain: "jauhariconten.firebaseapp.com",
  projectId: "jauhariconten",
  storageBucket: "jauhariconten.firebasestorage.app",
  messagingSenderId: "882962993803",
  appId: "1:882962993803:web:e5456730328cc3eff7fa8e",
  measurementId: "G-QG1MHGGZG7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);