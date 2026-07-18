import {
    Wrench, Building2, Car, Laptop, Palette, Briefcase,
    Utensils, Heart, GraduationCap, Scissors, Lock, Dog
} from "lucide-react";

export const categories = [
    { 
        id: "home-maintenance", 
        label: { en: "Home & Maintenance", ar: "صيانة وخدمات المنزل" }, 
        icon: Wrench, 
        description: { en: "Plumbing, electrical, cleaning, and gardening", ar: "سباكة، كهرباء، تنظيف، وتنسيق حدائق" } 
    },
    { 
        id: "real-estate-construction", 
        label: { en: "Real Estate & Construction", ar: "العقارات والإنشاءات" }, 
        icon: Building2, 
        description: { en: "Buy, rent, property management, and contracting", ar: "بيع وإيجار، إدارة العقارات، والمقاولات" } 
    },
    { 
        id: "automotive-logistics", 
        label: { en: "Cars & Transport Services", ar: "السيارات و خدمات النقل" }, 
        icon: Car, 
        description: { en: "Car maintenance, rental, moving, and shipping", ar: "صيانة سيارات، تأجير، نقل أثاث، وشحن" } 
    },
    { 
        id: "tech-programming", 
        label: { en: "Tech & Software", ar: "البرمجيات والتكنولوجيا" }, 
        icon: Laptop, 
        description: { en: "Programming, web development, and tech support", ar: "برمجة، تطوير مواقع، ودعم فني" } 
    },
    { 
        id: "design-creative", 
        label: { en: "Design & Creative", ar: "التصميم والخدمات الإبداعية" }, 
        icon: Palette, 
        description: { en: "Graphic design, photography, and writing", ar: "تصميم جرافيك، تصوير، وكتابة محتوى" } 
    },
    { 
        id: "business-legal", 
        label: { en: "Business & Legal", ar: "الأعمال والخدمات القانونية" }, 
        icon: Briefcase, 
        description: { en: "Legal services, accounting, and consulting", ar: "استشارات قانونية، محاسبة، وإدارة أعمال" } 
    },
    { 
        id: "events-catering", 
        label: { en: "Events & Catering", ar: "الفعاليات والضيافة" }, 
        icon: Utensils, 
        description: { en: "Event planning, catering, and equipment rental", ar: "تنظيم حفلات، تموين طعام، وتأجير معدات" } 
    },
    { 
        id: "healthcare-family", 
        label: { en: "Healthcare & Family", ar: "الرعاية الصحية والأسرة" }, 
        icon: Heart, 
        description: { en: "Home nursing, physical therapy, and childcare", ar: "تمريض منزلي، علاج طبيعي، ورعاية أطفال" } 
    },
    { 
        id: "education-training", 
        label: { en: "Education & Training", ar: "التعليم والتدريب" }, 
        icon: GraduationCap, 
        description: { en: "Private tutoring, online courses, and languages", ar: "دروس خصوصية، دورات تدريبية، ولغات" } 
    },
    { 
        id: "personal-care-beauty", 
        label: { en: "Personal Care & Beauty", ar: "الجمال والعناية الشخصية" }, 
        icon: Scissors, 
        description: { en: "Barbering, makeup, and skincare", ar: "حلاقة منزلية، مكياج، وعناية بالبشرة" } 
    },
    { 
        id: "pets-animal-care", 
        label: { en: "Pets", ar: "الحيوانات الأليفة" }, 
        icon: Dog, 
        description: { en: "Veterinary services, pet training, and care", ar: "طبيب بيطري، تدريب، ورعاية حيوانات" } 
    },
    { 
        id: "security-smart-systems", 
        label: { en: "Security & Smart Systems", ar: "الأمن والأنظمة الذكية" }, 
        icon: Lock, 
        description: { en: "CCTV cameras, alarm systems, and smart locks", ar: "كاميرات مراقبة، أنظمة إنذار، وأقفال ذكية" } 
    }
];

