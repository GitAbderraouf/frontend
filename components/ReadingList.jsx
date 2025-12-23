"use client";

import { useEffect, useState } from 'react';
import { useReadingList } from '../context/ReadingListContext';
import { getBatchRegulations, exportSelection } from '../lib/api';
import { Download, Trash2, FileText, Loader2 } from 'lucide-react';

export default function ReadingList() {
  const { savedIds, removeFromReadingList } = useReadingList();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch details when savedIds changes
  useEffect(() => {
    let mounted = true;

    const fetchItems = async () => {
      if (savedIds.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getBatchRegulations(savedIds);
        if (mounted) setItems(data);
      } catch (err) {
        console.error("Failed to load reading list details", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchItems();

    return () => { mounted = false; };
  }, [savedIds]);

  const handleExport = async () => {
    if (savedIds.length === 0) return;
    setExporting(true);
    try {
      await exportSelection(savedIds);
    } catch (e) {
      alert("Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  };

  if (savedIds.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
         <p className="text-slate-400 text-sm italic">Votre liste de lecture est vide.</p>
         <p className="text-xs text-slate-400 mt-2">Ajoutez des documents en cliquant sur l'icône <span className="inline-block"><FileText size={10} /></span> bookmark.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col max-h-[calc(100vh-120px)] sticky top-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <FileText size={18} className="text-blue-600" />
          Ma Sélection ({savedIds.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading && items.length === 0 ? (
           <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : (
          items.map(item => (
            <div key={item._id || item.id} className="group p-3 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition-all relative">
              <h4 className="text-sm font-medium text-slate-700 line-clamp-2 pr-6 leading-snug">
                {item.title}
              </h4>
              <button 
                onClick={() => removeFromReadingList(item._id || item.id)}
                className="absolute top-3 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                title="Retirer"
              >
                <Trash2 size={14} />
              </button>
              <div className="mt-1 text-xs text-slate-400">
                {item.publication_date ? new Date(item.publication_date).toLocaleDateString() : ''}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Exporter CSV
        </button>
      </div>
    </div>
  );
}
