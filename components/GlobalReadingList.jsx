"use client";

import { ReadingListProvider, useReadingList } from '../context/ReadingListContext';
import ReadingListDrawer from './ReadingListDrawer';
import { BookOpen } from 'lucide-react';

function FloatingTrigger() {
  const { toggleDrawer, savedIds } = useReadingList();

  if (savedIds.length === 0) return null;

  return (
    <button
      onClick={toggleDrawer}
      className="fixed bottom-8 right-8 z-40 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 group"
      title="Ouvrir ma liste de lecture"
    >
      <div className="relative">
        <BookOpen size={24} />
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-900">
          {savedIds.length}
        </span>
      </div>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-medium">
        Ma Liste
      </span>
    </button>
  );
}

export default function GlobalReadingList({ children }) {
  return (
    <ReadingListProvider>
      {children}
      <FloatingTrigger />
      <ReadingListDrawer />
    </ReadingListProvider>
  );
}
