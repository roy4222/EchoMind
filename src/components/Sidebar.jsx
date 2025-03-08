// 引入必要的 React 相關套件
import React from 'react';
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
      </div>
    </nav>
  );
};

export default Sidebar;