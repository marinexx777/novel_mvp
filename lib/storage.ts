export interface LibraryEntry {
  novelId: string;
  addedAt: string;
}

export interface ReadingHistoryEntry {
  chapter: number;
  scrollPosition: number;
  lastReadAt: string;
}

export type ReadingHistory = Record<string, ReadingHistoryEntry>;

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  theme: "light" | "dark" | "sepia";
}

export interface RewardUnlockState {
  unlockedUntil: string;
}

export const defaultReaderSettings: ReaderSettings = {
  fontSize: 18,
  lineHeight: 1.8,
  theme: "sepia"
};

const storageKeys = {
  anonymousId: "anonymousId",
  library: "novelLibrary",
  history: "readingHistory",
  readerSettings: "readerSettings",
  rewardUnlock: "rewardUnlockState"
};

let storageAvailable: boolean | null = null;

function canUseLocalStorage() {
  if (storageAvailable !== null) {
    return storageAvailable;
  }

  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
    return storageAvailable;
  } catch {
    storageAvailable = false;
    return storageAvailable;
  }
}

export function isLocalStorageAvailable() {
  return typeof window !== "undefined" && canUseLocalStorage();
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !canUseLocalStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined" || !canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function createAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateAnonymousId() {
  if (typeof window === "undefined" || !canUseLocalStorage()) {
    return null;
  }

  const existing = window.localStorage.getItem(storageKeys.anonymousId);

  if (existing) {
    return existing;
  }

  const anonymousId = createAnonymousId();
  window.localStorage.setItem(storageKeys.anonymousId, anonymousId);
  return anonymousId;
}

export function getExistingAnonymousId() {
  if (typeof window === "undefined" || !canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(storageKeys.anonymousId);
}

export function getLibraryEntries() {
  return readJson<LibraryEntry[]>(storageKeys.library, []);
}

export function isInLibrary(novelId: string) {
  return getLibraryEntries().some((entry) => entry.novelId === novelId);
}

export function addLibraryEntry(novelId: string) {
  const entries = getLibraryEntries();

  if (entries.some((entry) => entry.novelId === novelId)) {
    return entries;
  }

  const nextEntries = [
    ...entries,
    {
      novelId,
      addedAt: new Date().toISOString()
    }
  ];
  writeJson(storageKeys.library, nextEntries);
  return nextEntries;
}

export function removeLibraryEntry(novelId: string) {
  const nextEntries = getLibraryEntries().filter(
    (entry) => entry.novelId !== novelId
  );
  writeJson(storageKeys.library, nextEntries);
  return nextEntries;
}

export function getReadingHistory() {
  return readJson<ReadingHistory>(storageKeys.history, {});
}

export function getNovelReadingHistory(novelId: string) {
  return getReadingHistory()[novelId] ?? null;
}

export function saveReadingHistory(
  novelId: string,
  chapter: number,
  scrollPosition: number
) {
  const history = getReadingHistory();
  const nextHistory: ReadingHistory = {
    ...history,
    [novelId]: {
      chapter,
      scrollPosition,
      lastReadAt: new Date().toISOString()
    }
  };

  writeJson(storageKeys.history, nextHistory);
  return nextHistory[novelId];
}

export function getReaderSettings() {
  const settings = readJson<ReaderSettings>(
    storageKeys.readerSettings,
    defaultReaderSettings
  );

  return {
    fontSize: clamp(settings.fontSize, 16, 24),
    lineHeight: clamp(settings.lineHeight, 1.5, 2.2),
    theme: isReaderTheme(settings.theme) ? settings.theme : "sepia"
  } satisfies ReaderSettings;
}

export function saveReaderSettings(settings: ReaderSettings) {
  const nextSettings: ReaderSettings = {
    fontSize: clamp(settings.fontSize, 16, 24),
    lineHeight: clamp(settings.lineHeight, 1.5, 2.2),
    theme: settings.theme
  };

  writeJson(storageKeys.readerSettings, nextSettings);
  return nextSettings;
}

export function getRewardUnlockState() {
  return readJson<RewardUnlockState | null>(storageKeys.rewardUnlock, null);
}

export function isRewardUnlocked() {
  if (!isLocalStorageAvailable()) {
    return true;
  }

  const state = getRewardUnlockState();

  if (!state?.unlockedUntil) {
    return false;
  }

  return Date.now() < new Date(state.unlockedUntil).getTime();
}

export function unlockRewardReading(minutes: number) {
  const unlockedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  const state: RewardUnlockState = { unlockedUntil };
  writeJson(storageKeys.rewardUnlock, state);
  return state;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isReaderTheme(value: string): value is ReaderSettings["theme"] {
  return value === "light" || value === "dark" || value === "sepia";
}
