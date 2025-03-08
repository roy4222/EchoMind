/**
 * FAQ 功能的自定義 Hook
 * 處理 FAQ 的搜尋、過濾和展開/收合功能
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { currentUser } = useAuth();

  // 模擬從 API 獲取 FAQ 數據
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
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
      } catch (error) {
        console.error('獲取 FAQ 失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // 使用 AI 搜尋功能
  const searchWithAI = async (query) => {
    if (!query.trim() || isSearching) return;
    
    try {
      setIsSearching(true);
      setSearchQuery(query);
      
      // 這裡應該是實際的 AI API 調用
      // const response = await aiService.searchFAQ(query);
      
      // 模擬 AI 處理延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬 AI 搜尋結果
      const aiResults = faqs.filter(faq => {
        const searchTerms = query.toLowerCase().split(' ');
        return searchTerms.some(term => 
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term) ||
          faq.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      });

      // 如果沒有找到完全匹配的結果，生成一個 AI 回答
      if (aiResults.length === 0) {
        const aiAnswer = {
          id: Date.now(),
          question: query,
          answer: `根據您的問題「${query}」，我建議您可以：\n\n1. 直接到聊天室與 AI 助手進行更深入的對話\n2. 瀏覽相關的學習資源\n3. 參考其他使用者的相似問題`,
          tags: ['AI回答', '客製化'],
          isAIGenerated: true
        };
        setSearchResults([aiAnswer]);
      } else {
        setSearchResults(aiResults);
      }
    } catch (error) {
      console.error('AI 搜尋失敗:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 清除搜尋
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

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
    isSearching,
    expandedItems,
    toggleItem,
    searchWithAI,
    clearSearch
  };
}; 