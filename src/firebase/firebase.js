import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Fill these in a .env file at the project root (see .env.example).
// Every key must be prefixed with VITE_ for Vite to expose it to the client.
const firebaseConfig = {
  apiKey: "AIzaSyCY8DkiNsKELlJJ77jwVT2dkLl6QJ6yx8k",
  authDomain: "tailor-shop-b9a51.firebaseapp.com",
  projectId: "tailor-shop-b9a51",
  storageBucket: "tailor-shop-b9a51.firebasestorage.app",
  messagingSenderId: "47173112803",
  appId: "1:47173112803:web:d593e36c1ca7ae0c1406d6"
};


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
