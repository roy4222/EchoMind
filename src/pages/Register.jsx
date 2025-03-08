/**
 * 註冊頁面組件
 * 提供使用者建立新帳號的介面
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../utils/firebase';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';

/**
 * Register 組件 - 處理使用者註冊
 * @returns {JSX.Element} 註冊頁面的 JSX 元素
 */
const Register = () => {
  const navigate = useNavigate();
  
  /**
   * 表單資料狀態
   * @type {Object}
   * @property {string} username - 使用者名稱
   * @property {string} email - 使用者電子郵件
   * @property {string} password - 使用者密碼
   * @property {string} confirmPassword - 確認密碼
   */
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    // 驗證密碼
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', content: '兩次輸入的密碼不相符' });
      setIsLoading(false);
      return;
    }

    // 驗證密碼長度
    if (formData.password.length < 6) {
      setMessage({ type: 'error', content: '密碼長度至少需要 6 個字元' });
      setIsLoading(false);
      return;
    }

    try {
      // 建立帳號
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 更新使用者資料
      await updateProfile(result.user, {
        displayName: formData.username
      });

      console.log('註冊成功:', result.user);
      setMessage({ type: 'success', content: '註冊成功！正在為您導向...' });

      // 延遲導向到登入頁面
      setTimeout(() => {
        navigate('/sign');
      }, 1500);
    } catch (error) {
      console.error('註冊失敗:', error);
      let errorMessage = '註冊失敗，請稍後再試';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = '此電子郵件已被使用';
          break;
        case 'auth/invalid-email':
          errorMessage = '無效的電子郵件格式';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = '註冊功能尚未啟用，請聯絡管理員';
          break;
        case 'auth/weak-password':
          errorMessage = '密碼強度不足';
          break;
      }
      
      setMessage({ type: 'error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState 
        type="dots" 
        size="lg" 
        text={
          formData.username ? 
          `正在為 ${formData.username} 建立帳號...` : 
          '建立新帳號中...'
        }
        fullScreen={true} 
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            建立新帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            開始您的旅程
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                使用者名稱
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="使用者名稱"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="****@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                確認密碼
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                <path fill="currentColor" d="M18 11h-2q-.425 0-.712-.288T15 10t.288-.712T16 9h2V7q0-.425.288-.712T19 6t.713.288T20 7v2h2q.425 0 .713.288T23 10t-.288.713T22 11h-2v2q0 .425-.288.713T19 14t-.712-.288T18 13zm-9 1q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 6v-.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2v.8q0 .825-.587 1.413T15 20H3q-.825 0-1.412-.587T1 18m2 0h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T9 15t-2.775.338T3.5 16.35q-.225.125-.363.35T3 17.2zm6-8q.825 0 1.413-.587T11 8t-.587-1.412T9 6t-1.412.588T7 8t.588 1.413T9 10m0 8"/>
              </svg>
              立即註冊
            </button>
          </div>
        </form>
        
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/sign" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group">
              <svg className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回登入
            </Link>
          </div>
        </div>
      </div>

      {message.content && (
        <SuccessMessage
          message={message.content}
          type={message.type}
          onClose={() => setMessage({ type: '', content: '' })}
          duration={1500}
        />
      )}
    </div>
  );
};

export default Register; 