"use client";

import { Search, Filter, Globe, Database } from 'lucide-react';

export default function Filters({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[73px] z-20 py-4 px-6 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            name="q"
            placeholder="Rechercher (ex: Ransomware, DORA, IA Act)..."
            value={filters.q || ''}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        {/* Source Select */}
        <div className="relative w-full md:w-auto min-w-[180px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Database size={16} className="text-slate-400" />
          </div>
          <select
            name="source"
            value={filters.source || ''}
            onChange={handleChange}
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm shadow-sm"
          >
            <option value="">Toutes les sources</option>
            <option value="ANSSI">ANSSI (Fr)</option>
            <option value="CNIL">CNIL (Fr)</option>
            <option value="CERT-FR">CERT-FR (Fr)</option>
            <option value="EDPB">EDPB (Europe)</option>
            <option value="NIST">NIST (USA)</option>
            <option value="Cybersecurity Dive">Cybersecurity Dive (USA)</option>
          </select>
           <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </div>
        </div>

        {/* Region Select */}
        <div className="relative w-full md:w-auto min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe size={16} className="text-slate-400" />
          </div>
          <select
            name="region"
            value={filters.region || ''}
            onChange={handleChange}
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm shadow-sm"
          >
            <option value="">Toutes régions</option>
            <option value="France">France</option>
            <option value="Europe">Europe</option>
            <option value="USA">USA</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </div>
        </div>

      </div>
    </div>
  );
}