// 引入必要的 React 相關套件
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// 引入身份驗證相關 Context
import { useAuth } from '../contexts/AuthContext';
// 引入導航連結配置
import { NAV_LINKS } from '../config/navLinks';
// 引入 GROQ API 服務
import { getChatHistory, deleteChatHistory } from '../services/groqApi';

// 側邊欄組件
const Sidebar = () => {
  // 從 AuthContext 中獲取用戶狀態和側邊欄狀態
  const { currentUser, isAdmin, isSidebarCollapsed } = useAuth();
  // 獲取當前路由位置
  const location = useLocation();
  const [expandHistory, setExpandHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 載入聊天歷史
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const history = await getChatHistory(currentUser.uid);
        setChatHistory(history);
      } catch (error) {
        console.error('載入聊天歷史失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [currentUser]);

  // 處理刪除聊天記錄
  const handleDelete = async (e, chatId) => {
    e.preventDefault(); // 防止觸發 Link 點擊
    try {
      await deleteChatHistory(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('刪除聊天記錄失敗:', error);
    }
  };

  // 根據用戶權限過濾導航連結
  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.public) return true;
    if (link.admin) return isAdmin();
    if (link.auth) return !!currentUser;
    return false;
  });

  return (
    // 側邊欄導航容器，根據收合狀態動態調整寬度
    <nav className={`fixed hidden md:block left-0 top-16 bottom-0 bg-white dark:bg-gray-800 shadow-lg z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* 可滾動的導航連結容器 */}
      <div className="h-full overflow-y-auto py-4">
        <div className="space-y-4">
          {/* 遍歷並渲染過濾後的導航連結 */}
          {filteredNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                // 當前路徑匹配時應用高亮樣式
                location.pathname === link.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : ''
              }`}
              // 在收合狀態下顯示提示文字
              title={isSidebarCollapsed ? link.label : ''}
            >
              {/* 導航圖標容器 */}
              <div className="flex-shrink-0">
                {link.icon}
              </div>
              {/* 在展開狀態下顯示導航文字 */}
              {!isSidebarCollapsed && (
                <span className="ml-3">{link.label}</span>
              )}
            </Link>
          ))}

          {/* 分隔線 */}
          {!isSidebarCollapsed && currentUser && (
            <div className="mx-6 my-4 border-t border-gray-200 dark:border-gray-700"></div>
          )}

          {/* 聊天歷史區域 */}
          {!isSidebarCollapsed && currentUser && (
            <div className="px-4">
              <button
                onClick={() => setExpandHistory(!expandHistory)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  聊天歷史
                </div>
                <svg
                  className={`w-4 h-4 transform transition-transform ${expandHistory ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 歷史記錄列表 */}
              {expandHistory && (
                <div className="mt-2 space-y-1">
                  {isLoading ? (
                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                      載入中...
                    </div>
                  ) : chatHistory.length > 0 ? (
                    chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className="group relative block px-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Link to={`/chat/${chat.id}`} className="block">
                          <div className="font-medium truncate pr-6">{chat.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {chat.date}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {chat.preview}
                          </div>
                        </Link>
                        <button
                          onClick={(e) => handleDelete(e, chat.id)}
                          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="刪除對話"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                      尚無聊天記錄
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;