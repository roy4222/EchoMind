/**
 * FAQ 搜尋欄組件
 * 提供搜尋功能的輸入框組件,包含搜尋圖標和提交按鈕
 * 
 * @param {string} value - 搜尋框的初始值
 * @param {function} onChange - 當輸入值改變時的回調函數
 * @param {function} onSearch - 當提交搜尋時的回調函數
 * @param {boolean} isSearching - 是否正在搜尋中的狀態
 * @param {string} placeholder - 搜尋框的佔位提示文字
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange, onSearch, isSearching, placeholder }) => {
  // 管理輸入框的值
  const [inputValue, setInputValue] = useState(value);

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSearching) return;
    onChange(inputValue);
    onSearch(inputValue);
  };

  /**
   * 處理鍵盤按下事件
   * @param {KeyboardEvent} e - 鍵盤事件
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    // 使用 framer-motion 添加動畫效果
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* 搜尋輸入框 */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSearching}
          className="w-full px-4 py-3 pl-12 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        />
        {/* 左側搜尋圖標或載入動畫 */}
        <div className="absolute left-4 top-3.5">
          {isSearching ? (
            // 載入中動畫
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          ) : (
            // 搜尋圖標
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        {/* 提交按鈕 */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isSearching}
          className="absolute right-3 top-2.5 p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 9l3 3m0 0l-3 3m3-3H8"
            />
          </svg>
        </button>
      </form>
    </motion.div>
  );
};

export default SearchBar;