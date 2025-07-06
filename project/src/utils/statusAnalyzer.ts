import { Cooperative, SearchResult } from '../types';

export function analyzeCooperativeStatus(cooperative: Cooperative): {
  status: 'en_règle' | 'douteuse' | 'non_reconnue';
  explanation: string;
} {
  const currentDate = new Date();
  const agrementDate = cooperative.date_agrement ? new Date(cooperative.date_agrement) : null;
  
  // Analyse du statut basée sur l'agrément
  if (!cooperative.agrément || cooperative.agrément.trim() === '') {
    return {
      status: 'non_reconnue',
      explanation: 'Aucun agrément enregistré dans nos données'
    };
  }

  // Vérification de la validité de l'agrément
  if (agrementDate) {
    const monthsDiff = (currentDate.getTime() - agrementDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsDiff > 12) {
      return {
        status: 'douteuse',
        explanation: `Agrément délivré il y a ${Math.round(monthsDiff)} mois, vérification recommandée`
      };
    }
  }

  // Vérification des informations obligatoires
  const missingFields = [];
  if (!cooperative.email || !cooperative.email.includes('@')) missingFields.push('email');
  if (!cooperative.numéro_de_téléphone) missingFields.push('téléphone');
  if (!cooperative.localisation) missingFields.push('localisation');
  if (cooperative.nombre_de_membres < 5) missingFields.push('nombre minimum de membres');

  if (missingFields.length > 2) {
    return {
      status: 'douteuse',
      explanation: `Informations incomplètes: ${missingFields.join(', ')}`
    };
  } else if (missingFields.length > 0) {
    return {
      status: 'douteuse',
      explanation: `Quelques informations manquantes: ${missingFields.join(', ')}`
    };
  }

  return {
    status: 'en_règle',
    explanation: 'Coopérative reconnue avec agrément valide et informations complètes'
  };
}

export function generateSearchResult(
  cooperative: Cooperative,
  confidence: number,
  matchType: 'exact' | 'fuzzy' | 'gpt'
): SearchResult {
  const statusAnalysis = analyzeCooperativeStatus(cooperative);
  
  return {
    cooperative,
    confidence,
    status: statusAnalysis.status,
    explanation: statusAnalysis.explanation,
    matchType
  };
}