/**
 * GROQ API 服務
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
    return 'deepseek-r1-distill-qwen-32b';
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

    // 添加繁體中文指令
    const systemMessage = {
      role: "system",
      content: "請使用繁體中文回答所有問題。回答要清晰、準確，並保持專業友善的語氣。"
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
  // 這裡應該實現與後端 API 的整合
  // 目前先使用 localStorage 模擬
  try {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.unshift(chat);
    localStorage.setItem('chatHistory', JSON.stringify(history));
    return chat;
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
  // 這裡應該實現與後端 API 的整合
  // 目前先使用 localStorage 模擬
  try {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    return history;
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
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const newHistory = history.filter(chat => chat.id !== chatId);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    return true;
  } catch (error) {
    console.error('刪除聊天記錄失敗:', error);
    throw error;
  }
}; 