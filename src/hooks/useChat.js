/**
 * 聊天功能的自定義 Hook
 * 處理對話邏輯
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sendChatMessage, saveChatHistory } from '../services/groqApi';
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);

  // 初始化聊天
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsChatReady(false);
        // 如果是新對話，添加歡迎訊息
        if (!chatId) {
          setMessages([{
            id: 1,
            type: 'bot',
            content: '你好！我是 EchoMind AI 助手。我可以協助你解答問題、提供學習建議，或是陪你聊天。請問有什麼我可以幫你的嗎？',
            timestamp: new Date()
          }]);
        }
        // TODO: 如果有 chatId，從後端載入歷史對話
        setIsChatReady(true);
      } catch (error) {
        console.error('初始化聊天失敗:', error);
        setIsChatReady(true);
      }
    };

    initializeChat();
  }, [chatId]);

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
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // 儲存聊天記錄
      if (!chatId) {
        const chatHistory = {
          id: Date.now().toString(),
          title: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
          date: new Date().toISOString().split('T')[0],
          preview: userMessage.content,
          messages: [...messages, userMessage, botMessage],
          userId: currentUser?.uid
        };
        await saveChatHistory(chatHistory);
      }
    } catch (error) {
      console.error('處理訊息失敗:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content: '抱歉，我現在無法正確處理您的訊息。請稍後再試。',
          timestamp: new Date()
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
    isChatReady
  };
}; 