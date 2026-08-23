import { brandName, productConfig } from "@/lib/config";
import type { CategoryDefinition, Locale } from "@/types/novel";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français"
};

export const localeCopy = {
  en: {
    brand: brandName,
    siteDescription:
      "Completed web novels for fast, comfortable mobile reading.",
    nav: {
      home: "Home",
      browse: "Categories",
      search: "Search",
      library: "My Library",
      privacy: "Privacy Policy",
      terms: "Terms",
      contact: "Contact"
    },
    home: {
      eyebrow: "Completed web novels",
      title: "Completed stories ready to read",
      intro:
        "A focused reading catalog for romance, fantasy, werewolf, billionaire, mafia, and paranormal novels.",
      featured: "Featured",
      trending: "Trending",
      completed: "Completed Novels"
    },
    labels: {
      completed: "Completed",
      chapters: "Chapters",
      by: "by",
      startReading: "Start Reading",
      continueReading: "Continue Reading",
      addToLibrary: "Add to Library",
      savedToLibrary: "Saved to Library",
      removeFromLibrary: "Remove from Library",
      chapterList: "Chapter List",
      previousChapter: "Previous Chapter",
      nextChapter: "Next Chapter",
      noPrevious: "First Chapter",
      noNext: "Final Chapter",
      synopsis: "Synopsis",
      genre: "Genre",
      tags: "Tags",
      allCategories: "All Categories",
      novels: "Novels",
      readChapter: "Read Chapter",
      backToNovel: "Novel Details",
      currentChapter: "Current Chapter",
      recentReadingTime: "Recent Reading Time",
      libraryEmptyTitle: "Your library is empty.",
      libraryEmptyBody: "Explore novels and save your favorites here.",
      exploreNovels: "Explore Novels",
      fontSize: "Font Size",
      lineHeight: "Line Height",
      theme: "Theme",
      readerSettings: "Reader Settings",
      light: "Light",
      dark: "Dark",
      sepia: "Sepia",
      searchTitle: "Search Novels",
      searchIntro: "Search by title, author, genre, tags, or description.",
      searchPlaceholder: "Search for billionaire, magic, mafia...",
      searchButton: "Search",
      searchResults: "Search Results",
      noSearchResults: "No novels found.",
      searchEmpty: "Enter a keyword to search the catalog.",
      continueReadingFree: "Continue Reading Free",
      rewardWallBody:
        "Watch a short ad to unlock reading for 30 minutes.",
      watchAd: "Watch Ad",
      noPaymentRequired: "No payment required.",
      simulatingRewardedAd: "Simulating rewarded ad...",
      adComplete: "Ad complete.",
      continue: "Continue",
      advertisement: "Advertisement",
      legalReviewNotice: "Needs legal review before production launch.",
      privacyTitle: "Privacy Policy",
      privacyBody:
        "This placeholder explains where privacy details will appear before launch. The production version should be reviewed by qualified counsel.",
      termsTitle: "Terms",
      termsBody:
        "This placeholder explains where service terms will appear before launch. The production version should be reviewed by qualified counsel.",
      contactTitle: "Contact",
      contactBody:
        "For launch preparation, add the appropriate business contact channel here before production."
    },
    footer:
      "Built for a static, mobile-first reading experience with completed novels."
  },
  fr: {
    brand: brandName,
    siteDescription:
      "Des romans terminés pour une lecture mobile rapide et confortable.",
    nav: {
      home: "Accueil",
      browse: "Catégories",
      search: "Recherche",
      library: "Ma bibliothèque",
      privacy: "Politique de confidentialité",
      terms: "Conditions",
      contact: "Contact"
    },
    home: {
      eyebrow: "Romans terminés",
      title: "Romans terminés prêts à lire",
      intro:
        "Un catalogue de lecture clair pour les romances, la fantasy, les loups-garous, les milliardaires, la mafia et le paranormal.",
      featured: "Sélection",
      trending: "Tendances",
      completed: "Romans terminés"
    },
    labels: {
      completed: "Terminé",
      chapters: "Chapitres",
      by: "par",
      startReading: "Commencer la lecture",
      continueReading: "Continuer la lecture",
      addToLibrary: "Ajouter à la bibliothèque",
      savedToLibrary: "Dans la bibliothèque",
      removeFromLibrary: "Retirer de la bibliothèque",
      chapterList: "Liste des chapitres",
      previousChapter: "Chapitre précédent",
      nextChapter: "Chapitre suivant",
      noPrevious: "Premier chapitre",
      noNext: "Dernier chapitre",
      synopsis: "Synopsis",
      genre: "Genre",
      tags: "Mots-clés",
      allCategories: "Toutes les catégories",
      novels: "Romans",
      readChapter: "Lire le chapitre",
      backToNovel: "Détails du roman",
      currentChapter: "Chapitre actuel",
      recentReadingTime: "Dernière lecture",
      libraryEmptyTitle: "Votre bibliothèque est vide.",
      libraryEmptyBody:
        "Explorez les romans et enregistrez vos favoris ici.",
      exploreNovels: "Explorer les romans",
      fontSize: "Taille du texte",
      lineHeight: "Interligne",
      theme: "Thème",
      readerSettings: "Réglages de lecture",
      light: "Clair",
      dark: "Sombre",
      sepia: "Sépia",
      searchTitle: "Rechercher des romans",
      searchIntro:
        "Recherchez par titre, auteur, genre, mots-clés ou description.",
      searchPlaceholder: "Rechercher milliardaire, magie, mafia...",
      searchButton: "Rechercher",
      searchResults: "Résultats de recherche",
      noSearchResults: "Aucun roman trouvé.",
      searchEmpty: "Saisissez un mot-clé pour rechercher dans le catalogue.",
      continueReadingFree: "Continuer gratuitement",
      rewardWallBody:
        "Regardez une courte publicité pour débloquer la lecture pendant 30 minutes.",
      watchAd: "Regarder la publicité",
      noPaymentRequired: "Aucun paiement requis.",
      simulatingRewardedAd: "Simulation de la publicité récompensée...",
      adComplete: "Publicité terminée.",
      continue: "Continuer",
      advertisement: "Publicité",
      legalReviewNotice:
        "À faire relire par un juriste avant le lancement en production.",
      privacyTitle: "Politique de confidentialité",
      privacyBody:
        "Ce texte provisoire indique où les informations de confidentialité seront ajoutées avant le lancement. La version de production doit être relue par un juriste qualifié.",
      termsTitle: "Conditions",
      termsBody:
        "Ce texte provisoire indique où les conditions du service seront ajoutées avant le lancement. La version de production doit être relue par un juriste qualifié.",
      contactTitle: "Contact",
      contactBody:
        "Pour préparer le lancement, ajoutez ici le canal de contact professionnel approprié."
    },
    footer:
      "Conçu pour une expérience de lecture statique, mobile-first, avec des romans terminés."
  }
} satisfies Record<Locale, unknown>;

