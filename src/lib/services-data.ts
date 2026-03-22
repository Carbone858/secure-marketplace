
import {
    Thermometer, Zap, Droplets, Hammer, Sparkles, Truck,
    Cpu, Globe, Briefcase, Palette, Fan, Building2
} from "lucide-react";

export const categories = [
    { id: "ac", label: { en: "AC & HVAC", ar: "تكييف وتبريد" }, icon: Fan, description: { en: "Cooling, heating, and air quality services", ar: "خدمات التبريد والتدفئة وجودة الهواء" } },
    { id: "electrical", label: { en: "Electrical", ar: "كهرباء" }, icon: Zap, description: { en: "Wiring, lighting, and power solutions", ar: "تمديدات، إنارة، وحلول الطاقة" } },
    { id: "plumbing", label: { en: "Plumbing", ar: "سباكة" }, icon: Droplets, description: { en: "Leaks, pipes, and water systems", ar: "تسربات، أنابيب، وأنظمة مياه" } },
    { id: "carpentry", label: { en: "Carpentry", ar: "نجارة" }, icon: Hammer, description: { en: "Furniture, doors, and woodworks", ar: "أثاث، أبواب، وأعمال خشبية" } },
    { id: "construction", label: { en: "Construction", ar: "مقاولات" }, icon: Building2, description: { en: "Building, renovation, and remodeling", ar: "بناء، ترميم، وتجديد" } },
    { id: "cleaning", label: { en: "Cleaning", ar: "تنظيف" }, icon: Sparkles, description: { en: "Home and office cleaning services", ar: "خدمات تنظيف المنازل والمكاتب" } },
    { id: "moving", label: { en: "Moving", ar: "نقل عفش" }, icon: Truck, description: { en: "Relocation and logistics", ar: "نقل وترحيل" } },
    { id: "it", label: { en: "IT Support", ar: "دعم تقني" }, icon: Cpu, description: { en: "Tech support and networking", ar: "دعم فني وشبكات" } },
    { id: "digital", label: { en: "Digital Services", ar: "خدمات رقمية" }, icon: Globe, description: { en: "Web, app, and marketing", ar: "ويب، تطبيقات، وتسويق" } },
    { id: "business", label: { en: "Business", ar: "أعمال" }, icon: Briefcase, description: { en: "Accounting, legal, and HR", ar: "محاسبة، قانون، وموارد بشرية" } },
    { id: "design", label: { en: "Design", ar: "تصميم" }, icon: Palette, description: { en: "Interior and graphic design", ar: "تصميم داخلي وجرافيك" } },
];

