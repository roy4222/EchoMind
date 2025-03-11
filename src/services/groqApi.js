/**
 * GROQ API 服務
 */
import { db } from '../utils/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 聊天記錄集合名稱
const CHATS_COLLECTION = 'chats';

// FAQ 集合名稱
const FAQ_COLLECTION = 'faqs';

/**
 * 根據訊息內容選擇合適的模型
 * @param {string} content - 用戶訊息內容
 * @returns {string} - 選擇的模型名稱
 */
const selectModel = (content) => {
  // 複雜度評估標準
  const complexityIndicators = [
    '分析', '比較', '評估', '解釋',
    '為什麼', '如何', '原因',
    '程式碼', '代碼', 'code',
    '數學', '科技', '歷史',
    '建議', '優缺點'
  ];

  // 檢查訊息是否包含複雜度指標
  const isComplex = complexityIndicators.some(indicator => {
    const hasIndicator = content.toLowerCase().includes(indicator.toLowerCase());
    if (hasIndicator) {
      console.log(`檢測到複雜度指標: "${indicator}"`);
    }
    return hasIndicator;
  });

  // 根據複雜度選擇模型
  const selectedModel = isComplex ? 'deepseek-r1-distill-llama-70b' : 'llama-3.3-70b-versatile';
  
  console.log(`問題: "${content}"`);
  console.log(`複雜度: ${isComplex ? '高' : '一般'}`);
  console.log(`選擇模型: ${selectedModel}`);
  
  return selectedModel;
};

/**
 * 發送聊天請求到 GROQ API
 * @param {Array} messages - 聊天訊息陣列
 * @returns {Promise} - API 回應
 */
