# CoopVerif - Application de Vérification des Coopératives Agricoles

Une application web moderne et complète pour la vérification du statut légal des coopératives agricoles, développée pour un hackathon de haut niveau.

## 🚀 Fonctionnalités

### Modes de Recherche
- **Recherche par nom** : Saisie directe du nom de la coopérative avec correction automatique
- **Analyse de documents** : Upload et analyse OCR d'agréments, RCCM, et autres documents officiels
- **Recherche intelligente** : Requêtes en langage naturel avec IA (ex: "Coopératives du nord avec plus de 200 membres")

### Technologies Utilisées
- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **Intelligence Artificielle** : OpenAI GPT-4 pour l'analyse et la correction
- **OCR** : Tesseract.js pour l'extraction de texte des documents
- **Recherche floue** : Fuse.js pour la correspondance approximative
- **Gestion d'état** : React Hooks + LocalStorage

### Fonctionnalités Avancées
- ✅ **Thème clair/sombre** avec toggle automatique
- ✅ **Historique des recherches** avec persistance locale
- ✅ **Analyse de statut intelligente** (En règle, Douteuse, Non reconnue)
- ✅ **Interface responsive** optimisée mobile/desktop
- ✅ **Animations fluides** et micro-interactions
- ✅ **Dataset CSV intégré** avec 20 coopératives de démonstration

## 🔧 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Clé API OpenAI (GPT-4)

### Configuration
1. Clonez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre clé API OpenAI dans `.env.local` :
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Démarrez l'application :
   ```bash
   npm run dev
   ```

## 📊 Structure des Données

Le dataset CSV contient les colonnes suivantes :
- `nom_abrégé` : Nom court de la coopérative
- `nom_complet` : Nom officiel complet
- `nombre_de_membres` : Nombre de membres actifs
- `agrément` : Numéro d'agrément officiel
- `email` : Adresse email de contact
- `numéro_de_téléphone` : Numéro de téléphone
- `localisation` : Ville/région d'implantation

## 🎯 Analyse de Statut

L'application évalue automatiquement le statut légal selon plusieurs critères :

### 🟢 **En Règle**
- Agrément valide et récent
- Informations complètes (email, téléphone, localisation)
- Nombre minimum de membres respecté

### 🟡 **Douteuse** 
- Agrément ancien (>12 mois)
- Informations incomplètes
- Nombre de membres insuffisant

### 🔴 **Non Reconnue**
- Aucun agrément enregistré
- Informations manquantes critiques
- Non présente dans le dataset officiel

## 🤖 Intelligence Artificielle

### Analyse GPT-4
- **Correction automatique** des noms mal orthographiés
- **Extraction intelligente** des informations des documents
- **Recherche en langage naturel** avec transformation en filtres
- **Évaluation contextuelle** du statut légal

### Exemples de Requêtes Naturelles
- "Coopératives de Korhogo avec plus de 300 membres"
- "Coopératives spécialisées dans l'anacarde"
- "Coopératives créées après 2020"
- "Coopératives du secteur avicole en règle"

## 🏗️ Architecture

```
src/
├── components/          # Composants React réutilisables
├── hooks/              # Hooks personnalisés
├── types/              # Types TypeScript
├── utils/              # Utilitaires (OCR, IA, parsing)
├── data/               # Dataset CSV
└── App.tsx             # Composant principal
```

## 📱 Interface Utilisateur

### Design System
- **Couleurs** : Palette professionnelle avec vert primaire, bleu secondaire
- **Typography** : Inter font avec hiérarchie claire
- **Spacing** : Système 8px pour la cohérence
- **Animations** : Transitions fluides et micro-interactions

### Composants Principaux
- `SearchModes` : Sélection du mode de recherche
- `StatusBadge` : Affichage du statut avec couleurs
- `SearchResults` : Présentation des résultats
- `SearchHistory` : Historique des recherches
- `ThemeToggle` : Basculement thème clair/sombre

## 🔍 Fonctionnalités de Recherche

### Recherche Floue (Fuse.js)
- Tolérance aux erreurs de frappe
- Recherche dans nom complet et abrégé
- Score de confiance calculé

### Analyse OCR (Tesseract.js)
- Support images (JPG, PNG, WebP)
- Support PDF
- Extraction multi-langue (français/anglais)
- Preprocessing automatique

### Filtrage Intelligent
- Filtres par localisation
- Filtres par secteur d'activité
- Filtres par nombre de membres
- Filtres par date de création

## 🎨 Personnalisation

### Thèmes
- Mode clair avec couleurs douces
- Mode sombre avec contraste optimisé
- Transition fluide entre les modes
- Persistance de la préférence

### Responsive Design
- Mobile-first approach
- Breakpoints : 640px, 768px, 1024px
- Composants adaptatifs
- Navigation optimisée tactile

## 🚀 Déploiement

L'application est prête pour le déploiement sur :
- Netlify
- Vercel
- GitHub Pages
- Tout hébergeur de sites statiques

### Variables d'Environnement
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
KOUMOUL_API_KEY="your_api_key_here"
```

## 📈 Métriques et Analytics

### Statistiques Intégrées
- Nombre total de coopératives
- Nombre de recherches effectuées
- Répartition des statuts
- Historique des performances

### Monitoring
- Suivi des erreurs API
- Métriques de performance OCR
- Statistiques d'utilisation

## 🔐 Sécurité

- Clé API OpenAI sécurisée côté client
- Validation des données d'entrée
- Sanitization des uploads
- Protection contre les injections

## 📝 Licence

Développé pour le Hackathon Ivoire Tech Forum 2025