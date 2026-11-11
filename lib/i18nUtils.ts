export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function hasLocalizedKeys(value: unknown): boolean {
  return isRecord(value) && ('uz' in value || 'ru' in value || 'en' in value);
}

function pickLocalized(value: unknown, lang: string): string {
  if (!isRecord(value)) return '';
  const picked = value[lang] ?? value.uz;
  return typeof picked === 'string' ? picked : '';
}

/**
 * Lokalizatsiyalangan matnni olish.
 *
 * `text` quyidagilardan biri bo'lishi mumkin:
 *  - JSON satr: `'{"uz":"...","ru":"..."}'`
 *  - obyekt: `{ uz, ru, en }`
 *  - oddiy matn (o'zbekcha) — o'zgarishsiz qaytadi
 */
export const getLocalizedText = (text: unknown, lang: string): string => {
  if (text === null || text === undefined || text === '') return '';

  if (typeof text === 'string') {
    try {
      const parsed: unknown = JSON.parse(text);
      if (hasLocalizedKeys(parsed)) {
        return pickLocalized(parsed, lang) || pickLocalized(parsed, 'uz');
      }
      return text;
    } catch {
      return text;
    }
  }

  if (typeof text === 'object') {
    return pickLocalized(text, lang) || pickLocalized(text, 'uz');
  }

  return String(text);
};

export const parseLocalizedObject = (text: unknown): LocalizedString => {
  const defaultLoc: LocalizedString = { uz: '', ru: '', en: '' };
  if (!text) return defaultLoc;

  if (typeof text === 'string') {
    try {
      const parsed: unknown = JSON.parse(text);
      if (hasLocalizedKeys(parsed)) {
        return { ...defaultLoc, ...(parsed as Partial<LocalizedString>) };
      }
      return { ...defaultLoc, uz: text, ru: text, en: text };
    } catch {
      return { ...defaultLoc, uz: text, ru: text, en: text };
    }
  }

  if (isRecord(text)) {
    return { ...defaultLoc, ...(text as Partial<LocalizedString>) };
  }

  return defaultLoc;
};
