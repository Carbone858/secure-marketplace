'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
    Building2, MapPin, Briefcase, User, CheckCircle, AlertCircle, Loader2,
    Upload, X, Plus, ChevronDown, Check, Eye, EyeOff, Globe, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { checkPasswordStrength } from '@/lib/validations/auth';

// --- Types ---

interface Country {
    id: string;
    name: string;
    code: string;
}

interface City {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    icon?: string;
    subcategories?: Category[];
}

interface CompanyJoinFormProps {
    countries: Country[];
}

// --- Helper Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted">
        <motion.div
            className="h-full bg-gradient-to-r from-primary to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
    </div>
);

const SectionHeader = ({
    step,
    title,
    description,
    isActive,
    isCompleted,
    onEdit
}: {
    step: number;
    title: string;
    description: string;
    isActive: boolean;
    isCompleted: boolean;
    onEdit: () => void;
}) => (
    <div
        className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${isActive ? 'bg-card' : 'bg-muted/30 hover:bg-muted/50'}`}
        onClick={isCompleted ? onEdit : undefined}
    >
        <div className="flex items-center gap-4">
            <div className={`
        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-lg
        ${isActive ? 'border-primary bg-primary text-primary-foreground' : ''}
        ${isCompleted && !isActive ? 'border-success bg-success/10 text-success' : ''}
        ${!isActive && !isCompleted ? 'border-muted-foreground/30 text-muted-foreground' : ''}
      `}>
                {isCompleted && !isActive ? <Check className="w-5 h-5" /> : step}
            </div>
            <div>
                <h3 className={`text-lg font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h3>
                {isActive && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </div>
        {isCompleted && !isActive && (
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
                Edit
            </button>
        )}
    </div>
);

const TagInput = ({
    placeholder,
    tags,
    onAdd,
    onRemove
}: {
    placeholder: string;
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
}) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {tags.map(tag => (
                        <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                            {tag}
                            <button onClick={() => onRemove(tag)} className="hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                    type="button"
                    onClick={() => { if (input.trim()) { onAdd(input.trim()); setInput(''); } }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors ${!input.trim() ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <Plus className="w-4 h-4 text-primary" />
                </button>
            </div>
        </div>
    );
};

const FileDropzone = ({ file, onChange }: { file: File | null, onChange: (f: File) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            onChange(e.dataTransfer.files[0]);
        }
    };

    const locale = useLocale();
    const isArabic = locale === 'ar';

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'}
        `}
        >
            <input type="file" ref={inputRef} hidden accept="image/*" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])} />

            {file ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{isArabic ? 'انقر للاستبدال' : 'Click to replace'}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{isArabic ? 'انقر لرفع الشعار' : 'Click to upload logo'}</p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG (max 2MB)</p>
                </div>
            )}
        </div>
    );
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const strength = checkPasswordStrength(password);
    const locale = useLocale();
    const isArabic = locale === 'ar';

    // 0-1: Red, 2-3: Yellow, 4-5: Green
    const color = strength.score < 2 ? 'bg-destructive' : strength.score < 4 ? 'bg-yellow-500' : 'bg-success';
    const width = `${(strength.score / 5) * 100}%`;

    return (
        <div className="space-y-3 mt-2">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${color}`}
                    style={{ width: password ? width : '0%' }}
                />
            </div>
            {isArabic && (
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                    <li className={password.length >= 12 ? 'text-success' : ''}>12 حرفاً على الأقل</li>
                    <li className={/[A-Z]/.test(password) ? 'text-success' : ''}>حرف كبير واحد (A-Z)</li>
                    <li className={/[a-z]/.test(password) ? 'text-success' : ''}>حرف صغير واحد (a-z)</li>
                    <li className={/[0-9]/.test(password) ? 'text-success' : ''}>رقم واحد (0-9)</li>
                    <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-success' : ''}>رمز خاص واحد (!@#$...)</li>
                </ul>
            )}
            {!isArabic && (
                <p className="text-xs text-muted-foreground text-right w-full">
                    {strength.score === 0 ? 'Enter password' :
                        strength.score < 3 ? 'Weak' :
                            strength.score < 5 ? 'Good' : 'Strong'}
                </p>
            )}
        </div>
    );
};

// --- Main Form Component ---

export function CompanyJoinForm({ countries }: CompanyJoinFormProps) {
    const router = useRouter();
    const t = useTranslations('company.join');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // --- State ---

    const [activeStep, setActiveStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Data
    const [cities, setCities] = useState<City[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        // Step 1
        companyName: '',
        businessType: '', // This will hold the main category ID
        description: '',
        logo: null as File | null,
        // Step 2
        countryId: 'SY', // Default to Syria if code 'SY' matches, otherwise use ID logic
        cityId: '',
        operationAreas: [] as string[],
        address: '',
        // Step 3
        serviceIds: [] as string[],
        serviceType: 'BOTH',
        skills: [] as string[],
        // Step 4
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailChecking, setEmailChecking] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    // --- Effects ---

    useEffect(() => {
        fetchCategories();
        // Pre-select Syria if available (assuming Country code 'SY')
        const syria = countries.find(c => c.code === 'SY');
        if (syria) {
            handleCountryChange(syria.id);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        // When Business Type (Category) changes, update available subcategories for Step 3
        if (formData.businessType) {
            const selectedCat = categories.find(c => c.id === formData.businessType);
            if (selectedCat && selectedCat.subcategories) {
                setFilteredSubcategories(selectedCat.subcategories);
            } else {
                setFilteredSubcategories([]);
            }
        } else {
            setFilteredSubcategories([]);
        }
    }, [formData.businessType, categories]);


    // --- Actions ---

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const res = await fetch(`/api/categories?locale=${locale}`);
            const data = await res.json();
            if (data.categories) setCategories(data.categories);
        } catch (e) { console.error(e); } finally { setCategoriesLoading(false); }
    };

    const handleCountryChange = async (countryId: string) => {
        setFormData(prev => ({ ...prev, countryId, cityId: '', operationAreas: [] }));
        if (countryId) {
            try {
                const res = await fetch(`/api/countries/${countryId}/cities`);
                const data = await res.json();
                if (data.success) setCities(data.data.cities);
            } catch (e) { console.error(e); }
        } else {
            setCities([]);
        }
    };

    const checkEmail = async () => {
        if (!formData.email || !formData.email.includes('@')) return;
        setEmailChecking(true);
        setEmailError('');
        // Mock check for now, ideally an API endpoint /api/auth/check-email
        // await new Promise(r => setTimeout(r, 500));
        // Simulated simple check
        setEmailChecking(false);
    };

    const handleStepComplete = (step: number) => {
        // Validation
        let valid = true;
        let stepError = '';

        if (step === 1) {
            if (!formData.companyName) { valid = false; stepError = isRTL ? 'اسم الشركة مطلوب' : 'Company Name is required'; }
            else if (!formData.businessType) { valid = false; stepError = isRTL ? 'مجال العمل مطلوب' : 'Business Type is required'; }
            else if (formData.description.length < 25) { valid = false; stepError = isRTL ? 'الوصف قصير جداً (25 حرف كحد أدنى)' : 'Description too short (min 25 chars)'; }
        } else if (step === 2) {
            if (!formData.countryId) { valid = false; stepError = isRTL ? 'البلد مطلوب' : 'Country is required'; }
            else if (!formData.cityId) { valid = false; stepError = isRTL ? 'المدينة مطلوبة' : 'City is required'; }
        } else if (step === 3) {
            if (formData.serviceIds.length === 0) { valid = false; stepError = isRTL ? 'اختر خدمة واحدة على الأقل' : 'Select at least one service'; }
        } else if (step === 4) {
            if (!formData.name) { valid = false; stepError = isRTL ? 'اسم المسؤول مطلوب' : 'Admin Name is required'; }
            else if (!formData.email) { valid = false; stepError = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required'; }
            else if (!formData.phone) { valid = false; stepError = isRTL ? 'رقم الهاتف مطلوب' : 'Phone is required'; }
            else if (!/^[+]?[0-9\s)(-]{8,20}$/.test(formData.phone)) { valid = false; stepError = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number format'; }
            else if (formData.password.length < 12) { valid = false; stepError = isRTL ? 'كلمة المرور ضعيفة' : 'Password too weak'; }
            else if (formData.password !== formData.confirmPassword) { valid = false; stepError = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'; }
            else if (!formData.termsAccepted) { valid = false; stepError = isRTL ? 'يجب الموافقة على الشروط' : 'Accept terms to proceed'; }
        }

        if (!valid) {
            setError(stepError);
            return;
        }

        setError('');
        if (!completedSteps.includes(step)) setCompletedSteps(prev => [...prev, step]);

        if (step < 4) {
            setActiveStep(step + 1);
        } else {
            submitForm();
        }
    };

    const submitForm = async () => {
        setIsLoading(true);
        try {
            const payload = { ...formData, companyPhone: formData.phone }; // Mapping
            const res = await fetch('/api/auth/register-company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto pt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-2xl shadow-xl border border-border p-10 text-center"
                >
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-success" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{isRTL ? 'تم التسجيل بنجاح!' : `Welcome, ${formData.companyName}!`}</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        {isRTL ? (
                            <>لقد أرسلنا رابط التحقق إلى <strong className="text-foreground">{formData.email}</strong>.<br /> يرجى التحقق من بريدك لتفعيل لوحة التحكم.</>
                        ) : (
                            <>We've sent a verification link to <strong className="text-foreground">{formData.email}</strong>.<br /> Please check your inbox to activate your dashboard.</>
                        )}
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href={`/${locale}`} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                            {isRTL ? 'الذهاب للرئيسية' : 'Go to Homepage'}
                        </Link>
                        <button
                            disabled={resendTimer > 0}
                            onClick={() => setResendTimer(60)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                        >
                            {resendTimer > 0
                                ? (isRTL ? `إعادة الإرسال بعد ${resendTimer} ثانية` : `Resend email in ${resendTimer}s`)
                                : (isRTL ? 'إعادة إرسال بريد التحقق' : 'Resend Verification Email')}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const progress = (completedSteps.length / 4) * 100;

    return (
        <div className="relative min-h-screen pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
            <ProgressBar progress={progress} />

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto pt-6 px-4">

                {/* Sidebar Nav */}
                <div className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit space-y-2">
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeStep === step ? 'bg-primary/5' : ''}`}>
                            <div className={`w-3 h-3 rounded-full ${activeStep === step ? 'bg-primary' : completedSteps.includes(step) ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                            <span className={`font-medium ${activeStep === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step === 1 ? (isRTL ? 'معلومات أساسية' : 'Basic Info') :
                                    step === 2 ? (isRTL ? 'الموقع' : 'Location') :
                                        step === 3 ? (isRTL ? 'الخدمات' : 'Services') :
                                            (isRTL ? 'الحساب' : 'Account')}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-2xl mx-auto w-full">
                    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-4 flex items-center gap-2 text-sm font-medium border-b border-destructive/20">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        {/* --- Section 1: Basic Info --- */}
                        <SectionHeader
                            step={1} title={isRTL ? "هوية الشركة" : "Company Identity"} description={isRTL ? "معلومات أساسية عن نشاطك التجاري" : "Basic information about your business"}
                            isActive={activeStep === 1} isCompleted={completedSteps.includes(1)}
                            onEdit={() => setActiveStep(1)}
                        />
                        <AnimatePresence>
                            {activeStep === 1 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8 space-y-6 border-b border-border"
                                >
                                    <div className="grid md:grid-cols-[1fr,auto] gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'اسم الشركة *' : 'Company Name <span className="text-destructive">*</span>'}</label>
                                                <input
                                                    value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                                    placeholder={isRTL ? "مثال: شركة الإعمار المتقدمة" : "e.g. Acme Construction"} autoFocus
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">{isRTL ? 'الاسم الظاهر في ملفك العام.' : 'The public name displayed on your profile.'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'مجال العمل *' : 'Business Category <span className="text-destructive">*</span>'}</label>
                                                <select
                                                    value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option value="">{isRTL ? 'اختر التصنيف...' : 'Select a category...'}</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-40">
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'الشعار' : 'Logo'}</label>
                                            <FileDropzone file={formData.logo} onChange={f => setFormData({ ...formData, logo: f })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'وصف مختصر *' : 'Short Description <span className="text-destructive">*</span>'}</label>
                                        <textarea
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                            placeholder={isRTL ? "ماذا تقدم شركتك؟" : "What does your company do?"}
                                        />
                                        <div className="flex justify-between mt-1 text-xs">
                                            <span className={formData.description.length < 25 ? 'text-destructive' : 'text-success'}>{isRTL ? '25 حرف كحد أدنى' : 'Min 25 characters'}</span>
                                            <span className="text-muted-foreground">{formData.description.length} chars</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={() => handleStepComplete(1)} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                                            {isRTL ? 'متابعة' : 'Continue'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* --- Section 2: Location --- */}
                        <SectionHeader
                            step={2} title={isRTL ? "العنوان والتغطية" : "Location & Coverage"} description={isRTL ? "أين تقدم خدماتك؟" : "Where do you operate?"}
                            isActive={activeStep === 2} isCompleted={completedSteps.includes(2)}
                            onEdit={() => setActiveStep(2)}
                        />
                        <AnimatePresence>
                            {activeStep === 2 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8 space-y-6 border-b border-border"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'البلد *' : 'Country <span className="text-destructive">*</span>'}</label>
                                            <select
                                                value={formData.countryId} onChange={e => handleCountryChange(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="">{isRTL ? 'اختر البلد' : 'Select Country'}</option>
                                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'المدينة *' : 'Main City <span className="text-destructive">*</span>'}</label>
                                            <select
                                                value={formData.cityId} onChange={e => setFormData({ ...formData, cityId: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                                disabled={!formData.countryId}
                                            >
                                                <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
                                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'مناطق التغطية' : 'Operation Areas'} <span className="text-muted-foreground font-normal">{isRTL ? '(اختياري)' : '(Optional)'}</span></label>
                                        <TagInput
                                            placeholder={isRTL ? "اكتب المدينة واضغط Enter..." : "Type city or area and press Enter..."}
                                            tags={formData.operationAreas}
                                            onAdd={tag => setFormData(prev => ({ ...prev, operationAreas: [...prev.operationAreas, tag] }))}
                                            onRemove={tag => setFormData(prev => ({ ...prev, operationAreas: prev.operationAreas.filter(t => t !== tag) }))}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">{isRTL ? 'حدد مدن أخرى تغطيها بخدماتك.' : 'Select other cities you cover.'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'العنوان' : 'Address'} <span className="text-muted-foreground font-normal">{isRTL ? '(اختياري)' : '(Optional)'}</span></label>
                                        <input
                                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                            placeholder={isRTL ? "الشارع، البناء، الطابق..." : "Street, Building, Floor..."}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={() => handleStepComplete(2)} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                                            {isRTL ? 'متابعة' : 'Continue'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* --- Section 3: Services --- */}
                        <SectionHeader
                            step={3} title={isRTL ? "الخدمات والمهارات" : "Services & Skills"} description={isRTL ? "ماذا تقدم لعملائك؟" : "What do you offer?"}
                            isActive={activeStep === 3} isCompleted={completedSteps.includes(3)}
                            onEdit={() => setActiveStep(3)}
                        />
                        <AnimatePresence>
                            {activeStep === 3 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8 space-y-6 border-b border-border"
                                >
                                    {categoriesLoading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div> : (
                                        filteredSubcategories.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {filteredSubcategories.map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => {
                                                            const newIds = formData.serviceIds.includes(cat.id)
                                                                ? formData.serviceIds.filter(id => id !== cat.id)
                                                                : [...formData.serviceIds, cat.id];
                                                            setFormData({ ...formData, serviceIds: newIds });
                                                        }}
                                                        className={`
                                                cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2 hover:bg-muted/50 relative
                                                ${formData.serviceIds.includes(cat.id) ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-muted-foreground'}
                                            `}
                                                    >
                                                        <div className="font-semibold">{cat.name}</div>
                                                        {formData.serviceIds.includes(cat.id) && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full text-primary-foreground flex items-center justify-center"><Check className="w-3 h-3" /></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/30">
                                                <Briefcase className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                                                <p className="text-muted-foreground">{isRTL ? "لا توجد خدمات فرعية متاحة لهذا التصنيف." : "No sub-services available for this category."}</p>
                                            </div>
                                        )
                                    )}
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'مهارات خاصة / كلمات مفتاحية' : 'Specific Skills / Tags'} <span className="text-muted-foreground font-normal">{isRTL ? '(اختياري)' : '(Optional)'}</span></label>
                                        <TagInput
                                            placeholder={isRTL ? "مثال: صيانة تكييف مركزي، قانون تجاري..." : "e.g. HVAC Repair, Corporate Law..."}
                                            tags={formData.skills}
                                            onAdd={tag => setFormData(prev => ({ ...prev, skills: [...prev.skills, tag] }))}
                                            onRemove={tag => setFormData(prev => ({ ...prev, skills: prev.skills.filter(t => t !== tag) }))}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={() => handleStepComplete(3)} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                                            {isRTL ? 'متابعة' : 'Continue'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* --- Section 4: Account --- */}
                        <SectionHeader
                            step={4} title={isRTL ? "الحساب والأمان" : "Account & Security"} description={isRTL ? "تأمين حساب المسؤول" : "Secure your admin access"}
                            isActive={activeStep === 4} isCompleted={completedSteps.includes(4)}
                            onEdit={() => setActiveStep(4)}
                        />
                        <AnimatePresence>
                            {activeStep === 4 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8 space-y-6"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'اسم المسؤول *' : 'Admin Name <span className="text-destructive">*</span>'}</label>
                                            <input
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                                placeholder={isRTL ? "فلان الفلاني" : "John Doe"}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'رقم الهاتف *' : 'Phone Number <span className="text-destructive">*</span>'}</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    // Allow only digits, +, -, (, ), and spaces
                                                    if (/^[0-9+\-\(\)\s]*$/.test(val)) {
                                                        setFormData({ ...formData, phone: val });
                                                    }
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                                                placeholder={isRTL ? "+963912345678" : "+963..."}
                                                dir="ltr"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1" dir={isRTL ? 'rtl' : 'ltr'}>
                                                {isRTL ? '+1234567890 أو 001234567890 (مع رمز الدولة)' : '+1234567890 or 001234567890 (include country code)'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'البريد الإلكتروني *' : 'Email Address <span className="text-destructive">*</span>'}</label>
                                        <div className="relative">
                                            <input
                                                type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                onBlur={checkEmail}
                                                className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 transition-all ${emailError ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20'}`}
                                                placeholder="admin@company.com"
                                            />
                                            {emailChecking && <Loader2 className="absolute right-3 top-3.5 w-5 h-5 animate-spin text-muted-foreground" />}
                                        </div>
                                        {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'كلمة المرور *' : 'Password <span className="text-destructive">*</span>'}</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder={isRTL ? "كلمة المرور" : "Password"}
                                                    className={`w-full py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3.5 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <PasswordStrengthMeter password={formData.password} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'تأكيد كلمة المرور *' : 'Confirm Password <span className="text-destructive">*</span>'}</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className={`w-full py-3 rounded-xl border bg-background focus:ring-2 transition-all ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} ${formData.confirmPassword && formData.confirmPassword !== formData.password ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:ring-primary/20'}`}
                                                />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-3.5 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                                <p className="text-xs text-destructive mt-1">
                                                    {isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox" checked={formData.termsAccepted} onChange={e => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                                className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary"
                                            />
                                            <span className={`text-sm text-muted-foreground ${isRTL ? 'mr-0' : ''}`}>
                                                {isRTL ? (
                                                    <>أوافق على <Link href="#" className="text-primary hover:underline">شروط الاستخدام</Link> و <Link href="#" className="text-primary hover:underline">سياسة الخصوصية</Link>.</>
                                                ) : (
                                                    <>I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.</>
                                                )}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => handleStepComplete(4)}
                                            disabled={isLoading}
                                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRTL ? 'إنشاء حساب الشركة' : 'Create Company Account')}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
