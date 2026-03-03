const fs = require('fs');

try {
    const arData = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));

    if (!arData.company_dashboard) arData.company_dashboard = {};

    arData.company_dashboard.title = "لوحة تحكم الشركة";
    arData.company_dashboard.welcome = "مرحباً بعودتك، {name}";
    arData.company_dashboard.upgradePlan = "ترقية الخطة";
    arData.company_dashboard.editProfile = "تعديل الملف الشخصي";
    arData.company_dashboard.retry = "إعادة المحاولة";
    arData.company_dashboard.loadFailed = "فشل تحميل بيانات لوحة التحكم";
    arData.company_dashboard.noData = "فشل تحميل بيانات لوحة التحكم";

    if (!arData.company_dashboard.membership) arData.company_dashboard.membership = {};
    arData.company_dashboard.membership.planActive = "خطة {plan} نشطة";
    arData.company_dashboard.membership.expiresOn = "تنتهي في {date}";
    arData.company_dashboard.membership.active = "نشط";
    arData.company_dashboard.membership.noMembership = "لا توجد عضوية نشطة";
    arData.company_dashboard.membership.upgradeDescription = "قم بالترقية للوصول إلى الميزات المتميزة";
    arData.company_dashboard.membership.viewPlans = "عرض الخطط";

    if (!arData.company_dashboard.stats) arData.company_dashboard.stats = {};
    arData.company_dashboard.stats.totalProjects = "إجمالي المشاريع";
    arData.company_dashboard.stats.activeProjects = "المشاريع النشطة";
    arData.company_dashboard.stats.completed = "مكتملة";
    arData.company_dashboard.stats.totalOffers = "إجمالي العروض";
    arData.company_dashboard.stats.rating = "التقييم";
    arData.company_dashboard.stats.basedOnReviews = "بناءً على {count} تقييم";
    arData.company_dashboard.stats.offerSuccessRate = "معدل نجاح العروض";
    arData.company_dashboard.stats.accepted = "مقبولة: {count}";
    arData.company_dashboard.stats.pending = "قيد الانتظار: {count}";
    arData.company_dashboard.stats.acceptanceRate = "معدل القبول {rate}%";
    arData.company_dashboard.stats.noOffers = "لا توجد عروض بعد";

    if (!arData.company_dashboard.recent) arData.company_dashboard.recent = {};
    arData.company_dashboard.recent.recentProjects = "المشاريع الأخيرة";
    arData.company_dashboard.recent.recentOffers = "العروض الأخيرة";
    arData.company_dashboard.recent.viewAll = "عرض الكل";
    arData.company_dashboard.recent.noProjects = "لا توجد مشاريع بعد";
    arData.company_dashboard.recent.noOffers = "لا توجد عروض بعد";
    arData.company_dashboard.recent.client = "العميل: {name}";

    if (!arData.company_dashboard.browse) arData.company_dashboard.browse = {};
    arData.company_dashboard.browse.title = "تصفح الطلبات";
    arData.company_dashboard.browse.subtitle = "ابحث عن طلبات الخدمة لتقديم عروض";
    arData.company_dashboard.browse.searchPlaceholder = "البحث في الطلبات بالعنوان، الوصف...";
    arData.company_dashboard.browse.noResults = "لم يتم العثور على طلبات مفتوحة";
    arData.company_dashboard.browse.noResultsDesc = "تحقق مرة أخرى لاحقًا للحصول على فرص جديدة";
    arData.company_dashboard.browse.viewDetails = "عرض التفاصيل وتقديم عرض";
    arData.company_dashboard.browse.previous = "السابق";
    arData.company_dashboard.browse.next = "التالي";
    arData.company_dashboard.browse.pageOf = "صفحة {page} من {total}";

    if (!arData.company_dashboard.offers) arData.company_dashboard.offers = {};
    arData.company_dashboard.offers.title = "عروضي";
    arData.company_dashboard.offers.subtitle = "تتبع العروض التي قدمتها";
    arData.company_dashboard.offers.all = "الكل";
    arData.company_dashboard.offers.noOffers = "لا توجد عروض بعد";
    arData.company_dashboard.offers.noOffersDesc = "تصفح الطلبات للبدء في تقديم العروض";
    arData.company_dashboard.offers.browseRequests = "تصفح الطلبات";
    arData.company_dashboard.offers.untitledRequest = "طلب بدون عنوان";
    arData.company_dashboard.offers.amount = "المبلغ: ${amount}";
    arData.company_dashboard.offers.duration = "المدة: {days} أيام";
    arData.company_dashboard.offers.loadFailed = "فشل تحميل العروض";

    if (!arData.company_dashboard.reviews) arData.company_dashboard.reviews = {};
    arData.company_dashboard.reviews.title = "مراجعاتي";
    arData.company_dashboard.reviews.subtitle = "مراجعات من عملائك";
    arData.company_dashboard.reviews.averageRating = "متوسط التقييم";
    arData.company_dashboard.reviews.totalReviews = "إجمالي المراجعات";
    arData.company_dashboard.reviews.positiveReviews = "مراجعات إيجابية";
    arData.company_dashboard.reviews.noReviews = "لا توجد مراجعات بعد";
    arData.company_dashboard.reviews.noReviewsDesc = "ستظهر المراجعات بعد اكتمال المشاريع";
    arData.company_dashboard.reviews.anonymous = "مجهول";
    arData.company_dashboard.reviews.project = "المشروع: {title}";

    if (!arData.company_dashboard.profile) arData.company_dashboard.profile = {};
    arData.company_dashboard.profile.title = "ملف الشركة";
    arData.company_dashboard.profile.subtitle = "تحديث معلومات شركتك";
    arData.company_dashboard.profile.basicInfo = "المعلومات الأساسية";
    arData.company_dashboard.profile.companyNameEn = "اسم الشركة (باللغة الإنجليزية)";
    arData.company_dashboard.profile.companyName = "اسم الشركة";
    arData.company_dashboard.profile.description = "الوصف";
    arData.company_dashboard.profile.descriptionPlaceholder = "صف شركتك وخدماتك...";
    arData.company_dashboard.profile.phone = "الهاتف";
    arData.company_dashboard.profile.website = "الموقع الإلكتروني";
    arData.company_dashboard.profile.address = "العنوان";
    arData.company_dashboard.profile.saveChanges = "حفظ التغييرات";
    arData.company_dashboard.profile.updateSuccess = "تم تحديث الملف بنجاح";
    arData.company_dashboard.profile.updateFailed = "فشل تحديث الملف";
    arData.company_dashboard.profile.loadFailed = "فشل تحميل بيانات الشركة";

    fs.writeFileSync('messages/ar.json', JSON.stringify(arData, null, 2), 'utf8');
    console.log("SUCCESS");
} catch (e) {
    console.error("ERROR:", e);
}
