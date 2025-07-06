import React from 'react';
import { SearchHistory as SearchHistoryType } from '../types';
import { History, Clock, Search, Upload, MessageSquare } from 'lucide-react';

interface SearchHistoryProps {
  history: SearchHistoryType[];
  onSelectFromHistory: (query: string, type: 'name' | 'document' | 'natural') => void;
  onClearHistory: () => void;
}

export function SearchHistory({ history, onSelectFromHistory, onClearHistory }: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'name': return Search;
      case 'document': return Upload;
      case 'natural': return MessageSquare;
      default: return Search;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <History className="h-5 w-5 mr-2" />
          Historique des recherches
        </h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Effacer
        </button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {history.slice(0, 10).map((item) => {
          const Icon = getIcon(item.type);
          return (
            <button
              key={item.id}
              onClick={() => onSelectFromHistory(item.query, item.type)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <Icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                    {item.query}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
              {item.results.length > 0 && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.results.length} résultat(s) trouvé(s)
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}