/**
 * FAQ 結果列表組件
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ResultList = ({ items, expandedItems, onToggle }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // 按類別分組
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // 處理思維鏈顯示
  const formatAnswer = (answer) => {
    // 處理舊的思維鏈格式
    const thinkingMatch = answer.match(/<思考過程>([\s\S]*?)<\/思考過程>/);
    // 處理 <think> 標籤
    const thinkMatch = answer.match(/<think>([\s\S]*?)<\/think>/);
    
    // 移除所有思維鏈標記
    let mainContent = answer
      .replace(/<思考過程>[\s\S]*?<\/思考過程>/, '')
      .replace(/<think>[\s\S]*?<\/think>/, '')
      .trim();
    
    return {
      main: mainContent,
      thinking: thinkingMatch ? thinkingMatch[1].trim() : (thinkMatch ? thinkMatch[1].trim() : null)
    };
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {category}
          </h2>
          <div className="space-y-4">
            {categoryItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => onToggle(item.id)}
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
                        expandedItems.has(item.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tag === 'AI回答'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedItems.has(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="px-6 py-4">
                        <div className="prose dark:prose-invert max-w-none">
                          {item.isAIGenerated ? (
                            <>
                              <ReactMarkdown>{formatAnswer(item.answer).main}</ReactMarkdown>
                              {formatAnswer(item.answer).thinking && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    AI 思考過程
                                  </h4>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <ReactMarkdown>{formatAnswer(item.answer).thinking}</ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            item.answer.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
                                {paragraph}
                              </p>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultList; 