import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';

interface SearchModesProps {
  activeMode: 'name' | 'document' | 'natural';
  onModeChange: (mode: 'name' | 'document' | 'natural') => void;
}

export function SearchModes({ activeMode, onModeChange }: SearchModesProps) {
  const modes = [
    {
      id: 'name' as const,
      icon: Search,
      title: 'Recherche par nom',
      description: 'Rechercher par nom de coopérative'
    },
    {
      id: 'document' as const,
      icon: Upload,
      title: 'Analyse de document',
      description: 'Analyser un document (agrément, RCCM, etc.)'
    },
    // {
    //   id: 'natural' as const,
    //   icon: MessageSquare,
    //   title: 'Recherche intelligente',
    //   description: 'Recherche en langage naturel'
    // }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
              isActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <Icon className={`h-8 w-8 mb-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
              {mode.title}
            </h3>
            <p className={`text-sm ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}