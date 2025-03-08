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
    icon: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 32 32"
        className="inline-block"
      >
        <g fill="currentColor">
          <path d="M6.86 8.203a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"/>
          <path d="m29.844 21.558l.087.084a3.47 3.47 0 0 1 1.06 2.547v5.491a2.31 2.31 0 0 1-2.31 2.31h-1.37a2.31 2.31 0 0 1-2.31-2.31v-2.151l-.644-.395l-1.775 3.222l-.021.028c-.267.355-.68.585-1.15.585h-1.03c-.624 0-.96-.645-.744-1.155l1.676-4.547l.014-.027l.001-.002a5.5 5.5 0 0 1-.784-.732A6.4 6.4 0 0 1 18.07 25h-.551l1.277 4.952l.002.008a.94.94 0 0 1-.052.581a.71.71 0 0 1-.656.428h-.004l-1.398-.01c-.127 0-.3-.02-.466-.105a.76.76 0 0 1-.397-.507l-.872-3.308a.15.15 0 0 0-.06-.087l-.003-.002a3 3 0 0 1-.143-.092a4.7 4.7 0 0 1-.747 1.39v1.442c0 1.316-1.077 2.31-2.32 2.31h-1.37c-1.225 0-2.333-.998-2.3-2.345V23.87A6.72 6.72 0 0 1 5 18.26v-5.729h-.73c-1.141 0-1.982-.641-2.46-1.238A3.68 3.68 0 0 1 1 9.031c0-.511.123-1.048.303-1.5c.158-.395.51-1.115 1.241-1.57l.004-.002l3.108-1.922q.207-.132.415-.245l-.268-.818A2.25 2.25 0 0 1 7.941 0a4.23 4.23 0 0 1 3.989 2.842l.005.015l3.342 10.103h7.974c1.142 0 2.206.333 3.101.908a2 2 0 1 1 2.35 3.006c.194.577.3 1.194.3 1.836v2.21zm-2.573.562a.94.94 0 0 1-.27-.66v-2.75c0-2.07-1.68-3.75-3.75-3.75h-8.17c-.66 0-1.27-.38-1.57-.97L10.041 3.5a2.24 2.24 0 0 0-1.53-1.425l-.034-.009A2.2 2.2 0 0 0 7.941 2c-.18 0-.3.17-.24.34L8.571 5a1 1 0 0 0-.135.016c-.136.025-.34.079-.579.164a2.96 2.96 0 0 1 1.944 2.77v1c0 1.126-.911 2.05-2.04 2.05h-.76v7.26c0 2.01 1.25 3.72 3.01 4.41v7.02c-.01.17.13.31.3.31h1.37c.137 0 .25-.08.297-.194a.3.3 0 0 0 .023-.116v-1.96q0-.057.01-.11a.67.67 0 0 1 .17-.33c.53-.52.82-1.23.82-1.97V23h5.07a4.45 4.45 0 0 0 3.33-1.5c0 .749.305 1.396.884 1.932q.222.205.496.388l3.96 2.43a.61.61 0 0 1 .26.5v2.93c0 .17.14.31.31.31h1.37c.17 0 .31-.14.31-.31v-5.51c.01-.4-.15-.8-.45-1.09zM3.03 9c.125.572.633 1 1.241 1h3.49c.57 0 1.04-.47 1.04-1.05v-1A1.96 1.96 0 0 0 5.89 6.245L3.6 7.66a1 1 0 0 0-.307.34H3.5c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
        </g>
      </svg>
    )
  },
  {
    id: 'qwen-qwq-32b',
    name: 'Qwen QWQ 32B',
    description: '一般對話(中文強化)',
    icon: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        className="inline-block"
      >
        <path 
          fill="currentColor" 
          d="M21 1v12A9 9 0 1 1 7.375 5.278L14 1.453v2.77zm-9 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10"
        />
      </svg>
    )
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'Deepseek R1 70B',
    description: '複雜問題',
    icon: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 48 48"
        className="inline-block"
      >
        <path 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M31.97 33.128c5.146-5.785 5.618-11.022 5.797-13.649"
        />
        <path 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M37.764 19.48c4.61-.866 6.127-3.58 6.623-5.779c.269-1.19.016-1.792-.316-1.97c-.332-.18-.742.064-1.117.463c-1.892 2.01-3.02.998-4.405 1.37c-.765.206-1.218.796-1.655.56s-.86-1.303-1.476-1.745c-.617-.443-1.428-.264-1.982-.965c-.553-.7-.959-2.436-1.38-2.384c-.99 0-1.573 1.995-1.579 3.698c-.005 1.754.919 3.887 3.557 5.824c0 0-.455 1.457-.602 2.205h.004c-3.954-1.765-6.14-5.062-9.006-7.254c-.902-.69-.89-1.382-.325-1.888c.564-.506 1.555-.843 1.38-1.133c-.173-.29-1.512-.532-2.814-.353s-2.566.78-3.831 1.38c0 0-1.129-.727-3.19-.727c-8.454 0-12.15 6.554-12.15 12.119c0 6.636 6.091 16.07 16.107 16.07c7.585 0 9.221-3.111 9.221-3.111c3.708 1.206 6.08.788 6.924-.333c.753-1-2.268-1.808-3.784-2.399"
        />
        <path 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M17.62 31.213c-1.018-.12-.156 2.938-.156 2.938c-2.034.442-4.743.295-8.299-4.835c-2.885-4.162-3.427-8.892-1.975-9.232c1.45-.34 5.668.345 8.64 2.403c2.974 2.059 5.858 5.86 7.827 8.191s3.04 3.558 5.171 5.182c-7.119-.45-8.582-4.339-11.207-4.647m8.454-10.385c2.442 0 4.771 3.392 4.771 4.927c0 .618-.721.783-1.607.783s-2.154-.412-2.154-2.04s-.122-2.329-1.44-2.329s-.992-1.34.43-1.34"
        />
        <circle 
          cx="25.294" 
          cy="23.751" 
          r=".735" 
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    description: '複雜問題',
    icon: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 32 32"
        className="inline-block"
      >
        <g fill="currentColor">
          <path d="M6.86 8.203a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"/>
          <path d="m29.844 21.558l.087.084a3.47 3.47 0 0 1 1.06 2.547v5.491a2.31 2.31 0 0 1-2.31 2.31h-1.37a2.31 2.31 0 0 1-2.31-2.31v-2.151l-.644-.395l-1.775 3.222l-.021.028c-.267.355-.68.585-1.15.585h-1.03c-.624 0-.96-.645-.744-1.155l1.676-4.547l.014-.027l.001-.002a5.5 5.5 0 0 1-.784-.732A6.4 6.4 0 0 1 18.07 25h-.551l1.277 4.952l.002.008a.94.94 0 0 1-.052.581a.71.71 0 0 1-.656.428h-.004l-1.398-.01c-.127 0-.3-.02-.466-.105a.76.76 0 0 1-.397-.507l-.872-3.308a.15.15 0 0 0-.06-.087l-.003-.002a3 3 0 0 1-.143-.092a4.7 4.7 0 0 1-.747 1.39v1.442c0 1.316-1.077 2.31-2.32 2.31h-1.37c-1.225 0-2.333-.998-2.3-2.345V23.87A6.72 6.72 0 0 1 5 18.26v-5.729h-.73c-1.141 0-1.982-.641-2.46-1.238A3.68 3.68 0 0 1 1 9.031c0-.511.123-1.048.303-1.5c.158-.395.51-1.115 1.241-1.57l.004-.002l3.108-1.922q.207-.132.415-.245l-.268-.818A2.25 2.25 0 0 1 7.941 0a4.23 4.23 0 0 1 3.989 2.842l.005.015l3.342 10.103h7.974c1.142 0 2.206.333 3.101.908a2 2 0 1 1 2.35 3.006c.194.577.3 1.194.3 1.836v2.21zm-2.573.562a.94.94 0 0 1-.27-.66v-2.75c0-2.07-1.68-3.75-3.75-3.75h-8.17c-.66 0-1.27-.38-1.57-.97L10.041 3.5a2.24 2.24 0 0 0-1.53-1.425l-.034-.009A2.2 2.2 0 0 0 7.941 2c-.18 0-.3.17-.24.34L8.571 5a1 1 0 0 0-.135.016c-.136.025-.34.079-.579.164a2.96 2.96 0 0 1 1.944 2.77v1c0 1.126-.911 2.05-2.04 2.05h-.76v7.26c0 2.01 1.25 3.72 3.01 4.41v7.02c-.01.17.13.31.3.31h1.37c.137 0 .25-.08.297-.194a.3.3 0 0 0 .023-.116v-1.96q0-.057.01-.11a.67.67 0 0 1 .17-.33c.53-.52.82-1.23.82-1.97V23h5.07a4.45 4.45 0 0 0 3.33-1.5c0 .749.305 1.396.884 1.932q.222.205.496.388l3.96 2.43a.61.61 0 0 1 .26.5v2.93c0 .17.14.31.31.31h1.37c.17 0 .31-.14.31-.31v-5.51c.01-.4-.15-.8-.45-1.09zM3.03 9c.125.572.633 1 1.241 1h3.49c.57 0 1.04-.47 1.04-1.05v-1A1.96 1.96 0 0 0 5.89 6.245L3.6 7.66a1 1 0 0 0-.307.34H3.5c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
        </g>
      </svg>
    )
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
