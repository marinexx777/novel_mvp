import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");
const targetPerCategory = 12;
const chapterCount = 3;

const seeds = {
  en: [
    "Amber",
    "Silver",
    "Hidden",
    "Midnight",
    "Crimson",
    "Golden",
    "Secret",
    "Wild",
    "Starlit",
    "Northern",
    "Final"
  ],
  fr: [
    "d'ambre",
    "d'argent",
    "secrete",
    "de minuit",
    "pourpre",
    "doree",
    "cachee",
    "sauvage",
    "des etoiles",
    "du nord",
    "finale"
  ]
};

const categories = [
  {
    en: {
      slug: "romance",
      label: "Romance",
      noun: "Promise",
      motif: "a guarded heart learning to trust again"
    },
    fr: {
      slug: "romance",
      label: "Romance",
      noun: "Promesse",
      motif: "un coeur prudent qui reapprend la confiance"
    }
  },
  {
    en: {
      slug: "fantasy",
      label: "Fantasy",
      noun: "Crown",
      motif: "lost magic returning before the kingdom falls"
    },
    fr: {
      slug: "fantastique",
      label: "Fantasy",
      noun: "Couronne",
      motif: "une magie perdue qui revient avant la chute du royaume"
    }
  },
  {
    en: {
      slug: "werewolf",
      label: "Werewolf",
      noun: "Pack",
      motif: "pack rivals forced to follow the same moonlit trail"
    },
    fr: {
      slug: "loup-garou",
      label: "Loup-garou",
      noun: "Meute",
      motif: "des rivaux de meute forces de suivre la meme piste lunaire"
    }
  },
  {
    en: {
      slug: "billionaire",
      label: "Billionaire",
      noun: "Dynasty",
      motif: "a contract that turns ambition into an emotional risk"
    },
    fr: {
      slug: "milliardaire",
      label: "Milliardaire",
      noun: "Dynastie",
      motif: "un contrat qui transforme l'ambition en risque sentimental"
    }
  },
  {
    en: {
      slug: "mafia",
      label: "Mafia",
      noun: "Oath",
      motif: "old loyalties breaking under one dangerous choice"
    },
    fr: {
      slug: "mafia",
      label: "Mafia",
      noun: "Serment",
      motif: "d'anciennes loyautes brisees par un choix dangereux"
    }
  },
  {
    en: {
      slug: "paranormal",
      label: "Paranormal",
      noun: "Shadow",
      motif: "a hidden power waking after midnight"
    },
    fr: {
      slug: "paranormal",
      label: "Paranormal",
      noun: "Ombre",
      motif: "un pouvoir cache qui s'eveille apres minuit"
    }
  },
  {
    en: {
      slug: "rebirth",
      label: "Rebirth",
      noun: "Return",
      motif: "a second chance that remembers every old mistake"
    },
    fr: {
      slug: "renaissance",
      label: "Renaissance",
      noun: "Retour",
      motif: "une seconde chance qui se souvient de chaque ancienne erreur"
    }
  },
  {
    en: {
      slug: "adventure",
      label: "Adventure",
      noun: "Voyage",
      motif: "a map, a secret route, and one last brave decision"
    },
    fr: {
      slug: "aventure",
      label: "Aventure",
      noun: "Voyage",
      motif: "une carte, une route secrete et une derniere decision courageuse"
    }
  }
];

for (const pair of categories) {
  ensureCategory("en", pair.en);
  ensureCategory("fr", pair.fr, pair.en.slug);
}

