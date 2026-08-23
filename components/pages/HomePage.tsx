import Link from "next/link";

import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import {
  getAllNovels,
  getCompletedNovels,
  getFeaturedNovels,
  getNovelsByCategory
} from "@/lib/content";
import { getCategories, getLocaleCopy } from "@/lib/i18n";
import { categoriesPath, categoryPath, chapterPath, novelPath, searchPath } from "@/lib/routes";
import type { Locale, Novel } from "@/types/novel";

interface HomePageProps {
  locale: Locale;
}

const coverAccents = [
  "from-[#4a2c66] to-[#a84b89]",
  "from-[#105766] to-[#3bbfc4]",
  "from-[#bd5628] to-[#f1a84c]",
  "from-[#6c1023] to-[#ed3455]",
  "from-[#b5446b] to-[#ff97b2]",
  "from-[#133d75] to-[#457dc4]",
  "from-[#1b544a] to-[#57a67d]",
  "from-[#17171b] to-[#585364]"
];

const shelfAccents = [
  "bg-ember text-white",
  "bg-[#8ccbd2] text-ink",
  "bg-[#f7d35e] text-ink"
];

function getHomeUi(locale: Locale) {
  return locale === "fr"
    ? {
        discover: "Decouvrir le prochain roman termine",
        searchPlaceholder: "Rechercher titre, auteur ou genre",
        hotPrefix: "Populaire",
        all: "Tout",
        allCategories: "Toutes les categories",
        categoryCta: "Toutes les categories",
        heroKicker: "Selection editoriale de la semaine",
        start: "Commencer",
        save: "+ Bibliotheque",
        recommended: "Recommande",
        comfort: "Lecture confort",
        curatedKicker: "CURATED",
        curatedTitle: "Selection populaire",
        curatedSubtitle: "Des romans termines choisis pour une lecture fluide.",
        updatesKicker: "NEW RELEASES",
        updatesTitle: "Derniers chapitres",
        rankingKicker: "WEEKLY",
        rankingTitle: "Classement",
        collectionsKicker: "COLLECTIONS",
        collectionsTitle: "Listes thematiques",
        collectionsSubtitle: "Choisissez une ambiance, puis commencez a lire.",
        finalChapter: "Chapitre final",
        by: "par"
      }
    : {
        discover: "Discover your next finished story",
        searchPlaceholder: "Search title, author, or genre",
        hotPrefix: "Hot",
        all: "All",
        allCategories: "All Categories",
        categoryCta: "All categories",
        heroKicker: "Weekly editor pick",
        start: "Start Reading",
        save: "+ Add to Library",
        recommended: "Editor Pick",
        comfort: "Comfort Read",
        curatedKicker: "CURATED",
        curatedTitle: "Popular Picks",
        curatedSubtitle: "Completed novels selected for smooth reading.",
        updatesKicker: "NEW RELEASES",
        updatesTitle: "Latest Chapters",
        rankingKicker: "WEEKLY",
        rankingTitle: "Rising Reads",
        collectionsKicker: "COLLECTIONS",
        collectionsTitle: "Theme Shelves",
        collectionsSubtitle: "Start from a mood and read into a complete arc.",
        finalChapter: "Final Chapter",
        by: "by"
      };
}

type HomeUi = ReturnType<typeof getHomeUi>;
type LocaleCopy = ReturnType<typeof getLocaleCopy>;

