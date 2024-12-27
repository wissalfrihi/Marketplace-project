import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBrUSx6GCcBWB-gjCAU4J6xNiCWXrNNl4c",
  authDomain: "marketplaceweb-a6d94.firebaseapp.com",
  projectId: "marketplaceweb-a6d94",
  storageBucket: "marketplaceweb-a6d94.appspot.com",
  messagingSenderId: "875041706171",
  appId: "1:875041706171:web:8520def42d2210be5b599e",
  measurementId: "G-24Q91VRYCK"
};

const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);
const db = getFirestore(app);
 const storage = getStorage(app); // Export Firebase Storage


export { db, auth, storage };