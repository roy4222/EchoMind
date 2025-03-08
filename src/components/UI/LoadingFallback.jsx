import React from 'react';

const LoadingFallback = ({ title = '載入中' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <div className="w-12 h-12 mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        請稍候片刻...
      </p>
    </div>
  );
};

export default LoadingFallback; 