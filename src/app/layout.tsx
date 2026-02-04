import './globals.css';

export default function RootLayout({ children, params: { locale } }: any) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
