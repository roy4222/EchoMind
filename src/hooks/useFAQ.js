/**
 * FAQ 功能的自定義 Hook
 * 處理 FAQ 的搜尋、過濾和展開/收合功能
 */
import { useState, useEffect } from 'react';

export const useFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // 模擬從 API 獲取 FAQ 數據
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        // 這裡應該是實際的 API 調用
        // const response = await faqService.getFAQs();
        // setFaqs(response.data);
        
        // 模擬數據
        const mockFAQs = [
          {
            id: 1,
            question: '這個平台是做什麼的？',
            answer: 'EchoMind 是一個整合 AI 的教育助理網站，提供智能問答、AI 關懷對話，以及教育資源推薦等功能。',
            tags: ['介紹', '功能']
          },
          {
            id: 2,
            question: '如何開始使用 AI 對話功能？',
            answer: '登入後，點擊頁面上方的「AI 對話」按鈕即可開始。系統會根據您的對話內容，提供個人化的回應和建議。',
            tags: ['使用說明', 'AI 對話']
          },
          {
            id: 3,
            question: '教育資源推薦是如何運作的？',
            answer: '系統會分析您的對話內容和學習需求，自動推薦相關的學習資源，包括文章、影片、練習題等。',
            tags: ['功能', '學習資源']
          },
          {
            id: 4,
            question: '系統支援哪些學科領域？',
            answer: '目前支援語文、數學、自然科學、社會科學等主要學科，未來會持續擴充更多領域。',
            tags: ['學科', '範圍']
          },
          {
            id: 5,
            question: '如何追蹤學習進度？',
            answer: '在個人儀表板中可以查看學習歷程、完成率、推薦資源等統計資訊，幫助您掌握學習狀況。',
            tags: ['功能', '學習追蹤']
          }
        ];
        
        setFaqs(mockFAQs);
        setIsLoading(false);
      } catch (error) {
        console.error('獲取 FAQ 失敗:', error);
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // 處理搜尋功能
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // 使用模糊搜尋比對問題和答案
    const results = faqs.filter(faq => {
      const query = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    });

    setSearchResults(results);
  }, [searchQuery, faqs]);

  // 處理展開/收合
  const toggleItem = (id) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  return {
    faqs,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    expandedItems,
    toggleItem
  };
}; 