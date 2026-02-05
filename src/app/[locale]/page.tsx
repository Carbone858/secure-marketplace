// This is a SERVER COMPONENT - no 'use client'
import HomePageClient from './components/HomePageClient';

export default function HomePage({ params }: { params: { locale: string } }) {
  return <HomePageClient locale={params.locale} />;
}
