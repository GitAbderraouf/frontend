"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ReadingListContext = createContext();

export function ReadingListProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('readingList');
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse reading list", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever savedIds changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('readingList', JSON.stringify(savedIds));
    }
  }, [savedIds, isInitialized]);

  const addArticle = (id) => {
    if (!savedIds.includes(id)) {
      setSavedIds(prev => [...prev, id]);
    }
  };

  const removeArticle = (id) => {
    setSavedIds(prev => prev.filter(savedId => savedId !== id));
  };

  const isSaved = (id) => savedIds.includes(id);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  return (
    <ReadingListContext.Provider value={{ 
      savedIds, 
      addArticle, 
      removeArticle, 
      isSaved,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer
    }}>
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  return useContext(ReadingListContext);
}
