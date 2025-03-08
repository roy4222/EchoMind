import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 修改為正確的 AuthContext 路徑
import { ROUTES } from '../routes';

/**
 * 路由守衛元件
 * @param {Object} props - 元件屬性
 * @param {React.ReactNode} props.children - 子元件
 * @param {boolean} props.requireAuth - 是否需要登入驗證
 * @param {boolean} props.requireAdmin - 是否需要管理員權限
 * @returns {React.ReactNode} 根據權限返回對應內容
 */
export const RouteGuard = ({ children, requireAuth, requireAdmin }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  // 等待驗證狀態載入完成
  if (loading) {
    return <div>載入中...</div>; // 可以替換為載入動畫組件
  }

  // 需要登入但未登入時重定向到登入頁面
  if (requireAuth && !currentUser) {
    return <Navigate to={ROUTES.SIGN} replace state={{ from: window.location.pathname }} />;
  }

  // 需要管理員權限但不是管理員時重定向到首頁
  if (requireAdmin && !isAdmin()) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 權限驗證通過，渲染子元件
  return children;
};