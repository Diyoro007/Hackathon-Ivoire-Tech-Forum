import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeCooperativeName(name: string, dataset: any[]): Promise<{
  correctedName: string;
  bestMatch: any | null;
  confidence: number;
  explanation: string;
}> {
  try {
    const cooperativeNames = dataset.map(coop => coop.nom_complet).join(', ');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en analyse de coopératives agricoles. Tu dois analyser un nom de coopérative saisi par l'utilisateur et trouver la meilleure correspondance dans notre dataset. Voici les coopératives disponibles: ${cooperativeNames}`
        },
        {
          role: "user",
          content: `Analyse ce nom de coopérative: "${name}". Trouve la ou les  meilleures correspondance, corrige les erreurs possibles et indique le niveau de confiance (0-100). Réponds en JSON avec: correctedName, bestMatchName, confidence, explanation`
        }
      ],
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    const bestMatch = dataset.find(coop => 
      coop.nom_complet.toLowerCase().includes(result.bestMatchName?.toLowerCase()) ||
      coop.nom_abrégé.toLowerCase().includes(result.bestMatchName?.toLowerCase())
    );

    return {
      correctedName: result.correctedName || name,
      bestMatch,
      confidence: result.confidence || 0,
      explanation: result.explanation || "Analyse automatique effectuée"
    };
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return {
      correctedName: name,
      bestMatch: null,
      confidence: 0,
      explanation: "Erreur lors de l'analyse automatique"
    };
  }
}

export async function analyzeDocument(extractedText: string, dataset: any[]): Promise<{
  cooperativeName: string;
  agrementNumber: string;
  confidence: number;
  explanation: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse de documents officiels de coopératives agricoles. Extrait le nom de la coopérative, le numéro d'agrément et évalue la validité du document."
        },
        {
          role: "user",
          content: `Analyse ce texte extrait d'un document officiel: "${extractedText}". Extrait le nom de la coopérative, le numéro d'agrément et évalue la validité. Réponds en JSON avec: cooperativeName, agrementNumber, confidence, explanation`
        }
      ],
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      cooperativeName: result.cooperativeName || "",
      agrementNumber: result.agrementNumber || "",
      confidence: result.confidence || 0,
      explanation: result.explanation || "Document analysé automatiquement"
    };
  } catch (error) {
    console.error('Erreur analyse document:', error);
    return {
      cooperativeName: "",
      agrementNumber: "",
      confidence: 0,
      explanation: "Erreur lors de l'analyse du document"
    };
  }
}

export async function naturalLanguageSearch(query: string, dataset: any[]): Promise<{
  filters: any;
  explanation: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en transformation de requêtes en langage naturel vers des filtres de données. Les colonnes disponibles sont: nom_abrégé, nom_complet, nombre_de_membres, agrément, localisation, secteur_activité, date_création."
        },
        {
          role: "user",
          content: `Transforme cette requête en filtres: "${query}". Réponds en JSON avec: filters (objet avec les conditions), explanation (explication des filtres appliqués)`
        }
      ],
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      filters: result.filters || {},
      explanation: result.explanation || "Filtres appliqués automatiquement"
    };
  } catch (error) {
    console.error('Erreur recherche naturelle:', error);
    return {
      filters: {},
      explanation: "Erreur lors de l'analyse de la requête"
    };
  }
}