export const subcategories = {
    ac: [
        { id: "ac-install", title: { en: "AC Installation", ar: "تركيب مكيفات" }, img: "/images/discovery/ac-installation.webp" },
        { id: "ac-repair", title: { en: "AC Repair", ar: "صيانة مكيفات" }, img: "/images/discovery/ac-repair.webp" },
        { id: "ac-maintenance", title: { en: "AC Maintenance", ar: "عقود صيانة" }, img: "/images/discovery/ac-maintenance.webp" },
        { id: "central-ac", title: { en: "Central AC Systems", ar: "تكييف مركزي" }, img: "/images/discovery/central-ac-systems.webp" },
    ],
    electrical: [
        { id: "wiring", title: { en: "Electrical Wiring", ar: "تمديدات كهربائية" }, img: "/images/discovery/electrical-wiring.webp" },
        { id: "electrical-repair", title: { en: "Electrical Repairs", ar: "إصلاح أعطال كهرباء" }, img: "/images/discovery/electrical-repairs.webp" },
        { id: "lighting", title: { en: "Lighting Install", ar: "تركيب إنارة" }, img: "/images/discovery/elektriker-installerar-downlights.webp" },
        { id: "solar-install", title: { en: "Solar Panel Install", ar: "تركيب طاقة شمسية" }, img: "/images/discovery/solar-panel-install.webp" },
    ],
    plumbing: [
        { id: "leak-repair", title: { en: "Leak Detection & Repair", ar: "كشف وإصلاح تسربات" }, img: "/images/discovery/leak-detection-repair.webp" },
        { id: "pipe-install", title: { en: "Pipe Installation", ar: "تمديد أنابيب" }, img: "/images/discovery/pipe-installation.webp" },
        { id: "water-heater", title: { en: "Water Heater Services", ar: "خدمات سخان مياه" }, img: "/images/discovery/water-heater-services.webp" },
        { id: "bathroom-plumbing", title: { en: "Bathroom Plumbing", ar: "سباكة حمامات" }, img: "/images/discovery/bathroom-plumbing.webp" },
    ],
    carpentry: [
        { id: "custom-furniture", title: { en: "Custom Furniture", ar: "تفصيل أثاث" }, img: "/images/discovery/custom-furniture.webp" },
        { id: "door-install", title: { en: "Door Services", ar: "صيانة وتركيب أبواب" }, img: "/images/discovery/door-services.webp" },
        { id: "kitchen-cabinets", title: { en: "Kitchen Cabinets", ar: "خزائن مطبخ" }, img: "/images/discovery/kitchen-cabinets.webp" },
        { id: "wardrobes", title: { en: "Bedroom Wardrobes", ar: "خزائن ملابس" }, img: "/images/discovery/bedroom-wardrobes.webp" },
    ],
    construction: [
        { id: "building", title: { en: "Building Construction", ar: "أعمال بناء" }, img: "/images/discovery/building-construction.webp" },
        { id: "home-renovation", title: { en: "House Renovation", ar: "ترميم منازل" }, img: "/images/discovery/house-renovation.webp" },
        { id: "tile-install", title: { en: "Tile Installation", ar: "تركيب بلاط" }, img: "/images/discovery/tile-installation.webp" },
        { id: "painting", title: { en: "Painting Services", ar: "دهانات وديكور" }, img: "/images/discovery/painting-services.webp" },
    ],
    cleaning: [
        { id: "home-cleaning", title: { en: "Home Cleaning", ar: "تنظيف منازل" }, img: "/images/discovery/home-cleaning.webp" },
        { id: "deep-cleaning", title: { en: "Deep Cleaning", ar: "تنظيف عميق" }, img: "/images/discovery/deep-cleaning.webp" },
        { id: "office-cleaning", title: { en: "Office Cleaning", ar: "تنظيف مكاتب" }, img: "/images/discovery/office-cleaning.webp" },
        { id: "window-cleaning", title: { en: "Window Cleaning", ar: "تنظيف واجهات" }, img: "/images/discovery/window-cleaning.webp" },
    ],
    moving: [
        { id: "house-moving", title: { en: "House Moving", ar: "نقل منازل" }, img: "/images/discovery/house-moving.webp" },
        { id: "furniture-moving", title: { en: "Furniture Moving", ar: "نقل أثاث" }, img: "/images/discovery/furniture-moving.webp" },
        { id: "storage", title: { en: "Storage Services", ar: "خدمات تخزين" }, img: "/images/discovery/storage-services.webp" },
        { id: "packing", title: { en: "Packing Services", ar: "تغليف" }, img: "/images/discovery/packing-services.webp" },
    ],
    it: [
        { id: "it-support", title: { en: "IT Support", ar: "دعم فني وتقني" }, img: "/images/discovery/it-support.webp" },
        { id: "networking", title: { en: "Networking", ar: "شبكات" }, img: "/images/discovery/networking.webp" },
        { id: "hardware-fix", title: { en: "Hardware Repair", ar: "صيانة أجهزة" }, img: "/images/discovery/hardware-repair.webp" },
        { id: "cctv", title: { en: "CCTV Systems", ar: "أنظمة مراقبة" }, img: "/images/discovery/cctv-systems.webp" },
    ],
    digital: [
        { id: "web", title: { en: "Web Development", ar: "تطوير مواقع" }, img: "/images/discovery/web-development.webp" },
        { id: "uiux", title: { en: "UI/UX Design", ar: "تصميم واجهات" }, img: "/images/discovery/ui-ux-design.webp" },
        { id: "marketing", title: { en: "Digital Marketing", ar: "تسويق رقمي" }, img: "/images/discovery/digital-marketing.webp" },
        { id: "content", title: { en: "Content Creation", ar: "صناعة محتوى" }, img: "/images/discovery/content-creation.webp" },
    ],
    business: [
        { id: "legal", title: { en: "Legal Services", ar: "خدمات قانونية" }, img: "/images/discovery/legal-services.webp" },
        { id: "accounting", title: { en: "Accounting", ar: "محاسبة" }, img: "/images/discovery/accounting.webp" },
        { id: "consulting", title: { en: "Business Consulting", ar: "استشارات أعمال" }, img: "/images/discovery/business-consulting.webp" },
        { id: "office-setup", title: { en: "Office Setup", ar: "تجهيز مكاتب" }, img: "/images/discovery/office-setup.webp" },
    ],
    design: [
        { id: "interior", title: { en: "Interior Design", ar: "تصميم داخلي" }, img: "/images/discovery/interior-designer.webp" },
        { id: "landscape", title: { en: "Landscape", ar: "تصميم حدائق" }, img: "/images/discovery/landscape.webp" },
        { id: "graphic", title: { en: "Graphic Design", ar: "تصميم جرافيك" }, img: "/images/discovery/graphic-design.webp" },
        { id: "architecture", title: { en: "Architectural Design", ar: "تصميم معماري" }, img: "/images/discovery/architectural-design.webp" },
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
