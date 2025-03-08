/**
 * 引入必要的 React 和 Suspense 組件
 */
import React, { Suspense } from 'react';

/**
 * withSuspense 高階組件
 * 用於包裝需要 Suspense 功能的組件
 * 
 * @param {React.Component} Component - 需要被包裝的組件
 * @param {React.Component} FallbackComponent - 可選的載入中顯示組件
 * @returns {React.Component} 返回包裝後的組件
 */
export const withSuspense = (Component, FallbackComponent = null) => {
  /**
   * 包裝後的組件
   * 
   * @param {Object} props - 傳遞給組件的屬性
   * @returns {React.Element} 返回包含 Suspense 的組件
   */
  return function WithSuspenseWrapper(props) {
    return (
      <Suspense fallback={FallbackComponent || <div>載入中...</div>}>
        <Component {...props} />
      </Suspense>
    );
  };
}; 