# 專案設置步驟

## 1. 初始化專案

```bash
# 使用 Vite 創建 React 專案
npm create vite@latest my-blog -- --template react

# 進入專案目錄
cd my-blog

# 安裝依賴
npm install
```

## 2. 安裝必要的依賴套件

```bash
1.核心套件
# React 相關
npm install react react-dom
npm install react-router-dom

2.後端服務
# Firebase 相關
npm install firebase
# R2 上傳相關
npm install @aws-sdk/client-s3 uuid

3.UI相關
# 動畫相關
npm install framer-motion

# Tailwind CSS 相關
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install classnames

# 工具類
npm install date-fns

# 前端圖片壓縮工具
npm install browser-image-compression 

```

## 3. 建立專案結構

```bash
C:.
├── src/                  # 源碼目錄
│   ├── App.jsx          # 應用程式主入口
│   ├── main.jsx         # React 渲染入口
│   │
│   ├── assets/          # 靜態資源
│   │   ├── icons/       # 圖標文件
│   │   ├── images/      # 圖片資源
│   │   └── styles/      # 樣式文件
│   │       └── global.css
│   │
│   ├── components/      # 共用元件
│   │   ├── Header.jsx   # 頁面頭部
│   │   ├── Footer.jsx   # 頁面底部
│   │   ├── ScrollToTopButton.jsx
│   │   │
│   │   ├── Post/       # 文章相關元件
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostHeader.jsx
│   │   │   ├── PostContent.jsx
│   │   │   ├── PostActions.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ImagePreview.jsx
│   │   │   ├── ImagePreviewList.jsx
│   │   │   ├── PostCommentForm.jsx
│   │   │   ├── PostCommentsList.jsx
│   │   │   └── PostInteractionButtons.jsx
│   │   │
│   │   ├── Profile/    # 個人資料相關元件
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── ProfileTabs.jsx
│   │   │   └── ProfilePostsList.jsx
│   │   │
│   │   └── UI/         # 基礎 UI 元件
│   │       ├── BackButton.jsx
│   │       ├── LoadingState.jsx
│   │       ├── SuccessMessage.jsx
│   │       └── ImageModal.jsx
│   │
│   ├── contexts/       # Context API
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/         # 頁面組件
│   │   ├── HomePage.jsx
│   │   ├── Sign.jsx
│   │   ├── Register.jsx
│   │   ├── NewPost.jsx
│   │   ├── Post.jsx
│   │   ├── EditPost.jsx
│   │   ├── Profile.jsx
│   │   ├── AdminPanel.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── utils/         # 工具函數
│   │   ├── firebase.js
│   │   ├── imageUtils.js
│   │   ├── r2Config.js
│   │   └── ShareUtils.js
│   │
│   └── routes.js      # 路由配置
│
├── public/            # 公開資源
│   ├── index.html
│   └── favicon.ico
│
├── package.json
└── README.md

## 4. 設置 Firebase

1. 創建 Firebase 專案並獲取配置信息。

2. 在專案根目錄創建 `.env` 文件，添加 Firebase 配置：

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. 創建 Firebase 配置文件：

   ```javascript
   // src/services/firebase.js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };

   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```


# 4.實作步驟

### 1. 基礎設置與工具

```
src/utils/
├── firebase.js      # Firebase 配置
└── imageUtils.js    # 圖片處理工具

```

改進建議：

- 將 R2 相關配置從 `firebase.js` 分離出來，建立 `r2Config.js`
- 在 `imageUtils.js` 中添加圖片壓縮功能
- 添加圖片格式驗證

### 2. 路由和頁面結構

```
export const ROUTES = {
    HOME: '/',
    SIGN: '/sign',
    REGISTER: '/register',
    NEW_POST: '/NewPost',
    POST_DETAIL: '/post/:id',
    EDIT_POST: '/edit-post/:id',
    PROFILE: '/profile',
    ADMIN: '/admin',
    RESET_PASSWORD: '/reset-password'
};

// 定義路由配置
export const routes = [
    {
        path: ROUTES.HOME,
        element: HomePage,
        title: '首頁'
    },
    {
        path: ROUTES.SIGN,
        element: Sign,
        title: '登入'
    },
    {
        path: ROUTES.REGISTER,
        element: Register,
        title: '註冊'
    },
    {
        path: ROUTES.NEW_POST,
        element: NewPost,
        title: '發表文章'
    },
    {
        path: ROUTES.POST_DETAIL,
        element: Post,
        title: '文章詳情'
    },
    {
        path: ROUTES.EDIT_POST,
        element: EditPost,
        title: '編輯文章'
    },
    {
        path: ROUTES.PROFILE,
        element: Profile,
        title: '個人資料'
    },
    {
        path: ROUTES.ADMIN,
        element: AdminPanel,
        title: '管理員面板'
    },
    {
        path: ROUTES.RESET_PASSWORD,
        element: ResetPassword,
        title: '重設密碼'
    }
];

