import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface NameSearchFormProps {
  onSearch: (name: string) => void;
  loading: boolean;
}

export function NameSearchForm({ onSearch, loading }: NameSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
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
          <input
            id="cooperative-name"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: Coopérative Agricole du Nord, COOPAGRI..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            disabled={loading}
          />
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