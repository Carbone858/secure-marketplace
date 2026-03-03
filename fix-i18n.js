const fs = require('fs');

try {
    const enData = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
    const arData = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));

    // Safely clone company_dashboard from EN to AR so NO tags ever render as raw keys
    arData.company_dashboard = JSON.parse(JSON.stringify(enData.company_dashboard));

    // Translate the specific pieces the user saw on the generic dashboard projects
    arData.company_dashboard.projects = {
        "title": "مشاريعي",
        "subtitle": "إدارة مشاريعك الجارية والمقبولة",
        "noProjects": "لا توجد مشاريع بعد",
        "noProjectsDesc": "لم تقم بقبول أي عروض حتى الآن",
        "client": "العميل: {name}",
        "unknown": "غير معروف",
        "messages": "{count} رسائل",
        "files": "{count} ملفات",
        "created": "تاريخ الإنشاء: {date}",
        "viewRequest": "عرض الطلب",
        "messageUser": "مراسلة العميل",
        "loadFailed": "فشل تحميل المشاريع"
    };

    arData.company_dashboard.status = {
        "PENDING": "قيد الانتظار",
        "ACTIVE": "نشط",
        "IN_PROGRESS": "قيد التنفيذ",
        "COMPLETED": "مكتمل",
        "CANCELLED": "ملغى",
        "ON_HOLD": "معلق",
        "ACCEPTED": "مقبول",
        "REJECTED": "مرفوض",
        "WITHDRAWN": "مسحوب",
        "MATCHING": "مطابقة",
        "REVIEWING_OFFERS": "مراجعة العروض",
        "OPEN": "مفتوح"
    };

    // Ensure dashboard_pages exists
    if (!arData.dashboard_pages) arData.dashboard_pages = {};
    if (!enData.dashboard_pages) enData.dashboard_pages = {};

    // Inject the user-side projects dashboard translations as well
    arData.dashboard_pages.projects = {
        "title": "مشاريعي",
        "subtitle": "تتبع مشاريعك النشطة والمكتملة",
        "noProjects": "لا توجد مشاريع بعد",
        "noProjectsDescription": "يتم إنشاء المشاريع عند قبولك لعرض على طلبك",
        "createRequest": "إنشاء طلب",
        "company": "الشركة: ",
        "unknown": "غير معروف",
        "messages": "رسائل",
        "created": "تاريخ الإنشاء: ",
        "toasts": {
            "loadFailed": "فشل تحميل المشاريع"
        }
    };

    enData.dashboard_pages.projects = {
        "title": "My Projects",
        "subtitle": "Track your ongoing service projects",
        "noProjects": "No Projects Found",
        "noProjectsDescription": "You don't have any active projects yet.",
        "createRequest": "Create New Request",
        "company": "Provider: ",
        "unknown": "Unknown",
        "messages": "Messages",
        "created": "Created: ",
        "toasts": {
            "loadFailed": "Failed to load projects"
        }
    };

    fs.writeFileSync('messages/ar.json', JSON.stringify(arData, null, 2), 'utf8');
    fs.writeFileSync('messages/en.json', JSON.stringify(enData, null, 2), 'utf8');
    console.log("SUCCESS");
} catch (e) {
    console.error("ERROR:", e);
}
