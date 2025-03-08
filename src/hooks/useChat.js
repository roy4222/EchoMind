/**
 * 聊天功能的自定義 Hook
 * 處理對話邏輯
 */
import { useState, useEffect } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '你好！我是 EchoMind AI 助手。我可以協助你解答問題、提供學習建議，或是陪你聊天。請問有什麼我可以幫你的嗎？',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);

  // 模擬 AI 初始化
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 這裡應該是實際的 AI 服務初始化
        // await aiService.initialize();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsChatReady(true);
      } catch (error) {
        console.error('AI 服務初始化失敗:', error);
        setIsChatReady(true); // 開發時暫時設為 true
      }
    };

    initializeChat();
  }, []);

  // 處理訊息發送
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    // 新增使用者訊息
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // 模擬 AI 回應
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模擬 AI 回應
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: generateResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('處理訊息失敗:', error);
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 2,
          type: 'bot',
          content: '抱歉，我現在無法正確處理您的訊息。請稍後再試。',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 模擬回應生成
  const generateResponse = (input) => {
    const responses = [
      '這是個很好的問題！讓我來幫你解答...',
      '我理解你的困惑，讓我們一步一步來分析...',
      '根據我的理解，這個問題可以這樣思考...',
      '這個問題有幾個重要的面向需要考慮...',
      '讓我為你整理一下相關的重點...'
    ];
    return responses[Math.floor(Math.random() * responses.length)] +
           '\n\n這是一個示範回應。在實際應用中，這裡會串接 AI API 來獲得更智能的回答。';
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