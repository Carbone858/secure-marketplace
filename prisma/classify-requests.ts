import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryRules = [
    {
        id: "home-maintenance",
        keywords: ["كهربائي", "سباك", "نجار", "دهان", "تكييف", "تنظيف", "حدائق", "غسيل", "حشرات", "plumb", "electr", "paint", "clean", "leak", "carpenter", "ac", "air condition", "pest", "repair", "maintenance", "installation"],
        subs: {
            "electrician": ["كهربائي", "electr", "wiring"],
            "plumber": ["سباك", "plumb", "leak", "pipe"],
            "carpenter": ["نجار", "carpenter", "wood", "furniture"],
            "painter": ["دهان", "paint"],
            "ac-services": ["تكييف", "ac", "air condition", "hvac"],
            "appliance-repair": ["أجهزة", "appliance", "fridge", "washer", "tv"],
            "home-cleaning": ["تنظيف", "cleaning", "clean", "sofa", "carpet"],
            "pest-control": ["حشرات", "pest", "insect"],
            "gardening": ["حدائق", "garden", "landscape", "tree", "irrigation"]
        },
        defaultSub: "ac-services"
    },
    {
        id: "real-estate-construction",
        keywords: ["عقار", "إيجار", "بيع", "بناء", "مقاول", "مهندس", "ديكور", "شقة", "منزل", "real estate", "rent", "buy", "construction", "builder", "architect", "civil", "interior", "decor", "apartment", "house"],
        subs: {
            "home-sales-rentals": ["شقة", "منزل", "بيت", "apartment", "house", "villa", "rent", "sale"],
            "commercial-sales-rentals": ["مكتب", "محلات", "office", "shop", "commercial"],
            "contracting": ["مقاول", "بناء", "construction", "builder", "contractor", "tile", "renovation"],
            "architect": ["معماري", "architect"],
            "civil-engineer": ["مدني", "civil"],
            "interior-design": ["ديكور", "تصميم داخلي", "interior", "decor"]
        },
        defaultSub: "contracting"
    },
    {
        id: "automotive-logistics",
        keywords: ["سائق", "توصيل", "نقل", "شحن", "سيار", "ميكانيك", "مطار", "car", "truck", "ship", "delivery", "driver", "move", "moving", "towing", "tow", "mechanic", "transport"],
        subs: {
            "personal-driver": ["سائق خاص", "driver", "chauffeur"],
            "airport-driver": ["مطار", "airport"],
            "furniture-moving": ["نقل أثاث", "نقل عفش", "moving", "move", "furniture"],
            "local-shipping": ["شحن", "shipping", "local delivery", "delivery"],
            "car-mechanic": ["ميكانيك", "mechanic", "engine"],
            "car-electrician": ["كهرباء سيارات", "car electric"],
            "car-rental": ["تأجير سيارات", "car rental"]
        },
        defaultSub: "personal-driver"
    },
    {
        id: "tech-programming",
        keywords: ["موقع", "تطبيق", "برمج", "كمبيوتر", "شبك", "ذكاء", "تسويق", "سيرفر", "seo", "web", "app", "software", "program", "code", "developer", "computer", "server", "network", "cyber", "security"],
        subs: {
            "cybersecurity": ["أمن سيبراني", "cyber", "security", "hack", "penetration"],
            "ui-ux": ["واجهات", "ui", "ux", "figma"],
            "web-design": ["موقع", "ويب", "web", "nextjs", "react", "html", "wordpress"],
            "app-development": ["تطبيق", "موبايل", "app", "ios", "android", "flutter", "react native"],
            "programming": ["برمجة", "برمج", "software", "python", "javascript", "backend", "api"],
            "computer-maintenance": ["صيانة كمبيوتر", "computer repair", "hardware"],
            "network-installation": ["شبكات", "network", "router", "wifi"],
            "digital-marketing": ["تسويق", "marketing", "social media", "ads", "إعلانات"],
            "seo": ["seo", "محركات البحث", "search engine"]
        },
        defaultSub: "web-design"
    },
    {
        id: "design-creative",
        keywords: ["تصميم", "شعار", "فيديو", "تصوير", "كتابة", "ترجمة", "شاشات", "graphic", "logo", "video", "photo", "write", "translate", "creative", "branding", "editing"],
        subs: {
            "graphic-design": ["تصميم جرافيك", "graphics", "illustrator", "photoshop", "banner"],
            "logo-design": ["شعار", "logo", "identity", "branding"],
            "video-editing": ["فيديو", "مونتاج", "video", "premiere", "after effects", "editor"],
            "photography": ["تصوير", "photo", "camera", "shoot"],
            "creative-writing": ["كتابة", "write", "copywriter", "content"],
            "translation": ["ترجمة", "translate", "translation", "english", "arabic"]
        },
        defaultSub: "graphic-design"
    },
    {
        id: "business-legal",
        keywords: ["محام", "قانون", "محاسب", "شركة", "ضرائب", "استشار", "عقد", "lawyer", "legal", "account", "tax", "audit", "business", "consult", "company", "audit", "contract"],
        subs: {
            "lawyers": ["محام", "قضية", "lawyer", "attorney", "court"],
            "legal-consultants": ["قانوني", "legal", "contracts", "عقد"],
            "certified-translation": ["ترجمة محلفة", "certified translation"],
            "company-registration": ["تسجيل شركة", "incorporation", "register company"],
            "accountants": ["محاسب", "حسابات", "accountant", "bookkeeping"],
            "tax-services": ["ضرائب", "tax", "vat"]
        },
        defaultSub: "business-consulting"
    },
    {
        id: "events-catering",
        keywords: ["حفلة", "حفلات", "ضيافة", "ورد", "dj", "طبخ", "حلويات", "حلو", "طعام", "شيف", "عرس", "خطوبة", "event", "wedding", "catering", "chef", "dj", "party", "flower"],
        subs: {
            "hospitality": ["ضيافة", "hospitality"],
            "decorations": ["زينة", "decoration", "balloons"],
            "flower-arrangements": ["ورد", "flowers"],
            "dj-rental": ["dj", "دي جي", "sound system"],
            "event-planning": ["تنظيم", "planning", "organizing"],
            "home-cooking": ["طبخ منزلي", "home cooking"],
            "catering": ["تموين", "بوفيه", "catering", "buffet"],
            "sweets-pastries": ["حلويات", "sweets", "cake", "pastries"]
        },
        defaultSub: "event-planning"
    },
    {
        id: "healthcare-family",
        keywords: ["ممرض", "علاج", "رعاية", "طفل", "طبيب", "نفس", "جليسة", "مسن", "مدرب", "nurse", "therapy", "care", "baby", "doctor", "psych", "medical", "trainer", "fitness"],
        subs: {
            "home-nurse": ["ممرض", "nurse", "injection"],
            "physical-therapy": ["علاج طبيعي", "therapy", "rehab"],
            "elderly-care": ["كبار السن", "elderly", "old age"],
            "childcare": ["أطفال", "baby", "nanny", "childcare"],
            "home-doctor": ["طبيب منزلي", "doctor", "physician"],
            "personal-trainer": ["مدرب", "trainer", "fitness", "gym"]
        },
        defaultSub: "home-nurse"
    },
    {
        id: "education-training",
        keywords: ["درس", "مدرس", "تعليم", "لغة", "دورة", "تدريب", "موسيقى", "قيادة", "tutor", "teach", "learn", "course", "train", "music", "school", "driving"],
        subs: {
            "private-tutoring": ["دروس خصوصية", "tutor", "math", "physics"],
            "online-tutors": ["أونلاين", "online tutor"],
            "language-teaching": ["لغة", "english", "french", "german", "language"],
            "music-teaching": ["موسيقى", "music", "piano", "guitar"],
            "driving-learning": ["قيادة", "سياقة", "driving"]
        },
        defaultSub: "private-tutoring"
    },
    {
        id: "personal-care-beauty",
        keywords: ["صالون", "مكياج", "حلاقة", "بشرة", "شعر", "جمال", "عروس", "salon", "makeup", "barber", "beauty", "skincare", "hair"],
        subs: {
            "women-salons": ["صالون نسائي", "صالون تجميل", "women salon", "nails"],
            "men-salons": ["صالون رجالي", "حلاقة", "barber", "shave"],
            "makeup": ["مكياج", "makeup"],
            "skincare": ["بشرة", "skincare", "facial"]
        },
        defaultSub: "men-salons"
    },
    {
        id: "pets-animal-care",
        keywords: ["حيوان", "قطة", "كلب", "بيطري", "طعام حيوانات", "pet", "dog", "cat", "vet", "animal"],
        subs: {
            "vet": ["بيطري", "vet", "veterinary"],
            "pet-training": ["تدريب", "train pet", "train dog"],
            "pet-care": ["رعاية حيوانات", "grooming", "pet care"]
        },
        defaultSub: "vet"
    },
    {
        id: "security-smart-systems",
        keywords: ["كاميرا", "إنذار", "حارس", "قفل", "أمن", "cctv", "camera", "alarm", "security", "lock", "surveillance"],
        subs: {
            "cctv": ["كاميرا مراقبة", "cctv", "surveillance", "camera"],
            "alarm-systems": ["إنذار", "alarm", "fire alarm"],
            "security-guards": ["حارس", "حراس", "guards", "security guard"],
            "smart-locks": ["قفل ذكي", "smart lock", "automation"]
        },
        defaultSub: "cctv"
    }
];

