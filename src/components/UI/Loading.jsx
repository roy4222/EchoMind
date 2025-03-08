/**
 * 載入狀態組件
 */
import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = ({ type = 'spinner', text = '載入中...', fullScreen = false }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const dotVariants = {
    animate: {
      y: ['0%', '-50%', '0%'],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <motion.div
            animate="animate"
            variants={spinnerVariants}
            className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        );
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate="animate"
                variants={dotVariants}
                className="w-2 h-2 bg-blue-600 rounded-full"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        {renderLoadingIndicator()}
        {text && (
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState; 