export function HomePage({ locale }: HomePageProps) {
  const copy = getLocaleCopy(locale);
  const ui = getHomeUi(locale);
  const allNovels = getAllNovels(locale);
  const categories = getCategories(locale);
  const featured = getFeaturedNovels(locale);
  const heroNovels = allNovels.slice(0, 3);
  const primaryNovel = heroNovels[0];
  const sideFeatures = heroNovels.slice(1, 3);
  const curatedSource = [
    ...featured,
    ...allNovels.filter(
      (novel) => !featured.some((featuredNovel) => featuredNovel.id === novel.id)
    )
  ];
  const curated = curatedSource.slice(0, 4);
  const latest = allNovels.slice(0, 6);
  const ranking = allNovels.slice(0, 5);
  const completed = getCompletedNovels(locale).slice(0, 6);

  return (
    <div className="bg-[#f7f5f1]">
      <PageViewTracker eventName="home_view" locale={locale} />

      <section id="top" className="border-b border-line bg-[#f7f5f1]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)_280px] lg:items-center">
          <p className="text-sm font-black text-ink">{ui.discover}</p>
          <Link
            href={searchPath(locale)}
            className="flex h-12 items-center justify-between border border-[#d9d5d0] bg-white px-4 text-sm text-neutral-500 shadow-[5px_5px_0_#e3ded7] transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember"
          >
            <span>{ui.searchPlaceholder}</span>
            <span className="ml-4 bg-ember px-4 py-2 text-xs font-black uppercase text-white">
              {copy.labels.searchButton}
            </span>
          </Link>
          <p className="text-xs leading-6 text-neutral-500">
            {ui.hotPrefix}: {heroNovels.map((novel) => novel.title).join("  ")}
          </p>
        </div>
      </section>

      <section
        id="categories"
        className="border-b border-line bg-white"
        aria-label={ui.allCategories}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          <a
            href="#library"
            className="whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
          >
            {ui.all}
          </a>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={categoryPath(locale, category.slug)}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-ink hover:text-white focus:outline-none focus:ring-2 focus:ring-ember"
            >
              {category.label}
            </Link>
          ))}
          <Link
            href={categoriesPath(locale)}
            className="ml-auto whitespace-nowrap text-sm font-black text-ember"
          >
            {ui.categoryCta} -&gt;
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:py-12">
        {primaryNovel ? (
          <HeroBanner locale={locale} novel={primaryNovel} ui={ui} copy={copy} />
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {sideFeatures.map((novel, index) => (
            <MiniFeature
              key={novel.id}
              locale={locale}
              novel={novel}
              index={index}
              label={index === 0 ? ui.recommended : ui.comfort}
              copy={copy}
            />
          ))}
        </div>
      </section>

      <section id="library" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <SectionHead
          kicker={ui.curatedKicker}
          title={ui.curatedTitle}
          subtitle={ui.curatedSubtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {curated.map((novel, index) => (
            <StoryCard
              key={novel.id}
              locale={locale}
              novel={novel}
              index={index}
              priority={index < 4}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#1c1a20] py-14 text-white lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[#615d65] pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7893]">
                  {ui.updatesKicker}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-black">
                  {ui.updatesTitle}
                </h2>
              </div>
            </div>
            <div className="flex flex-col">
              {latest.map((novel, index) => (
                <UpdateRow
                  key={novel.id}
                  locale={locale}
                  novel={novel}
                  index={index}
                  ui={ui}
                />
              ))}
            </div>
          </div>

          <aside className="bg-[#26232a] p-6">
            <div className="mb-1 border-b border-[#4c4851] pb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7893]">
                {ui.rankingKicker}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-black">
                {ui.rankingTitle}
              </h2>
            </div>
            <div>
              {ranking.map((novel, index) => (
                <RankRow
                  key={novel.id}
                  locale={locale}
                  novel={novel}
                  index={index}
                />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead
          kicker={ui.collectionsKicker}
          title={ui.collectionsTitle}
          subtitle={ui.collectionsSubtitle}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {categories.slice(0, 3).map((category, index) => (
            <Link
              key={category.slug}
              href={categoryPath(locale, category.slug)}
              className={`relative min-h-[220px] overflow-hidden p-7 transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ember ${
                shelfAccents[index % shelfAccents.length]
              }`}
            >
              <span className="text-xs font-black uppercase tracking-[0.16em]">
                {String(index + 1).padStart(2, "0")} / {category.label}
              </span>
              <h3 className="relative z-10 mt-8 max-w-xs font-serif text-3xl font-black leading-tight">
                {category.description}
              </h3>
              <span className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full border-[36px] border-white/25" />
            </Link>
          ))}
        </div>

        <NovelSection
          title={copy.home.featured}
          locale={locale}
          novels={featured}
        />
        <NovelSection
          title={copy.home.trending}
          locale={locale}
          novels={allNovels.slice(0, 3)}
        />

        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold text-ink">
              {copy.labels.allCategories}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={categoryPath(locale, category.slug)}
                className="border border-line bg-white p-4 transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember"
              >
                <h3 className="font-bold text-ink">{category.label}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {categories.slice(0, 3).map((category) => (
          <NovelSection
            key={category.slug}
            title={category.label}
            locale={locale}
            novels={getNovelsByCategory(locale, category.slug)}
          />
        ))}

        <NovelSection
          title={copy.home.completed}
          locale={locale}
          novels={completed}
        />
      </section>
    </div>
  );
}

function HeroBanner({
  locale,
  novel,
  ui,
  copy
}: {
  locale: Locale;
  novel: Novel;
  ui: HomeUi;
  copy: LocaleCopy;
}) {
  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className="group relative min-h-[500px] overflow-hidden bg-[#232027] text-white shadow-cover transition focus:outline-none focus:ring-2 focus:ring-ember"
    >
      <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:w-[54%]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffbdca]">
          {ui.heroKicker}
        </p>
        <h1 className="mt-5 font-serif text-4xl font-black leading-tight sm:text-5xl">
          {novel.title}
        </h1>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#c8c5cb]">
          {novel.description}
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
          {copy.labels.completed} / {novel.chapterCount} {copy.labels.chapters} / {ui.by} {novel.author}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="border border-ember bg-ember px-5 py-3 text-sm font-black text-white transition group-hover:-translate-y-0.5">
            {ui.start}
          </span>
          <span className="border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white transition group-hover:-translate-y-0.5">
            {ui.save}
          </span>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-r from-[#232027] via-[#23202799] to-transparent lg:block" />
      <div className="absolute bottom-10 right-10 top-12 hidden w-[240px] rotate-2 border border-white/20 bg-white/10 p-4 shadow-[12px_12px_0_rgba(168,63,57,0.35)] lg:block">
        <img
          src={novel.cover}
          alt={`${novel.title} cover`}
          width={240}
          height={320}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute -bottom-8 right-5 text-[120px] font-black leading-none text-white/10">
        01
      </div>
    </Link>
  );
}

function MiniFeature({
  locale,
  novel,
  index,
  label,
  copy
}: {
  locale: Locale;
  novel: Novel;
  index: number;
  label: string;
  copy: LocaleCopy;
}) {
  const accent =
    index === 0 ? "bg-[#77dbda] text-ink" : "bg-[#ffb15c] text-ink";

  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className={`relative min-h-[242px] overflow-hidden p-7 transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ember ${accent}`}
    >
      <span className="text-xs font-black uppercase tracking-[0.18em]">
        {label}
      </span>
      <h2 className="relative z-10 mt-10 max-w-[220px] font-serif text-3xl font-black leading-tight">
        {novel.title}
      </h2>
      <p className="relative z-10 mt-3 text-sm font-semibold">
        {novel.genres[0]} / {novel.chapterCount} {copy.labels.chapters}
      </p>
      <b className="absolute right-5 top-0 text-7xl font-black text-white/45">
        {String(index + 2).padStart(2, "0")}
      </b>
      <span className="absolute -bottom-16 -right-12 h-44 w-44 rotate-45 border border-black/20" />
      <span className="absolute -bottom-10 right-7 h-24 w-24 rotate-45 border border-black/20" />
    </Link>
  );
}

function SectionHead({
  kicker,
  title,
  subtitle
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end gap-4 border-b-2 border-ink pb-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ember">
          {kicker}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black text-ink">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-sm font-semibold leading-6 text-neutral-500">
        {subtitle}
      </p>
    </div>
  );
}

function StoryCard({
  locale,
  novel,
  index,
  priority = false
}: {
  locale: Locale;
  novel: Novel;
  index: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className="group grid grid-cols-[120px_minmax(0,1fr)] gap-4 transition focus:outline-none focus:ring-2 focus:ring-ember"
    >
      <div
        className={`relative h-[172px] overflow-hidden bg-gradient-to-br p-3 shadow-[7px_7px_0_#e6e1da] ${
          coverAccents[index % coverAccents.length]
        }`}
      >
        <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.18em] text-white/75">
          Lumen Original
        </span>
        <img
          src={novel.cover}
          alt={`${novel.title} cover`}
          width={240}
          height={320}
          loading={priority ? "eager" : "lazy"}
          className="absolute bottom-0 right-0 h-[145px] w-[108px] object-cover shadow-cover transition group-hover:scale-105"
        />
        <span className="absolute right-3 top-11 text-2xl text-white/80">*</span>
      </div>
      <div className="min-w-0 pt-1">
        <h3 className="text-lg font-black leading-snug text-ink group-hover:text-ember">
          {novel.title}
        </h3>
        <p className="mt-3 truncate text-xs font-bold uppercase tracking-[0.12em] text-ember">
          {novel.genres[0]}
        </p>
        <p className="mt-2 text-sm text-neutral-500">{novel.author}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {novel.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="border border-line bg-white px-2 py-1 text-[11px] font-semibold text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function UpdateRow({
  locale,
  novel,
  index,
  ui
}: {
  locale: Locale;
  novel: Novel;
  index: number;
  ui: HomeUi;
}) {
  return (
    <Link
      href={chapterPath(locale, novel.slug, novel.chapterCount)}
      className="grid grid-cols-[36px_minmax(0,1fr)_24px] items-center gap-4 border-b border-[#3b3840] py-4 text-left transition hover:bg-white/5 hover:px-2 sm:grid-cols-[44px_1.1fr_1.3fr_24px]"
    >
      <span className="text-xs font-bold text-[#6e6974]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <b className="block truncate text-sm">{novel.title}</b>
        <em className="mt-1 inline-block border border-[#713949] px-1.5 py-1 text-[10px] font-bold not-italic text-[#ff7893]">
          {novel.genres[0]}
        </em>
      </span>
      <strong className="hidden truncate text-xs font-normal text-[#aaa6af] sm:block">
        {ui.finalChapter} {novel.chapterCount}
      </strong>
      <span className="text-ember">-&gt;</span>
    </Link>
  );
}

function RankRow({
  locale,
  novel,
  index
}: {
  locale: Locale;
  novel: Novel;
  index: number;
}) {
  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className="grid grid-cols-[28px_48px_minmax(0,1fr)_18px] items-center gap-3 border-b border-[#3b3840] py-3 text-left transition hover:bg-white/5"
    >
      <strong
        className={
          index === 0
            ? "text-xs font-black text-[#ff466b]"
            : "text-xs font-black text-[#716c78]"
        }
      >
        {String(index + 1).padStart(2, "0")}
      </strong>
      <div
        className={`grid h-14 place-items-center overflow-hidden bg-gradient-to-br ${
          coverAccents[index % coverAccents.length]
        }`}
      >
        <img
          src={novel.cover}
          alt=""
          width={80}
          height={106}
          loading="lazy"
          className="h-14 w-11 object-cover"
        />
      </div>
      <span className="min-w-0">
        <b className="block truncate text-sm text-white">{novel.title}</b>
        <em className="mt-1 block truncate text-xs not-italic text-[#77727e]">
          {novel.genres.slice(0, 2).join(" / ")}
        </em>
      </span>
      <span className="text-ember">up</span>
    </Link>
  );
}

interface NovelSectionProps {
  title: string;
  locale: Locale;
  novels: Novel[];
}

function NovelSection({ title, locale, novels }: NovelSectionProps) {
  if (novels.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-serif text-2xl font-bold text-ink">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {novels.map((novel, index) => (
          <StoryCard
            key={novel.id}
            locale={locale}
            novel={novel}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}