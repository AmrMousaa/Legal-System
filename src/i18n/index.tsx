import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { translations, type TranslationKey } from './translations';

interface LanguageContextValue {
  dir: 'ltr';
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/** English/LTR is the only supported mode for this app — there is no language switch. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LanguageContextValue>(
    () => ({
      dir: 'ltr',
      t: (key: TranslationKey) => translations[key],
    }),
    []
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
