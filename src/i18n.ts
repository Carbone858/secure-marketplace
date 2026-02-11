import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically comes from the middleware
  let locale = await requestLocale;
  
  // Provide a default if middleware didn't run
  if (!locale) {
    locale = 'ar';
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
