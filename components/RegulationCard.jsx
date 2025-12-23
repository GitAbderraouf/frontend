"use client";

import { Bookmark, BookmarkCheck, Languages, ExternalLink } from 'lucide-react';
import { useReadingList } from '../context/ReadingListContext';

export default function RegulationCard({ doc, onClick }) {
  const { isSaved, addArticle, removeArticle } = useReadingList();
  const docId = doc._id || doc.id;
  const saved = isSaved(docId);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    if (saved) {
      removeArticle(docId);
    } else {
      addArticle(docId);
    }
  };

  // --- Logic: Titles & Translations ---
  const hasTranslation = !!doc.analysis?.title_fr;
  const displayTitle = doc.analysis?.title_fr || doc.title;
  const displaySummary = doc.analysis?.summary || doc.content_raw?.substring(0, 280) + "...";

  // --- Logic: Badges & Colors ---
  const getSourceStyle = (source) => {
    switch (source) {
      case 'ANSSI': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'CNIL': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'CERT-FR': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'NIST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EDPB': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cybersecurity Dive': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getImpactStyle = (score) => {
    if (!score) return 'bg-slate-100 text-slate-600';
    if (score >= 8) return 'bg-red-100 text-red-700 border-red-200 font-bold';
    if (score >= 5) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div 
      className="bg-white border border-slate-200 rounded-lg p-5 mb-4 hover:shadow-md transition-shadow cursor-pointer relative group flex flex-col"
      onClick={() => onClick(doc)}
    >
      {/* Top Meta: Source & Date */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs border ${getSourceStyle(doc.source)} font-medium`}>
            {doc.source}
          </span>
          <span className="text-xs text-slate-400">
            {doc.publication_date ? new Date(doc.publication_date).toLocaleDateString() : 'Date inconnue'}
          </span>
        </div>
        
        {/* Bookmark Button */}
        <button 
          onClick={toggleBookmark}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors z-10"
          title={saved ? "Retirer de la liste" : "Ajouter à la liste"}
        >
          {saved ? <BookmarkCheck size={20} className="text-blue-600 fill-current" /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-800 transition-colors pr-8">
        {displayTitle}
      </h3>

      {/* Translation Badge (if applicable) */}
      {hasTranslation && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-3 bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-bold rounded border border-blue-100 w-fit">
          <Languages size={12} /> Traduit par IA
        </div>
      )}

      {/* Summary */}
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
        {displaySummary}
      </p>

      {/* Footer Tags & Action */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded border ${getImpactStyle(doc.analysis?.impact_score)}`}>
            Impact {doc.analysis?.impact_score ? `${doc.analysis.impact_score}/10` : 'N/A'}
          </span>
          {doc.region && (
            <span className="text-slate-500 border border-slate-100 bg-slate-50 px-2 py-0.5 rounded">
              {doc.region}
            </span>
          )}
        </div>
        
        {/* Read Source Link */}
        {doc.url && (
          <a 
            href={doc.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-blue-50"
            onClick={(e) => e.stopPropagation()}
          >
            Lire la source <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
