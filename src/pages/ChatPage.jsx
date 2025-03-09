/**
 * 聊天頁面組件
 * 提供與 AI 對話功能的主要頁面
 * 包含聊天框、訊息列表和輸入區域等子組件
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // 引入動畫庫
import { useParams, useNavigate } from 'react-router-dom'; // 引入路由相關 hook
import ChatBox from '../components/Chat/ChatBox'; // 聊天框容器組件
import MessageList from '../components/Chat/MessageList'; // 訊息列表組件
import InputArea from '../components/Chat/InputArea'; // 輸入區域組件
import LoadingState from '../components/UI/LoadingState'; // 載入狀態組件
import { useChat } from '../hooks/useChat'; // 聊天功能 Hook
import { useAuth } from '../contexts/AuthContext'; // 認證相關 Hook

const ChatPage = () => {
  const { chatId } = useParams(); // 獲取 URL 中的 chatId 參數
  const navigate = useNavigate(); // 用於頁面導航
  
  // 從 useChat Hook 獲取聊天相關狀態和方法
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSubmit,
    isChatReady,
    currentModel,
    setCurrentModel,
    clearMessages // 假設 useChat 提供了這個方法，如果沒有需要在 useChat 中添加
  } = useChat();

  // 從認證 context 獲取側邊欄狀態
  const { isSidebarCollapsed } = useAuth();
  const [showModelList, setShowModelList] = useState(false);

  // 處理模型列表的顯示/隱藏
  const handleToggleModelList = (forceState) => {
    setShowModelList(prev => typeof forceState === 'boolean' ? forceState : !prev);
  };

  // 處理新增聊天室
  const handleNewChat = () => {
    if (messages.length > 0) {
      const confirmNewChat = window.confirm('確定要開始新的對話嗎？目前的對話內容將會被清空。');
      if (!confirmNewChat) return;
    }
    clearMessages();
    setInputMessage('');
    // 如果當前在特定聊天頁面，則導航回主聊天頁面
    if (chatId) {
      navigate('/chat');
    }
  };

  // 返回聊天列表
  const handleBackToList = () => {
    navigate('/');
  };

  // 定義容器動畫效果
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  // 如果聊天尚未準備就緒，顯示載入狀態
  if (!isChatReady) {
    return <LoadingState type="spinner" text="正在連接 AI 助手..." />;
  }

  return (
    <div className="fixed inset-0 pt-16">
      <div className="h-full bg-gray-50 dark:bg-gray-900">
        <motion.div
          className={`h-full transition-all duration-300 ${
            isSidebarCollapsed 
              ? 'md:pl-16' 
              : 'md:pl-64'
          }`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {chatId && (
            <div className="max-w-[900px] mx-auto px-4 pt-2">
              <button 
                onClick={handleBackToList}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                返回聊天列表
              </button>
            </div>
          )}
          <motion.div 
            className="h-full max-w-[900px] mx-auto px-4 py-4 md:px-6"
            variants={containerVariants}
          >
            <ChatBox
              currentModel={currentModel}
              onModelSelect={setCurrentModel}
              showModelList={showModelList}
              onToggleModelList={handleToggleModelList}
              onNewChat={handleNewChat}
            >
              {/* 訊息列表區域 */}
              <div className="flex-1 min-h-0">
                <MessageList 
                  messages={messages} 
                  isTyping={isTyping}
                />
              </div>
              {/* 底部輸入區域 */}
              <div className="shrink-0 border-t dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <InputArea
                  value={inputMessage}
                  onChange={setInputMessage}
                  onSubmit={handleSubmit}
                  isTyping={isTyping}
                />
              </div>
            </ChatBox>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
