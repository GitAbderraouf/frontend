"use client";

import { useState, useEffect } from 'react';
import { searchRegulations } from '../lib/api';

// Components
import RegulationCard from '../components/RegulationCard';
import ArticleModal from '../components/ArticleModal';
import Filters from '../components/Filters';
import NewsletterForm from '@/components/NewsletterForm';
import { GraduationCap, ShieldAlert, Loader2 } from 'lucide-react';

export default function Page() {
  const [regulations, setRegulations] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    q: '',
    source: '',
    region: ''
  });
  
  // Initial load
  useEffect(() => {
    handleSearch();
  }, []); 

  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchRegulations(filters);
      // Handle both Array (direct list) and Object (paginated { items: [] }) formats
      const items = Array.isArray(data) ? data : (data.items || []);
      const total = Array.isArray(data) ? data.length : (data.total || items.length);
      
      setRegulations(items);
      setTotalResults(total);
    } catch (e) {
      console.error("Search Error:", e);
      setRegulations([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800 font-serif font-bold text-2xl tracking-tight">
            <GraduationCap size={32} />
            RegulatoryScholar <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 font-sans font-medium tracking-normal align-middle">v2.0 AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
             <span>6 Sources Monitorées</span>
             <span>Mise à jour en temps réel</span>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <Filters filters={filters} onFilterChange={setFilters} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin text-blue-600" size={16} /> Recherche en cours...</span>
            ) : (
              `${totalResults} Documents de veille trouvés`
            )}
          </h2>
        </div>

        {loading ? (
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm animate-pulse">
                 <div className="flex justify-between mb-4">
                   <div className="h-4 bg-slate-200 rounded w-24"></div>
                   <div className="h-4 bg-slate-200 rounded w-16"></div>
                 </div>
                 <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                 <div className="h-20 bg-slate-100 rounded w-full mb-4"></div>
                 <div className="h-8 bg-slate-50 rounded w-full"></div>
               </div>
             ))}
           </div>
        ) : (
          <div className="space-y-4">
            {regulations.map((doc) => (
              <RegulationCard 
                key={doc._id || doc.id} 
                doc={doc} 
                onClick={setSelectedDoc} 
              />
            ))}
            
            {regulations.length === 0 && !loading && (
               <div className="py-20 text-center text-slate-400 bg-white rounded-lg border border-slate-200 border-dashed shadow-sm">
                  <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium text-slate-600">Aucun résultat trouvé.</p>
                  <p className="text-sm">Essayez d'élargir vos filtres de recherche ou de vérifier la connexion au serveur.</p>
               </div>
            )}
          </div>
        )}
      </main>
      <div className="flex-1">
      <NewsletterForm/>
      </div>

      {/* Modal */}
      {selectedDoc && (
        <ArticleModal 
          doc={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </div>
  );
}
