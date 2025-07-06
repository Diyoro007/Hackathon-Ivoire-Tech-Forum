export interface Cooperative {
  id: string;
  nom_abrégé: string;
  nom_complet: string;
  nombre_de_membres: number;
  agrément: string;
  email: string;
  numéro_de_téléphone: string;
  localisation: string;
  date_création?: string;
  statut_legal?: 'en_règle' | 'douteuse' | 'non_reconnue';
  date_agrement?: string;
  secteur_activité?: string;
}

export interface SearchResult {
  cooperative: Cooperative;
  confidence: number;
  status: 'en_règle' | 'douteuse' | 'non_reconnue';
  explanation: string;
  matchType: 'exact' | 'fuzzy' | 'gpt';
}

export interface SearchHistory {
  id: string;
  query: string;
  type: 'name' | 'document' | 'natural';
  timestamp: Date;
  results: SearchResult[];
}

export type Theme = 'light' | 'dark';