function ensureCategory(locale, category, translatedFromSlug = null) {
  const localeDir = path.join(contentRoot, locale);
  const currentCount = listMetadata(locale).filter((metadata) =>
    metadata.genres.some(
      (genre) => normalizeLabel(genre) === normalizeLabel(category.label)
    )
  ).length;
  const missing = Math.max(0, targetPerCategory - currentCount);
  let created = 0;

  for (let slot = 1; created < missing; slot += 1) {
    const padded = String(slot).padStart(2, "0");
    const slug = `demo-${category.slug}-${padded}`;
    const novelDir = path.join(localeDir, slug);

    if (fs.existsSync(novelDir)) {
      continue;
    }

    writeNovel(locale, category, padded, novelDir, translatedFromSlug);
    created += 1;
  }

  if (created > 0) {
    console.log(`${locale}/${category.slug}: created ${created} demo books`);
  }
}

function writeNovel(locale, category, padded, novelDir, translatedFromSlug) {
  const number = Number(padded);
  const title = buildTitle(locale, category, number);
  const id = `demo-${locale}-${category.slug}-${padded}`;
  const translationOf =
    locale === "fr" && translatedFromSlug
      ? `demo-en-${translatedFromSlug}-${padded}`
      : null;
  const description =
    locale === "en"
      ? `A completed ${category.label.toLowerCase()} demo novel about ${category.motif}.`
      : `Un roman ${category.label.toLowerCase()} complet autour de ${category.motif}.`;

  const metadata = {
    id,
    language: locale,
    title,
    slug: path.basename(novelDir),
    author: locale === "en" ? "Lumen Studio" : "Studio Lumen",
    description,
    longDescription:
      locale === "en"
        ? `${title} is a compact completed demo story built for category browsing, search, and static reading flows.`
        : `${title} est une histoire de demonstration terminee pour les pages de categorie, la recherche et la lecture statique.`,
    cover: "/covers/default.svg",
    status: "completed",
    genres: [category.label],
    tags:
      locale === "en"
        ? [category.label, "Demo Catalog", "Completed"]
        : [category.label, "Catalogue demo", "Termine"],
    chapterCount,
    featured: false,
    ranking: 60 - number,
    translationOf
  };

  fs.mkdirSync(novelDir, { recursive: true });
  fs.writeFileSync(
    path.join(novelDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`
  );

  for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
    fs.writeFileSync(
      path.join(novelDir, `chapter-${String(chapter).padStart(3, "0")}.md`),
      buildChapter(locale, category, title, chapter)
    );
  }
}

function buildTitle(locale, category, number) {
  const seed = seeds[locale][number - 1] ?? String(number).padStart(2, "0");

  return locale === "en"
    ? `The ${seed} ${category.noun}`
    : `${category.noun} ${seed}`;
}

function buildChapter(locale, category, title, chapter) {
  const chapterTitle =
    locale === "en"
      ? ["Opening Signal", "Hidden Cost", "Last Door"][chapter - 1]
      : ["Premier signe", "Prix cache", "Derniere porte"][chapter - 1];
  const body =
    locale === "en"
      ? [
          `${title} moves through a completed ${category.label.toLowerCase()} arc with a clear promise, a focused cast, and no unfinished cliffhanger.`,
          `Chapter ${chapter} keeps the demo story concise while showing how the reading page handles pacing, navigation, and saved settings.`,
          `The final beat points the characters toward a settled ending, keeping the sample useful for browsing and testing.`
        ]
      : [
          `${title} suit un arc ${category.label.toLowerCase()} termine avec une promesse claire, des personnages lisibles et aucune fin suspendue.`,
          `Le chapitre ${chapter} garde l'histoire de demonstration concise tout en testant le rythme, la navigation et les reglages de lecture.`,
          `Le dernier mouvement conduit les personnages vers une conclusion stable, utile pour parcourir et verifier le site.`
        ];

  return [
    "---",
    `chapter: ${chapter}`,
    `title: ${JSON.stringify(chapterTitle)}`,
    "---",
    ...body,
    ""
  ].join("\n");
}

function listMetadata(locale) {
  const localeDir = path.join(contentRoot, locale);

  return fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) =>
      JSON.parse(
        fs.readFileSync(path.join(localeDir, entry.name, "metadata.json"), "utf8")
      )
    );
}

function normalizeLabel(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
