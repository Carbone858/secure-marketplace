'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Loader2, Plus, X, Upload, AlertCircle, CheckCircle,
  MapPin, DollarSign, Calendar, Eye, Shield, ChevronDown,
  ChevronUp, FileText, Image, Tag, Globe, Sparkles,
  GripVertical, Send,
} from 'lucide-react';

/* ── types ─────────────────────────────────────────── */
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

interface City {
  id: string;
  nameEn: string;
  nameAr: string;
  name?: string;
}

interface RequestFormSPAProps {
  categories: Category[];
  countries: Country[];
  mode?: 'authenticated' | 'guest';
}

/* ── section ids (for progress & anchor scrolling) ── */
const SECTIONS_AUTH = ['details', 'location', 'budget', 'media', 'visibility'] as const;
const SECTIONS_GUEST = ['details', 'location', 'budget', 'media', 'visibility', 'account'] as const;
type SectionId = 'details' | 'location' | 'budget' | 'media' | 'visibility' | 'account';

interface SectionMeta {
  id: SectionId;
  icon: React.ReactNode;
  required: boolean;
}

/* ── field-to-section mapping ────────────────────── */
const FIELD_SECTION_MAP: Record<string, SectionId> = {
  title: 'details', description: 'details', categoryId: 'details',
  countryId: 'location', cityId: 'location',
  budgetMin: 'budget', budgetMax: 'budget', deadline: 'budget',
  contactName: 'account', contactEmail: 'account',
};

