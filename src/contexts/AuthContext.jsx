/**
 * AuthContext.jsx
 * 提供身份驗證相關的 Context 和 Provider 組件
 * 管理用戶登入狀態、角色權限和身份驗證功能
 */

// 引入必要的 React hooks 和 Firebase 身份驗證方法
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  signInWithRedirect
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// 創建身份驗證 Context
const AuthContext = createContext();

// 創建 Google 提供者實例
const googleProvider = new GoogleAuthProvider();
// 設定 Google 登入選項
googleProvider.setCustomParameters({
  prompt: 'select_account',
  display: 'popup'
});

/**
 * AuthProvider 組件 - 提供身份驗證相關的狀態和方法
 * @param {Object} props
 * @param {ReactNode} props.children - 子組件
 */
export function AuthProvider({ children }) {
  // 狀態管理
  const [currentUser, setCurrentUser] = useState(null);  // 當前登入用戶
  const [userRole, setUserRole] = useState(null);        // 用戶角色
  const [loading, setLoading] = useState(true);          // 載入狀態
  const [error, setError] = useState(null);              // 錯誤狀態
  
  // 新增側邊欄狀態
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // 從 localStorage 讀取之前的狀態，預設為 false
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // 切換側邊欄狀態
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
      return newState;
    });
  };

  /**
   * 設定登入持久性
   * @param {boolean} rememberMe - 是否記住登入狀態
   */
  const setPersistenceType = async (rememberMe) => {
    try {
      await setPersistence(auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
    } catch (error) {
      console.error('設定持久性失敗:', error);
      throw error;
    }
  };

  /**
   * 用戶註冊函數
   * @param {string} email - 用戶郵箱
   * @param {string} password - 用戶密碼
   * @param {string} displayName - 用戶顯示名稱
   * @returns {Promise<UserCredential>} Firebase 用戶憑證
   */
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 用戶登入函數
   * @param {string} email - 用戶郵箱
   * @param {string} password - 用戶密碼
   * @param {boolean} rememberMe - 是否記住登入狀態
   * @returns {Promise<UserCredential>} Firebase 用戶憑證
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      await setPersistenceType(rememberMe);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Google 登入函數
   * @param {boolean} rememberMe - 是否記住登入狀態
   * @returns {Promise<UserCredential>} Firebase 用戶憑證
   */
  const googleLogin = async (rememberMe = false) => {
    try {
      await setPersistenceType(rememberMe);
      const result = await signInWithPopup(auth, googleProvider);
      // 確保關閉彈出視窗
      if (window.opener) {
        window.close();
      }
      return result;
    } catch (error) {
      console.error('Google 登入失敗:', error);
      // 如果是彈出視窗被阻擋，嘗試使用重定向方式
      if (error.code === 'auth/popup-blocked') {
        return await signInWithRedirect(auth, googleProvider);
      }
      throw error;
    }
  };

  /**
   * 用戶登出函數
   * 清除用戶角色並登出
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      // 清除本地儲存的所有用戶相關資料
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('theme');
      // 重置狀態
      setCurrentUser(null);
      setError(null);
    } catch (error) {
      console.error('登出失敗:', error);
      throw error;
    }
  };

  /**
   * 檢查用戶角色權限
   * @param {string} requiredRole - 需要的角色權限
   * @returns {boolean} 是否具有權限
   */
  const checkUserRole = (requiredRole) => {
    return userRole === requiredRole || userRole === 'admin';
  };
  
  /**
   * 檢查是否為管理員
   * @returns {boolean} 是否為管理員
   */
  const isAdmin = () => {
    return userRole === 'admin';
  };

  /**
   * 重新驗證用戶
   * @param {string} currentPassword - 當前密碼
   * @returns {Promise<boolean>} 驗證結果
   */
  const reauthenticateUser = async (currentPassword) => {
    try {
      if (!currentUser) {
        throw new Error('沒有登入的用戶');
      }
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      console.error('重新驗證失敗:', error);
      throw error;
    }
  };

  /**
   * 更新用戶密碼
   * 先重新驗證用戶身份，然後更新密碼
   * @param {string} currentPassword - 當前密碼，用於重新驗證用戶身份
   * @param {string} newPassword - 要設置的新密碼
   * @returns {Promise<boolean>} 更新結果，成功返回true，失敗則拋出錯誤
   * @throws {Error} 當用戶未登入、驗證失敗或密碼更新失敗時拋出錯誤
   */
  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      // 檢查用戶是否已登入
      if (!currentUser) {
        throw new Error('沒有登入的用戶');
      }
      // 先進行身份重新驗證
      await reauthenticateUser(currentPassword);
      // 更新用戶密碼
      await updatePassword(currentUser, newPassword);
      return true;
    } catch (error) {
      console.error('更新密碼失敗:', error);
      throw error;
    }
  };

  /**
   * 更新用戶個人資料
   * @param {Object} data - 要更新的資料
   * @returns {Promise<boolean>} 更新結果
   */
  const updateUserProfile = async (data) => {
    try {
      if (!currentUser) {
        throw new Error('沒有登入的用戶');
      }
      await updateProfile(currentUser, data);
      return true;
    } catch (error) {
      console.error('更新個人資料失敗:', error);
      throw error;
    }
  };

  /**
   * 處理身份驗證錯誤
   * @param {Error} error - Firebase 錯誤對象
   * @returns {string} 本地化的錯誤訊息
   */
  const handleAuthError = (error) => {
    const errorMessages = {
      'auth/user-not-found': '找不到該用戶',
      'auth/wrong-password': '密碼錯誤',
      'auth/email-already-in-use': '該電子郵件已被使用',
      'auth/invalid-email': '無效的電子郵件格式',
      'auth/weak-password': '密碼強度不足',
      'auth/network-request-failed': '網路連接失敗',
      'auth/too-many-requests': '登入嘗試次數過多，請稍後再試',
      'default': '發生未知錯誤'
    };
    return errorMessages[error.code] || errorMessages.default;
  };

  /**
   * 發送重設密碼郵件
   * @param {string} email - 用戶郵箱
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('發送重設密碼郵件失敗:', error);
      throw error;
    }
  };

  // 監聽用戶身份驗證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // 保存用戶登入狀態到 localStorage
        localStorage.setItem('isLoggedIn', 'true');
        try {
          // 從 Firestore 獲取用戶角色信息
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'user');
            localStorage.setItem('userRole', userData.role || 'user');
          } else {
            setUserRole('user');
            localStorage.setItem('userRole', 'user');
          }
        } catch (error) {
          console.error('獲取用戶角色失敗:', error);
          setUserRole('user');
          localStorage.setItem('userRole', 'user');
        }
      } else {
        // 清除登入狀態
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
      }
      
      setLoading(false);
    });

    // 清理訂閱
    return () => unsubscribe();
  }, []);

  // 定義 Context 值物件，包含所有身份驗證相關的狀態和方法
  const value = {
    currentUser,      // 當前登入的用戶物件
    userRole,         // 用戶角色(admin/user)
    isAdmin,          // 是否為管理員
    checkUserRole,    // 檢查用戶角色的方法
    register,         // 註冊方法
    login,           // 登入方法
    googleLogin,     // Google 登入方法
    logout,          // 登出方法
    reauthenticateUser,  // 重新驗證用戶身份
    updateUserPassword,   // 更新用戶密碼
    updateUserProfile,    // 更新用戶資料
    handleAuthError,      // 處理身份驗證錯誤
    resetPassword,        // 發送重設密碼郵件
    loading,             // 載入狀態
    error,               // 錯誤訊息
    // 新增側邊欄相關的狀態和方法
    isSidebarCollapsed,
    toggleSidebar
  };

  // 回傳 AuthContext.Provider 組件，並傳入 value 物件
  // 只有在非載入狀態時才渲染子組件
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * 自定義 Hook - 用於獲取 Auth Context
 * @returns {Object} Auth Context 值
 * @throws {Error} 如果在 Provider 外使用則拋出錯誤
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
}