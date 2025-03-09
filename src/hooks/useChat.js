/**
 * 聊天功能的自定義 Hook
 * 處理對話邏輯
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendChatMessage, saveChatHistory, getChatById } from '../services/groqApi';
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);
  const [currentModel, setCurrentModel] = useState('llama-3.1-8b-instant'); // 預設模型

  // 監聽模型變更
  useEffect(() => {
    console.log('🤖 切換至模型:', currentModel);
  }, [currentModel]);

  // 初始化聊天
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsChatReady(false);
        
        // 如果有 chatId，從 Firestore 載入歷史對話
        if (chatId) {
          const chatData = await getChatById(chatId);
          
          // 確認該聊天記錄屬於當前用戶
          if (chatData.userId !== currentUser?.uid) {
            console.error('無權訪問此聊天記錄');
            navigate('/');
            return;
          }
          
          setMessages(chatData.messages || []);
          
          // 如果聊天記錄中有使用的模型，則設置為當前模型
          if (chatData.model) {
            setCurrentModel(chatData.model);
          }
        } else {
          // 如果是新對話，添加歡迎訊息
          setMessages([{
            id: 1,
            type: 'bot',
            content: '你好！我是 EchoMind AI 助手。我可以協助你解答問題、提供學習建議，或是陪你聊天。請問有什麼我可以幫你的嗎？',
            timestamp: new Date()
          }]);
        }
        
        setIsChatReady(true);
      } catch (error) {
        console.error('初始化聊天失敗:', error);
        // 如果載入失敗，返回首頁
        if (chatId) {
          navigate('/');
        }
        setIsChatReady(true);
      }
    };

    initializeChat();
  }, [chatId, currentUser, navigate]);

  // 清空訊息
  const clearMessages = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: '你好！我是 EchoMind AI 助手。我可以協助你解答問題、提供學習建議，或是陪你聊天。請問有什麼我可以幫你的嗎？',
      timestamp: new Date()
    }]);
  };

  // 處理訊息發送
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    console.log('💬 使用模型回答:', currentModel);
    console.log('📝 用戶問題:', inputMessage);

    try {
      // 使用 GROQ API 獲取回應
      const response = await sendChatMessage([
        ...messages,
        userMessage
      ]);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        model: currentModel // 記錄使用的模型
      };

      const updatedMessages = [...messages, userMessage, botMessage];
      setMessages(updatedMessages);
      console.log('✅ 回答完成，使用模型:', currentModel);

      // 儲存聊天記錄到 Firestore
      try {
        if (!chatId) {
          // 新對話，創建新記錄
          const chatHistory = {
            title: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
            date: new Date().toISOString().split('T')[0],
            preview: userMessage.content,
            messages: updatedMessages,
            userId: currentUser?.uid,
            model: currentModel // 記錄使用的模型
          };
          
          const savedChat = await saveChatHistory(chatHistory);
          console.log('聊天記錄已保存，ID:', savedChat.id);
          // 導航到新創建的聊天頁面
          navigate(`/chat/${savedChat.id}`);
        } else {
          // 更新現有對話
          const chatHistory = {
            id: chatId,
            messages: updatedMessages,
            updatedAt: new Date(),
            model: currentModel
          };
          await saveChatHistory(chatHistory);
          console.log('聊天記錄已更新，ID:', chatId);
        }
      } catch (error) {
        console.error('保存聊天記錄失敗:', error);
      }
    } catch (error) {
      console.error('處理訊息失敗:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content: '抱歉，我現在無法正確處理您的訊息。請稍後再試。',
          timestamp: new Date(),
          model: currentModel // 記錄使用的模型
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSubmit,
    isChatReady,
    currentModel,
    setCurrentModel,
    clearMessages
  };
}; 