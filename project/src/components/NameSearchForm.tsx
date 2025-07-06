import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';

interface NameSearchFormProps {
  onSearch: (name: string) => void;
  loading: boolean;
}

export function NameSearchForm({ onSearch, loading }: NameSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setSearchTerm(result);
        setIsListening(false);
        onSearch(result); // auto-recherche après vocal
      };

      recognition.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      console.warn("Reconnaissance vocale non supportée sur ce navigateur.");
    }
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Recherche par nom de coopérative
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="cooperative-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom de la coopérative
          </label>
          <div className="flex items-center gap-2">
            <input
              id="cooperative-name"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Coopérative Agricole du Nord, COOPAGRI..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isListening || loading}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Utiliser le micro"
            >
              <Mic className={`h-5 w-5 ${isListening ? 'text-red-600 animate-pulse' : 'text-gray-700 dark:text-gray-100'}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!searchTerm.trim() || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          <Search className="h-5 w-5 mr-2" />
          {loading ? 'Recherche en cours...' : 'Rechercher'}
        </button>
      </div>
    </form>
  );
}
