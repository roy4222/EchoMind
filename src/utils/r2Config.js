// 引入 AWS S3 客戶端,用於與 Cloudflare R2 進行交互
import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 基礎配置
// 包含了連接 R2 存儲所需的所有基本設置
export const r2Config = {
  region: "auto",  // 自動選擇最近的區域
  endpoint: `https://${import.meta.env.VITE_R2_API_ENDPOINT}`,  // R2 API 端點地址
  bucket: import.meta.env.VITE_R2_BUCKET,  // R2 儲存桶名稱
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,  // 訪問金鑰 ID
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,  // 訪問金鑰密碼
  },
  forcePathStyle: true  // 使用路徑樣式訪問
};

// 初始化 R2 客戶端
export const r2Client = new S3Client(r2Config);  // 直接傳入配置對象

// 圖片上傳相關配置
export const imageConfig = {
  maxSize: 5 * 1024 * 1024,  // 最大文件大小限制為 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],  // 允許上傳的圖片類型
  uploadPath: {
    avatar: 'avatars/',  // 頭像存儲路徑
    post: 'posts/',      // 貼文圖片存儲路徑
    temp: 'temp/'        // 臨時文件存儲路徑
  },
  defaultAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCvBNjFR_6BVhW3lFNwF0oEk2N8JXjeiaSqg&s'  // 默認頭像URL
};

// 緩存控制配置
// 定義不同類型內容的緩存策略
export const cacheConfig = {
  public: 'public, max-age=31536000',  // 公共緩存,保存一年
  private: 'private, no-cache',         // 私有緩存,不緩存
  none: 'no-store'                      // 禁止緩存
};

export const uploadWithRetry = async (file, folder, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await uploadImageToR2(file, folder);
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};