/* ── Panel (stable, outside main component) ──────── */
function Panel({
  id,
  icon,
  required,
  children,
  badge,
  isOpen,
  hasError,
  sectionLabel,
  onToggle,
  sectionRef,
}: {
  id: SectionId;
  icon: React.ReactNode;
  required: boolean;
  children: React.ReactNode;
  badge?: React.ReactNode;
  isOpen: boolean;
  hasError: boolean;
  sectionLabel: string;
  onToggle: () => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={sectionRef}
      className={`rounded-xl border transition-all duration-200 ${hasError
        ? 'border-destructive/50 bg-destructive/5'
        : isOpen
          ? 'border-primary/30 bg-card shadow-sm'
          : 'border-border bg-card hover:border-primary/20'
        }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-start"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {icon}
          </div>
          <div>
            <span className="font-semibold text-foreground">{sectionLabel}</span>
            {required && <span className="text-destructive ms-1">*</span>}
            {!isOpen && badge && <span className="ms-2 text-sm text-muted-foreground">{badge}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasError && <AlertCircle className="w-4 h-4 text-destructive" />}
          {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>
      {isOpen && <div className="px-5 pb-5 space-y-5">{children}</div>}
    </div>
  );
}

/* ── field error (plain function, not component) ──── */
function renderFieldError(fieldErrors: Record<string, string>, name: string) {
  if (!fieldErrors[name]) return null;
  return (
    <p className="mt-1 text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {fieldErrors[name]}
    </p>
  );
}

/* ── component ─────────────────────────────────────── */
export function RequestFormSPA({ categories, countries, mode = 'authenticated' }: RequestFormSPAProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('requests.new');
  const isGuest = mode === 'guest';
  const SECTIONS = isGuest ? SECTIONS_GUEST : SECTIONS_AUTH;

  /* ── state ──────────────────────────────────────── */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [collapsed, setCollapsed] = useState<Record<SectionId, boolean>>({
    details: false,
    location: false,
    budget: true,
    media: true,
    visibility: true,
    account: false,
  });

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    details: null,
    location: null,
    budget: null,
    media: null,
    visibility: null,
    account: null,
  });

  /* ── guest contact info state ─────────────────── */
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [formData, setFormData] = useState(() => {
    const syriaCountry = countries.find((c) => c.code === 'SY');
    return {
      title: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      countryId: syriaCountry?.id || '',
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
    };
  });

  /* ── section meta ───────────────────────────────── */
  const sectionMeta: SectionMeta[] = [
    { id: 'details', icon: <FileText className="w-5 h-5" />, required: true },
    { id: 'location', icon: <MapPin className="w-5 h-5" />, required: true },
    { id: 'budget', icon: <DollarSign className="w-5 h-5" />, required: false },
    { id: 'media', icon: <Image className="w-5 h-5" />, required: false },
    { id: 'visibility', icon: <Eye className="w-5 h-5" />, required: false },
    ...(isGuest ? [{ id: 'account' as SectionId, icon: <Shield className="w-5 h-5" />, required: true }] : []),
  ];

  /* ── helpers ────────────────────────────────────── */
  const sectionLabel = (id: SectionId) => {
    const labels: Record<SectionId, string> = {
      details: t('steps.details.title'),
      location: t('steps.location.title'),
      budget: t('steps.budget.title'),
      media: t('spa.media'),
      visibility: t('steps.visibility.title'),
      account: t('steps.account.title'),
    };
    return labels[id];
  };

  /* ── progress calculation ───────────────────────── */
  const progress = (() => {
    let filled = 0;
    const total = 7; // weighted fields
    if (formData.title.trim().length >= 5) filled++;
    if (formData.description.trim().length >= 20) filled++;
    if (formData.categoryId) filled++;
    if (formData.countryId) filled++;
    if (formData.cityId) filled++;
    if (formData.budgetMin || formData.budgetMax) filled++;
    if (formData.visibility) filled++;
    return Math.round((filled / total) * 100);
  })();

  /* ── toggle section ─────────────────────────────── */
  const toggle = (id: SectionId) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
    // scroll into view if opening
    if (collapsed[id]) {
      setTimeout(() => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  /* ── field change ───────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
    // clear field-level error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  /* ── guest contact change ───────────────────────── */
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Filter phone input
    if (name === 'phone') {
      if (!/^[0-9+\-\(\)\s]*$/.test(value)) {
        return;
      }
    }

    setContactData((prev) => ({ ...prev, [name]: value }));
    const fieldKey = `contact${name.charAt(0).toUpperCase() + name.slice(1)}`;
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => { const c = { ...prev }; delete c[fieldKey]; return c; });
    }
  };

  /* ── category change (load subcategories) ───────── */
  const handleCategoryChange = async (categoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryId, subcategoryId: '' }));
    if (fieldErrors.categoryId) {
      setFieldErrors((prev) => { const c = { ...prev }; delete c.categoryId; return c; });
    }
    if (categoryId) {
      try {
        const res = await fetch(`/api/categories/${categoryId}/subcategories`);
        const data = await res.json();
        if (data.success) setSubcategories(data.data.subcategories);
      } catch {
        console.error('Failed to load subcategories');
      }
    } else {
      setSubcategories([]);
    }
  };



  /* ── country change (load cities) ───────────────── */
  const handleCountryChange = async (countryId: string) => {
    setFormData((prev) => ({ ...prev, countryId, cityId: '' }));
    if (fieldErrors.countryId) {
      setFieldErrors((prev) => { const c = { ...prev }; delete c.countryId; return c; });
    }
    if (countryId) {
      try {
        const res = await fetch(`/api/countries/${countryId}/cities`);
        const data = await res.json();
        if (data.success) setCities(data.data.cities);
      } catch {
        console.error('Failed to load cities');
      }
    } else {
      setCities([]);
    }
  };

  /* auto-load cities for default Syria */
  useEffect(() => {
    if (formData.countryId) handleCountryChange(formData.countryId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── tags ────────────────────────────────────────── */
  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val) && tags.length < 10) {
      setTags((prev) => [...prev, val]);
      setTagInput('');
    }
  };

  /* ── image upload (file input + drag & drop) ────── */
  const processFiles = async (files: FileList | File[]) => {
    setUploadingImage(true);
    for (const file of Array.from(files)) {
      if (images.length >= 10) break;
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) setImages((prev) => [...prev, data.data.url]);
      } catch {
        console.error('Upload error');
      }
    }
    setUploadingImage(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
    },
    [images.length] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* ── validation ─────────────────────────────────── */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim() || formData.title.length < 5) {
      errs.title = t('errors.titleMinLength');
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      errs.description = t('errors.descriptionMinLength');
    }
    if (!formData.categoryId) errs.categoryId = t('errors.categoryRequired');
    if (!formData.countryId) errs.countryId = t('errors.countryRequired');
    if (!formData.cityId) errs.cityId = t('errors.cityRequired');

    // Budget validation
    if (formData.budgetMin) {
      const min = parseFloat(formData.budgetMin);
      if (isNaN(min) || min < 0) {
        errs.budgetMin = t('errors.invalidBudget');
      }
    }
    if (formData.budgetMax) {
      const max = parseFloat(formData.budgetMax);
      if (isNaN(max) || max < 0) {
        errs.budgetMax = t('errors.invalidBudget');
      }
    }
    if (formData.budgetMin && formData.budgetMax) {
      const min = parseFloat(formData.budgetMin);
      const max = parseFloat(formData.budgetMax);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        errs.budgetMin = t('errors.budgetMinExceedsMax');
      }
    }

    // Deadline validation — must be a future date
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        errs.deadline = t('errors.deadlinePast');
      }
    }

    // Guest mode: contact validation
    if (isGuest) {
      if (!contactData.name.trim() || contactData.name.length < 2) {
        errs.contactName = t('errors.nameRequired');
      }
      if (!contactData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
        errs.contactEmail = t('errors.emailRequired');
      }
      if (contactData.phone && !/^[+]?[0-9\s)(-]{8,20}$/.test(contactData.phone)) {
        errs.contactPhone = t('errors.invalidPhone');
      }
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      // expand & scroll to first errored section
      const firstErrField = Object.keys(errs)[0];
      const sec = FIELD_SECTION_MAP[firstErrField];
      if (sec) {
        setCollapsed((prev) => ({ ...prev, [sec]: false }));
        setTimeout(() => sectionRefs.current[sec]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
      return false;
    }
    return true;
  };

  /* ── submit ─────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError('');
    try {
      const requestPayload = {
        ...formData,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
        images,
        tags,
      };

      if (isGuest) {
        // Guest flow: create user + request in one call
        const res = await fetch('/api/auth/guest-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact: contactData,
            request: requestPayload,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.error === 'user.exists') {
            setError(t('errors.userExists'));
          } else {
            setError(data.message || t('errors.general'));
          }
          return;
        }
        setSuccess(true);
        // Guest mode: don't redirect, show check-email message
      } else {
        // Authenticated flow
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || t('errors.general'));
          return;
        }
        setSuccess(true);
        setTimeout(() => router.push(`/${locale}/requests/${data.data.request.id}`), 1500);
      }
    } catch {
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  /* ── success screen ─────────────────────────────── */
  if (success) {
    return (
      <div className="text-center py-16" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isGuest ? t('success.guestTitle') : t('success.title')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isGuest ? t('success.guestMessage') : t('success.message')}
        </p>
        {isGuest && (
          <div className="max-w-md mx-auto bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{t('success.checkEmail')}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('success.checkEmailDesc')}</p>
          </div>
        )}
      </div>
    );
  }

  /* ── helpers for section state ────────────────────── */
  const getSectionHasError = (id: SectionId) =>
    Object.keys(fieldErrors).some((k) => FIELD_SECTION_MAP[k] === id);

  /* ── review summary ─────────────────────────────── */
  const ReviewSummary = () => {
    const catName = categories.find((c) => c.id === formData.categoryId);
    const countryName = countries.find((c) => c.id === formData.countryId);
    const cityName = cities.find((c) => c.id === formData.cityId);

    const urgencyLabels: Record<string, string> = {
      LOW: t('steps.details.urgencyOptions.LOW'),
      MEDIUM: t('steps.details.urgencyOptions.MEDIUM'),
      HIGH: t('steps.details.urgencyOptions.HIGH'),
      URGENT: t('steps.details.urgencyOptions.URGENT'),
    };

    const visLabels: Record<string, string> = {
      PUBLIC: t('steps.visibility.options.PUBLIC'),
      REGISTERED_ONLY: t('steps.visibility.options.REGISTERED_ONLY'),
      VERIFIED_COMPANIES: t('steps.visibility.options.VERIFIED_COMPANIES'),
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{t('spa.reviewTitle')}</h3>
        </div>

        <div className="rounded-xl border border-border divide-y divide-border">
          {/* Details */}
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('steps.details.title')}</p>
            <p className="font-semibold text-foreground">{formData.title || '—'}</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{formData.description || '—'}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {catName && (
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {isRTL ? catName.nameAr : catName.nameEn}
                </span>
              )}
              <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full">
                {urgencyLabels[formData.urgency]}
              </span>
            </div>
          </div>
          {/* Location */}
          <div className="p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('steps.location.title')}</p>
            <p className="text-sm text-foreground">
              {countryName ? (isRTL ? countryName.nameAr : countryName.nameEn) : '—'}
              {cityName ? ` — ${isRTL ? cityName.nameAr : cityName.nameEn}` : ''}
            </p>
            {formData.allowRemote && (
              <span className="text-xs px-2 py-0.5 bg-info/10 text-info rounded-full">{t('spa.remote')}</span>
            )}
          </div>
          {/* Budget */}
          {(formData.budgetMin || formData.budgetMax) && (
            <div className="p-4 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('steps.budget.title')}</p>
              <p className="text-sm text-foreground">
                {formData.budgetMin && `${formData.currency} ${formData.budgetMin}`}
                {formData.budgetMin && formData.budgetMax && ' – '}
                {formData.budgetMax && `${formData.currency} ${formData.budgetMax}`}
              </p>
            </div>
          )}
          {/* Media */}
          {(images.length > 0 || tags.length > 0) && (
            <div className="p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('spa.media')}</p>
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ))}
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Visibility */}
          <div className="p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('steps.visibility.title')}</p>
            <p className="text-sm text-foreground">{visLabels[formData.visibility]}</p>
          </div>
        </div>
      </div>
    );
  };

  /* ── main render ────────────────────────────────── */
  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Progress Bar ─────────────────────────── */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{t('spa.progress')}</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* mini nav pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {sectionMeta.map((s) => {
            const hasErr = getSectionHasError(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCollapsed((prev) => ({ ...prev, [s.id]: false }));
                  setTimeout(() => sectionRefs.current[s.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${hasErr
                  ? 'bg-destructive/10 text-destructive'
                  : !collapsed[s.id]
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {s.icon}
                {sectionLabel(s.id)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Global Error ─────────────────────────── */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* ── Section 1: Details (required) ─────────── */}
      <Panel
        id="details"
        icon={<FileText className="w-5 h-5" />}
        required
        isOpen={!collapsed.details}
        hasError={getSectionHasError('details')}
        sectionLabel={sectionLabel('details')}
        onToggle={() => toggle('details')}
        sectionRef={(el) => { sectionRefs.current.details = el; }}
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t('steps.details.requestTitle')} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors text-base ${fieldErrors.title ? 'border-destructive' : 'border-input'
              }`}
            placeholder={t('steps.details.titlePlaceholder')}
          />
          {renderFieldError(fieldErrors, 'title')}
          {formData.title.length > 0 && formData.title.length < 5 && !fieldErrors.title && (
            <p className="mt-1 text-xs text-muted-foreground">{formData.title.length}/5 min</p>
          )}
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t('steps.details.description')} <span className="text-destructive">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-colors text-base ${fieldErrors.description ? 'border-destructive' : 'border-input'
              }`}
            placeholder={t('steps.details.descriptionPlaceholder')}
          />
          {renderFieldError(fieldErrors, 'description')}
          {formData.description.length > 0 && formData.description.length < 20 && !fieldErrors.description && (
            <p className="mt-1 text-xs text-muted-foreground">{formData.description.length}/20 min</p>
          )}
        </div>
        {/* Category + Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('steps.category.selectCategory')} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.categoryId ? 'border-destructive' : 'border-input'
                }`}
            >
              <option value="">{t('steps.category.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isRTL ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
            {renderFieldError(fieldErrors, 'categoryId')}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('steps.category.selectSubcategory')}
            </label>
            <select
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleChange}
              disabled={!formData.categoryId}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-muted text-base"
            >
              <option value="">{t('steps.category.selectSubcategory')}</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {isRTL ? sub.nameAr : sub.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t('steps.details.urgency')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((level) => {
              const colors: Record<string, string> = {
                LOW: 'border-success/40 bg-success/5 text-success',
                MEDIUM: 'border-warning/40 bg-warning/5 text-warning',
                HIGH: 'border-warning/60 bg-warning/10 text-warning',
                URGENT: 'border-destructive/40 bg-destructive/5 text-destructive',
              };
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, urgency: level }))}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${formData.urgency === level
                    ? `${colors[level]} ring-2 ring-offset-1 ring-current`
                    : 'border-border text-muted-foreground hover:border-primary/30'
                    }`}
                >
                  {t(`steps.details.urgencyOptions.${level}`)}
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* ── Section 2: Location (required) ────────── */}
      <Panel
        id="location"
        icon={<MapPin className="w-5 h-5" />}
        required
        isOpen={!collapsed.location}
        hasError={getSectionHasError('location')}
        sectionLabel={sectionLabel('location')}
        onToggle={() => toggle('location')}
        sectionRef={(el) => { sectionRefs.current.location = el; }}
        badge={
          formData.cityId && cities.find((c) => c.id === formData.cityId)
            ? isRTL
              ? cities.find((c) => c.id === formData.cityId)?.nameAr
              : cities.find((c) => c.id === formData.cityId)?.nameEn
            : undefined
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('steps.location.country')} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.countryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.countryId ? 'border-destructive' : 'border-input'
                }`}
            >
              <option value="">{t('steps.location.selectCountry')}</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {isRTL ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
            {renderFieldError(fieldErrors, 'countryId')}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('steps.location.city')} <span className="text-destructive">*</span>
            </label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              disabled={!formData.countryId}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-muted text-base ${fieldErrors.cityId ? 'border-destructive' : 'border-input'
                }`}
            >
              <option value="">{t('steps.location.selectCity')}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {isRTL ? city.nameAr : city.nameEn}
                </option>
              ))}
            </select>
            {renderFieldError(fieldErrors, 'cityId')}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t('spa.address')}</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none text-base"
            placeholder={t('spa.addressPlaceholder')}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <input
            type="checkbox"
            name="allowRemote"
            checked={formData.allowRemote}
            onChange={handleChange}
            className="w-5 h-5 text-primary rounded focus:ring-ring"
          />
          <span className="text-foreground font-medium">{t('spa.allowRemote')}</span>
        </label>
      </Panel>

      {/* ── Section 3: Budget (optional, collapsible) ── */}
      <Panel
        id="budget"
        icon={<DollarSign className="w-5 h-5" />}
        required={false}
        isOpen={!collapsed.budget}
        hasError={getSectionHasError('budget')}
        sectionLabel={sectionLabel('budget')}
        onToggle={() => toggle('budget')}
        sectionRef={(el) => { sectionRefs.current.budget = el; }}
        badge={
          formData.budgetMin || formData.budgetMax
            ? `${formData.currency} ${formData.budgetMin || '0'} – ${formData.budgetMax || '∞'}`
            : undefined
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.budget.minBudget')}</label>
            <div className="relative">
              <DollarSign className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50`} />
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.budgetMin ? 'border-destructive' : 'border-input'
                  }`}
                placeholder="0"
                min="0"
              />
            </div>
            {renderFieldError(fieldErrors, 'budgetMin')}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.budget.maxBudget')}</label>
            <div className="relative">
              <DollarSign className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50`} />
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.budgetMax ? 'border-destructive' : 'border-input'
                  }`}
                placeholder="0"
                min="0"
              />
            </div>
            {renderFieldError(fieldErrors, 'budgetMax')}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.budget.currency')}</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.budget.deadline')}</label>
          <div className="relative">
            <Calendar className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50`} />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.deadline ? 'border-destructive' : 'border-input'
                }`}
            />
          </div>
          {renderFieldError(fieldErrors, 'deadline')}
        </div>
      </Panel>

      {/* ── Section 4: Media (optional, collapsible) ── */}
      <Panel
        id="media"
        icon={<Image className="w-5 h-5" />}
        required={false}
        isOpen={!collapsed.media}
        hasError={getSectionHasError('media')}
        sectionLabel={sectionLabel('media')}
        onToggle={() => toggle('media')}
        sectionRef={(el) => { sectionRefs.current.media = el; }}
        badge={images.length > 0 ? `${images.length} ${t('spa.images')}` : undefined}
      >
        {/* Image upload with drag & drop */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t('spa.uploadImages')}</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-input hover:border-primary/40 hover:bg-muted/30'
              }`}
          >
            {uploadingImage ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">{t('spa.dragDrop')}</p>
                <label className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                  {t('spa.browse')}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            )}
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">{t('spa.imagesHint')}</p>
        </div>
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.visibility.tags')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base"
              placeholder={t('steps.visibility.tagsPlaceholder')}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 10}
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  #{tag}
                  <button type="button" onClick={() => setTags((p) => p.filter((t) => t !== tag))} className="hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* ── Section 5: Visibility (optional, collapsible) ── */}
      <Panel
        id="visibility"
        icon={<Eye className="w-5 h-5" />}
        required={false}
        isOpen={!collapsed.visibility}
        hasError={getSectionHasError('visibility')}
        sectionLabel={sectionLabel('visibility')}
        onToggle={() => toggle('visibility')}
        sectionRef={(el) => { sectionRefs.current.visibility = el; }}
        badge={formData.visibility !== 'PUBLIC' ? t(`steps.visibility.options.${formData.visibility}`) : undefined}
      >
        <div className="space-y-3">
          {(['PUBLIC', 'REGISTERED_ONLY', 'VERIFIED_COMPANIES'] as const).map((vis) => (
            <label
              key={vis}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.visibility === vis
                ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/20 hover:bg-muted/30'
                }`}
            >
              <input
                type="radio"
                name="visibility"
                value={vis}
                checked={formData.visibility === vis}
                onChange={handleChange}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium text-foreground">{t(`steps.visibility.options.${vis}`)}</span>
              </div>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors mt-2">
          <input
            type="checkbox"
            name="requireVerification"
            checked={formData.requireVerification}
            onChange={handleChange}
            className="w-5 h-5 text-primary rounded focus:ring-ring"
          />
          <div>
            <span className="font-medium text-foreground">{t('spa.requireVerification')}</span>
            <p className="text-xs text-muted-foreground">{t('spa.requireVerificationDesc')}</p>
          </div>
        </label>
      </Panel>

      {/* ── Section 6: Account (guest mode only) ──── */}
      {isGuest && (
        <Panel
          id="account"
          icon={<Shield className="w-5 h-5" />}
          required={true}
          isOpen={!collapsed.account}
          hasError={getSectionHasError('account')}
          sectionLabel={sectionLabel('account')}
          onToggle={() => toggle('account')}
          sectionRef={(el) => { sectionRefs.current.account = el; }}
          badge={contactData.email ? contactData.email : undefined}
        >
          <p className="text-sm text-muted-foreground mb-4">{t('steps.account.description')}</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.account.name')}</label>
              <input
                type="text"
                name="name"
                value={contactData.name}
                onChange={handleContactChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.contactName ? 'border-destructive' : 'border-input'
                  }`}
                placeholder={t('steps.account.namePlaceholder')}
              />
              {renderFieldError(fieldErrors, 'contactName')}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.account.email')}</label>
              <input
                type="email"
                name="email"
                value={contactData.email}
                onChange={handleContactChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.contactEmail ? 'border-destructive' : 'border-input'
                  }`}
                placeholder={t('steps.account.emailPlaceholder')}
              />
              {renderFieldError(fieldErrors, 'contactEmail')}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('steps.account.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={contactData.phone}
                onChange={handleContactChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${fieldErrors.contactPhone ? 'border-destructive' : 'border-input'
                  }`}
                placeholder={t('steps.account.phonePlaceholder')}
              />
              {renderFieldError(fieldErrors, 'contactPhone')}
              <p className="text-xs text-muted-foreground mt-1">{t('steps.account.phoneHint')}</p>
            </div>
          </div>
        </Panel>
      )}

      {/* ── Review Summary ───────────────────────── */}
      {showReview && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-sm">
          <ReviewSummary />
        </div>
      )}

      {/* ── Submit Bar ───────────────────────────── */}
      <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur rounded-xl border border-border p-4 shadow-lg flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className="px-4 py-2.5 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {showReview ? t('spa.hideReview') : t('spa.showReview')}
        </button>
        <button
          type="button"
          onClick={() => {
            if (validate()) handleSubmit();
          }}
          disabled={isLoading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('navigation.submitting')}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t('navigation.submit')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
