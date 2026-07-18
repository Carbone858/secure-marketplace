import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the 12 new main categories
const newCategories = [
    { id: "home-maintenance", label: { en: "Home & Maintenance", ar: "صيانة وخدمات المنزل" }, icon: "🏡", iconName: "home", sortOrder: 1 },
    { id: "real-estate-construction", label: { en: "Real Estate & Construction", ar: "العقارات والإنشاءات" }, icon: "🏢", iconName: "construction", sortOrder: 2 },
    { id: "automotive-logistics", label: { en: "Cars & Transport Services", ar: "السيارات و خدمات النقل" }, icon: "🚗", iconName: "moving", sortOrder: 3 },
    { id: "tech-programming", label: { en: "Tech & Software", ar: "البرمجيات والتكنولوجيا" }, icon: "💻", iconName: "it", sortOrder: 4 },
    { id: "design-creative", label: { en: "Design & Creative", ar: "التصميم والخدمات الإبداعية" }, icon: "🎨", iconName: "palette", sortOrder: 5 },
    { id: "business-legal", label: { en: "Business & Legal", ar: "الأعمال والخدمات القانونية" }, icon: "💼", iconName: "gavel", sortOrder: 6 },
    { id: "events-catering", label: { en: "Events & Catering", ar: "الفعاليات والضيافة" }, icon: "🎉", iconName: "award", sortOrder: 7 },
    { id: "healthcare-family", label: { en: "Healthcare & Family", ar: "الرعاية الصحية والأسرة" }, icon: "🏥", iconName: "health", sortOrder: 8 },
    { id: "education-training", label: { en: "Education & Training", ar: "التعليم والتدريب" }, icon: "🎓", iconName: "school", sortOrder: 9 },
    { id: "personal-care-beauty", label: { en: "Personal Care & Beauty", ar: "الجمال والعناية الشخصية" }, icon: "👗", iconName: "palette", sortOrder: 10 },
    { id: "pets-animal-care", label: { en: "Pets", ar: "الحيوانات الأليفة" }, icon: "🐾", iconName: "folder", sortOrder: 11 },
    { id: "security-smart-systems", label: { en: "Security & Smart Systems", ar: "الأمن والأنظمة الذكية" }, icon: "🔒", iconName: "folder", sortOrder: 12 }
];

