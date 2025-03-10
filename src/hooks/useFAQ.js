/**
 * FAQ 功能的自定義 Hook
 * 處理 FAQ 的搜尋、過濾和展開/收合功能
 */
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { searchFAQWithAI } from '../services/groqApi';

export const useFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [thinkingProcess, setThinkingProcess] = useState('');

  // 載入 FAQ 資料
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'faqs'));
        const faqList = [];
        querySnapshot.forEach((doc) => {
          faqList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setFaqs(faqList);
      } catch (error) {
        console.error('載入 FAQ 失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();
  }, []);

  // 切換展開/收合狀態
  const toggleItem = (itemId) => {
    setExpandedItems((prevItems) => {
      const newItems = new Set(prevItems);
      if (newItems.has(itemId)) {
        newItems.delete(itemId);
      } else {
        newItems.add(itemId);
      }
      return newItems;
    });
  };

  // AI 搜尋功能
  const searchWithAI = async (query) => {
    if (!query.trim() || isSearching) return;
    
    try {
      setIsSearching(true);
      setSearchQuery(query);
      setThinkingProcess('');
      
      // 使用 AI 搜尋 FAQ
      const aiResponse = await searchFAQWithAI(query, (thinking) => {
        setThinkingProcess(thinking);
      });
      
      // 解析 AI 回應並更新搜尋結果
      const aiResult = {
        id: `ai-${Date.now()}`,
        question: query,
        answer: aiResponse,
        tags: ['AI回答'],
        isAIGenerated: true
      };
      
      setSearchResults([aiResult]);
      // 自動展開 AI 回答
      setExpandedItems(new Set([aiResult.id]));
    } catch (error) {
      console.error('AI FAQ 搜尋失敗:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setThinkingProcess('');
    }
  };

  return {
    faqs,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSearching,
    searchResults,
    expandedItems,
    toggleItem,
    searchWithAI,
    thinkingProcess
  };
}; 