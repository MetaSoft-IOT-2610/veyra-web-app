const STORAGE_KEY = 'veyra.lang';
const SUPPORTED = ['en', 'es'] as const;

export type AppLanguage = (typeof SUPPORTED)[number];

export function resolveInitialLanguage(): AppLanguage {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && isAppLanguage(saved)) {
    return saved;
  }
  const browser = navigator.language.split('-')[0];
  if (isAppLanguage(browser)) {
    return browser;
  }
  return 'en';
}

export function persistLanguage(language: string): void {
  if (isAppLanguage(language)) {
    localStorage.setItem(STORAGE_KEY, language);
  }
}

export function applyDocumentLanguage(language: string): void {
  document.documentElement.lang = language;
}

function isAppLanguage(value: string): value is AppLanguage {
  return (SUPPORTED as readonly string[]).includes(value);
}
