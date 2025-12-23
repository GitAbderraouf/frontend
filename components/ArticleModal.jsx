"use client";

import { X, Calendar, MapPin, Shield } from 'lucide-react';
import { useEffect } from 'react';

export default function ArticleModal({ doc, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="pr-8">
            <h2 className="text-2xl font-serif text-slate-900 font-bold leading-tight mb-2">
              {doc.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Shield size={14} /> {doc.source}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {doc.publication_date ? new Date(doc.publication_date).toLocaleDateString() : 'N/A'}</span>
              {doc.region && <span className="flex items-center gap-1"><MapPin size={14} /> {doc.region}</span>}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Analysis Section */}
          {doc.analysis && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3">Analyse IA</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Résumé</h4>
                  <p className="text-slate-700 leading-relaxed text-sm mt-1">{doc.analysis.summary}</p>
                </div>
                
                {doc.analysis.obligations?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Obligations</h4>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {doc.analysis.obligations.map((item, i) => (
                        <li key={i} className="text-slate-700 text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Content */}
          <div>
             <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 border-b pb-2">Contenu du texte</h3>
             <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
               {doc.content_raw}
             </div>
          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium text-sm hover:text-slate-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
