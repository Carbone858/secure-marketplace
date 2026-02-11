'use client';

import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  locale?: string;
}

interface Requirement {
  key: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    key: 'minLength',
    test: (password) => password.length >= 12,
  },
  {
    key: 'uppercase',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    test: (password) => /[0-9]/.test(password),
  },
  {
    key: 'specialChar',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

export function PasswordStrength({ password, locale = 'en' }: PasswordStrengthProps) {
  const t = useTranslations('auth.password');
  const isRTL = locale === 'ar';

  // Calculate strength score
  const metRequirements = requirements.filter((req) => req.test(password));
  const strengthScore = metRequirements.length;

  // Determine strength label and color
  const getStrengthInfo = () => {
    if (password.length === 0) {
      return { label: t('strength.empty'), color: 'bg-gray-200', textColor: 'text-gray-500' };
    }
    if (strengthScore <= 2) {
      return { label: t('strength.weak'), color: 'bg-red-500', textColor: 'text-red-600' };
    }
    if (strengthScore <= 3) {
      return { label: t('strength.fair'), color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    }
    if (strengthScore <= 4) {
      return { label: t('strength.good'), color: 'bg-blue-500', textColor: 'text-blue-600' };
    }
    return { label: t('strength.strong'), color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t('strength.label')}</span>
          <span className={`text-sm font-medium ${strengthInfo.textColor}`}>
            {strengthInfo.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthInfo.color}`}
            style={{ width: `${(strengthScore / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements list */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t('requirements.title')}</p>
        <ul className="space-y-1">
          {requirements.map((req) => {
            const isMet = req.test(password);
            return (
              <li
                key={req.key}
                className={`flex items-center gap-2 text-sm ${
                  isMet ? 'text-green-600' : 'text-gray-500'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    isMet ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  {isMet ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </span>
                <span>{t(`requirements.${req.key}`)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
