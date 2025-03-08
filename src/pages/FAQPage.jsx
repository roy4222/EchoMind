/**
 * FAQ 頁面組件
 * 提供智能問答查詢功能
 */
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/FAQ/SearchBar';
import ResultList from '../components/FAQ/ResultList';
import LoadingState from '../components/UI/LoadingState';
import { motion } from 'framer-motion';
import { useFAQ } from '../hooks/useFAQ';

const FAQPage = () => {
  const { 
    faqs, 
    searchQuery, 
    setSearchQuery, 
    isLoading, 
    searchResults,
    expandedItems,
    toggleItem 
  } = useFAQ();

  // 頁面動畫設定
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return <LoadingState type="spinner" text="載入常見問題中..." />;
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 dark:text-white"
        variants={containerVariants}
      >
        智能問答系統
      </motion.h1>

      <motion.div 
        className="mb-8"
        variants={containerVariants}
      >
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="輸入您的問題，AI 將為您找到最相關的答案..."
        />
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={containerVariants}
      >
        <ResultList 
          items={searchQuery ? searchResults : faqs}
          expandedItems={expandedItems}
          onToggle={toggleItem}
        />
      </motion.div>

      {searchQuery && searchResults.length === 0 && !isLoading && (
        <motion.div 
          className="text-center text-gray-600 dark:text-gray-400 mt-8"
          variants={containerVariants}
        >
          <p>找不到相關問題？試試直接到聊天室詢問 AI 助手！</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => window.location.href = '/chat'}
          >
            開始對話
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FAQPage;
