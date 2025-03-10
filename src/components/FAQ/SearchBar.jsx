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
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localValue);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-16 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-800 transition-all duration-200"
          disabled={isSearching}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-500 dark:text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSearching || !localValue.trim()}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSearching ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>搜尋中</span>
            </div>
          ) : (
            <span>搜尋</span>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default SearchBar;