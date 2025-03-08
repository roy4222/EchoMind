import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * 成功訊息提示元件
 * @param {string} message - 要顯示的訊息內容
 * @param {string} type - 訊息類型 ('success' | 'error' | 'warning' | 'info')
 * @param {function} onClose - 關閉訊息的回調函數
 * @param {number} duration - 訊息顯示時間(毫秒)
 */
const SuccessMessage = ({ message, type = 'success', onClose, duration = 3000 }) => {
  // 設定訊息自動關閉的計時器
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      // 清理計時器以避免記憶體洩漏
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // 基本樣式設定
  const baseStyles = "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out";
  
  // 不同類型訊息的樣式設定
  const typeStyles = {
    success: "bg-green-500 hover:bg-green-600",
    error: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-500 hover:bg-blue-600"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} animate-slide-in-bottom`}>
      <div className="flex items-center space-x-2">
        {/* 成功圖示 */}
        {type === 'success' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {/* 錯誤圖示 */}
        {type === 'error' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {/* 警告圖示 */}
        {type === 'warning' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {/* 資訊圖示 */}
        {type === 'info' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {/* 訊息文字 */}
        <span>{message}</span>
      </div>
    </div>
  );
};

// PropTypes 型別檢查
SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onClose: PropTypes.func,
  duration: PropTypes.number
};

export default SuccessMessage;
