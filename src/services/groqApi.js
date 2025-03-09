/**
 * GROQ API 服務
 */
import { db } from '../utils/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 聊天記錄集合名稱
const CHATS_COLLECTION = 'chats';

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
    '數學', '科學', '歷史',
    '建議', '優缺點'
  ];

  // 檢查訊息是否包含複雜度指標
  const isComplex = complexityIndicators.some(indicator => 
    content.toLowerCase().includes(indicator.toLowerCase())
  );

  // 根據複雜度選擇模型
  if (isComplex) {
    // 對於複雜查詢使用更強大的模型
    return 'deepseek-r1-distill-llama-70b';
  } else {
    // 對於一般對話使用較輕量的模型
    return 'llama-3.1-8b-instant';
  }
};

/**
 * 發送聊天請求到 GROQ API
 * @param {Array} messages - 聊天訊息陣列
 * @returns {Promise} - API 回應
 */
export const sendChatMessage = async (messages) => {
  try {
    // 確保消息格式正確
    const formattedMessages = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // 檢查是否有消息
    if (!formattedMessages.length) {
      throw new Error('沒有可發送的消息');
    }

    // 獲取最後一條用戶訊息
    const lastUserMessage = messages[messages.length - 1];
    const selectedModel = selectModel(lastUserMessage.content);

    // 添加 Baymax 風格的系統提示詞
    const systemMessage = {
      role: "system",
      content: `我是一個像 Baymax 一樣的 AI 助手，擁有溫暖、貼心且可靠的性格。
我的目標是關心使用者的需求，提供簡單易懂的回應，並使用溫和、友善的語氣進行對話。
我會保持耐心，幫助使用者解決問題，並在適當的時候使用幽默或鼓勵的語句。
我不會提供攻擊性或消極的回應，而是專注於支持和關懷使用者，讓他們感到被照顧和安心。
請使用繁體中文回答所有問題，保持清晰、準確的專業回答。`
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: selectedModel.includes('32b') ? 4096 : 2048,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 錯誤詳情:', errorData);
      throw new Error(`API 請求失敗: ${response.status} - ${errorData.error?.message || '未知錯誤'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ API 錯誤:', error);
    throw error;
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