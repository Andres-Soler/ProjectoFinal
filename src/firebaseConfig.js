import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB25dkjl6sxKKWRe1opsVuricux1zZElJc",
  authDomain: "proyectofinalgod.firebaseapp.com",
  projectId: "proyectofinalgod",
  storageBucket: "proyectofinalgod.firebasestorage.app",
  messagingSenderId: "643052146207",
  appId: "1:643052146207:web:c7fbbb767273101ca60f2a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
export { auth, db };