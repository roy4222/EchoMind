/**
 * 重設密碼頁面組件
 * 提供使用者重設密碼的介面
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ResetPassword 組件 - 處理使用者重設密碼
 * @returns {JSX.Element} 重設密碼頁面的 JSX 元素
 */
const ResetPassword = () => {
  const { resetPassword, handleAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setSuccess('重設密碼郵件已發送！請檢查您的收件匣。');
      setEmail(''); // 清空輸入框
    } catch (error) {
      console.error('重設密碼失敗:', error);
      setError(handleAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 主容器 - 全屏高度、居中顯示、漸變背景
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* 重設密碼卡片 - 有陰影和懸停效果 */}
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        {/* 標題區域 */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            重設密碼
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            請輸入您的電子郵件地址，我們將發送重設密碼的連結給您
          </p>
          {error && (
            <div className="mt-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-2 p-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg">
              {success}
            </div>
          )}
        </div>
        {/* 重設密碼表單 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 輸入欄位容器 */}
          <div className="rounded-md shadow-sm space-y-4">
            {/* 電子郵件輸入區域 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="****@email.com"
              />
            </div>
          </div>

          {/* 發送重設連結按鈕 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '發送中...' : '發送重設連結'}
            </button>
          </div>
        </form>
        
        {/* 返回登入連結區域 */}
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/sign" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group">
              {/* 返回箭頭圖示 - 有懸停動畫效果 */}
              <svg className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 