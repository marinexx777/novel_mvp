import fs from "node:fs";
import path from "node:path";

const novelsDir = "D:\\novels_created";

const novels = [
  {
    folder: "hs_101561",
    slugEn: "beyond-the-scan",
    slugFr: "au-dela-de-limage",
    genres: ["Rebirth"],
    tags: ["Medical", "Nuclear Medicine", "Friendship"],
    description: "A brilliant electronics student abandons engineering for medicine after a teacher's preventable death, discovering nuclear medicine and building a legacy of advanced diagnostics.",
    longDescription: "Daniel Mercer leaves electronics for medicine after a teacher dies from a treatable condition. With friends Clara and Marcus, he enters nuclear medicine, where friendship becomes love, admiration turns to jealousy, and he builds a revolutionary imaging technology while haunted by the woman they could not save."
  },
  {
    folder: "hs_103663",
    slugEn: "heather-and-honey",
    slugFr: "miel-des-hautes-terres",
    genres: ["Romance"],
    tags: ["Coercion", "Resilience", "Beekeeping"],
    description: "A young woman returns to her Welsh valley to escape a wealthy heir's coercive campaign, rebuilding her life through bees and wild honey.",
    longDescription: "Emma Hayes is lured home by a fake family emergency, only to face Gavin Price's campaign of coercion. With a local officer uncovering corruption, she builds something that cannot be bought: a life rooted in bees, wild honey, and mountain knowledge."
  },
  {
    folder: "hs_105751",
    slugEn: "lines-across-the-sand",
    slugFr: "la-ligne-au-dela-des-dunes",
    genres: ["Adventure"],
    tags: ["Engineering", "Desert", "Family Secrets"],
    description: "An engineer must build a high-speed rail across a brutal desert while uncovering a family mystery buried beneath the dust.",
    longDescription: "Daniel Mercer is sent to the Kingdom of Almar to build a high-speed rail corridor across a brutal desert. As accidents expose old fractures, he discovers the line through the desert is not the only thing being built—a family broken decades earlier waits beneath the dust."
  },
  {
    folder: "hs_106288",
    slugEn: "the-last-ride-home",
    slugFr: "le-dernier-trajet-avant-laube",
    genres: ["Rebirth"],
    tags: ["Pandemic", "Volunteers", "Marriage"],
    description: "During a mysterious epidemic, a husband and wife join an improvised network of volunteer drivers, discovering courage in ordinary kindness.",
    longDescription: "When Ravensbridge shuts down, Ethan Cole joins volunteer drivers transporting doctors and patients through silent streets. His wife Maya works with a neighborhood response team. Together they discover courage is rarely dramatic, and kindness keeps a city alive."
  },
  {
    folder: "hs_106878",
    slugEn: "the-distance-between-breaths",
    slugFr: "quand-la-ville-retint-son-souffle",
    genres: ["Romance"],
    tags: ["Medical", "Epidemic", "Second Chance"],
    description: "Two doctors reunite during a mysterious respiratory illness, confronting family secrets and learning that surviving a crisis is not the same as living.",
    longDescription: "Dr. Lena Ward's life centers on medicine until a mysterious illness spreads through Lakeshore and Adrian Shaw returns after eight years. As hospitals overflow, they must choose between safety and duty, confronting the secret that destroyed their relationship."
  },
  {
    folder: "hs_106887",
    slugEn: "the-blade-without-equal",
    slugFr: "la-lame-sans-egale",
    genres: ["Fantasy"],
    tags: ["Historical", "Martial Arts", "Corruption"],
    description: "A young agent of the Ming dynasty's secret police trains under a master swordsman, uncovering river-god fraud and corruption.",
    longDescription: "In Ming dynasty China, young Lin Zuo trains under Tang Xiao in the Jinyiwei. Their investigation into river-god fraud and corruption exposes a conspiracy involving pirate leaders and imperial betrayal, testing loyalty and honor."
  },
  {
    folder: "hs_113161",
    slugEn: "a-wind-through-suzhou",
    slugFr: "le-vent-de-suzhou",
    genres: ["Romance"],
    tags: ["Art", "Business", "Mystery"],
    description: "An interior designer uncovers secrets in Suzhou's art world while navigating business drama, mystery, and romance.",
    longDescription: "Li Mufeng's failing design company is saved by a mysterious deal with Huashi Group. As he navigates Suzhou's world of Chinese painting, gardens, and furniture craft, he uncovers family secrets and discovers that art, business, and love are more intertwined than he imagined."
  },
  {
    folder: "hs_117518",
    slugEn: "the-village-after-the-fall",
    slugFr: "apres-la-chute",
    genres: ["Rebirth"],
    tags: ["Redemption", "Family", "Construction"],
    description: "A disgraced property developer returns to his childhood village, discovering that inheritance is not what can be sold but what must be passed on.",
    longDescription: "Martin Hale's property empire collapses. Broke and humiliated, he returns to his childhood village where his brother wants to sell the family home. As family secrets and old arguments surface, Martin discovers that true inheritance is a song, a street, a story—the courage to pass them on."
  },
  {
    folder: "hs_120001",
    slugEn: "the-nuclear-medicine-files",
    slugFr: "les-dossiers-de-medicine-nucleaire",
    genres: ["Paranormal"],
    tags: ["Medical Mystery", "Crime", "Identity"],
    description: "A nuclear medicine professor's disappearance sparks an investigation that uncovers twin identities and a criminal conspiracy.",
    longDescription: "When Professor Zou Shiming is presumed murdered, his student Li Xiangyang investigates. The trail leads to Jingzhou's nuclear medicine department, where twin identities, criminal conspiracies, and the professor's disappearance reveal truths that challenge everything Li believed."
  },
  {
    folder: "hs_92987",
    slugEn: "where-the-ouse-remembers",
    slugFr: "ce-que-la-saone-noublie-pas",
    genres: ["Rebirth"],
    tags: ["Family", "Heritage", "New Beginnings"],
    description: "A widow returns to York with her daughter, discovering that inheritance is not property but tradition, community, and the courage to start again.",
    longDescription: "After her husband's death and business collapse, Eleanor Ward returns to York with her daughter Lily. Caught in a family war over the family house, she must rebuild her career, mother a grieving child, and discover that true inheritance is a song, a street, a story—the courage to pass them on."
  }
];