async function main() {
    console.log("⚡ Starting requests smart classification...");
    
    // Fetch all active categories
    const categories = await prisma.category.findMany();
    const catsMap: Record<string, string> = {};
    for (const c of categories) {
        catsMap[c.slug] = c.id;
    }
    
    // Fetch all requests
    const requests = await prisma.serviceRequest.findMany();
    console.log(`Loaded ${requests.length} requests from database.`);
    
    let updatedCount = 0;
    
    for (const req of requests) {
        const text = `${req.title} ${req.description}`.toLowerCase();
        
        let bestCatId = "home-maintenance";
        let maxScore = -1;
        let matchedRule: any = null;
        
        for (const rule of categoryRules) {
            let score = 0;
            for (const kw of rule.keywords) {
                if (text.includes(kw.toLowerCase())) {
                    score++;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestCatId = rule.id;
                matchedRule = rule;
            }
        }
        
        // Resolve database category ID
        let categoryDbId = catsMap[bestCatId];
        if (!categoryDbId) {
            categoryDbId = catsMap["home-maintenance"];
            matchedRule = categoryRules[0];
        }
        
        // Match subcategory
        let subSlug: string | null = null;
        if (matchedRule) {
            let maxSubScore = -1;
            let bestSub: string | null = null;
            
            for (const [sId, sKws] of Object.entries(matchedRule.subs)) {
                let sScore = 0;
                for (const kw of sKws as string[]) {
                    if (text.includes(kw.toLowerCase())) {
                        sScore++;
                    }
                }
                if (sScore > maxSubScore) {
                    maxSubScore = sScore;
                    bestSub = sId;
                }
            }
            
            if (bestSub && maxSubScore > 0) {
                subSlug = bestSub;
            } else {
                subSlug = matchedRule.defaultSub;
            }
        }
        
        const subDbId = subSlug ? catsMap[subSlug] : null;
        
        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: {
                categoryId: categoryDbId,
                subcategoryId: subDbId
            }
        });
        updatedCount++;
    }
    
    console.log(`✅ Successfully classified and updated ${updatedCount}/${requests.length} requests in the database!`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
