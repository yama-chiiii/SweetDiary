import { initializeApp } from 'firebase/app';
import 'firebase/auth'; // 認証機能を使用する場合
import { getAuth } from 'firebase/auth';

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
