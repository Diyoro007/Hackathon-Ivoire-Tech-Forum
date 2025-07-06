import { Cooperative } from '../types';
import Papa from 'papaparse';

export async function loadCooperativesData(): Promise<Cooperative[]> {
  try {
    // URL de l'API (à adapter)
    const response = await fetch('https://koumoul.com/data-fair/api/v1/datasets/kgvg3ux8w1b2ihmdawrsh3md/lines', {
      headers: {
        'Accept': 'application/json',
        // Si besoin d'authentification, ajouter un header Authorization ici
        'x-apiKey': import.meta.env.VITE_KOUMOUL_API_KEY,     }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // On récupère directement le JSON
    const json = await response.json();

    // Ici, tu adaptes la structure selon ta réponse API.
    // Par exemple, si ta réponse est { results: [...] }
    const cooperatives: Cooperative[] = [];

    json.results.forEach((item: any, index: number) => {
      // Récupérer la clé dynamique (autre que les clés _id, _rand etc)
      const keys = Object.keys(item).filter(k => !['_id', '_rand', '_i', '_score'].includes(k));
      if (keys.length !== 1) return; // si pas exactement 1 clé, on ignore

      const csvLine = item[keys[0]] as string;

      // Parser cette ligne CSV (une ligne seulement)
      const parsed = Papa.parse<string[]>(csvLine, { delimiter: ',', quoteChar: '"', header: false });

      if (parsed.data.length === 0) return;

      const cols = parsed.data[0];

      if (!Array.isArray(cols)) return;

      cooperatives.push({
        id: `coop-${index}`,
        nom_abrégé: cols[1] || '',
        nom_complet: cols[2] ? cols[2].replace(/["\\]/g, '') : '',
        nombre_de_membres: parseInt(cols[4]) || 0,
        agrément: cols[11] || '',
        email: cols[6] || '',
        numéro_de_téléphone: cols[8] || '',
        localisation: cols[3] || '',
        date_création: '',  // pas dispo dans ces données
        date_agrement: '',  // pas dispo
        secteur_activité: '' // pas dispo
      });
    });

    return cooperatives.filter(c => c.nom_complet);

  } catch (err) {
    console.error('Erreur chargement données :', err);
    return [];
  }
}