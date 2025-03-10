import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_SOULNET_TEST_API_KEY,
  authDomain: process.env.VITE_SOULNET_TEST_AUTH_DOMAIN,
  projectId: process.env.VITE_SOULNET_TEST_PROJECT_ID,
  storageBucket: process.env.VITE_SOULNET_TEST_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_SOULNET_TEST_MESSAGING_SENDER_ID,
  appId: process.env.VITE_SOULNET_TEST_APP_ID,
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 初始 FAQ 資料
const initialFAQs = [
  // 學術與課程相關
  {
    question: '資管系與資工系有何差異？',
    answer: '資管系著重「資訊科技」結合「企業管理」，培養解決企業資訊問題的能力；資工系則側重軟硬體架構設計與開發。',
    tags: ['學術課程', '系所比較'],
    category: '學術與課程',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '主要學習哪些程式語言？',
    answer: '課程以Python為基礎，延伸教授PHP、Java、JavaScript框架（如React），並根據產業趨勢調整授課內容。',
    tags: ['學術課程', '程式語言'],
    category: '學術與課程',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '是否有程式語言畢業門檻？',
    answer: '需通過「程式語言機測」，若未通過但累計通過3題，可修習選修程式課程替代。',
    tags: ['學術課程', '畢業門檻'],
    category: '學術與課程',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '英文能力畢業要求為何？',
    answer: '需達CEF A2等級（相當於多益750分），未達標者可修習4學分全英文課程替代。',
    tags: ['學術課程', '畢業門檻', '英文能力'],
    category: '學術與課程',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '必修課程包含哪些領域？',
    answer: '包含管理學基礎（會計、統計）、程式設計、系統分析，以及人工智慧、雲端服務等進階選修。',
    tags: ['學術課程', '必修課程'],
    category: '學術與課程',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 實務與專題
  {
    question: '「資訊系統專題」如何進行？',
    answer: '需五人一組開發完整系統，從需求分析到實作，並公開發表，為期一年且為畢業必要條件。',
    tags: ['實務專題', '畢業專題'],
    category: '實務與專題',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '產業實習如何申請？',
    answer: '大四可申請企業實習，流程包含徵才說明會、履歷投遞、面試，實習期間每周3-3.5天。',
    tags: ['實務專題', '實習'],
    category: '實務與專題',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '實習是否算學分？',
    answer: '實習課程為必修學分，系辦協助選課，完成後需提交心得報告並參與成果發表。',
    tags: ['實務專題', '實習', '學分'],
    category: '實務與專題',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '是否有國際交流機會？',
    answer: '透過AACSB認證，學分獲國際承認，可申請管理學院英語商管課程或海外交換。',
    tags: ['實務專題', '國際交流'],
    category: '實務與專題',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 升學與職涯
  {
    question: '畢業生主要就業方向？',
    answer: '多投入軟體開發、數據分析、雲端服務及AI應用領域，系友廣泛分佈於科技業與金融業。',
    tags: ['升學就業', '職涯發展'],
    category: '升學與職涯',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '碩士班申請優勢為何？',
    answer: '可申請「五年一貫」學程，提前修習碩士學分，並有專屬獎學金。',
    tags: ['升學就業', '碩士班'],
    category: '升學與職涯',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '轉系或雙主修是否容易？',
    answer: '轉系名額依年度調整，近年因資管熱門競爭較激烈；雙主修資工系可強化技術底層能力。',
    tags: ['升學就業', '轉系', '雙主修'],
    category: '升學與職涯',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 學習資源與環境
  {
    question: '系上提供哪些硬體資源？',
    answer: '包含VMWare雲端虛擬機、GPU工作站、VR設備及樹莓派等開發工具。',
    tags: ['學習資源', '硬體設備'],
    category: '學習資源與環境',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '是否有專屬學習空間？',
    answer: '設有專題實驗室、系機房供開發使用，博達樓為主要機房與討論區。',
    tags: ['學習資源', '學習空間'],
    category: '學習資源與環境',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何加強程式能力？',
    answer: '系上提供機測練習平台，建議自學Python基礎語法，並參與社群協作專案。',
    tags: ['學習資源', '程式學習'],
    category: '學習資源與環境',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 新生與生活
  {
    question: '住宿選擇與交通建議？',
    answer: '新生優先抽籤宿舍，校外可選新莊站、輔大醫院周邊套房，通勤建議捷運沿線。',
    tags: ['新生資訊', '住宿', '交通'],
    category: '新生與生活',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '修課學分如何規劃？',
    answer: '畢業需128學分，包含管理學院基礎30學分、資管專業41學分，及通識與全人課程。',
    tags: ['新生資訊', '學分規劃'],
    category: '新生與生活',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '「雲端學程」內容為何？',
    answer: '整合雲端技術與AI應用課程，21學分中12學分可抵免系選修，強化第二專長。',
    tags: ['新生資訊', '學程資訊'],
    category: '新生與生活',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 其他常見問題
  {
    question: '如何準備申請入學面試？',
    answer: '重視表達與問題解決能力，可準備自主學習成果，並熟悉資管與資工差異。',
    tags: ['其他問題', '入學面試'],
    category: '其他常見問題',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '系上特色學術活動？',
    answer: '定期舉辦資訊應用服務創新競賽、就業博覽會，並與企業合作專題展示。',
    tags: ['其他問題', '學術活動'],
    category: '其他常見問題',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 將 FAQ 資料寫入 Firestore
const initializeFAQs = async () => {
  try {
    console.log('開始初始化 FAQ 資料...');
    
    // 清空現有的 FAQ 集合
    const querySnapshot = await getDocs(collection(db, 'faqs'));
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    console.log('已清空現有 FAQ 資料');
    
    // 新增新的 FAQ 資料
    for (const faq of initialFAQs) {
      await addDoc(collection(db, 'faqs'), faq);
      console.log(`已新增 FAQ: ${faq.question}`);
    }
    
    console.log('FAQ 資料初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('初始化 FAQ 資料時發生錯誤:', error);
    process.exit(1);
  }
};

initializeFAQs(); 