```

改進建議：

- 添加路由守衛功能
- 實作延遲加載（Code Splitting）
- 添加錯誤邊界頁面

### 3. 功能模組化

需要將現有功能拆分為以下模組：

```
src/features/
├── auth/           # 認證相關
│   ├── hooks/
│   │   └── useAuth.js
│   └── services/
│       └── authService.js
│
├── posts/          # 文章相關
│   ├── hooks/
│   │   ├── usePost.js
│   │   └── usePostForm.js
│   └── services/
│       └── postService.js
│
└── profile/        # 個人資料相關
    ├── hooks/
    │   └── useProfile.js
    └── services/
        └── profileService.js

```

### 4. 共用組件改進

從現有代碼中提取：

```
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 只驗證分類
        if (!category) {
            setError('請選擇一個分類');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 上傳所有圖片並獲取URLs
            const imageUrls = [];
            if (images.length > 0) {
                // 並行上傳所有圖片
                const uploadPromises = images.map(image => uploadImageToR2(image, r2Client));
                const urls = await Promise.all(uploadPromises);
                imageUrls.push(...urls);
            }

            // 獲取 Firestore 實例
            const postsRef = collection(db, 'posts');

            // 創建新文章文檔，標題和內容可為空
            const postData = {
                imageUrls: imageUrls, // 使用圖片URL數組
                title: title.trim() || '',
                content: content.replace(/\\n/g, '\\n') || '',
                category: category,
                createdAt: serverTimestamp(),
                author: {
                    displayName: auth.currentUser.displayName || '匿名用戶',
                    photoURL: auth.currentUser.photoURL || null,
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email
                }
            };

            await addDoc(postsRef, postData);

            // 發布成功後導航到首頁
            navigate('/');
        } catch (error) {
            console.error('發文失敗:', error);
            setError('發文失敗，請稍後再試');
            setLoading(false);
        }
    };

```

需要建立：

```
src/components/
├── UI/
│   ├── ImageUploader/
│   │   ├── index.jsx
│   │   └── ImagePreview.jsx
│   └── Form/
│       ├── TextField.jsx
│       └── PasswordField.jsx
└── Post/
    ├── PostForm/
    │   ├── index.jsx
    │   └── validation.js
    └── PostActions/
        ├── index.jsx
        └── handlers.js

```

### 5. 資料處理邏輯優化

需要改進的部分：

1. 圖片刪除邏輯：

```
  const handleDelete = async () => {
    if (!canModify()) return;

    if (window.confirm('確定要刪除這篇文章嗎？此操作無法撤銷。')) {
      try {
        // 1. 記錄需要刪除的圖片 URL（但不從前端刪除）
        const imageUrls = post.imageUrls?.length > 0 ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : []);

        if (imageUrls.length > 0) {
          console.log('需要刪除的圖片 URL:', imageUrls);
          // 注意：從前端直接刪除 R2 圖片會遇到 CORS 和安全憑證問題
          // 需要設置後端 API 或 Cloud Functions 來處理圖片刪除
        }

        // 2. 查詢並刪除所有相關的轉發文章
        const repostsQuery = query(collection(db, 'posts'), where('originalPostId', '==', post.id));
        const repostsSnapshot = await getDocs(repostsQuery);

        // 刪除所有轉發文章
        const deleteRepostsPromises = repostsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteRepostsPromises);
        console.log(`已刪除 ${repostsSnapshot.docs.length} 篇相關轉發文章`);

        // 3. 最後刪除原文章
        await deleteDoc(doc(db, 'posts', post.id));
        alert('文章已成功刪除');
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('刪除文章時發生錯誤');
      }
    }
  };

```

1. 文章更新邏輯：

```
      const updateData = {
        title,
        content,
        category,
        updatedAt: Timestamp.now()
      };

      // 添加圖片URLs到更新數據中
      if (post.imageURL && allImageUrls.length > 0) {
        // 如果原來是單圖片格式，現在轉為多圖片格式
        delete updateData.imageURL;
        updateData.imageUrls = allImageUrls;

```

### 6. 安全性和效能優化

需要添加：

1. 請求限制（Rate Limiting）
2. 圖片上傳大小限制
3. 添加錯誤追蹤
4. 實作快取機制

### 7. 測試架構

建立測試目錄：

```
src/__tests__/
├── unit/
│   ├── utils/
│   └── hooks/
└── integration/
    ├── auth/
    └── posts/

```

這個實作順序確保了：

1. 基礎設施先到位
2. 功能模組化清晰
3. 共用組件可重用
4. 業務邏輯集中管理
5. 測試覆蓋完整