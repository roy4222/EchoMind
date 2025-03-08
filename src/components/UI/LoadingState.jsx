import React from 'react';
import PropTypes from 'prop-types';

/**
 * 載入狀態元件
 * @param {string} type - 載入動畫類型 ('spinner' | 'dots' | 'pulse')
 * @param {string} size - 載入動畫大小 ('sm' | 'md' | 'lg')
 * @param {string} text - 載入時顯示的文字
 * @param {boolean} fullScreen - 是否全螢幕顯示
 */
const LoadingState = ({ type = 'spinner', size = 'md', text, fullScreen = false }) => {
  // 定義不同大小的 CSS 類別
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  // 根據是否全螢幕設定容器類別
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50'
    : 'w-full';

  /**
   * 根據類型渲染不同的載入動畫
   * @returns {JSX.Element} 載入動畫元素
   */
  const renderLoadingIndicator = () => {
    switch (type) {
      // 旋轉動畫
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-500 border-t-transparent`} />
        );
      // 跳動點點動畫
      case 'dots':
        return (
          <div className="flex space-x-3">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`${
                  size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
                } bg-gradient-to-r from-blue-400 to-blue-600 rounded-full 
                shadow-lg transform transition-all duration-500 ease-in-out
                hover:shadow-blue-400/50 hover:scale-125`}
                style={{ 
                  animation: 'bounce 1.2s ease-in-out infinite',
                  animationDelay: `${dot * 0.2}s`,
                  opacity: 0.9
                }}
              />
            ))}
          </div>
        );
      // 脈衝動畫
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} animate-pulse bg-blue-500 rounded-full`} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center`}>
      <div className="flex flex-col items-center space-y-4">
        {renderLoadingIndicator()}
        {/* 顯示載入文字 */}
        {text && (
          <p className="text-gray-600 dark:text-gray-400 text-center mt-4 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// PropTypes 型別檢查
LoadingState.propTypes = {
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingState;
