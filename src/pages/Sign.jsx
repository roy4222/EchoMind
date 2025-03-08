/**
 * 登入頁面組件
 * 提供使用者登入功能的介面
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';

/**
 * Sign 組件 - 處理使用者登入
 * @returns {JSX.Element} 登入頁面的 JSX 元素
 */
const Sign = () => {
  const navigate = useNavigate();
  const { login, googleLogin, handleAuthError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * 處理一般登入
   * @param {Event} e - 表單提交事件
   */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const { email, password } = formData;
      await login(email, password, rememberMe);
      
      setMessage({ type: 'success', content: '登入成功！正在為您導向...' });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('登入失敗:', error);
      setMessage({ type: 'error', content: handleAuthError(error) });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理 Google 登入
   * @async
   * @function
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage({ type: '', content: '' });
    
    try {
      await googleLogin(rememberMe);
      setMessage({ type: 'success', content: '登入成功！正在為您導向...' });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Google 登入失敗:', error);
      setMessage({ type: 'error', content: handleAuthError(error) });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState 
        type="spinner" 
        size="lg" 
        text={
          formData.email ? '正在使用電子郵件登入...' : 
          'Google 帳號登入中...'
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
            登入帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            歡迎回來
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
          <div className="rounded-md shadow-sm space-y-4">
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                記住我
              </label>
            </div>

            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                忘記密碼？
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 11 11" className="mr-2">
                <path d="M4.793 7.263a.5.5 0 0 0 .707.707l2.243-2.293a.25.25 0 0 0 0-.354L5.489 3.042a.5.5 0 0 0-.707.707L6 5H1.5a.5.5 0 0 0 0 1H6zM9 1H4.5a.5.5 0 0 0 0 1h4a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-4a.5.5 0 0 0 0 1H9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" fill="currentColor"/>
              </svg>
              登入
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              使用 Google 帳號登入
            </button>
          </div>
        </form>
        
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group">
              還沒有帳號？
              <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
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

export default Sign; 