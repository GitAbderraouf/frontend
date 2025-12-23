"use client";

import { useEffect, useState } from 'react';
import { useReadingList } from '../context/ReadingListContext';
import { getBatchRegulations, exportSelection } from '../lib/api';
import { X, FileDown, Loader2, Trash2 } from 'lucide-react';

export default function ReadingListDrawer() {
  const { isDrawerOpen, closeDrawer, savedIds, removeArticle } = useReadingList();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch article details when drawer opens or IDs change
  useEffect(() => {
    if (isDrawerOpen && savedIds.length > 0) {
      setLoading(true);
      getBatchRegulations(savedIds)
        .then(data => setArticles(data))
        .catch(err => console.error("Failed to load reading list details", err))
        .finally(() => setLoading(false));
    } else if (savedIds.length === 0) {
      setArticles([]);
    }
  }, [isDrawerOpen, savedIds]);

  const handleExportPdf = async () => {
    if (savedIds.length === 0) return;
    setExporting(true);
    try {
      await exportSelection(savedIds);
    } catch (error) {
      // Error is already logged in api.js
      alert("Erreur lors de l'export PDF. Vérifiez la console.");
    } finally {
      setExporting(false);
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-serif font-bold text-lg text-slate-800">Ma Liste de Lecture</h2>
            <p className="text-sm text-slate-500">{savedIds.length} article{savedIds.length > 1 ? 's' : ''} sélectionné{savedIds.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={closeDrawer} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {savedIds.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p>Votre liste est vide.</p>
              <p className="text-sm">Ajoutez des articles pour générer un rapport.</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            articles.map(article => (
              <div key={article._id || article.id} className="bg-white border border-slate-200 rounded p-3 shadow-sm flex gap-3 group">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-blue-600 mb-1 block">{article.source}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">
                    {article.analysis?.title_fr || article.title}
                  </h4>
                </div>
                <button 
                  onClick={() => removeArticle(article._id || article.id)}
                  className="text-slate-300 hover:text-red-500 self-start p-1"
                  title="Retirer de la liste"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleExportPdf}
            disabled={savedIds.length === 0 || exporting}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <FileDown size={20} />
            )}
            {exporting ? 'Génération...' : 'Télécharger le Rapport PDF'}
          </button>
        </div>
      </div>
    </>
  );
}
