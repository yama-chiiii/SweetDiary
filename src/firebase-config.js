import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firestore用のインポートを追加

const firebaseConfig = {
    apiKey: "AIzaSyD8Xzt4Xesf2KT5jYMp-8wPzvo3nJPRzKU",
    authDomain: "sweet-diary-e0e3b.firebaseapp.com",
    projectId: "sweet-diary-e0e3b",
    storageBucket: "sweet-diary-e0e3b.appspot.com",
    messagingSenderId: "43675353573",
    appId: "1:43675353573:web:e0e3b"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);  // Firestoreを初期化してエクスポート