export const sendChatMessage = async (messages) => {
  try {
    // 確保消息格式正確，將內部訊息類型轉換為 GROQ API 所需的格式
    const formattedMessages = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant', // 將內部的 type 轉換為 API 需要的 role
      content: msg.content // 保留訊息內容不變
    }));

    // 檢查是否有消息，如果沒有則拋出錯誤
    if (!formattedMessages.length) {
      throw new Error('沒有可發送的消息');
    }

    // 獲取最後一條用戶訊息，用於選擇適合的模型
    const lastUserMessage = messages[messages.length - 1];
    const selectedModel = selectModel(lastUserMessage.content); // 根據訊息內容選擇合適的模型

    // 添加 Baymax 風格的系統提示詞，定義 AI 助手的性格和回應風格
    const systemMessage = {
      role: "system", // 系統訊息角色
      content: `我是一個像 Baymax 一樣的 AI 助手，擁有溫暖、貼心且可靠的性格。
我的目標是關心使用者的需求，提供簡單易懂的回應，並使用溫和、友善的語氣進行對話。
我會保持耐心，幫助使用者解決問題，並在適當的時候使用幽默或鼓勵的語句。
我不會提供攻擊性或消極的回應，而是專注於支持和關懷使用者，讓他們感到被照顧和安心。
請使用繁體中文回答所有問題，保持清晰、準確的專業回答。`
    };

    // 發送 API 請求到 GROQ 服務
    const response = await fetch(GROQ_API_URL, {
      method: 'POST', // 使用 POST 方法
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`, // 添加 API 金鑰進行身份驗證
        'Content-Type': 'application/json', // 設定內容類型為 JSON
      },
      body: JSON.stringify({
        model: selectedModel, // 使用選定的模型
        messages: [systemMessage, ...formattedMessages], // 將系統提示詞和用戶訊息合併
        temperature: 0.7, // 控制回應的創造性，較高值產生更多樣化的回應
        top_p: 0.95, // 控制詞彙選擇的多樣性
        max_tokens: selectedModel.includes('32b') ? 4096 : 2048, // 根據模型大小設定最大回應長度
        stream: false // 不使用串流回應模式
      }),
    });

    // 檢查 API 回應是否成功
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // 嘗試解析錯誤訊息
      console.error('API 錯誤詳情:', errorData); // 記錄錯誤詳情
      throw new Error(`API 請求失敗: ${response.status} - ${errorData.error?.message || '未知錯誤'}`); // 拋出格式化的錯誤
    }

    // 解析 API 回應並返回 AI 生成的內容
    const data = await response.json();
    return data.choices[0].message.content; // 返回 AI 回應的文本內容
  } catch (error) {
    // 捕獲並記錄任何錯誤
    console.error('GROQ API 錯誤:', error);
    throw error; // 將錯誤向上拋出，讓調用者處理
  }
};

/**
 * 儲存聊天記錄
 * @param {Object} chat - 聊天記錄物件
 * @returns {Promise}
 */
export const saveChatHistory = async (chat) => {
  try {
    // 檢查是否為更新現有聊天記錄
    if (chat.id) {
      // 更新現有聊天記錄
      const chatRef = doc(db, CHATS_COLLECTION, chat.id);
      
      // 檢查文檔是否存在
      const docSnap = await getDoc(chatRef);
      if (!docSnap.exists()) {
        throw new Error(`聊天記錄 ID ${chat.id} 不存在`);
      }
      
      // 更新文檔
      await updateDoc(chatRef, {
        messages: chat.messages,
        updatedAt: new Date(),
        model: chat.model
      });
      
      console.log('聊天記錄已更新，ID:', chat.id);
      return chat;
    } else {
      // 創建新的聊天記錄
      const docRef = await addDoc(collection(db, CHATS_COLLECTION), {
        ...chat,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('聊天記錄已儲存至 Firestore，ID:', docRef.id);
      return { ...chat, id: docRef.id };
    }
  } catch (error) {
    console.error('儲存聊天記錄失敗:', error);
    throw error;
  }
};

/**
 * 獲取聊天歷史記錄
 * @param {string} userId - 用戶 ID
 * @returns {Promise}
 */
export const getChatHistory = async (userId) => {
  try {
    // 從 Firestore 獲取特定用戶的聊天記錄
    const q = query(collection(db, CHATS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // 按更新時間排序，最新的在前面
    return history.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  } catch (error) {
    console.error('獲取聊天記錄失敗:', error);
    throw error;
  }
};

/**
 * 刪除聊天記錄
 * @param {string} chatId - 聊天記錄 ID
 * @returns {Promise}
 */
export const deleteChatHistory = async (chatId) => {
  try {
    // 從 Firestore 刪除特定聊天記錄
    await deleteDoc(doc(db, CHATS_COLLECTION, chatId));
    console.log('聊天記錄已刪除，ID:', chatId);
    return true;
  } catch (error) {
    console.error('刪除聊天記錄失敗:', error);
    throw error;
  }
};

/**
 * 獲取單個聊天記錄詳情
 * @param {string} chatId - 聊天記錄 ID
 * @returns {Promise}
 */
export const getChatById = async (chatId) => {
  try {
    const docRef = doc(db, CHATS_COLLECTION, chatId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('找不到該聊天記錄');
    }
  } catch (error) {
    console.error('獲取聊天記錄詳情失敗:', error);
    throw error;
  }
};

/**
 * 使用 AI 搜尋 FAQ
 * @param {string} query - 搜尋關鍵字
 * @param {function} onThinking - 思考過程回調函數
 * @returns {Promise} - 搜尋結果
 */
export const searchFAQWithAI = async (query, onThinking) => {
  try {
    // 顯示初始思考過程
    onThinking?.(`思考分析中...
1. 正在理解問題重點：「${query}」
2. 搜尋相關 FAQ 資料
3. 分析資訊關聯性
4. 整合回答內容`);

    // 從 Firestore 獲取所有 FAQ
    const querySnapshot = await getDocs(collection(db, FAQ_COLLECTION));
    const faqs = [];
    querySnapshot.forEach((doc) => {
      faqs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // 更新思考進度
    onThinking?.(`分析進行中...
1. ✓ 已理解問題重點
2. ✓ 已找到 ${faqs.length} 條相關資料
3. ⟳ 正在分析資訊關聯性
4. ⟳ 準備整合回答`);

    // 構建 AI 提示詞
    const systemMessage = {
      role: "system",
      content: `你是一個專業的 FAQ 搜尋助手，同時也是一位經驗豐富的學長。
請以個人化的口吻回答用戶的問題，先展示思考過程，再給出建議和分析。

回答時請遵循以下結構：

# 我的建議
[以第一人稱給出明確的立場和建議，說明你認為什麼更重要/更好，為什麼？]
例如：「以我的經驗，我建議你...因為...」

# 深入分析
[整合 FAQ 資訊並提供完整分析]
- 優點：...
- 缺點：...
- 關鍵考量：...

# 實用建議
[提供具體可行的行動方案]
1. [具體建議 1]
2. [具體建議 2]
...

請注意：
1. 思考過程要先於建議展示
2. 給出明確的立場和個人建議
3. 用生動的例子說明
4. 提供具體可行的建議
5. 整合 FAQ 資訊但不要直接引用
6. 使用親切的口吻

FAQ 列表：
${faqs.map(faq => `問題：${faq.question}\n答案：${faq.answer}\n標籤：${faq.tags.join(', ')}\n---`).join('\n')}`
    };

    // 更新最終思考進度
    onThinking?.(`最終整合中...
1. ✓ 已理解問題重點
2. ✓ 已找到 ${faqs.length} 條相關資料
3. ✓ 已分析資訊關聯性
4. ⟳ 正在生成完整回答`);

    const userMessage = {
      role: "user",
      content: query
    };

    // 定義可用的模型列表
    const models = ['deepseek-r1-distill-llama-70b', 'llama-3.3-70b-versatile'];
    let lastError = null;

    // 嘗試每個模型
    for (const model of models) {
      try {
        onThinking?.(`使用 ${model} 模型生成回答...`);
        
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [systemMessage, userMessage],
            temperature: 0.7,
            max_tokens: 2048,
            stream: false
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }

        // 如果不是 429 錯誤，直接拋出
        if (response.status !== 429) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`AI 搜尋請求失敗: ${response.status} - ${errorData.error?.message || '未知錯誤'}`);
        }

        // 如果是 429 錯誤，記錄並繼續嘗試下一個模型
        const errorData = await response.json();
        lastError = new Error(`模型 ${model} 請求限制: ${errorData.error?.message}`);
        console.log(`切換到下一個模型，因為: ${lastError.message}`);
        
      } catch (error) {
        lastError = error;
        if (error.message.includes('429')) {
          console.log(`模型 ${model} 達到請求限制，嘗試下一個模型...`);
          continue;
        }
        throw error;
      }
    }

    // 如果所有模型都失敗了，拋出最後一個錯誤
    throw lastError || new Error('所有模型都無法使用');

  } catch (error) {
    console.error('FAQ AI 搜尋失敗:', error);
    throw error;
  }
}; 