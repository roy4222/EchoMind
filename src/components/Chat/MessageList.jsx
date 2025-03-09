/**
 * 訊息列表組件
 * 顯示對話歷史記錄
 * 
 * @component
 * @param {Object[]} messages - 訊息陣列
 * @param {boolean} isTyping - 是否正在輸入中
 */
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 格式化訊息內容，處理標題格式
 * 將文字中的 ** 標記轉換為加粗樣式
 * 
 * @param {string} content - 原始訊息內容
 * @returns {JSX.Element} 格式化後的 JSX 元素
 */
const formatMessage = (content) => {
  // 分行處理
  const lines = content.split('\n');
  const formattedLines = lines.map((line, index) => {
    // 檢查是否包含 ** 標記
    if (line.includes('**')) {
      // 將行內容分割成普通文字和加粗文字
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // 移除 ** 並套用加粗樣式
          const text = part.slice(2, -2);
          if (/^\d+\./.test(text)) {
            // 如果是數字開頭（如：1.），使用藍色
            return (
              <span key={partIndex} className="font-semibold text-blue-500 dark:text-blue-400">
                {text}
              </span>
            );
          }
          return (
            <span key={partIndex} className="font-semibold">
              {text}
            </span>
          );
        }
        return <span key={partIndex}>{part}</span>;
      });

      return (
        <div key={index} className="mb-2">
          {formattedParts}
        </div>
      );
    }

    // 一般文字
    return (
      <div key={index} className="mb-2">
        {line}
      </div>
    );
  });

  return <div className="space-y-1">{formattedLines}</div>;
};

/**
 * 訊息列表組件
 * 顯示所有對話訊息，包含使用者和 AI 的回應
 * 
 * @param {Object} props
 * @param {Object[]} props.messages - 訊息陣列
 * @param {boolean} props.isTyping - 是否正在輸入中
 */
const MessageList = ({ messages, isTyping }) => {
  // 用於自動滾動的 ref
  const messagesEndRef = useRef(null);

  /**
   * 自動滾動到最新訊息
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 當訊息更新時自動滾動
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 訊息動畫設定
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
  };

  /**
   * 格式化時間為本地時間字串
   * @param {Date} date - 時間戳記
   * @returns {string} 格式化後的時間字串
   */
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {formatMessage(message.content)}
                </div>
                <span className="text-xs opacity-75 mt-2 block">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 打字中動畫 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex space-x-2">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    transition: { duration: 0.6, repeat: Infinity }
                  }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    transition: { duration: 0.6, repeat: Infinity, delay: 0.2 }
                  }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    transition: { duration: 0.6, repeat: Infinity, delay: 0.4 }
                  }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 