import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCO0T20uUs0BJhpyEE3QFA-kGhok0KOhPI",
  authDomain: "music-4253b.firebaseapp.com",
  projectId: "music-4253b",
  storageBucket: "music-4253b.appspot.com",
  appId: "1:563838254097:web:13f79a7306d337416905b0",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => console.error(`Firebase persistence error: ${error.code}`));

/** Collections */
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export { auth, db, storage, usersCollection, songsCollection, commentsCollection };
