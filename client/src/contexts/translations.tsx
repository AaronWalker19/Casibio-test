export const translations = {
  FR: {
    // Navigation
    accueil: "Accueil",
    histoire: "Histoire",
    articles: "Articles",
    gallerie: "Gallerie",
    connexion: "Connexion",
    back: "Back",

    // HomePage
    projetANRCasibio: "Projet ANR Casibio",
    projectDescription: "vise à élaborer des céramiques poreuses catalytiques Ni(Ru)/SiCxOy pour les réactions de reformage à sec du méthane et de méthanation du CO2, deux réactions incontournables dans le domaine de l'énergie pour lesquels la stabilité du catalyseur est la principale problématique",
    enSavoirPlus: "En savoir plus",
    dernieresPublications: "Dernières publication",
    decouvrezNosTravaux: "Découvrez nos travaux et avancements recents",
    voirTout: "Voir tout",
    decouvrezGalerie: "Découvrez notre galerie",
    galleriPhotoRecentes: "Galeries photo recentes",

    // Articles Page
    voiciTousNosArticles: "Voici tout nos articles",
    chargementArticles: "Chargement des articles...",
    aucunArticleTrouve: "Aucun article trouvé",
    erreurChargementArticles: "Erreur lors du chargement des articles",
    erreurInconnue: "Erreur inconnue",
    erreurChargementImages: "Erreur lors du chargement des images",
    inCours: "En cours",
    complet: "Complet",
    datePlusAncien: "Date (Plus ancien)",
    datePlusRecent: "Date (Plus récent)",

    // Article Detail Page
    chargement: "Chargement...",
    articleNonTrouve: "Article non trouvé",
    resume: "Résumé",
    methodes: "Méthodes",
    resultats: "Résultats",
    perspectives: "Perspectives",
    nonCompletee: "Cette partie n'a pas encore été complétée",
    sommaire: "Sommaire",
    galerie: "Galerie",
    fichierLie: "Fichier lier a l'article",
    imageEtVideos: "Image et vidéos lier a l'article",
  },
  EN: {
    // Navigation
    accueil: "Home",
    histoire: "History",
    articles: "Articles",
    gallerie: "Gallery",
    connexion: "Login",
    back: "Back",

    // HomePage
    projetANRCasibio: "ANR Casibio Project",
    projectDescription: "aims to develop porous catalytic ceramics Ni(Ru)/SiCxOy for dry methane reforming and CO2 methanation reactions, two essential reactions in the energy field for which catalyst stability is the main issue",
    enSavoirPlus: "Learn More",
    dernieresPublications: "Latest Publications",
    decouvrezNosTravaux: "Discover our recent work and advancements",
    voirTout: "See All",
    decouvrezGalerie: "Discover our gallery",
    galleriPhotoRecentes: "Recent photo galleries",

    // Articles Page
    voiciTousNosArticles: "Here are all our articles",
    chargementArticles: "Loading articles...",
    aucunArticleTrouve: "No articles found",
    erreurChargementArticles: "Error loading articles",
    erreurInconnue: "Unknown error",
    erreurChargementImages: "Error loading images",
    inCours: "In progress",
    complet: "Complete",
    datePlusAncien: "Date (Oldest)",
    datePlusRecent: "Date (Newest)",

    // Article Detail Page
    chargement: "Loading...",
    articleNonTrouve: "Article not found",
    resume: "Summary",
    methodes: "Methods",
    resultats: "Results",
    perspectives: "Perspectives",
    nonCompletee: "This section has not been completed yet",
    sommaire: "Table of Contents",
    galerie: "Gallery",
    fichierLie: "Files related to the article",
    imageEtVideos: "Images and videos related to the article",
  },
};

export function t(language: 'FR' | 'EN', key: keyof typeof translations.FR): string {
  return translations[language][key] || key;
}
