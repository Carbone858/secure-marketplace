'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Plus, X, Upload, AlertCircle, CheckCircle, MapPin, DollarSign, Calendar, Eye, Shield } from 'lucide-react';

interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string | null;
}

interface Country {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
}

interface RequestFormProps {
  categories: Category[];
  countries: Country[];
}

export function RequestForm({ categories, countries }: RequestFormProps) {
  const router = useRouter();
  const t = useTranslations('requests.form');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState<{ id: string; nameEn: string; nameAr: string }[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    countryId: '',
    cityId: '',
    address: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    deadline: '',
    urgency: 'MEDIUM',
    visibility: 'PUBLIC',
    allowRemote: false,
    requireVerification: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
  };

  const handleCategoryChange = async (categoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryId, subcategoryId: '' }));
    
    if (categoryId) {
      try {
        const response = await fetch(`/api/categories/${categoryId}/subcategories`);
        const data = await response.json();
        if (data.success) {
          setSubcategories(data.data.subcategories);
        }
      } catch (error) {
        console.error('Failed to load subcategories:', error);
      }
    } else {
      setSubcategories([]);
    }
  };

  const handleCountryChange = async (countryId: string) => {
    setFormData((prev) => ({ ...prev, countryId, cityId: '' }));
    
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

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (images.length >= 10) break;
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setImages((prev) => [...prev, data.data.url]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title.trim() || formData.title.length < 5) {
          setError(t('errors.titleRequired'));
          return false;
        }
        if (!formData.description.trim() || formData.description.length < 20) {
          setError(t('errors.descriptionRequired'));
          return false;
        }
        if (!formData.categoryId) {
          setError(t('errors.categoryRequired'));
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
        if (formData.budgetMin && formData.budgetMax) {
          if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) {
            setError(t('errors.budgetInvalid'));
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
          budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
          images,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t('errors.general'));
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/requests/${data.data.request.id}`);
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12" dir={isRTL ? 'rtl' : 'ltr'}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('success.title')}</h2>
        <p className="text-gray-600">{t('success.message')}</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('titlePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isRTL ? cat.nameAr : cat.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('subcategory')}
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  disabled={!formData.categoryId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">{t('selectSubcategory')}</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {isRTL ? sub.nameAr : sub.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('country')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="countryId"
                  value={formData.countryId}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('selectCountry')}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {isRTL ? country.nameAr : country.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('city')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  disabled={!formData.countryId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">{t('selectCity')}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {isRTL ? city.nameAr : city.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('address')}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={t('addressPlaceholder')}
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowRemote"
                  checked={formData.allowRemote}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{t('allowRemote')}</span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('budgetMin')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('budgetMax')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('currency')}
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('deadline')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('urgency')}
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">{t('urgencyLow')}</option>
                  <option value="MEDIUM">{t('urgencyMedium')}</option>
                  <option value="HIGH">{t('urgencyHigh')}</option>
                  <option value="URGENT">{t('urgencyUrgent')}</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('images')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img src={image} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">{t('addImage')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">{t('imagesHint')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tags')}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('tagsPlaceholder')}
                />
                <button
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('visibility')}
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={formData.visibility === 'PUBLIC'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{t('visibilityPublic')}</div>
                    <div className="text-sm text-gray-500">{t('visibilityPublicDesc')}</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="REGISTERED_ONLY"
                    checked={formData.visibility === 'REGISTERED_ONLY'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{t('visibilityRegistered')}</div>
                    <div className="text-sm text-gray-500">{t('visibilityRegisteredDesc')}</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="VERIFIED_COMPANIES"
                    checked={formData.visibility === 'VERIFIED_COMPANIES'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{t('visibilityVerified')}</div>
                    <div className="text-sm text-gray-500">{t('visibilityVerifiedDesc')}</div>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="requireVerification"
                  checked={formData.requireVerification}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium">{t('requireVerification')}</div>
                  <div className="text-sm text-gray-500">{t('requireVerificationDesc')}</div>
                </div>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div className={`w-12 h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || isLoading}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {t('back')}
        </button>
        {step < 5 ? (
          <button
            onClick={() => validateStep() && setStep((s) => s + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('next')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {t('submit')}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
