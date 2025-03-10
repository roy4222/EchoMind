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
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ value, onChange, onSearch, isSearching, placeholder }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localValue);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <motion.input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 pl-12 pr-24 text-gray-900 bg-white border-2 rounded-xl
            focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500 
            dark:focus:ring-blue-800/30 transition-all duration-300 ease-in-out
            ${isFocused ? 'shadow-lg' : 'shadow-md'} 
            ${isSearching ? 'opacity-80' : 'opacity-100'}`}
          disabled={isSearching}
        />
        <motion.div 
          className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            className={`w-5 h-5 transition-colors duration-200
              ${isFocused ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
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
        </motion.div>

        <AnimatePresence>
          {localValue && !isSearching && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-[4.5rem] flex items-center px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSearching || !localValue.trim()}
            className={`absolute inset-y-2 right-2 flex items-center px-4 text-white
              rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              ${isSearching ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'}
              shadow-md hover:shadow-lg`}
          >
            {isSearching ? (
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">搜尋中</span>
              </motion.div>
            ) : (
              <motion.span 
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                搜尋
              </motion.span>
            )}
          </motion.button>
        </AnimatePresence>
      </div>
    </motion.form>
  );
};

export default SearchBar;