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
      return { label: t('strength.empty'), color: 'bg-muted', textColor: 'text-muted-foreground' };
    }
    if (strengthScore <= 2) {
      return { label: t('strength.weak'), color: 'bg-destructive/100', textColor: 'text-destructive' };
    }
    if (strengthScore <= 3) {
      return { label: t('strength.fair'), color: 'bg-warning/100', textColor: 'text-warning' };
    }
    if (strengthScore <= 4) {
      return { label: t('strength.good'), color: 'bg-primary/100', textColor: 'text-primary' };
    }
    return { label: t('strength.strong'), color: 'bg-success/100', textColor: 'text-success' };
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t('strength.label')}</span>
          <span className={`text-sm font-medium ${strengthInfo.textColor}`}>
            {strengthInfo.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthInfo.color}`}
            style={{ width: `${(strengthScore / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements list */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('requirements.title')}</p>
        <ul className="space-y-1">
          {requirements.map((req) => {
            const isMet = req.test(password);
            return (
              <li
                key={req.key}
                className={`flex items-center gap-2 text-sm ${
                  isMet ? 'text-success' : 'text-muted-foreground'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    isMet ? 'bg-success/10' : 'bg-muted'
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
