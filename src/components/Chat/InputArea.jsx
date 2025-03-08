/**
 * 輸入區域組件
 * 處理訊息輸入和發送
 */
import React from 'react';
import { motion } from 'framer-motion';

const InputArea = ({ value, onChange, onSubmit, isTyping }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isTyping) return;
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
      <div className="flex space-x-4">
        <motion.input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="輸入訊息..."
          disabled={isTyping}
          className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          type="submit"
          disabled={!value.trim() || isTyping}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 transform rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            發送
          </span>
        </motion.button>
      </div>
    </form>
  );
};

export default InputArea; 