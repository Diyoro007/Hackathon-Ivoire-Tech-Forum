// import React, { useState } from 'react';
// import { MessageSquare, Sparkles } from 'lucide-react';

// interface NaturalSearchFormProps {
//   onSearch: (query: string) => void;
//   loading: boolean;
// }

// export function NaturalSearchForm({ onSearch, loading }: NaturalSearchFormProps) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (query.trim()) {
//       onSearch(query.trim());
//     }
//   };

//   const exampleQueries = [
//     "Coopératives de Korhogo avec plus de 300 membres",
//     "Coopératives ayant plus de 500 membres",
//     "Coopératives de Bouaké",
//     "Coopératives avec plus de 1000 membres"
//   ];

//   return (
//     <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
//       <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
//         <Sparkles className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
//         Recherche intelligente
//       </h3>
      
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="natural-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Posez votre question en français
//           </label>
//           <textarea
//             id="natural-query"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Ex: Quelles coopératives du nord ont plus de 200 membres et sont spécialisées dans le coton ?"
//             rows={3}
//             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
//             disabled={loading}
//           />
//         </div>
        
//         <div className="space-y-2">
//           <p className="text-sm text-gray-600 dark:text-gray-400">Exemples de requêtes :</p>
//           <div className="flex flex-wrap gap-2">
//             {exampleQueries.map((example, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => setQuery(example)}
//                 className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
//               >
//                 {example}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <button
//           type="submit"
//           disabled={!query.trim() || loading}
//           className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
//         >
//           <MessageSquare className="h-5 w-5 mr-2" />
//           {loading ? 'Recherche en cours...' : 'Rechercher'}
//         </button>
//       </div>
//     </form>
//   );
// }