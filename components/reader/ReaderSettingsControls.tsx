"use client";

import { useEffect, useState } from "react";

import { getLocaleCopy } from "@/lib/i18n";
import {
  defaultReaderSettings,
  getReaderSettings,
  saveReaderSettings,
  type ReaderSettings
} from "@/lib/storage";
import type { Locale } from "@/types/novel";

interface ReaderSettingsControlsProps {
  locale: Locale;
}

const themes: ReaderSettings["theme"][] = ["light", "dark", "sepia"];

export function ReaderSettingsControls({
  locale
}: ReaderSettingsControlsProps) {
  const copy = getLocaleCopy(locale);
  const [settings, setSettings] = useState(defaultReaderSettings);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedSettings = getReaderSettings();
    setSettings(savedSettings);
    applyReaderSettings(savedSettings);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    applyReaderSettings(settings);
    saveReaderSettings(settings);
  }, [loaded, settings]);

  function updateSettings(nextSettings: Partial<ReaderSettings>) {
    setSettings((current) => ({
      ...current,
      ...nextSettings
    }));
  }

  return (
    <div className="relative z-30">
      <button
        type="button"
        aria-label={copy.labels.readerSettings}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="reader-panel inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.7 1Z" />
        </svg>
      </button>

      {open ? (
        <section
          className="reader-panel absolute right-0 top-12 w-[min(88vw,440px)] rounded-lg border p-4 shadow-lg"
          aria-label={copy.labels.readerSettings}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              <span>{copy.labels.fontSize}</span>
              <input
                type="range"
                min="16"
                max="24"
                step="1"
                value={settings.fontSize}
                onChange={(event) =>
                  updateSettings({ fontSize: Number(event.target.value) })
                }
              />
              <span className="text-xs reader-muted">{settings.fontSize}px</span>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>{copy.labels.lineHeight}</span>
              <input
                type="range"
                min="1.5"
                max="2.2"
                step="0.1"
                value={settings.lineHeight}
                onChange={(event) =>
                  updateSettings({ lineHeight: Number(event.target.value) })
                }
              />
              <span className="text-xs reader-muted">
                {settings.lineHeight.toFixed(1)}
              </span>
            </label>

            <div className="grid gap-2 text-sm font-semibold">
              <span>{copy.labels.theme}</span>
              <div className="grid grid-cols-3 overflow-hidden rounded-md border border-line">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSettings({ theme })}
                    className={
                      settings.theme === theme
                        ? "bg-ember px-3 py-2 text-xs font-bold text-white"
                        : "reader-panel px-3 py-2 text-xs font-bold hover:text-ember"
                    }
                  >
                    {copy.labels[theme]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function applyReaderSettings(settings: ReaderSettings) {
  const root = document.querySelector<HTMLElement>("[data-reader-root]");

  if (!root) {
    return;
  }

  root.style.setProperty("--reader-font-size", `${settings.fontSize}px`);
  root.style.setProperty("--reader-line-height", `${settings.lineHeight}`);
  root.dataset.readerTheme = settings.theme;
}
