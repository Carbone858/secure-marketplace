'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');

  const footerLinks = {
    company: [
      { name: t('company.aboutUs'), href: `/${locale}/about` },
      { name: t('company.careers'), href: `/${locale}/careers` },
      { name: t('company.press'), href: `/${locale}/press` },
      { name: t('company.blog'), href: `/${locale}/blog` },
    ],
    support: [
      { name: t('support.helpCenter'), href: `/${locale}/faq` },
      { name: t('support.contactUs'), href: `/${locale}/contact` },
      { name: t('support.privacyPolicy'), href: `/${locale}/privacy` },
      { name: t('support.termsOfService'), href: `/${locale}/terms` },
    ],
    services: [
      { name: t('services.forCompanies'), href: `/${locale}/for-companies` },
      { name: t('services.forCustomers'), href: `/${locale}/for-customers` },
      { name: t('services.pricing'), href: `/${locale}/pricing` },
      { name: t('services.successStories'), href: `/${locale}/stories` },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <footer className="bg-zinc-900 text-zinc-200 mt-auto border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold">{t('brand')}</span>
            </Link>
            <p className="text-zinc-400 mb-6 max-w-sm">
              {t('tagline')}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="h-4 w-4" />
                <span>support@servicemarket.com</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="h-4 w-4" />
                <span>+963 11 000 0000</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="h-4 w-4" />
                <span>{t('contact.location')}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('sections.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('sections.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('sections.services')}</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">
            {t('copyright', { year: String(new Date().getFullYear()) })}
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-zinc-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