// Define the complete list of subcategories for each of the 12 main categories from user screenshots
const newSubcategories = {
    "home-maintenance": [
        { id: "electrician", title: { en: "Electrician", ar: "كهربائي" } },
        { id: "plumber", title: { en: "Plumber", ar: "سباك" } },
        { id: "carpenter", title: { en: "Carpenter", ar: "نجار" } },
        { id: "painter", title: { en: "Painter", ar: "دهان" } },
        { id: "ac-services", title: { en: "AC Installation & Repair", ar: "تركيب وصيانة التكييف" } },
        { id: "appliance-repair", title: { en: "Home Appliance Repair", ar: "صيانة الأجهزة المنزلية" } },
        { id: "kitchen-install", title: { en: "Kitchen Installation", ar: "تركيب مطبخ" } },
        { id: "aluminum-glass", title: { en: "Aluminum & Glass Work", ar: "تركيب ألمنيوم وزجاج" } },
        { id: "blacksmith-welder", title: { en: "Blacksmithing & Welding", ar: "حدادة ولحام" } },
        { id: "roof-insulation", title: { en: "Roof Insulation", ar: "عزل الأسطح" } },
        { id: "pest-control", title: { en: "Pest Control", ar: "مكافحة الحشرات" } },
        { id: "home-cleaning", title: { en: "Home Cleaning", ar: "تنظيف منازل" } },
        { id: "office-cleaning", title: { en: "Office Cleaning", ar: "تنظيف مكاتب" } },
        { id: "carpet-cleaning", title: { en: "Carpet Cleaning", ar: "تنظيف سجاد" } },
        { id: "tank-cleaning", title: { en: "Water Tank Cleaning", ar: "تنظيف خزانات" } },
        { id: "window-cleaning", title: { en: "Window & Facade Cleaning", ar: "تنظيف واجهات" } },
        { id: "sterilization", title: { en: "Sterilization", ar: "تعقيم" } },
        { id: "post-construction-cleaning", title: { en: "Post-Construction Cleaning", ar: "تنظيف بعد البناء" } },
        { id: "gardening", title: { en: "Gardening & Landscaping", ar: "تنسيق حدائق" } },
        { id: "tree-trimming", title: { en: "Tree Trimming", ar: "قص أشجار" } },
        { id: "irrigation-systems", title: { en: "Irrigation Systems", ar: "تركيب شبكات ري" } }
    ],
    "real-estate-construction": [
        { id: "home-sales-rentals", title: { en: "Residential Sales & Rentals", ar: "بيع وإيجار منازل" } },
        { id: "commercial-sales-rentals", title: { en: "Commercial Sales & Rentals", ar: "بيع وإيجار محلات" } },
        { id: "land-sales-rentals", title: { en: "Land Sales & Rentals", ar: "بيع وإيجار أراضي" } },
        { id: "property-management", title: { en: "Property Management", ar: "إدارة العقارات" } },
        { id: "real-estate-appraisal", title: { en: "Real Estate Appraisal", ar: "التقييم العقاري" } },
        { id: "contracting", title: { en: "Contracting & Construction", ar: "مقاولات" } },
        { id: "architect", title: { en: "Architect", ar: "مهندس معماري" } },
        { id: "civil-engineer", title: { en: "Civil Engineer", ar: "مهندس مدني" } },
        { id: "interior-design", title: { en: "Interior Design & Decor", ar: "ديكور داخلي" } },
        { id: "engineering-supervision", title: { en: "Engineering Supervision", ar: "إشراف هندسي" } },
        { id: "surveyor", title: { en: "Land Surveyor", ar: "مساح أراضي" } }
    ],
    "automotive-logistics": [
        { id: "personal-driver", title: { en: "Private Driver & Delivery", ar: "خدمات سائق خاص للتوصيل" } },
        { id: "airport-driver", title: { en: "Airport Driver", ar: "توصيل للمطار" } },
        { id: "furniture-moving", title: { en: "Furniture Moving", ar: "نقل أثاث" } },
        { id: "local-shipping", title: { en: "Local Shipping", ar: "شحن داخلي" } },
        { id: "international-shipping", title: { en: "International Shipping", ar: "شحن دولي" } },
        { id: "customs-clearance", title: { en: "Customs Clearance", ar: "تخليص جمركي" } },
        { id: "warehousing", title: { en: "Warehousing & Storage", ar: "تخزين" } },
        { id: "car-towing", title: { en: "Car Towing & Recovery", ar: "سحب سيارات" } },
        { id: "car-mechanic", title: { en: "Car Mechanic", ar: "ميكانيكي سيارات" } },
        { id: "car-electrician", title: { en: "Car Electrician", ar: "كهربائي سيارات" } },
        { id: "mobile-car-wash", title: { en: "Mobile Car Wash", ar: "غسيل سيارات متنقل" } },
        { id: "car-rental", title: { en: "Car Rental", ar: "تأجير سيارات" } },
        { id: "car-sales", title: { en: "Car Sales & Trading", ar: "بيع وشراء سيارات" } }
    ],
    "tech-programming": [
        { id: "cybersecurity", title: { en: "Cybersecurity", ar: "الأمن السيبراني" } },
        { id: "ui-ux", title: { en: "UI/UX Design", ar: "UI/UX" } },
        { id: "web-design", title: { en: "Web Design", ar: "تصميم مواقع" } },
        { id: "app-development", title: { en: "App Development", ar: "تطوير تطبيقات" } },
        { id: "programming", title: { en: "Programming", ar: "برمجة" } },
        { id: "computer-maintenance", title: { en: "Computer Repair & Maintenance", ar: "صيانة الكمبيوتر" } },
        { id: "phone-maintenance", title: { en: "Phone Repair", ar: "صيانة هواتف" } },
        { id: "network-installation", title: { en: "Network Installation", ar: "تركيب شبكات" } },
        { id: "artificial-intelligence", title: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" } },
        { id: "digital-marketing", title: { en: "Digital Marketing", ar: "التسويق الإلكتروني" } },
        { id: "social-media-management", title: { en: "Social Media Management", ar: "إدارة صفحات التواصل" } },
        { id: "sponsored-ads", title: { en: "Sponsored Ads & Paid Media", ar: "الإعلانات الممولة" } },
        { id: "seo", title: { en: "SEO", ar: "تحسين محركات البحث" } },
        { id: "content-writing", title: { en: "Content Writing", ar: "كتابة المحتوى" } },
        { id: "e-store-management", title: { en: "E-Store Management", ar: "إدارة المتاجر الإلكترونية" } }
    ],
    "design-creative": [
        { id: "graphic-design", title: { en: "Graphic Design", ar: "تصميم جرافيك" } },
        { id: "logo-design", title: { en: "Logo Design", ar: "تصميم شعارات" } },
        { id: "video-editing", title: { en: "Video Editing & Production", ar: "مونتاج فيديو" } },
        { id: "photography", title: { en: "Photography", ar: "تصوير فوتوغرافي" } },
        { id: "event-photography", title: { en: "Event Photography", ar: "تصوير مناسبات" } },
        { id: "product-photography", title: { en: "Product Photography", ar: "تصوير منتجات" } },
        { id: "creative-writing", title: { en: "Creative Writing", ar: "كتابة محتوى" } },
        { id: "translation", title: { en: "Translation", ar: "ترجمة" } }
    ],
    "business-legal": [
        { id: "lawyers", title: { en: "Lawyers & Legal Services", ar: "محامون" } },
        { id: "legal-consultants", title: { en: "Legal Consultants", ar: "مستشارون قانونيون" } },
        { id: "certified-translation", title: { en: "Certified Translation", ar: "ترجمة محلفة" } },
        { id: "notary-services", title: { en: "Notary Public Services", ar: "خدمات كتاب العدل" } },
        { id: "company-registration", title: { en: "Company Registration", ar: "تسجيل شركات" } },
        { id: "accountants", title: { en: "Accountants", ar: "محاسبون" } },
        { id: "financial-advisors", title: { en: "Financial Advisors", ar: "مستشارون ماليون" } },
        { id: "business-setup", title: { en: "Business Setup", ar: "تأسيس شركات" } },
        { id: "tax-services", title: { en: "Tax & Auditing", ar: "خدمات ضرائب" } },
        { id: "hr-recruitment", title: { en: "HR & Recruitment", ar: "موارد بشرية" } },
        { id: "business-consulting", title: { en: "Business Consulting", ar: "استشارات أعمال" } }
    ],
    "events-catering": [
        { id: "event-photography-catering", title: { en: "Event Photography", ar: "تصوير حفلات" } },
        { id: "hospitality", title: { en: "Hospitality Services", ar: "ضيافة" } },
        { id: "decorations", title: { en: "Event Decoration", ar: "زينة" } },
        { id: "flower-arrangements", title: { en: "Flower Arrangements", ar: "تنسيق ورد" } },
        { id: "dj-rental", title: { en: "DJ & Sound System Rental", ar: "تأجير DJ" } },
        { id: "event-planning", title: { en: "Event Planning", ar: "تنظيم حفلات" } },
        { id: "wedding-halls", title: { en: "Wedding Halls & Venues", ar: "قاعات أفراح" } },
        { id: "event-equipment-rental", title: { en: "Event Equipment Rental", ar: "معدات" } },
        { id: "home-cooking", title: { en: "Home Cooking", ar: "طبخ منزلي" } },
        { id: "catering", title: { en: "Catering Services", ar: "تموين حفلات" } },
        { id: "sweets-pastries", title: { en: "Sweets & Pastries", ar: "حلويات" } },
        { id: "private-chef", title: { en: "Private Chef", ar: "شيف خاص" } }
    ],
    "healthcare-family": [
        { id: "home-nurse", title: { en: "Home Nursing", ar: "ممرض منزلي" } },
        { id: "physical-therapy", title: { en: "Physical Therapy", ar: "علاج طبيعي" } },
        { id: "elderly-care", title: { en: "Elderly Care", ar: "رعاية كبار السن" } },
        { id: "childcare", title: { en: "Childcare & Babysitting", ar: "رعاية أطفال" } },
        { id: "home-doctor", title: { en: "Home Doctor", ar: "طبيب منزلي" } },
        { id: "psychological-services", title: { en: "Psychological Support", ar: "خدمات نفسية" } },
        { id: "child-nursery", title: { en: "Child Nursery", ar: "حضانة أطفال" } },
        { id: "nanny", title: { en: "Nanny Services", ar: "جليسة أطفال" } },
        { id: "special-needs-care", title: { en: "Special Needs Care", ar: "رعاية ذوي الاحتياجات الخاصة" } },
        { id: "personal-trainer", title: { en: "Personal Trainer", ar: "مدرب شخصي" } }
    ],
    "education-training": [
        { id: "private-tutoring", title: { en: "Private Tutoring", ar: "دروس خصوصية" } },
        { id: "online-tutors", title: { en: "Online Tutors", ar: "مدرسون أونلاين" } },
        { id: "language-teaching", title: { en: "Language Learning", ar: "تعليم اللغات" } },
        { id: "programming-courses", title: { en: "Coding Courses", ar: "دورات برمجة" } },
        { id: "design-courses", title: { en: "Design Courses", ar: "دورات تصميم" } },
        { id: "vocational-training", title: { en: "Vocational Training", ar: "تدريب مهني" } },
        { id: "university-prep", title: { en: "University Prep", ar: "تحضير جامعي" } },
        { id: "music-teaching", title: { en: "Music Teaching", ar: "تعليم الموسيقى" } },
        { id: "driving-learning", title: { en: "Driving School", ar: "تعليم قيادة السيارات" } }
    ],
    "personal-care-beauty": [
        { id: "women-salons", title: { en: "Women's Salons", ar: "صالونات نسائية" } },
        { id: "men-salons", title: { en: "Barber Shops & Men's Salons", ar: "صالونات رجالية" } },
        { id: "makeup", title: { en: "Makeup Artistry", ar: "مكياج" } },
        { id: "home-barber", title: { en: "Home Barber", ar: "حلاقة منزلية" } },
        { id: "skincare", title: { en: "Skincare & Beauty", ar: "عناية بالبشرة" } },
        { id: "fashion-photography", title: { en: "Fashion Photography", ar: "تصوير أزياء" } }
    ],
    "pets-animal-care": [
        { id: "vet", title: { en: "Veterinary Services", ar: "طبيب بيطري" } },
        { id: "pet-training", title: { en: "Pet Training", ar: "تدريب الحيوانات" } },
        { id: "pet-care", title: { en: "Pet Grooming & Care", ar: "رعاية الحيوانات" } },
        { id: "pet-supplies", title: { en: "Pet Supplies & Shop", ar: "بيع مستلزمات الحيوانات" } }
    ],
    "security-smart-systems": [
        { id: "cctv", title: { en: "CCTV Cameras & Installation", ar: "كاميرات مراقبة" } },
        { id: "alarm-systems", title: { en: "Alarm Systems", ar: "أنظمة إنذار" } },
        { id: "security-guards", title: { en: "Security Guards", ar: "حراس أمن" } },
        { id: "smart-locks", title: { en: "Smart Locks & Automation", ar: "أقفال ذكية" } }
    ]
};

// Maps old category slugs and old subcategory slugs to new active slugs
const categoryMapping: Record<string, { parentSlug: string; subSlug?: string }> = {
    // Old main categories mapping to new main categories & fallback subcategories
    'ac': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'electrical': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'plumbing': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'carpentry': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'construction': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'cleaning': { parentSlug: 'home-maintenance', subSlug: 'home-cleaning' },
    'moving': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'it': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'digital': { parentSlug: 'tech-programming', subSlug: 'web-design' },
    'business': { parentSlug: 'business-legal', subSlug: 'business-consulting' },
    'design': { parentSlug: 'design-creative', subSlug: 'graphic-design' },

    // Old subcategories
    'ac-install': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'ac-repair': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'ac-maintenance': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'central-ac': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'heating-repair': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'focus-area-ac': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'thermostat': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'gas-refill': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'hvac-inspection': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },
    'hvac': { parentSlug: 'home-maintenance', subSlug: 'ac-services' },

    'wiring': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'electrical-repair': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'lighting': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'generator-install': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'generator-maint': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'solar-install': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'solar-maint': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'panel-install': { parentSlug: 'home-maintenance', subSlug: 'electrician' },
    'backup-power': { parentSlug: 'home-maintenance', subSlug: 'electrician' },

    'leak-repair': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'pipe-install': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'water-heater-install': { parentSlug: 'home-maintenance', subSlug: 'appliance-repair' },
    'water-heater-repair': { parentSlug: 'home-maintenance', subSlug: 'appliance-repair' },
    'bathroom-plumbing': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'kitchen-plumbing': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'drain-cleaning': { parentSlug: 'home-maintenance', subSlug: 'plumber' },
    'water-tank-install': { parentSlug: 'home-maintenance', subSlug: 'tank-cleaning' },
    'pump-install': { parentSlug: 'home-maintenance', subSlug: 'plumber' },

    'custom-furniture': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'door-install': { parentSlug: 'home-maintenance', subSlug: 'aluminum-glass' },
    'kitchen-cabinets': { parentSlug: 'home-maintenance', subSlug: 'kitchen-install' },
    'wardrobes': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'wood-flooring': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'pergolas': { parentSlug: 'home-maintenance', subSlug: 'gardening' },
    'office-furniture': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'furniture-repair': { parentSlug: 'home-maintenance', subSlug: 'carpenter' },
    'interior-design-service': { parentSlug: 'real-estate-construction', subSlug: 'interior-design' },
    'landscape': { parentSlug: 'home-maintenance', subSlug: 'gardening' },
    '3d-visual': { parentSlug: 'real-estate-construction', subSlug: 'interior-design' },
    'interior-design': { parentSlug: 'real-estate-construction', subSlug: 'interior-design' },

    'general-contractor': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'home-renovation': { parentSlug: 'real-estate-construction', subSlug: 'home-renovation' },
    'kitchen-reno': { parentSlug: 'real-estate-construction', subSlug: 'home-renovation' },
    'bathroom-reno': { parentSlug: 'real-estate-construction', subSlug: 'home-renovation' },
    'tile-install': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'flooring': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'gypsum': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'painting': { parentSlug: 'home-maintenance', subSlug: 'painter' },
    'roofing': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'concrete': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },
    'structural': { parentSlug: 'real-estate-construction', subSlug: 'contracting' },

    'home-cleaning': { parentSlug: 'home-maintenance', subSlug: 'home-cleaning' },
    'deep-cleaning': { parentSlug: 'home-maintenance', subSlug: 'carpet-cleaning' },
    'office-cleaning': { parentSlug: 'home-maintenance', subSlug: 'office-cleaning' },
    'post-construction': { parentSlug: 'home-maintenance', subSlug: 'post-construction-cleaning' },
    'carpet-cleaning': { parentSlug: 'home-maintenance', subSlug: 'carpet-cleaning' },
    'sofa-cleaning': { parentSlug: 'home-maintenance', subSlug: 'carpet-cleaning' },
    'window-cleaning': { parentSlug: 'home-maintenance', subSlug: 'window-cleaning' },
    'tank-cleaning': { parentSlug: 'home-maintenance', subSlug: 'tank-cleaning' },
    'disinfection': { parentSlug: 'home-maintenance', subSlug: 'sterilization' },

    'furniture-moving': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'house-moving': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'office-moving': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'packing-services': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'storage-services': { parentSlug: 'automotive-logistics', subSlug: 'warehousing' },
    'equipment-transport': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },
    'local-delivery': { parentSlug: 'automotive-logistics', subSlug: 'personal-driver' },
    'heavy-moving': { parentSlug: 'automotive-logistics', subSlug: 'furniture-moving' },

    'it-support': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'network-install': { parentSlug: 'tech-programming', subSlug: 'network-installation' },
    'server-install': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'server-maint': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'hardware-repair': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'printer-setup': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },
    'cctv-it': { parentSlug: 'security-smart-systems', subSlug: 'cctv' },
    'web-dev': { parentSlug: 'tech-programming', subSlug: 'web-design' },
    'app-dev': { parentSlug: 'tech-programming', subSlug: 'app-development' },
    'digital-marketing': { parentSlug: 'tech-programming', subSlug: 'digital-marketing' },
    'seo': { parentSlug: 'tech-programming', subSlug: 'seo' },
    'it-technology': { parentSlug: 'tech-programming', subSlug: 'computer-maintenance' },

    'accounting-service': { parentSlug: 'business-legal', subSlug: 'accountants' },
    'tax-consult': { parentSlug: 'business-legal', subSlug: 'tax-services' },
    'company-reg': { parentSlug: 'business-legal', subSlug: 'company-registration' },
    'business-consult': { parentSlug: 'business-legal', subSlug: 'business-consulting' },
    'accounting': { parentSlug: 'business-legal', subSlug: 'accountants' },

    'legal-consult': { parentSlug: 'business-legal', subSlug: 'lawyers' },
    'contracts': { parentSlug: 'business-legal', subSlug: 'lawyers' },

    'branding': { parentSlug: 'design-creative', subSlug: 'logo-design' },
    'social-media': { parentSlug: 'tech-programming', subSlug: 'social-media-management' },
    'content-creation': { parentSlug: 'design-creative', subSlug: 'creative-writing' },
    'graphic-design': { parentSlug: 'design-creative', subSlug: 'graphic-design' },
    'video-production': { parentSlug: 'design-creative', subSlug: 'video-editing' },
    'translation': { parentSlug: 'design-creative', subSlug: 'translation' },
    'photography': { parentSlug: 'design-creative', subSlug: 'photography' },
    'architecture': { parentSlug: 'real-estate-construction', subSlug: 'architect' },
    'marketing': { parentSlug: 'tech-programming', subSlug: 'digital-marketing' }
};

