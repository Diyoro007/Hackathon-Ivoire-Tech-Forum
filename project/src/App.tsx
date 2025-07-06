import React, { useState, useEffect } from 'react';
import { Sprout, Shield, Users } from 'lucide-react';
import { SearchModes } from './components/SearchModes';
import { NameSearchForm } from './components/NameSearchForm';
import { DocumentUploadForm } from './components/DocumentUploadForm';
import { NaturalSearchForm } from './components/NaturalSearchForm';
import { SearchResults } from './components/SearchResults';
import { SearchHistory } from './components/SearchHistory';
import { ThemeToggle } from './components/ThemeToggle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { loadCooperativesData } from './utils/csvParser';
import { fuzzySearch } from './utils/fuzzySearch';
import { processDocument } from './utils/ocr';
import { analyzeCooperativeName, analyzeDocument, naturalLanguageSearch } from './utils/openai';
import { generateSearchResult } from './utils/statusAnalyzer';
import { Cooperative, SearchResult, SearchHistory as SearchHistoryType } from './types';

function App() {
  const [theme] = useTheme();
  const [activeMode, setActiveMode] = useState<'name' | 'document' | 'natural'>('name');
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryType[]>('searchHistory', []);

  useEffect(() => {
    console.log('Début chargement coopératives');
    loadCooperativesData().then(data => {
      console.log('Coopératives chargées :', data.length);
      setCooperatives(data);
      setInitialLoading(false);
    }).catch(error => {
      console.error('Erreur chargement données:', error);
      setInitialLoading(false);
    });
  }, []);

  const addToHistory = (query: string, type: 'name' | 'document' | 'natural', results: SearchResult[]) => {
    const newHistoryItem: SearchHistoryType = {
      id: Date.now().toString(),
      query,
      type,
      timestamp: new Date(),
      results
    };
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
  };

  const handleNameSearch = async (name: string): Promise<SearchResult[]> => {
    setLoading(true);
    try {
      const fuzzyResults = fuzzySearch(name, cooperatives);
      const gptAnalysis = await analyzeCooperativeName(name, cooperatives);
      const results: SearchResult[] = [];
  
      const MIN_SCORE = 0.7; // seuil minimum (70%)
  
      // Ajout du meilleur match fuzzy uniquement si son score est suffisant
      if (fuzzyResults.bestMatch && fuzzyResults.matches[0].score >= MIN_SCORE) {
        results.push(generateSearchResult(
          fuzzyResults.bestMatch,
          fuzzyResults.matches[0].score * 100,
          'fuzzy'
        ));
      }
  
      // Ajout du meilleur match GPT uniquement si score de confiance suffisant
      if (gptAnalysis.bestMatch && gptAnalysis.confidence >= MIN_SCORE * 100 &&
          gptAnalysis.bestMatch.id !== fuzzyResults.bestMatch?.id) {
        results.push(generateSearchResult(
          gptAnalysis.bestMatch,
          gptAnalysis.confidence,
          'gpt'
        ));
      }
  
      // Ajout des autres résultats fuzzy qui dépassent le seuil, sans doublons
      fuzzyResults.matches.slice(1, 10).forEach(match => {
        if (match.score >= MIN_SCORE && !results.find(r => r.cooperative.id === match.item.id)) {
          results.push(generateSearchResult(
            match.item,
            match.score * 100,
            'fuzzy'
          ));
        }
      });
  
      setSearchResults(results);
      addToHistory(name, 'name', results);
      return results;
  
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };
  



  // const handleDocumentUpload = async (file: File) => {
  //   setLoading(true);
  //   try {
  //     // Traitement OCR
  //     const ocrResult = await processDocument(file);
      
  //     if (!ocrResult.extractedText) {
  //       setSearchResults([]);
  //       return;
  //     }
      
  //     // Analyse GPT du document
  //     const docAnalysis = await analyzeDocument(ocrResult.extractedText, cooperatives);
      
  //     if (docAnalysis.cooperativeName) {
  //       // Recherche basée sur le nom extrait
  //       await handleNameSearch(docAnalysis.cooperativeName);
  //     } else {
  //       setSearchResults([]);
  //     }
      
  //     addToHistory(`Document: ${file.name}`, 'document', searchResults);
      
  //   } catch (error) {
  //     console.error('Erreur traitement document:', error);
  //     setSearchResults([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDocumentUpload = async (file: File) => {
    console.log("📥 Fichier reçu :", file.name);
    setLoading(true);
    try {
      console.log("🔍 Début traitement document...");
      const ocrResult = await processDocument(file);
      console.log("📄 Résultat OCR :", ocrResult);

      if (!ocrResult.extractedText) {
        console.warn("⚠️ Aucun texte extrait !");
        setSearchResults([]);
        return;
      }

      const docAnalysis = await analyzeDocument(ocrResult.extractedText, cooperatives);
      console.log("🧠 Analyse GPT :", docAnalysis);
      let results: SearchResult[] = [];

      if (docAnalysis.agrementNumber) {
        const matchByAgrement = cooperatives.find(coop =>
          coop.agrément?.toLowerCase() === docAnalysis.agrementNumber.toLowerCase()
        );

        if (matchByAgrement) {
          results.push(generateSearchResult(matchByAgrement, docAnalysis.confidence || 90, 'gpt'));
          console.log("🧠 Analyse GPT du document :", docAnalysis);
          console.log("📄 Texte OCR brut :", ocrResult.extractedText);
        }
      }

      if (results.length === 0 && docAnalysis.cooperativeName) {
        const nameSearchResults = await handleNameSearch(docAnalysis.cooperativeName);
        results = nameSearchResults || [];
      }

      setSearchResults(results);
      addToHistory(`Document: ${file.name}`, 'document', results);

    } catch (error) {
      console.error('Erreur traitement document:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
};

  const handleNaturalSearch = async (query: string) => {
    setLoading(true);
    try {
      // Analyse GPT de la requête
      const searchAnalysis = await naturalLanguageSearch(query, cooperatives);
      console.log('Analyse de la requête :', searchAnalysis);
      
      
      // Application des filtres
      let filteredCooperatives = cooperatives;
      
      if (searchAnalysis.filters.localisation) {
        filteredCooperatives = filteredCooperatives.filter(coop =>
          coop.localisation.toLowerCase().includes(searchAnalysis.filters.localisation.toLowerCase())
        );
      }
      
      // if (searchAnalysis.filters.secteur_activité) {
      //   filteredCooperatives = filteredCooperatives.filter(coop =>
      //     coop.secteur_activité?.toLowerCase().includes(searchAnalysis.filters.secteur_activité.toLowerCase())
      //   );
      // }
      
      if (searchAnalysis.filters.nombre_de_membres_min) {
        filteredCooperatives = filteredCooperatives.filter(coop =>
          coop.nombre_de_membres >= searchAnalysis.filters.nombre_de_membres_min
        );
      }
      
      // if (searchAnalysis.filters.date_création_après) {
      //   filteredCooperatives = filteredCooperatives.filter(coop =>
      //     new Date(coop.date_création || '1900-01-01') >= new Date(searchAnalysis.filters.date_création_après)
      //   );
      // }
      
      const results = filteredCooperatives.slice(0, 10).map(coop =>
        generateSearchResult(coop, 90, 'gpt')
      );
      
      setSearchResults(results);
      addToHistory(query, 'natural', results);
      
    } catch (error) {
      console.error('Erreur recherche naturelle:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromHistory = (query: string, type: 'name' | 'document' | 'natural') => {
    setActiveMode(type);
    if (type === 'name') {
      handleNameSearch(query);
    } else if (type === 'natural') {
      handleNaturalSearch(query);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="Chargement des données..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    KAIO
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vérification des coopératives agricoles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{cooperatives.length} coopératives</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sprout className="h-12 w-12 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Vérification des Coopératives
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Vérifiez rapidement le statut légal et la validité de toute coopérative agricole
                  </p>
                </div>
              </div>
            </div>

            {/* Search Modes */}
            <SearchModes activeMode={activeMode} onModeChange={setActiveMode} />

            {/* Search Forms */}
            <div className="space-y-6">
              {activeMode === 'name' && (
                <NameSearchForm onSearch={handleNameSearch} loading={loading} />
              )}
              
              {activeMode === 'document' && (
                <DocumentUploadForm onUpload={handleDocumentUpload} loading={loading} />
              )}
              
              {/* {activeMode === 'natural' && (
                <NaturalSearchForm onSearch={handleNaturalSearch} loading={loading} />
              )} */}
            </div>

            {/* Search Results */}
            <SearchResults results={searchResults} loading={loading} />
          </div>

          {/* Right Column - History */}
          <div className="space-y-6">
            <SearchHistory
              history={searchHistory}
              onSelectFromHistory={handleSelectFromHistory}
              onClearHistory={handleClearHistory}
            />
            
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total coopératives</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {cooperatives.length}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recherches effectuées</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {searchHistory.length}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">En règle</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {Math.round(cooperatives.length * 0.75)}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 CoopVerif - Hackathon Agriculture Numérique</p>
            <p className="mt-1">Powered by OpenAI GPT-4 • Données open source</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;