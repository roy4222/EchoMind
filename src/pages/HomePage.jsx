/**
 * 首頁組件
 * 展示 EchoMind 的主要功能和特色
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  const { isSidebarCollapsed, currentUser } = useAuth();
  
  // 主要功能區塊
  const [features] = useState([
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8c0-1.12.24-2.19.66-3.16l3.26 3.26c.43.34.97.54 1.54.54L12 13v3l4-4l-4-4v3l-2.14-.01l-2.27-2.27C9.1 7.64 10.48 7 12 7c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
        </svg>
      ),
      title: 'FAQ 智能查詢',
      description: '自動解析學生問題，快速找到相關解答',
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      link: '/faq'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-3.37 12.5l-.8-2.3l-2.33.8l.8 2.3l2.33-.8M7.67 14.5l2.33-.8l-.8-2.3l-2.33.8l.8 2.3M20 15.5L18.5 17L17 15.5L15.5 17L14 15.5L15.5 14L14 12.5L15.5 11L17 12.5L18.5 11L20 12.5L18.5 14L20 15.5z"/>
        </svg>
      ),
      title: 'AI 關懷對話',
      description: '提供個人化諮詢和情感支持服務',
      color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      link: '/chat'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5c1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
      title: '教育資源推薦',
      description: '根據對話內容推薦相關學習資源',
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      link: '/resources'
    }
  ]);

  // 技術架構區塊
  const [techStack] = useState([
    {
      title: '前端技術',
      items: [
        { name: 'React + Vite', icon: '⚛️' },
        { name: 'Tailwind CSS', icon: '🎨' },
        { name: 'Framer Motion', icon: '✨' },
        { name: 'React Router', icon: '🔄' }
      ]
    },
    {
      title: '後端服務',
      items: [
        { name: 'Cloudflare Workers', icon: '☁️' },
        { name: 'Cloudflare D1', icon: '💾' },
        { name: 'Cloudflare KV', icon: '🗄️' },
        { name: 'Groq API', icon: '🤖' }
      ]
    }
  ]);

  useEffect(() => {
    const initializeHomePage = async () => {
      try {
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

  // 動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 pt-0 transition-all duration-300 ${
      isSidebarCollapsed 
        ? 'md:pl-16' 
        : 'md:pl-64'
    }`}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      >
        {/* 英雄區塊 */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl shadow-xl overflow-hidden mb-10"
        >
          <div className="px-6 py-10 sm:px-12 sm:py-14 md:py-16 md:px-16 text-center text-white relative z-10">
            <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-10 z-0"></div>
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5v-5H9.5v-2h1.5V9.5h2v2H15v2h-2v5h-2z"/>
                  </svg>
                </div>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">EchoMind 回聲心語</h1>
              <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-blue-100">
                整合 AI 技術的教育助理平台，為您提供智能問答、情感支持和個人化學習建議
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/chat"
                  className="px-6 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  開始對話
                </Link>
                <Link
                  to="/faq"
                  className="px-6 py-2.5 bg-blue-700 text-white hover:bg-blue-800 border border-blue-400 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  查看常見問題
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 主要功能區塊 */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">主要功能</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              EchoMind 提供多種智能功能，幫助學生解決問題、獲取支持和發現資源
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all"
              >
                <div className="p-5">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-lg ${feature.color} mb-4 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
                    {feature.description}
                  </p>
                  <div className="text-center">
                    <Link
                      to={feature.link}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      立即體驗
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 技術架構區塊 */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">技術架構</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              我們使用現代化的技術棧，確保系統的高效能、可靠性和擴展性
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    {stack.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {stack.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 開始使用區塊 */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:px-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">準備好開始使用了嗎？</h2>
            <p className="text-base mb-6 max-w-2xl mx-auto">
              立即體驗 EchoMind 的強大功能，讓 AI 助手幫助您解決問題、提供支持和推薦資源
            </p>
            <Link
              to="/chat"
              className="px-6 py-3 bg-white text-green-600 hover:bg-green-50 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center"
            >
              <span>開始對話</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>

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