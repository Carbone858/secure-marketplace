import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically comes from the middleware
  let locale = await requestLocale;
  
  // Provide a default if middleware didn't run
  if (!locale) {
    locale = 'ar';
  }
  
  let messages = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`[i18n] Failed to load messages for locale: ${locale}. Falling back to empty object.`);
  }

  return {
    locale,
    messages,
  };
});
