import React, { useState, useEffect } from 'react';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [features, setFeatures] = useState([
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8c0-1.12.24-2.19.66-3.16l3.26 3.26c.43.34.97.54 1.54.54L12 13v3l4-4l-4-4v3l-2.14-.01l-2.27-2.27C9.1 7.64 10.48 7 12 7c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
        </svg>
      ),
      title: 'FAQ 智能查詢',
      description: '自動解析學生問題，快速找到相關解答',
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-3.37 12.5l-.8-2.3l-2.33.8l.8 2.3l2.33-.8M7.67 14.5l2.33-.8l-.8-2.3l-2.33.8l.8 2.3M20 15.5L18.5 17L17 15.5L15.5 17L14 15.5L15.5 14L14 12.5L15.5 11L17 12.5L18.5 11L20 12.5L18.5 14L20 15.5z"/>
        </svg>
      ),
      title: 'AI 關懷對話',
      description: '提供個人化諮詢和情感支持服務',
      color: 'text-green-500 dark:text-green-400'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5c1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
      title: '教育資源推薦',
      description: '根據對話內容推薦相關學習資源',
      color: 'text-purple-500 dark:text-purple-400'
    }
  ]);

  useEffect(() => {
    const initializeHomePage = async () => {
      try {
        // 模擬資料載入
        await new Promise(resolve => setTimeout(resolve, 100));
        setMessage({ type: 'success'});
      } catch (error) {
        console.error('載入失敗:', error);
        setMessage({ type: 'error', content: '載入失敗，請重新整理頁面' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeHomePage();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        type="spinner"
        size="lg"
        text="載入中..."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            歡迎來到 EchoMind
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            回聲心語 - 您的智慧教育助理
          </p>
          
          <div className="text-base text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            整合 AI 技術的教育助理平台，為您提供智能問答、情感支持和個人化學習建議
          </div>
          
          <div className="flex justify-center mb-16">
            <Link
              to="/chat"
              className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              <span className="text-lg font-semibold">立即體驗</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
              >
                <div className={`${feature.color} text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {message.content && (
        <SuccessMessage
          message={message.content}
          type={message.type}
          onClose={() => setMessage({ type: '', content: '' })}
          duration={1000}
        />
      )}
    </div>
  );
};

export default HomePage;