async function importNovel(novel) {
  console.log(`\nImporting: ${novel.folder}`);
  
  const folderPath = path.join(novelsDir, novel.folder);
  
  // Find English and French text files
  const files = fs.readdirSync(folderPath);
  const txtFiles = files.filter(f => f.endsWith('.txt'));
  
  let enFile = txtFiles.find(f => !f.includes('À') && !f.includes('AU') && !f.includes('MIEL') && !f.includes('LA LIGNE') && !f.includes('LE DERNIER') && !f.includes('QUAND') && !f.includes('LA LAME') && !f.includes('LE VENT') && !f.includes('APRÈS') && !f.includes('LES DOSSIERS') && !f.includes('CE QUE'));
  
  // More robust matching
  enFile = txtFiles.find(f => {
    const upper = f.toUpperCase();
    return upper.startsWith('BEYOND') || upper.startsWith('HEATHER') || upper.startsWith('LINES') || 
           upper.startsWith('THE LAST') || upper.startsWith('THE DISTANCE') || upper.startsWith('THE BLADE') ||
           upper.startsWith('A WIND') || upper.startsWith('THE VILLAGE') || upper.startsWith('THE NUCLEAR') ||
           upper.startsWith('WHERE THE');
  });
  
  let frFile = txtFiles.find(f => f !== enFile);
  
  if (!enFile || !frFile) {
    console.log(`  Skipping: Could not identify EN/FR files`);
    return;
  }
  
  console.log(`  EN: ${enFile}`);
  console.log(`  FR: ${frFile}`);
  
  // Find cover image
  const coverFile = files.find(f => f.endsWith('.png'));
  if (coverFile) {
    console.log(`  Cover: ${coverFile}`);
  }
  
  // Import English version
  await importSingleNovel(path.join(folderPath, enFile), 'en', novel.slugEn, novel);
  
  // Import French version
  await importSingleNovel(path.join(folderPath, frFile), 'fr', novel.slugFr, novel);
  
  // Copy cover if exists
  if (coverFile) {
    const coverSrc = path.join(folderPath, coverFile);
    const coverDst = path.join(process.cwd(), 'public', 'covers', `${novel.slugEn}.png`);
    fs.copyFileSync(coverSrc, coverDst);
    console.log(`  Copied cover to ${coverDst}`);
  }
  
  console.log(`  ✓ Done`);
}

