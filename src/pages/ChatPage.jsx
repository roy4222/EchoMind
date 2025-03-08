/**
 * 聊天頁面組件
 * 提供與 AI 對話功能的主要頁面
 * 包含聊天框、訊息列表和輸入區域等子組件
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // 引入動畫庫
import ChatBox from '../components/Chat/ChatBox'; // 聊天框容器組件
import MessageList from '../components/Chat/MessageList'; // 訊息列表組件
import InputArea from '../components/Chat/InputArea'; // 輸入區域組件
import LoadingState from '../components/UI/LoadingState'; // 載入狀態組件
import { useChat } from '../hooks/useChat'; // 聊天功能 Hook
import { useAuth } from '../contexts/AuthContext'; // 認證相關 Hook

const ChatPage = () => {
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
