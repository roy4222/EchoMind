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
  // 選課系統相關
  {
    question: '如何進入選課系統？',
    answer: '登入「學生資訊入口網」後點選「選課系統」連結，需使用LDAP單一帳號認證。選課時段外系統會關閉，操作前請確認公告時程。',
    tags: ['選課系統', '系統操作'],
    category: '選課系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '選課分發機制為何？',
    answer: '採「登記隨機分發」制，分發順序依據開課單位設定（如企管系課程優先本系學生），大四學生在分發階級中仍保有優先權。',
    tags: ['選課系統', '選課規則'],
    category: '選課系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '課程出現「F/Z錯誤符號」如何處理？',
    answer: '此標註表示系統審核時教師尚未上傳成績，待成績更新後錯誤標註會自動清除。若需續修課程，須在錯誤更正截止前申請。',
    tags: ['選課系統', '錯誤處理'],
    category: '選課系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '全人課程志願選填如何操作？',
    answer: '學士班學生需於指定時段登入「全人課程選填系統」，分發結果將顯示於選課清單，未分發到課程者可於加退選階段補選。',
    tags: ['選課系統', '全人課程'],
    category: '選課系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 校務系統相關
  {
    question: '學生資訊入口網無法登入怎麼辦？',
    answer: '若遇「加密登入」需求，請重新啟動瀏覽器並點選入口網下方加密登入按鈕。密碼錯誤可至「單一帳號啟動網站」重設。',
    tags: ['校務系統', '登入問題'],
    category: '校務系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何查詢成績與學籍資料？',
    answer: '登入學生資訊入口網後，點選「學生資訊管理系統」即可查詢成績單、修課紀錄及學籍狀態，校外連線需使用VPN。',
    tags: ['校務系統', '成績查詢'],
    category: '校務系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '校際選課如何申請？',
    answer: '需先註冊「優久聯盟校際選課平台」帳號，跨校課程上限2門，延修生需依開課學校標準繳交學分費。',
    tags: ['校務系統', '校際選課'],
    category: '校務系統相關',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 圖書館資源
  {
    question: '如何在校外使用電子期刊？',
    answer: '透過SSO單一簽入認證，需使用圖書館帳號密碼登入。部分資料庫需設定校園Proxy（代理伺服器：proxy.fju.edu.tw:3128）。',
    tags: ['圖書館', '電子資源'],
    category: '圖書館資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '論文查詢系統有哪些？',
    answer: '可使用「輔仁大學博碩士論文系統」查詢本校論文，或透過「臺灣博碩士論文知識加值系統」檢索全國學位論文。',
    tags: ['圖書館', '論文查詢'],
    category: '圖書館資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '館藏書籍如何快速查找？',
    answer: '使用「資源整合查詢系統(EDS)」可同時檢索紙本與電子資源，系統會自動標示館藏位置與索書號。',
    tags: ['圖書館', '館藏查詢'],
    category: '圖書館資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 其他常用服務
  {
    question: '微軟365教育版如何啟用？',
    answer: '學生信箱已整合至m365.fju.edu.tw域，登入後可免費使用Office軟體與1TB雲端空間，校友帳號於離校後保留一個月。',
    tags: ['常用服務', '微軟365'],
    category: '其他常用服務',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '校園Wi-Fi連線設定方式？',
    answer: '優先選擇「FJU-5GHz」SSID以獲得穩定5G頻段，eduroam國際漫遊需在外校認證頁面輸入帳號格式為「學號@fju.edu.tw」。',
    tags: ['常用服務', 'Wi-Fi'],
    category: '其他常用服務',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何申請電子資源校外連線？',
    answer: '圖書館電子資源全面採用SSO認證，無需額外申請Proxy。若遇連線問題，可參考資訊中心「電子資源連線使用說明」。',
    tags: ['常用服務', '校外連線'],
    category: '其他常用服務',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 實務操作提醒
  {
    question: '選課清單確認時限',
    answer: '加退選結束後需於3/5前完成「選課確認」，未確認者視同無異議，逾期僅能透過人工申請更正。',
    tags: ['實務操作', '選課確認'],
    category: '實務操作提醒',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '停修申請注意事項',
    answer: '停修需在系統開放期間（3/5-5/2）線上申請並列印表件，經教師與系主任簽核後繳回課務組，每學期限停修2門。',
    tags: ['實務操作', '停修申請'],
    category: '實務操作提醒',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '程式語言機測替代方案',
    answer: '未通過機測者可累計完成3題APCS題庫，並修畢「進階程式設計」等選修課程，即可抵免畢業門檻。',
    tags: ['實務操作', '機測替代'],
    category: '實務操作提醒',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 系統異常處理
  {
    question: '選課系統流量壅塞對策',
    answer: '建議避開尖峰時段（如初選首日9:00-10:00），若遇當機可清除瀏覽器快取或切換裝置操作，分發結果不受瞬間流量影響。',
    tags: ['系統異常', '選課系統'],
    category: '系統異常處理',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '電子郵件收不到通知信？',
    answer: '檢查微軟365垃圾郵件匣，並確認信箱未設定自動轉寄。系所公告同步發布於TronClass教學平台與學生資訊入口網。',
    tags: ['系統異常', '電子郵件'],
    category: '系統異常處理',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 特殊需求服務
  {
    question: '身心障礙生資源申請',
    answer: '需至「資源教室」網站登錄需求，可申請延長考試時間、優先選課等協助，相關系統連結整合於學生資訊入口網。',
    tags: ['特殊需求', '身心障礙'],
    category: '特殊需求服務',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '國際生雙語支援',
    answer: '圖書館提供「英文版資源探索指南」，校務系統介面可切換中英文模式，選課問題可預約管理學院國際學生顧問諮詢。',
    tags: ['特殊需求', '國際生'],
    category: '特殊需求服務',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 國際交流與交換計畫
  {
    question: '校級交換計畫申請次數限制？',
    answer: '校級交換計畫在修業年限內限申請一次，但院系簽訂協議的專案交換不在此限。',
    tags: ['國際交流', '交換計畫'],
    category: '國際交流與交換計畫',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: 'TOEIC成績可用於交換申請嗎？',
    answer: '多數姊妹校不接受TOEIC成績（商管類學校除外），建議準備TOEFL或IELTS。',
    tags: ['國際交流', '英文能力', '交換計畫'],
    category: '國際交流與交換計畫',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何選擇交換學校志願？',
    answer: '建議優先考量個人興趣、參考學長姐交換心得，並交叉比對泰晤士高等教育與QS世界大學排名。',
    tags: ['國際交流', '交換計畫'],
    category: '國際交流與交換計畫',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 學術資源與特色
  {
    question: '系上教授有哪些國際學術成就？',
    answer: '2024年有兩位教授入選「全球前2%頂尖科學家」，研究領域涵蓋數據分析與人工智慧。',
    tags: ['學術資源', '師資'],
    category: '學術資源與特色',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '是否有雙聯學位機會？',
    answer: '管理學院提供「4+1學碩士雙聯學位」，最快五年可取得輔大學士與美國合作學校碩士學位。',
    tags: ['學術資源', '雙聯學位'],
    category: '學術資源與特色',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何查詢歷屆考古題？',
    answer: '可至圖書館網站查詢校內轉學考與研究所考古題，包含法律、社會科學等領域試題。',
    tags: ['學術資源', '考試資源'],
    category: '學術資源與特色',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 課程與學習建議
  {
    question: '「巨量資料概論」課程評價如何？',
    answer: '課程側重實務操作，學生評價顯示「學到含金量高」，但需具備基礎程式能力。',
    tags: ['課程評價', '專業課程'],
    category: '課程與學習建議',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '程式設計課程如何評分？',
    answer: '多數程式課程採用機測實作評分，需通過指定題目測試才能取得學分。',
    tags: ['課程評價', '程式設計'],
    category: '課程與學習建議',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '「雲端學程」如何抵免學分？',
    answer: '21學分中有12學分可抵免系選修，課程包含AWS雲端架構與容器化技術實作。',
    tags: ['課程規劃', '學分抵免'],
    category: '課程與學習建議',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 學生生活與資源
  {
    question: '校內主要學習場域有哪些？',
    answer: '利瑪竇大樓為課程教學核心，博達樓提供機房與專題實驗室，進修部大樓支援通識課程。',
    tags: ['學習資源', '校園環境'],
    category: '學生生活與資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '如何申請校內住宿？',
    answer: '新生優先抽籤宿舍，校外熱門租屋區集中在新莊站周邊，建議提早半年物色房源。',
    tags: ['學生生活', '住宿'],
    category: '學生生活與資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '系上提供哪些程式練習資源？',
    answer: '專屬機測平台分級提供APCS題庫，通過3題可抵免程式設計課程選修要求。',
    tags: ['學習資源', '程式練習'],
    category: '學生生活與資源',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 職涯發展與進修
  {
    question: '畢業生海外進修管道？',
    answer: '近年前往CMU、華盛頓大學等名校比例提升，系友網絡可協助申請矽谷科技公司職缺。',
    tags: ['職涯發展', '海外進修'],
    category: '職涯發展與進修',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '「五年一貫」學程優勢為何？',
    answer: '大四可預修碩士課程，碩一享學雜費減免與專屬獎學金，縮短1-2年取得學碩士。',
    tags: ['職涯發展', '進修規劃'],
    category: '職涯發展與進修',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '非技術背景如何強化就業競爭力？',
    answer: '建議選修「商業智慧分析」與「專案管理」課程，培養系統整合與跨部門溝通能力。',
    tags: ['職涯發展', '就業準備'],
    category: '職涯發展與進修',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 特殊計畫與獎助
  {
    question: 'APCS組面試重點為何？',
    answer: '需展示APCS實作題解題邏輯，面試獨立進行且著重程式開發過程的系統性思考。',
    tags: ['入學申請', 'APCS'],
    category: '特殊計畫與獎助',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '產業實習如何銜接就業？',
    answer: '近年實習轉正職率達35%，以雲端服務、金融科技、AI應用三大領域為主。',
    tags: ['實習', '就業'],
    category: '特殊計畫與獎助',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '系友會提供哪些支援？',
    answer: '定期舉辦職涯講座與企業參訪，提供內推機會與跨世代業界導師制度。',
    tags: ['系友會', '職涯發展'],
    category: '特殊計畫與獎助',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 新生適應與輔導
  {
    question: '如何準備「大學入門」課程？',
    answer: '課程包含校園導覽與時間管理工作坊，建議新生參與社團博覽會提前熟悉環境。',
    tags: ['新生適應', '課程準備'],
    category: '新生適應與輔導',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: '英文檢定未達標的補救措施？',
    answer: '可修習「科技英文寫作」與「商業簡報英語」等全英文課程替代，需累計15學分。',
    tags: ['新生適應', '英文能力'],
    category: '新生適應與輔導',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 原有的 FAQ 資料...
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