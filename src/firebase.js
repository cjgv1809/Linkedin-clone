import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAKs-JW55MH0wLeh3KZvnnahTOT8NCk6PA",
  authDomain: "linkedin-clone-55812.firebaseapp.com",
  projectId: "linkedin-clone-55812",
  storageBucket: "linkedin-clone-55812.appspot.com",
  messagingSenderId: "454106962921",
  appId: "1:454106962921:web:ddfeb540f81e8638b40978",
  measurementId: "G-B3WSSR0K7H",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { db, auth, provider, storage };
