import React from 'react';
import { SearchResult } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Phone, Mail, Users, Calendar, Building } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-2">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Aucune coopérative trouvée</p>
          <p className="text-sm">Essayez avec des termes différents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Résultats de la recherche ({results.length})
      </h3>
      
      {results.map((result, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {result.cooperative.nom_complet}
                </h4>
                <StatusBadge status={result.status} />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {result.cooperative.nom_abrégé}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                  Confiance: {Math.round(result.confidence)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{result.cooperative.localisation}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">{result.cooperative.nombre_de_membres} membres</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4 mr-2" />
                <span className="text-sm">{result.cooperative.secteur_activité}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{result.cooperative.numéro_de_téléphone}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{result.cooperative.email}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Créée le {result.cooperative.date_création}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Agrément:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {result.cooperative.agrément}
              </span>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Analyse:</span> {result.explanation}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}