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

// 定義可用的模型
const AVAILABLE_MODELS = [
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    description: '一般對話',
    icon: '⚡'
  },
  {
    id: 'qwen-qwq-32b',
    name: 'Qwen QWQ 32B',
    description: '一般對話',
    icon: '💬'
  },
  {
    id: 'deepseek-r1-distill-qwen-32b',
    name: 'Deepseek R1 32B',
    description: '複雜問題',
    icon: '🧠'
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    description: '複雜問題',
    icon: '🚀'
  }
];

const ChatPage = () => {
  // 從 useChat Hook 獲取聊天相關狀態和方法
  const {
    messages, // 訊息列表
    inputMessage, // 輸入框內容
    setInputMessage, // 設置輸入框內容
    isTyping, // AI 是否正在輸入
    handleSubmit, // 提交訊息處理函數
    isChatReady, // 聊天是否準備就緒
    currentModel, // 從 useChat 獲取當前使用的模型
    setCurrentModel // 設置當前使用的模型
  } = useChat();

  // 從認證 context 獲取側邊欄狀態
  const { isSidebarCollapsed } = useAuth();
  const [showModelList, setShowModelList] = useState(false);

  // 獲取當前模型資訊
  const getCurrentModel = () => {
    return AVAILABLE_MODELS.find(model => model.id === currentModel) || AVAILABLE_MODELS[0];
  };

  // 處理模型選擇
  const handleModelSelect = (modelId) => {
    setCurrentModel(modelId);
    setShowModelList(false);
  };

  // 定義容器動畫效果
  const containerVariants = {
    hidden: { opacity: 0 }, // 初始隱藏狀態
    visible: { // 顯示狀態
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1 // 子元素依序顯示
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
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col h-full">
                {/* 頂部標題區域 */}
                <div className="shrink-0 px-6 py-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-750/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* AI 助手頭像 */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                          <svg 
                            className="w-6 h-6 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                            />
                          </svg>
                        </div>
                        {/* 在線狀態指示器 */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      
                      {/* 標題和模型資訊 */}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                          AI 助手對話
                        </h2>
                        <div className="relative">
                          <button
                            onClick={() => setShowModelList(!showModelList)}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center space-x-1"
                          >
                            <span>{getCurrentModel().icon}</span>
                            <span>{getCurrentModel().name}</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${showModelList ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* 模型列表下拉框 */}
                          {showModelList && (
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                              <div className="p-2 space-y-1">
                                {AVAILABLE_MODELS.map(model => (
                                  <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model.id)}
                                    className={`w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${
                                      currentModel === model.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg">{model.icon}</span>
                                      <div className="text-left">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                          {model.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {model.description}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
