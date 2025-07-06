import Fuse from 'fuse.js';
import { Cooperative } from '../types';

export function createFuzzySearcher(cooperatives: Cooperative[]) {
  return new Fuse(cooperatives, {
    keys: [
      { name: 'nom_complet', weight: 0.7 },
      { name: 'nom_abrégé', weight: 0.3 }
    ],
    threshold: 0.6,
    includeScore: true
  });
}

export function fuzzySearch(query: string, cooperatives: Cooperative[]): {
  matches: Array<{ item: Cooperative; score: number }>;
  bestMatch: Cooperative | null;
} {
  const fuse = createFuzzySearcher(cooperatives);
  const results = fuse.search(query);
  
  const matches = results.map(result => ({
    item: result.item,
    score: 1 - (result.score || 0)
  }));

  return {
    matches,
    bestMatch: matches.length > 0 ? matches[0].item : null
  };
}