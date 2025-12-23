"use client";

import { useState } from 'react';
import { Mail, CheckCircle, XCircle, Send } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/subscribers/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Inscription réussie ! Vous recevrez nos alertes.');
        setEmail('');
      } else {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md mx-auto text-center shadow-lg">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-slate-700 rounded-full">
           <Mail size={24} className="text-blue-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-2">Restez informé</h3>
      <p className="text-slate-400 text-sm mb-6">
        Recevez les dernières alertes réglementaires directement dans votre boîte mail.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-4 pr-12 py-2 bg-slate-900 border border-slate-600 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
          >
             {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
                <Send size={16} />
             )}
          </button>
        </div>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-2 bg-green-900/30 text-green-400 rounded text-sm flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle size={16} /> {message}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-2 bg-red-900/30 text-red-400 rounded text-sm flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
          <XCircle size={16} /> {message}
        </div>
      )}
    </div>
  );
}
