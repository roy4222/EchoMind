// 引入必要的 React 相關套件
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// 引入身份驗證相關 Context
import { useAuth } from '../contexts/AuthContext';
// 引入導航連結配置
import { NAV_LINKS } from '../config/navLinks';

// 側邊欄組件
const Sidebar = () => {
  // 從 AuthContext 中獲取用戶狀態和側邊欄狀態
  const { currentUser, isAdmin, isSidebarCollapsed } = useAuth();
  // 獲取當前路由位置
  const location = useLocation();
  const [expandHistory, setExpandHistory] = useState(true);

  // 模擬聊天歷史數據
  const chatHistory = [
    { id: 1, title: '關於數學學習方法的討論', date: '2024-03-20', preview: '我想了解如何更有效地學習數學...' },
    { id: 2, title: '英語口說練習建議', date: '2024-03-19', preview: '請問有什麼方法可以提升英語口說能力？' },
    { id: 3, title: '物理概念釐清', date: '2024-03-18', preview: '我對力學的基本概念有些疑問...' },
  ];

  // 根據用戶權限過濾導航連結
  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.public) return true; // 公開連結
    if (link.admin) return isAdmin(); // 管理員專用連結
    if (link.auth) return !!currentUser; // 需要登入的連結
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
                  {chatHistory.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/chat/${chat.id}`}
                      className="block px-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="font-medium truncate">{chat.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {chat.date}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {chat.preview}
                      </div>
                    </Link>
                  ))}
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