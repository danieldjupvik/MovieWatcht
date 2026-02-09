import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import translationsEN from './en/translation.json';
import translationsNB from './nb/translation.json';

const i18n = new I18n({
  nb: translationsNB,
  en: translationsEN,
});

i18n.locale = Localization.getLocales()[0]?.languageTag;
i18n.enableFallback = true;

export default i18n;
