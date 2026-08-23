import type { productConfig } from "@/lib/config";

export type Locale = (typeof productConfig.supportedLanguages)[number];

export type NovelStatus = "completed";

export interface NovelMetadata {
  id: string;
  language: Locale;
  title: string;
  slug: string;
  author: string;
  description: string;
  longDescription: string;
  cover: string;
  status: NovelStatus;
  genres: string[];
  tags: string[];
  chapterCount: number;
  featured: boolean;
  ranking: number;
  translationOf: string | null;
}

export interface Novel extends NovelMetadata {
  contentDir: string;
}

export interface Chapter {
  novel: Novel;
  number: number;
  title: string;
  body: string;
}

export interface CategoryDefinition {
  slug: string;
  label: string;
  description: string;
}

export interface NovelSummary {
  id: string;
  title: string;
  slug: string;
  author: string;
  cover: string;
  genres: string[];
  tags: string[];
  description: string;
  chapterCount: number;
}

export interface SearchIndexItem {
  id: string;
  title: string;
  author: string;
  genres: string[];
  tags: string[];
  description: string;
  slug: string;
}