async function importSingleNovel(filePath, lang, slug, novelInfo) {
  const source = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  
  const title = lang === 'en' 
    ? novelInfo.slugEn.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : novelInfo.slugFr.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const chapters = splitChapters(source, lang);
  
  if (chapters.length < 2) {
    console.log(`  Could not split chapters for ${lang} version`);
    return;
  }
  
  const novelDir = path.join(process.cwd(), "content", lang, slug);
  
  if (fs.existsSync(novelDir)) {
    console.log(`  Directory already exists: ${novelDir}`);
    return;
  }
  
  fs.mkdirSync(novelDir, { recursive: true });
  
  const metadata = {
    id: slug,
    language: lang,
    title,
    slug,
    author: "Lumen Reads",
    description: novelInfo.description,
    longDescription: novelInfo.longDescription,
    cover: lang === 'en' ? `/covers/${novelInfo.slugEn}.png` : `/covers/${novelInfo.slugEn}.png`,
    status: "completed",
    genres: novelInfo.genres,
    tags: novelInfo.tags,
    chapterCount: chapters.length,
    featured: false,
    ranking: 0,
    translationOf: lang === 'fr' ? novelInfo.slugEn : null
  };
  
  fs.writeFileSync(
    path.join(novelDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`
  );
  
  chapters.forEach((chapter, index) => {
    const number = index + 1;
    const fileName = `chapter-${String(number).padStart(3, "0")}.md`;
    const frontmatter = [
      "---",
      `chapter: ${number}`,
      `title: ${JSON.stringify(chapter.title)}`,
      "---",
      chapter.body.trim(),
      ""
    ].join("\n");
    
    fs.writeFileSync(path.join(novelDir, fileName), frontmatter);
  });
  
  console.log(`  Imported ${chapters.length} chapters into ${novelDir}`);
}

function splitChapters(text, locale) {
  const headingPattern =
    locale === "fr"
      ? /^(chapitre\s+\d+[\s:.-]*(.*)|prologue|epilogue)\s*$/gim
      : /^(chapter\s+\d+[\s:.-]*(.*)|prologue|epilogue)\s*$/gim;
  const matches = [...text.matchAll(headingPattern)];
  
  if (matches.length < 2) {
    return [];
  }
  
  return matches
    .map((match, index) => {
      const start = match.index ?? 0;
      const nextStart = matches[index + 1]?.index ?? text.length;
      const heading = match[0].trim();
      const body = text.slice(start + match[0].length, nextStart).trim();
      const fallbackTitle =
        locale === "fr" ? `Chapitre ${index + 1}` : `Chapter ${index + 1}`;
      const title = match[2]?.trim() || heading || fallbackTitle;
      
      return { title, body };
    })
    .filter((chapter) => chapter.body.length > 0);
}

async function main() {
  console.log("Starting batch import of 10 novels...\n");
  
  for (const novel of novels) {
    try {
      await importNovel(novel);
    } catch (error) {
      console.error(`Error importing ${novel.folder}:`, error.message);
    }
  }
  
  console.log("\n\nBatch import complete!");
  console.log("Please review metadata.json files before publishing.");
}

main();