/**
 * 聊天歷史記錄列表組件
 * 顯示用戶的聊天歷史記錄，並允許用戶選擇查看或刪除
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getChatHistory, deleteChatHistory } from '../../services/groqApi';
import { useAuth } from '../../contexts/AuthContext';
import LoadingState from '../UI/LoadingState';

const ChatHistoryList = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 載入聊天歷史記錄
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const history = await getChatHistory(currentUser.uid);
        setChatHistory(history);
      } catch (error) {
        console.error('載入聊天歷史記錄失敗:', error);
        setError('無法載入聊天歷史記錄，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [currentUser]);

  // 處理刪除聊天記錄
  const handleDelete = async (chatId, e) => {
    e.preventDefault(); // 防止點擊事件冒泡到 Link
    e.stopPropagation();
    
    if (window.confirm('確定要刪除這個聊天記錄嗎？此操作無法撤銷。')) {
      try {
        await deleteChatHistory(chatId);
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      } catch (error) {
        console.error('刪除聊天記錄失敗:', error);
        setError('刪除聊天記錄失敗，請稍後再試');
      }
    }
  };

  // 處理新建聊天
  const handleNewChat = () => {
    navigate('/chat');
  };

  if (isLoading) {
    return <LoadingState type="spinner" text="載入聊天記錄中..." />;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">聊天記錄</h2>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          新對話
        </button>
      </div>

      {chatHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">您還沒有任何聊天記錄</p>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            開始新對話
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white truncate">
                    {chat.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {chat.preview}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.createdAt?.toDate?.() || chat.createdAt).toLocaleDateString()}
                    </span>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {chat.model || 'AI 助手'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(chat.id, e)}
                  className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                  title="刪除聊天記錄"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList; 