async function main() {
    console.log('⚡ MASTER SEEDING & MIGRATION STARTED...');

    // 1. Fetch all existing categories (before deactivating)
    const oldCategories = await prisma.category.findMany();
    const oldCategoriesMap = new Map(oldCategories.map(c => [c.id, c.slug]));
    console.log(`Loaded ${oldCategories.length} categories currently in database.`);

    // 2. Upsert the 12 new main categories
    console.log('🌱 Upserting 12 new main categories...');
    const parentSlugToIdMap: Record<string, string> = {};

    for (const cat of newCategories) {
        const seededCat = await prisma.category.upsert({
            where: { slug: cat.id },
            update: {
                name: cat.label.en,
                nameEn: cat.label.en,
                nameAr: cat.label.ar,
                icon: cat.icon,
                iconName: cat.iconName,
                sortOrder: cat.sortOrder,
                isActive: true,
                isFeatured: true,
                parentId: null
            },
            create: {
                slug: cat.id,
                name: cat.label.en,
                nameEn: cat.label.en,
                nameAr: cat.label.ar,
                icon: cat.icon,
                iconName: cat.iconName,
                sortOrder: cat.sortOrder,
                isActive: true,
                isFeatured: true,
            }
        });
        parentSlugToIdMap[cat.id] = seededCat.id;
    }

    // 3. Upsert the subcategories under the 12 main categories
    console.log('🌱 Upserting subcategories...');
    const subSlugToIdMap: Record<string, string> = {};

    for (const [parentSlug, subs] of Object.entries(newSubcategories)) {
        const parentId = parentSlugToIdMap[parentSlug];
        if (!parentId) continue;

        for (const sub of subs) {
            const seededSub = await prisma.category.upsert({
                where: { slug: sub.id },
                update: {
                    name: sub.title.en,
                    nameEn: sub.title.en,
                    nameAr: sub.title.ar,
                    parentId: parentId,
                    isActive: true,
                    isFeatured: false,
                },
                create: {
                    slug: sub.id,
                    name: sub.title.en,
                    nameEn: sub.title.en,
                    nameAr: sub.title.ar,
                    parentId: parentId,
                    isActive: true,
                    isFeatured: false,
                }
            });
            subSlugToIdMap[sub.id] = seededSub.id;
        }
    }

    // 4. Migrate the 583 requests to point to the new categories/subcategories
    console.log('📦 Migrating service requests to the new categories structure...');
    const allRequests = await prisma.serviceRequest.findMany();
    let migratedCount = 0;
    const activeMainCategorySlugs = newCategories.map(c => c.id);

    for (const req of allRequests) {
        // Resolve request's current category slug
        const oldCategorySlug = oldCategoriesMap.get(req.categoryId);
        if (!oldCategorySlug) {
            console.warn(`⚠️ Could not find old category slug for request "${req.title}" (ID: ${req.id})`);
            continue;
        }

        // If it's already one of the new main categories, map subcategories or keep
        if (activeMainCategorySlugs.includes(oldCategorySlug)) {
            let newSubId = req.subcategoryId;
            const subSlug = req.subcategoryId ? oldCategoriesMap.get(req.subcategoryId) : null;
            if (subSlug && subSlugToIdMap[subSlug]) {
                newSubId = subSlugToIdMap[subSlug];
            }
            await prisma.serviceRequest.update({
                where: { id: req.id },
                data: {
                    categoryId: req.categoryId,
                    subcategoryId: newSubId
                }
            });
            migratedCount++;
            continue;
        }

        // Look up mapping
        const mapping = categoryMapping[oldCategorySlug];
        if (!mapping) {
            console.warn(`⚠️ No mapping found for old category slug "${oldCategorySlug}". Falling back to home-maintenance.`);
            // Fallback
            const fallbackParentId = parentSlugToIdMap['home-maintenance'];
            const fallbackSubId = subSlugToIdMap['ac-services'];
            await prisma.serviceRequest.update({
                where: { id: req.id },
                data: { categoryId: fallbackParentId, subcategoryId: fallbackSubId }
            });
            continue;
        }

        const newParentId = parentSlugToIdMap[mapping.parentSlug];
        const newSubId = mapping.subSlug ? subSlugToIdMap[mapping.subSlug] : null;

        if (!newParentId) {
            console.error(`🚨 New parent ID not found for slug "${mapping.parentSlug}"`);
            continue;
        }

        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: {
                categoryId: newParentId,
                subcategoryId: newSubId
            }
        });
        migratedCount++;
    }

    console.log(`✅ Successfully mapped & migrated ${migratedCount}/${allRequests.length} Service Requests.`);

    // 5. Deactivate all categories and subcategories that are NOT in the active lists
    console.log('🧹 Cleaning up: deactivating old unused categories...');
    const activeSubcategorySlugs = Object.values(newSubcategories).flatMap(subs => subs.map(s => s.id));
    const allActiveSlugs = [...activeMainCategorySlugs, ...activeSubcategorySlugs];

    const deactivateResult = await prisma.category.updateMany({
        where: {
            slug: {
                notIn: allActiveSlugs
            }
        },
        data: {
            isActive: false,
            isFeatured: false
        }
    });

    console.log(`Deactivated ${deactivateResult.count} old category records in the database.`);
    console.log('🎉 CATEGORY SEEDING & REQUEST MIGRATION SUCCESSFULLY COMPLETE!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
