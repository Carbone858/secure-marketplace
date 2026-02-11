'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle, Building2, MapPin, Briefcase, FileText, Clock, Share2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

interface CompanyRegistrationWizardProps {
  countries: { id: string; name: string; code: string }[];
}

interface FormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  
  // Step 2: Location
  countryId: string;
  cityId: string;
  address: string;
  
  // Step 3: Services
  services: { name: string; description: string; priceFrom: string; priceTo: string }[];
  
  // Step 4: Working Hours
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  
  // Step 5: Social Links
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

const initialFormData: FormData = {
  name: '',
  description: '',
  email: '',
  phone: '',
  website: '',
  countryId: '',
  cityId: '',
  address: '',
  services: [{ name: '', description: '', priceFrom: '', priceTo: '' }],
  workingHours: {
    monday: '09:00-17:00',
    tuesday: '09:00-17:00',
    wednesday: '09:00-17:00',
    thursday: '09:00-17:00',
    friday: '09:00-17:00',
    saturday: '',
    sunday: '',
  },
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  },
};

const steps = [
  { id: 1, key: 'basic', icon: Building2 },
  { id: 2, key: 'location', icon: MapPin },
  { id: 3, key: 'services', icon: Briefcase },
  { id: 4, key: 'hours', icon: Clock },
  { id: 5, key: 'social', icon: Share2 },
];

export function CompanyRegistrationWizard({ countries }: CompanyRegistrationWizardProps) {
  const router = useRouter();
  const t = useTranslations('company.registration');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  const updateFormData = (section: keyof FormData, data: unknown) => {
    setFormData((prev) => ({ ...prev, [section]: data }));
    setError('');
  };

  const handleCountryChange = async (countryId: string) => {
    updateFormData('countryId', countryId);
    updateFormData('cityId', '');
    
    if (countryId) {
      try {
        const response = await fetch(`/api/countries/${countryId}/cities`);
        const data = await response.json();
        if (data.success) {
          setCities(data.data.cities);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    } else {
      setCities([]);
    }
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', priceFrom: '', priceTo: '' }],
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setError(t('errors.nameRequired'));
          return false;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError(t('errors.emailInvalid'));
          return false;
        }
        if (formData.phone && !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
          setError(t('errors.phoneInvalid'));
          return false;
        }
        return true;
      case 2:
        if (!formData.countryId) {
          setError(t('errors.countryRequired'));
          return false;
        }
        if (!formData.cityId) {
          setError(t('errors.cityRequired'));
          return false;
        }
        return true;
      case 3:
        if (formData.services.length === 0 || !formData.services[0].name.trim()) {
          setError(t('errors.serviceRequired'));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          email: formData.email || null,
          phone: formData.phone || null,
          website: formData.website || null,
          countryId: formData.countryId,
          cityId: formData.cityId,
          address: formData.address || null,
          services: formData.services
            .filter((s) => s.name.trim())
            .map((s) => ({
              name: s.name,
              description: s.description || null,
              priceFrom: s.priceFrom ? parseFloat(s.priceFrom) : null,
              priceTo: s.priceTo ? parseFloat(s.priceTo) : null,
            })),
          workingHours: formData.workingHours,
          socialLinks: formData.socialLinks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t('errors.general'));
        return;
      }

      // Redirect to document upload
      router.push(`/${locale}/company/${data.data.company.id}/documents`);
    } catch (error) {
      console.error('Registration error:', error);
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.basic.name')} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                placeholder={t('steps.basic.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.basic.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                placeholder={t('steps.basic.descriptionPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('steps.basic.email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder={t('steps.basic.emailPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('steps.basic.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder={t('steps.basic.phonePlaceholder')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.basic.website')}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                placeholder={t('steps.basic.websitePlaceholder')}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.location.country')} <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.countryId}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value="">{t('steps.location.selectCountry')}</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.location.city')} <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.cityId}
                onChange={(e) => updateFormData('cityId', e.target.value)}
                disabled={!formData.countryId}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-muted"
              >
                <option value="">{t('steps.location.selectCity')}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('steps.location.address')}
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                placeholder={t('steps.location.addressPlaceholder')}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {formData.services.map((service, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{t('steps.services.service')} {index + 1}</h4>
                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-destructive hover:text-destructive text-sm"
                    >
                      {t('steps.services.remove')}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                    placeholder={t('steps.services.namePlaceholder')}
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                    placeholder={t('steps.services.descriptionPlaceholder')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={service.priceFrom}
                      onChange={(e) => updateService(index, 'priceFrom', e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder={t('steps.services.priceFrom')}
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={service.priceTo}
                      onChange={(e) => updateService(index, 'priceTo', e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder={t('steps.services.priceTo')}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="w-full py-2 border-2 border-dashed border-input rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              + {t('steps.services.add')}
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            {Object.entries(formData.workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-24 font-medium capitalize">{t(`steps.hours.${day}`)}</span>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, [day]: e.target.value },
                    }))
                  }
                  placeholder="09:00-17:00"
                  className="flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                />
                <span className="text-sm text-muted-foreground">{t('steps.hours.format')}</span>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            {Object.entries(formData.socialLinks).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-foreground mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, [platform]: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder={`https://${platform}.com/yourcompany`}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm ${
                currentStep >= step.id ? 'text-primary font-medium' : 'text-muted-foreground/60'
              }`}
            >
              {t(`steps.${step.key}.title`)}
            </span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {t(`steps.${steps[currentStep - 1].key}.title`)}
        </h2>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
          className="flex items-center gap-2 px-6 py-3 border border-input rounded-lg text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('navigation.back')}
        </button>
        
        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('navigation.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('navigation.submitting')}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {t('navigation.submit')}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
