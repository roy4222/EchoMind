/**
 * FAQ 頁面組件
 * 提供智能問答查詢功能
 */
import React from 'react';
import SearchBar from '../components/FAQ/SearchBar';
import ResultList from '../components/FAQ/ResultList';
import LoadingState from '../components/UI/LoadingState';
import { motion } from 'framer-motion';
import { useFAQ } from '../hooks/useFAQ';
import { useAuth } from '../contexts/AuthContext';

// 快速搜索按鈕配置
const quickSearchButtons = [
  {
    text: '如何規劃四年課程？',
    icon: '📚',
  },
  {
    text: '實習和專題哪個重要？',
    icon: '💼',
  },
  {
    text: '英文門檻如何通過？',
    icon: '🌏',
  },
  {
    text: '程式能力如何提升？',
    icon: '💻',
  },
  {
    text: '雙主修/輔系選擇？',
    icon: '📖',
  },
  {
    text: '海外交換機會？',
    icon: '✈️',
  }
];

const FAQPage = () => {
  const { 
    faqs, 
    searchQuery, 
    setSearchQuery, 
    isLoading,
    isSearching,
    searchResults,
    expandedItems,
    toggleItem,
    searchWithAI,
    thinkingProcess
  } = useFAQ();

  const { isSidebarCollapsed } = useAuth();

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

  const displayItems = searchQuery ? searchResults : faqs;
  const showNoResults = searchQuery && searchResults.length === 0 && !isSearching;

  return (
    <div className="fixed inset-0 pt-16">
      <div className="h-full bg-gray-50 dark:bg-gray-900">
        <div className={`h-full transition-all duration-300 ${
          isSidebarCollapsed 
            ? 'md:pl-16' 
            : 'md:pl-64'
        }`}>
          <motion.div 
            className="h-full overflow-y-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="max-w-4xl mx-auto px-4 py-8">
              <motion.div 
                className="text-center mb-8"
                variants={containerVariants}
              >
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  智能問答系統
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  輸入您的問題，按下 Enter 鍵或搜尋按鈕開始搜尋
                </p>
              </motion.div>

              <motion.div 
                className="mb-8"
                variants={containerVariants}
              >
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={searchWithAI}
                  isSearching={isSearching}
                  placeholder="輸入您的問題，按下 Enter 開始搜尋..."
                />

                {/* 快速搜索按鈕 */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {quickSearchButtons.map((button, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setSearchQuery(button.text);
                        searchWithAI(button.text);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.1 }
                        }
                      }}
                    >
                      <span className="mr-2">{button.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{button.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={containerVariants}
              >
                {isSearching ? (
                  <div className="flex flex-col items-center py-8">
                    <LoadingState type="dots" text="AI 正在搜尋相關答案..." />
                    {thinkingProcess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full"
                      >
                        <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                          {thinkingProcess}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <ResultList 
                    items={displayItems}
                    expandedItems={expandedItems}
                    onToggle={toggleItem}
                  />
                )}
              </motion.div>

              {showNoResults && (
                <motion.div 
                  className="text-center py-8"
                  variants={containerVariants}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      找不到完全符合的答案
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      建議您直接到聊天室與 AI 助手進行更深入的對話
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <span className="flex items-center justify-center space-x-2">
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                          />
                        </svg>
                        <span>開始對話</span>
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