export const subcategories = {
    "home-maintenance": [
        { id: "electrician", title: { en: "Electrician", ar: "كهربائي" }, img: "/images/discovery/electrical-wiring.webp" },
        { id: "plumber", title: { en: "Plumber", ar: "سباك" }, img: "/images/discovery/leak-detection-repair.webp" },
        { id: "carpenter", title: { en: "Carpenter", ar: "نجار" }, img: "/images/discovery/custom-furniture.webp" },
        { id: "painter", title: { en: "Painter", ar: "دهان" }, img: "/images/discovery/painting-services.webp" },
        { id: "ac-services", title: { en: "AC Installation & Repair", ar: "تركيب وصيانة التكييف" }, img: "/images/discovery/ac-repair.webp" },
        { id: "appliance-repair", title: { en: "Home Appliance Repair", ar: "صيانة الأجهزة المنزلية" }, img: "/images/discovery/hardware-repair.webp" },
        { id: "kitchen-install", title: { en: "Kitchen Installation", ar: "تركيب مطبخ" }, img: "/images/discovery/kitchen-cabinets.webp" },
        { id: "aluminum-glass", title: { en: "Aluminum & Glass Work", ar: "تركيب ألمنيوم وزجاج" }, img: "/images/discovery/aluminum-glass.webp" },
        { id: "blacksmith-welder", title: { en: "Blacksmithing & Welding", ar: "حدادة ولحام" }, img: "/images/discovery/building-construction.webp" },
        { id: "roof-insulation", title: { en: "Roof Insulation", ar: "عزل الأسطح" }, img: "/images/discovery/house-renovation.webp" },
        { id: "pest-control", title: { en: "Pest Control", ar: "مكافحة الحشرات" }, img: "/images/discovery/pest-control.webp" },
        { id: "home-cleaning", title: { en: "Home Cleaning", ar: "تنظيف منازل" }, img: "/images/discovery/home-cleaning.webp" },
        { id: "office-cleaning", title: { en: "Office Cleaning", ar: "تنظيف مكاتب" }, img: "/images/discovery/office-cleaning.webp" },
        { id: "carpet-cleaning", title: { en: "Carpet Cleaning", ar: "تنظيف سجاد" }, img: "/images/discovery/carpet-cleaning.webp" },
        { id: "tank-cleaning", title: { en: "Water Tank Cleaning", ar: "تنظيف خزانات" }, img: "/images/discovery/water-heater-services.webp" },
        { id: "window-cleaning", title: { en: "Window & Facade Cleaning", ar: "تنظيف واجهات" }, img: "/images/discovery/window-cleaning.webp" },
        { id: "sterilization", title: { en: "Sterilization", ar: "تعقيم" }, img: "/images/discovery/deep-cleaning.webp" },
        { id: "post-construction-cleaning", title: { en: "Post-Construction Cleaning", ar: "تنظيف بعد البناء" }, img: "/images/discovery/building-construction.webp" },
        { id: "gardening", title: { en: "Gardening & Landscaping", ar: "تنسيق حدائق" }, img: "/images/discovery/gardening.webp" },
        { id: "tree-trimming", title: { en: "Tree Trimming", ar: "قص أشجار" }, img: "/images/discovery/tree-trimming.webp" },
        { id: "irrigation-systems", title: { en: "Irrigation Systems", ar: "تركيب شبكات ري" }, img: "/images/discovery/irrigation-systems.webp" }
    ],
    "real-estate-construction": [
        { id: "home-sales-rentals", title: { en: "Residential Sales & Rentals", ar: "بيع وإيجار منازل" }, img: "/images/discovery/home-sales-rentals.webp" },
        { id: "commercial-sales-rentals", title: { en: "Commercial Sales & Rentals", ar: "بيع وإيجار محلات" }, img: "/images/discovery/commercial-sales-rentals.webp" },
        { id: "land-sales-rentals", title: { en: "Land Sales & Rentals", ar: "بيع وإيجار أراضي" }, img: "/images/discovery/land-sales-rentals.webp" },
        { id: "property-management", title: { en: "Property Management", ar: "إدارة العقارات" }, img: "/images/discovery/property-management.webp" },
        { id: "real-estate-appraisal", title: { en: "Real Estate Appraisal", ar: "التقييم العقاري" }, img: "/images/discovery/real-estate-appraisal.webp" },
        { id: "contracting", title: { en: "Contracting & Construction", ar: "مقاولات" }, img: "/images/discovery/building-construction.webp" },
        { id: "architect", title: { en: "Architect", ar: "مهندس معماري" }, img: "/images/discovery/architectural-design.webp" },
        { id: "civil-engineer", title: { en: "Civil Engineer", ar: "مهندس مدني" }, img: "/images/discovery/civil-engineer.webp" },
        { id: "interior-design", title: { en: "Interior Design & Decor", ar: "ديكور داخلي" }, img: "/images/discovery/interior-designer.webp" },
        { id: "engineering-supervision", title: { en: "Engineering Supervision", ar: "إشراف هندسي" }, img: "/images/discovery/engineering-supervision.webp" },
        { id: "surveyor", title: { en: "Land Surveyor", ar: "مساح أراضي" }, img: "/images/discovery/surveyor.webp" }
    ],
    "automotive-logistics": [
        { id: "personal-driver", title: { en: "Private Driver & Delivery", ar: "خدمات سائق خاص للتوصيل" }, img: "/images/discovery/personal-driver.webp" },
        { id: "airport-driver", title: { en: "Airport Driver", ar: "توصيل للمطار" }, img: "/images/discovery/airport-driver.webp" },
        { id: "furniture-moving", title: { en: "Furniture Moving", ar: "نقل أثاث" }, img: "/images/discovery/furniture-moving.webp" },
        { id: "local-shipping", title: { en: "Local Shipping", ar: "شحن داخلي" }, img: "/images/discovery/packing-services.webp" },
        { id: "international-shipping", title: { en: "International Shipping", ar: "شحن دولي" }, img: "/images/discovery/international-shipping.webp" },
        { id: "customs-clearance", title: { en: "Customs Clearance", ar: "تخليص جمركي" }, img: "/images/discovery/customs-clearance.webp" },
        { id: "warehousing", title: { en: "Warehousing & Storage", ar: "تخزين" }, img: "/images/discovery/storage-services.webp" },
        { id: "car-towing", title: { en: "Car Towing & Recovery", ar: "سحب سيارات" }, img: "/images/discovery/car-towing.webp" },
        { id: "car-mechanic", title: { en: "Car Mechanic", ar: "ميكانيكي سيارات" }, img: "/images/discovery/car-mechanic.webp" },
        { id: "car-electrician", title: { en: "Car Electrician", ar: "كهربائي سيارات" }, img: "/images/discovery/car-electrician.webp" },
        { id: "mobile-car-wash", title: { en: "Mobile Car Wash", ar: "غسيل سيارات متنقل" }, img: "/images/discovery/mobile-car-wash.webp" },
        { id: "car-rental", title: { en: "Car Rental", ar: "تأجير سيارات" }, img: "/images/discovery/car-rental.webp" },
        { id: "car-sales", title: { en: "Car Sales & Trading", ar: "بيع وشراء سيارات" }, img: "/images/discovery/car-sales.webp" }
    ],
    "tech-programming": [
        { id: "cybersecurity", title: { en: "Cybersecurity", ar: "الأمن السيبراني" }, img: "/images/discovery/cybersecurity.webp" },
        { id: "ui-ux", title: { en: "UI/UX Design", ar: "UI/UX" }, img: "/images/discovery/ui-ux-design.webp" },
        { id: "web-design", title: { en: "Web Design", ar: "تصميم مواقع" }, img: "/images/discovery/web-development.webp" },
        { id: "app-development", title: { en: "App Development", ar: "تطوير تطبيقات" }, img: "/images/discovery/app-development.webp" },
        { id: "programming", title: { en: "Programming", ar: "برمجة" }, img: "/images/discovery/programming.webp" },
        { id: "computer-maintenance", title: { en: "Computer Repair & Maintenance", ar: "صيانة الكمبيوتر" }, img: "/images/discovery/hardware-repair.webp" },
        { id: "phone-maintenance", title: { en: "Phone Repair", ar: "صيانة هواتف" }, img: "/images/discovery/phone-maintenance.webp" },
        { id: "network-installation", title: { en: "Network Installation", ar: "تركيب شبكات" }, img: "/images/discovery/networking.webp" },
        { id: "artificial-intelligence", title: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" }, img: "/images/discovery/artificial-intelligence.webp" },
        { id: "digital-marketing", title: { en: "Digital Marketing", ar: "التسويق الإلكتروني" }, img: "/images/discovery/digital-marketing.webp" },
        { id: "social-media-management", title: { en: "Social Media Management", ar: "إدارة صفحات التواصل" }, img: "/images/discovery/content-creation.webp" },
        { id: "sponsored-ads", title: { en: "Sponsored Ads & Paid Media", ar: "الإعلانات الممولة" }, img: "/images/discovery/sponsored-ads.webp" },
        { id: "seo", title: { en: "SEO", ar: "تحسين محركات البحث" }, img: "/images/discovery/seo.webp" },
        { id: "content-writing", title: { en: "Content Writing", ar: "كتابة المحتوى" }, img: "/images/discovery/content-writing.webp" },
        { id: "e-store-management", title: { en: "E-Store Management", ar: "إدارة المتاجر الإلكترونية" }, img: "/images/discovery/e-store-management.webp" }
    ],
    "design-creative": [
        { id: "graphic-design", title: { en: "Graphic Design", ar: "تصميم جرافيك" }, img: "/images/discovery/graphic-design.webp" },
        { id: "logo-design", title: { en: "Logo Design", ar: "تصميم شعارات" }, img: "/images/discovery/logo-design.webp" },
        { id: "video-editing", title: { en: "Video Editing & Production", ar: "مونتاج فيديو" }, img: "/images/discovery/video-editing.webp" },
        { id: "photography", title: { en: "Photography", ar: "تصوير فوتوغرافي" }, img: "/images/discovery/photography.webp" },
        { id: "event-photography", title: { en: "Event Photography", ar: "تصوير مناسبات" }, img: "/images/discovery/event-photography.webp" },
        { id: "product-photography", title: { en: "Product Photography", ar: "تصوير منتجات" }, img: "/images/discovery/product-photography.webp" },
        { id: "creative-writing", title: { en: "Creative Writing", ar: "كتابة محتوى" }, img: "/images/discovery/creative-writing.webp" },
        { id: "translation", title: { en: "Translation", ar: "ترجمة" }, img: "/images/discovery/translation.webp" }
    ],
    "business-legal": [
        { id: "lawyers", title: { en: "Lawyers & Legal Services", ar: "محامون" }, img: "/images/discovery/legal-services.webp" },
        { id: "legal-consultants", title: { en: "Legal Consultants", ar: "مستشارون قانونيون" }, img: "/images/discovery/legal-consultants.webp" },
        { id: "certified-translation", title: { en: "Certified Translation", ar: "ترجمة محلفة" }, img: "/images/discovery/legal-services.webp" },
        { id: "notary-services", title: { en: "Notary Public Services", ar: "خدمات كتاب العدل" }, img: "/images/discovery/notary-services.webp" },
        { id: "company-registration", title: { en: "Company Registration", ar: "تسجيل شركات" }, img: "/images/discovery/company-registration.webp" },
        { id: "accountants", title: { en: "Accountants", ar: "محاسبون" }, img: "/images/discovery/accountants.webp" },
        { id: "financial-advisors", title: { en: "Financial Advisors", ar: "مستشارون ماليون" }, img: "/images/discovery/financial-advisors.webp" },
        { id: "business-setup", title: { en: "Business Setup", ar: "تأسيس شركات" }, img: "/images/discovery/business-setup.webp" },
        { id: "tax-services", title: { en: "Tax & Auditing", ar: "خدمات ضرائب" }, img: "/images/discovery/tax-services.webp" },
        { id: "hr-recruitment", title: { en: "HR & Recruitment", ar: "موارد بشرية" }, img: "/images/discovery/hr-recruitment.webp" },
        { id: "business-consulting", title: { en: "Business Consulting", ar: "استشارات أعمال" }, img: "/images/discovery/business-consulting.webp" }
    ],
    "events-catering": [
        { id: "event-photography-catering", title: { en: "Event Photography", ar: "تصوير مناسبات" }, img: "/images/discovery/event-photography.webp" },
        { id: "hospitality", title: { en: "Hospitality Services", ar: "ضيافة" }, img: "/images/discovery/hospitality.webp" },
        { id: "decorations", title: { en: "Event Decoration", ar: "زينة" }, img: "/images/discovery/decorations.webp" },
        { id: "flower-arrangements", title: { en: "Flower Arrangements", ar: "تنسيق ورد" }, img: "/images/discovery/flower-arrangements.webp" },
        { id: "dj-rental", title: { en: "DJ & Sound System Rental", ar: "تأجير DJ" }, img: "/images/discovery/dj-rental.webp" },
        { id: "event-planning", title: { en: "Event Planning", ar: "تنظيم حفلات" }, img: "/images/discovery/event-planning.webp" },
        { id: "wedding-halls", title: { en: "Wedding Halls & Venues", ar: "قاعات أفراح" }, img: "/images/discovery/wedding-halls.webp" },
        { id: "event-equipment-rental", title: { en: "Event Equipment Rental", ar: "معدات" }, img: "/images/discovery/event-equipment-rental.webp" },
        { id: "home-cooking", title: { en: "Home Cooking", ar: "طبخ منزلي" }, img: "/images/discovery/home-cooking.webp" },
        { id: "catering", title: { en: "Catering Services", ar: "تموين حفلات" }, img: "/images/discovery/catering.webp" },
        { id: "sweets-pastries", title: { en: "Sweets & Pastries", ar: "حلويات" }, img: "/images/discovery/sweets-pastries.webp" },
        { id: "private-chef", title: { en: "Private Chef", ar: "شيف خاص" }, img: "/images/discovery/private-chef.webp" }
    ],
    "healthcare-family": [
        { id: "home-nurse", title: { en: "Home Nursing", ar: "ممرض منزلي" }, img: "/images/discovery/home-nurse.webp" },
        { id: "physical-therapy", title: { en: "Physical Therapy", ar: "علاج طبيعي" }, img: "/images/discovery/physical-therapy.webp" },
        { id: "elderly-care", title: { en: "Elderly Care", ar: "رعاية كبار السن" }, img: "/images/discovery/elderly-care.webp" },
        { id: "childcare", title: { en: "Childcare & Babysitting", ar: "رعاية أطفال" }, img: "/images/discovery/childcare.webp" },
        { id: "home-doctor", title: { en: "Home Doctor", ar: "طبيب منزلي" }, img: "/images/discovery/home-doctor.webp" },
        { id: "psychological-services", title: { en: "Psychological Support", ar: "خدمات نفسية" }, img: "/images/discovery/psychological-services.webp" },
        { id: "child-nursery", title: { en: "Child Nursery", ar: "حضانة أطفال" }, img: "/images/discovery/child-nursery.webp" },
        { id: "nanny", title: { en: "Nanny Services", ar: "جليسة أطفال" }, img: "/images/discovery/nanny.webp" },
        { id: "special-needs-care", title: { en: "Special Needs Care", ar: "رعاية ذوي الاحتياجات الخاصة" }, img: "/images/discovery/special-needs-care.webp" },
        { id: "personal-trainer", title: { en: "Personal Trainer", ar: "مدرب شخصي" }, img: "/images/discovery/personal-trainer.webp" }
    ],
    "education-training": [
        { id: "private-tutoring", title: { en: "Private Tutoring", ar: "دروس خصوصية" }, img: "/images/discovery/private-tutoring.webp" },
        { id: "online-tutors", title: { en: "Online Tutors", ar: "مدرسون أونلاين" }, img: "/images/discovery/online-tutors.webp" },
        { id: "language-teaching", title: { en: "Language Learning", ar: "تعليم اللغات" }, img: "/images/discovery/language-teaching.webp" },
        { id: "programming-courses", title: { en: "Coding Courses", ar: "دورات برمجة" }, img: "/images/discovery/programming-courses.webp" },
        { id: "design-courses", title: { en: "Design Courses", ar: "دورات تصميم" }, img: "/images/discovery/design-courses.webp" },
        { id: "vocational-training", title: { en: "Vocational Training", ar: "تدريب مهني" }, img: "/images/discovery/vocational-training.webp" },
        { id: "university-prep", title: { en: "University Prep", ar: "تحضير جامعي" }, img: "/images/discovery/university-prep.webp" },
        { id: "music-teaching", title: { en: "Music Teaching", ar: "تعليم الموسيقى" }, img: "/images/discovery/music-teaching.webp" },
        { id: "driving-learning", title: { en: "Driving School", ar: "تعليم قيادة السيارات" }, img: "/images/discovery/driving-learning.webp" }
    ],
    "personal-care-beauty": [
        { id: "women-salons", title: { en: "Women's Salons", ar: "صالونات نسائية" }, img: "/images/discovery/women-salons.webp" },
        { id: "men-salons", title: { en: "Barber Shops & Men's Salons", ar: "صالونات رجالية" }, img: "/images/discovery/men-salons.webp" },
        { id: "makeup", title: { en: "Makeup Artistry", ar: "مكياج" }, img: "/images/discovery/makeup.webp" },
        { id: "home-barber", title: { en: "Home Barber", ar: "حلاقة منزلية" }, img: "/images/discovery/home-barber.webp" },
        { id: "skincare", title: { en: "Skincare & Beauty", ar: "عناية بالبشرة" }, img: "/images/discovery/skincare.webp" },
        { id: "fashion-photography", title: { en: "Fashion Photography", ar: "تصوير أزياء" }, img: "/images/discovery/fashion-photography.webp" }
    ],
    "pets-animal-care": [
        { id: "vet", title: { en: "Veterinary Services", ar: "طبيب بيطري" }, img: "/images/discovery/vet.webp" },
        { id: "pet-training", title: { en: "Pet Training", ar: "تدريب الحيوانات" }, img: "/images/discovery/pet-training.webp" },
        { id: "pet-care", title: { en: "Pet Grooming & Care", ar: "رعاية الحيوانات" }, img: "/images/discovery/pet-care.webp" },
        { id: "pet-supplies", title: { en: "Pet Supplies & Shop", ar: "بيع مستلزمات الحيوانات" }, img: "/images/discovery/pet-supplies.webp" }
    ],
    "security-smart-systems": [
        { id: "cctv", title: { en: "CCTV Cameras & Installation", ar: "كاميرات مراقبة" }, img: "/images/discovery/cctv-systems.webp" },
        { id: "alarm-systems", title: { en: "Alarm Systems", ar: "أنظمة إنذار" }, img: "/images/discovery/alarm-systems.webp" },
        { id: "security-guards", title: { en: "Security Guards", ar: "حراس أمن" }, img: "/images/discovery/security-guards.webp" },
        { id: "smart-locks", title: { en: "Smart Locks & Automation", ar: "أقفال ذكية" }, img: "/images/discovery/smart-locks.webp" }
    ],
    default: [
        { id: "residential", title: { en: "Residential", ar: "سكني" }, img: "/images/discovery/house-renovation.webp" },
        { id: "commercial", title: { en: "Commercial", ar: "تجاري" }, img: "/images/discovery/office-setup.webp" },
        { id: "maintenance", title: { en: "Maintenance", ar: "صيانة" }, img: "/images/discovery/home-cleaning.webp" },
        { id: "installation", title: { en: "Installation", ar: "تركيب" }, img: "/images/discovery/ac-installation.webp" },
    ]
};

export const getSubcategories = (categoryId: string) => {
    const data = subcategories[categoryId as keyof typeof subcategories];
    return data || subcategories.default;
};