export const categories: Record<Locale, CategoryDefinition[]> = {
  en: [
    {
      slug: "romance",
      label: "Romance",
      description:
        "Completed romance novels with emotional stakes, slow-burn tension, and satisfying endings."
    },
    {
      slug: "fantasy",
      label: "Fantasy",
      description:
        "Magic, kingdoms, rebirth arcs, and adventure stories ready to read from beginning to end."
    },
    {
      slug: "werewolf",
      label: "Werewolf",
      description:
        "Completed werewolf novels with pack politics, fated bonds, and supernatural secrets."
    },
    {
      slug: "billionaire",
      label: "Billionaire",
      description:
        "High-stakes billionaire romances, contract relationships, and polished modern drama."
    },
    {
      slug: "mafia",
      label: "Mafia",
      description:
        "Completed mafia stories with danger, loyalty, secrets, and tense romance."
    },
    {
      slug: "paranormal",
      label: "Paranormal",
      description:
        "Supernatural completed novels featuring old curses, hidden power, and midnight bargains."
    },
    {
      slug: "rebirth",
      label: "Rebirth",
      description:
        "Second-chance stories where memory, revenge, and destiny reshape the path ahead."
    },
    {
      slug: "adventure",
      label: "Adventure",
      description:
        "Fast-moving completed novels built around journeys, discoveries, and dangerous choices."
    }
  ],
  fr: [
    {
      slug: "romance",
      label: "Romance",
      description:
        "Des romances terminées, portées par l'émotion, la tension et des fins satisfaisantes."
    },
    {
      slug: "fantastique",
      label: "Fantasy",
      description:
        "Magie, royaumes, renaissance et aventures complètes à lire jusqu'au dernier chapitre."
    },
    {
      slug: "loup-garou",
      label: "Loup-garou",
      description:
        "Des romans de loups-garous terminés, entre meutes, liens du destin et secrets surnaturels."
    },
    {
      slug: "milliardaire",
      label: "Milliardaire",
      description:
        "Romances de milliardaires, contrats impossibles et drames modernes au rythme soutenu."
    },
    {
      slug: "mafia",
      label: "Mafia",
      description:
        "Des histoires de mafia terminées, entre loyauté, danger, secrets et romance tendue."
    },
    {
      slug: "paranormal",
      label: "Paranormal",
      description:
        "Romans surnaturels terminés avec malédictions anciennes, pouvoirs cachés et pactes nocturnes."
    },
    {
      slug: "renaissance",
      label: "Renaissance",
      description:
        "Des récits de seconde chance où mémoire, revanche et destin changent tout."
    },
    {
      slug: "aventure",
      label: "Aventure",
      description:
        "Des romans terminés pleins de voyages, de découvertes et de choix dangereux."
    }
  ]
};

export function isLocale(value: string): value is Locale {
  return productConfig.supportedLanguages.includes(value as Locale);
}

export function getLocaleCopy(locale: Locale) {
  return localeCopy[locale];
}

export function getCategories(locale: Locale) {
  return categories[locale];
}

export function getCategory(locale: Locale, slug: string) {
  return categories[locale].find((category) => category.slug === slug);
}
