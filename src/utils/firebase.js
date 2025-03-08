// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 配置（從 Firebase 控制台獲取）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_SOULNET_TEST_API_KEY,
  authDomain: import.meta.env.VITE_SOULNET_TEST_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_SOULNET_TEST_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SOULNET_TEST_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SOULNET_TEST_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SOULNET_TEST_APP_ID,
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
