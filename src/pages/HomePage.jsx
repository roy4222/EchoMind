import React, { useState, useEffect } from 'react';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [features, setFeatures] = useState([
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm18 0c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zM12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3s1.34 3 3 3z"/>
        </svg>
      ),
      title: '建立連結',
      description: '與志同道合的朋友建立深度連結，分享生活點滴',
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      title: '分享故事',
      description: '透過文字、圖片分享你的故事，讓更多人認識你',
      color: 'text-green-500 dark:text-green-400'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      title: '探索興趣',
      description: '發現新的興趣和話題，認識更多相似興趣的朋友',
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
            歡迎來到 SoulNet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            連結靈魂，分享生活
          </p>
          
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