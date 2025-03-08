/**
 * 路由配置文件
 * 包含所有頁面路由的定義和配置
 */

// 引入 React 的 lazy 和 Suspense 用於代碼分割和延遲加載
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// 引入載入中和錯誤邊界組件
import LoadingFallback from './components/UI/LoadingFallback';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import { RouteGuard } from './components/RouteGuard';

/**
 * 根佈局組件
 * @returns {React.Element} 根佈局組件
 */
const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/**
 * 使用 lazy 動態導入頁面組件
 * 這樣可以實現代碼分割,提高首次載入速度
 */
const Sign = lazy(() => import('./pages/Sign'));
const Register = lazy(() => import('./pages/Register')); 
const HomePage = lazy(() => import('./pages/HomePage'));
const NewPost = lazy(() => import('./pages/NewPost'));
const Post = lazy(() => import('./pages/Post'));
const Profile = lazy(() => import('./pages/Profile'));
const EditPost = lazy(() => import('./pages/EditPost'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ImageManager = lazy(() => import('./pages/ImageManager'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * 路由路徑常量
 * 集中管理所有路由路徑,方便維護和引用
 * @constant {Object} ROUTES
 */
export const ROUTES = {
    HOME: '/',
    SIGN: '/sign',
    REGISTER: '/register', 
    NEW_POST: '/new-post',
    POST_DETAIL: '/post/:id',
    EDIT_POST: '/edit-post/:id',
    PROFILE: '/profile',
    ADMIN: '/admin',
    IMAGE_MANAGER: '/admin/images',
    RESET_PASSWORD: '/reset-password'
};

/**
 * 包裝組件以添加 Suspense 和 ErrorBoundary
 * @param {React.Component} Component - 要包裝的組件
 * @param {string} title - 頁面標題,用於載入狀態顯示
 * @param {boolean} requireAuth - 是否需要登入
 * @param {boolean} requireAdmin - 是否需要管理員權限
 * @returns {React.Element} 包裝後的組件
 */
const withSuspense = (Component, title, requireAuth = false, requireAdmin = false) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback title={title} />}>
      <RouteGuard requireAuth={requireAuth} requireAdmin={requireAdmin}>
        <Component />
      </RouteGuard>
    </Suspense>
  </ErrorBoundary>
);

/**
 * 路由配置數組
 * 定義每個路由的路徑、組件、標題和訪問權限
 * @property {string} path - 路由路徑
 * @property {React.Component} element - 對應的頁面組件
 * @property {string} title - 頁面標題
 * @property {boolean} public - 是否為公開路由
 * @property {boolean} auth - 是否需要登入
 * @property {boolean} admin - 是否需要管理員權限
 */
export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage, '首頁'),
        title: '首頁',
        public: true
      },
      {
        path: ROUTES.SIGN,
        element: withSuspense(Sign, '登入'),
        title: '登入',
        public: true
      },
      {
        path: ROUTES.REGISTER,
        element: withSuspense(Register, '註冊'),
        title: '註冊',
        public: true
      },
      {
        path: ROUTES.NEW_POST,
        element: withSuspense(NewPost, '發表文章', true),
        title: '發表文章',
        auth: true
      },
      {
        path: ROUTES.POST_DETAIL,
        element: withSuspense(Post, '文章詳情'),
        title: '文章詳情',
        public: true
      },
      {
        path: ROUTES.EDIT_POST,
        element: withSuspense(EditPost, '編輯文章', true),
        title: '編輯文章',
        auth: true
      },
      {
        path: ROUTES.PROFILE,
        element: withSuspense(Profile, '個人資料', true),
        title: '個人資料',
        auth: true
      },
      {
        path: ROUTES.ADMIN,
        element: withSuspense(AdminPanel, '管理員面板', true, true),
        title: '管理員面板',
        admin: true
      },
      {
        path: ROUTES.IMAGE_MANAGER,
        element: withSuspense(ImageManager, '圖片管理', true, true),
        title: '圖片管理',
        admin: true
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: withSuspense(ResetPassword, '重設密碼'),
        title: '重設密碼',
        public: true
      },
      {
        path: '*',
        element: withSuspense(NotFound, '404頁面未找到'),
        title: '404頁面未找到',
        public: true
      }
    ]
  }
];

// 導出路由配置供其他文件使用
export default routes; 