import { prisma } from '../src/lib/prisma';

interface DraftArticle {
  slug: string;
  title: string;
  titleAr: string;
  metaDescription: string;
  metaKeywords: string;
  isPublished: boolean;
  contentAr: string;
}

const draftArticles: DraftArticle[] = [
  // Article 1: Electrician in Damascus (PUBLISH BATCH 1)
  {
    slug: 'electrician-damascus-guide',
    title: 'Damascus Electrician Guide',
    titleAr: 'دليل اختيار أفضل كهربائي في دمشق: النصائح والتكاليف وشروط الأمان',
    metaDescription: 'دليل شامل لاختيار فني كهربائي موثوق في دمشق. تعرف على أعطال الكهرباء الشائعة، نصائح الأمان، وأنظمة الإينفرتر وكيفية الحصول على أفضل عروض الأسعار عبر وسيط.',
    metaKeywords: 'كهربائي دمشق, صيانة كهرباء دمشق, فني كهرباء المزة, صيانة قواطع كهربائية دمشق, تركيب اينفرتر دمشق',
    isPublished: true, // PUBLISHED IN BATCH 1
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="فني صيانة كهربائية وتمديدات منزلية في دمشق - وسيط" 
          title="فني كهربائي موثوق في دمشق"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          فحص وتمديد الشبكات الكهربائية وأنظمة الحماية في أحياء دمشق
        </figcaption>
      </figure>

      <h2>مقدمة عن خدمات الكهرباء والصيانة في مدينة دمشق</h2>
      <p>تعتبر أعمال الكهرباء والصيانة المنزلية من أهم الخدمات الأساسية التي يحتاجها كل منزل ومؤسسة تجارية في دمشق. نظرًا لطبيعة الشبكات الكهربائية وأهمية الأمان والسلامة، ينبغي دائمًا الاستعانة بـ فنيين كهربائيين موثوقين ومكتسبي الخبرة الكافية في أحياء دمشق المختلفة مثل المزة، المالكي، جرمانا، دمر، كفرسوسة، والصالحية.</p>
      
      <h2>أبرز الأعطال الكهربائية الشائعة وكيفية التعامل معها في دمشق</h2>
      <p>تواجه المباني السكنية والتجارية في دمشق عدة تحديات كهربائية شائعة تتطلب تدخلاً متخصصاً:</p>
      <ul>
        <li><strong>أعطال القواطع والتابلوهات الرئيسية:</strong> احتراق القواطع نتيجة الأحمال الزائدة أو قدم التمديدات الجدارية.</li>
        <li><strong>تذبذب التيار الكهربائي:</strong> حاجة الأجهزة المنزلية الحساسة لتركيب منظمات جهد (Stablizers) وحمايات مناسبة.</li>
        <li><strong>تأسيس أنظمة الإينفرتر والإنارة البديلة:</strong> تركيب شبكات إينفرتر وشواحن بطاريات طاقة بديلة بطريقة آمنة تضمن توزيع الأحمال بشكل متوازن ومحمي.</li>
        <li><strong>أعطال التمديدات الجدارية المخفية:</strong> حدوث ماس كهربائي داخلي يتطلب استخدام أجهزة كشف الأعطال الحديثة دون الحاجة للتكسير العشوائي.</li>
      </ul>

      <h2>قائمة فحص السلامة (Checklist) عند استئجار كهربائي في دمشق</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">قائمة التأكد قبل بدء العمل الكهربائي:</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ التأكد من فصل التيار الكهربائي الرئيسي قبل بدء الصيانة.</li>
          <li>✔ الاتفاق المسبق على تكلفة أجرة اليد وقيمة قطع الغيار المطلوبة.</li>
          <li>✔ استخدام كابلات نحاسية ذات سماكات مناسبة للأحمال العالية (مثل المكيفات والسخانات).</li>
          <li>✔ التأكد من وجود قاطع حماية تفاضلي (Earth Leakage) لحماية الأفراد من الصدمات الكهربائية.</li>
        </ul>
      </div>

      <h2>نصائح اختيار فني كهربائي موثوق في دمشق</h2>
      <p>عند البحث عن فني كهربائي في دمشق، يُنصح باتباع الخطوات التالية لضمان السلامة والجودة:</p>
      <ol>
        <li><strong>التأكد من الخبرة والتأهيل:</strong> الاستفسار عن الأعمال السابقة وفحص تقييمات العملاء السابقين.</li>
        <li><strong>طلب تسعير واضح ومسبق:</strong> الاتفاق الشفاف على التكلفة الكلية لتجنب أي رسوم غير متوقعة.</li>
        <li><strong>الالتزام بمعايير الأمان:</strong> استخدام مواد وقواطع ذات مواصفات قياسية تعتمد معايير السلامة.</li>
      </ol>

      <h2>الأسئلة الشائعة عن خدمات الكهرباء في دمشق</h2>
      <h3>كيف أحصل على عروض أسعار تنافسية لكهربائي في دمشق؟</h3>
      <p>يمكنك نشر طلبك مجانًا على منصة وسيط لتتلقى عروضًا متعددة من فنيين وشركات موثوقة في دمشق ومقارنتها فورًا.</p>

      <h3>هل يقدم الفنيون خدمات صيانة طارئة في كافة أحياء دمشق؟</h3>
      <p>نعم، يغطي مزودو الخدمات المعتمدون في وسيط كافة أحياء دمشق وريفها لإنجاز الأعمال في أسرع وقت.</p>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">هل تحتاج إلى كهربائي موثوق في دمشق؟</h3>
        <p className="text-sm text-muted-foreground my-2">لا تضيع وقتك في البحث. أضف طلبك مجانًا عبر وسيط واستقبل عروض أسعار فورية من فنيين معتمدين.</p>
        <a href="/ar/services/electrician/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">تصفح كهربائيي دمشق عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 2: AC Repair in Damascus (PUBLISH BATCH 1 - REFINED & CLEAR ARABIC)
  {
    slug: 'ac-repair-damascus-guide',
    title: 'Damascus AC Services Guide',
    titleAr: 'دليل صيانة وإصلاح المكيفات في دمشق: كيفية الحفاظ على التبريد وحل الأعطال',
    metaDescription: 'دليل عملي وواضح لصيانة وإصلاح المكيفات في دمشق. تعلم كيفية غسيل الفلاتر، التأكد من غاز الفريون، وحماية المكيف عند عودة التيار الكهربائي مع خبراء وسيط.',
    metaKeywords: 'صيانة تكييف دمشق, تصليح مكيفات دمشق, شحن فريون دمشق, فني تكييف سبليت دمشق, تنظيف مكيفات دمشق',
    isPublished: true, // PUBLISHED IN BATCH 1
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="صيانة وتنظيف مكيفات التكييف والتبريد في دمشق - وسيط" 
          title="صيانة وإصلاح التكييف في دمشق"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          خدمات صيانة وإصلاح المكيفات المنزلية والمكتبية في دمشق
        </figcaption>
      </figure>

      <h2>أسباب ضعف تبريد المكيف في دمشق وكيف تعالجها</h2>
      <p>مع ارتفاع درجات الحرارة خلال فصل الصيف في دمشق، تزداد الحاجة لتأمين تبريد قوي ومستمر من المكيف. إذا كان مكيفك لا يبرد بالشكل المطلوب، فغالباً ما يعود السبب إلى إحدى المشاكل التالية:</p>
      <ul>
        <li><strong>تراكم الغبار على الفلاتر الداخلية:</strong> انسداد الفلاتر يمنع تدفق الهواء بشكل طبيعي ويقلل كفاءة التبريد.</li>
        <li><strong>نقص غاز الفريون:</strong> حدوث تسريب بسيط في أنابيب النحاس يقلل قدرة المكيف على تبريد الهواء.</li>
        <li><strong>اتساخ الوحدة الخارجية:</strong> تراكم الغبار على الكمبريسور والشبك الخارجي يعيق خروج الحرارة.</li>
        <li><strong>مشاكل كهربائية أو ضعف التيار:</strong> انخفاض الفولت يؤثر على دوران الضاغط (الكومبريسور).</li>
      </ul>

      <h2>خطوات بسيطة لتنظيف فلاتر المكيف بالمنزل</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">خطوات العناية الدورية بالمكيف:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. إيقاف تشغيل المكيف وفصل القاطع الكهربائي الخاص به تماماً.</li>
          <li>2. فتح الغطاء الأمامي للوحدة الداخلية وسحب الفلاتر البلاستيكية برفق.</li>
          <li>3. غسيل الفلاتر بالماء الفاتر والصابون الخفيف لإزالة العوالق والأتربة.</li>
          <li>4. ترك الفلاتر تجف بالكامل في مكان مظلل قبل إعادتها إلى المكيف.</li>
        </ol>
      </div>

      <h2>كيف تحمي المكيف من تذبذب التيار الكهربائي؟</h2>
      <p>في العديد من أحياء دمشق، قد يترافق عودة التيار الكهربائي مع فجوة فولت مرتفعة. لحماية المكيف من التلف، يُنصح بما يلي:</p>
      <ul>
        <li>تركيب <strong>مفتاح حماية زمنية (Delay Relay)</strong> يؤخر تشغيل المكيف لمدة 3 إلى 5 دقائق بعد عودة الكهرباء لتثبيت التيار.</li>
        <li>التأكد من سلامة التمديدات والكابلات الموصلة للمكيف وأنها تتحمل قوة الأمبير المطلوبة.</li>
      </ul>

      <h2>الأسئلة الشائعة عن صيانة المكيفات في دمشق</h2>
      <h3>كم مرة يحتاج المكيف للتنظيف والصيانة؟</h3>
      <p>يُنصح بتنظيف الفلاتر مرة كل أسبوعين في الصيف، واستدعاء فني متخصص لغسيل المكيف الشامل وفحص الفريون مرة واحدة بداية كل صيف.</p>

      <h3>كيف أعرف أن المكيف يحتاج إلى شحن فريون؟</h3>
      <p>إذا كان المكيف يعمل والمروحة تدفع الهواء لكن دون تبريد، أو إذا لاحظت تكون طبقة ثلج على أنبوب النحاس الخارجي.</p>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">هل تحتاج إلى فني تكييف موثوق في دمشق؟</h3>
        <p className="text-sm text-muted-foreground my-2">أضف طلبك مجاناً عبر منصة وسيط واستقبل عروض أسعار مباشرة من فنيي التكييف المعتمدين بمدينتك.</p>
        <a href="/ar/services/ac-services/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">طلب صيانة تكييف في دمشق ←</a>
      </div>
    `,
  },

  // Article 3: Business Setup in Damascus (PUBLISH BATCH 1 - TYPO FIXED: وتسجيل)
  {
    slug: 'business-setup-damascus-guide',
    title: 'Damascus Business Setup Guide',
    titleAr: 'دليل تأسيس وتسجيل الشركات في دمشق: الإجراءات القانونية والسجل التجاري',
    metaDescription: 'دليل شامل لتأسيس وتسجيل الشركات والمؤسسات التجارية في دمشق. الخطوات القانونية، استخراج السجل التجاري، والاستشارات القانونية عبر وسيط.',
    metaKeywords: 'تأسيس شركات دمشق, تسجيل شركات دمشق, سجل تجاري دمشق, محامي شركات دمشق, ترخيص شركة دمشق, تأسيس شركة ذ م م دمشق',
    isPublished: true, // PUBLISHED IN BATCH 1
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="تأسيس وتسجيل الشركات والمؤسسات التجارية في دمشق - وسيط" 
          title="تأسيس وتسجيل الشركات والسجل التجاري في دمشق"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          استشارات تأسيس وتسجيل الشركات وحجز الأسماء التجارية في دمشق
        </figcaption>
      </figure>

      <h2>خطوات تأسيس وتسجيل الشركات في دمشق</h2>
      <p>يعتبر تأسيس وتسجيل الشركات في دمشق خطوة استراتيجية هامة لأصحاب الأعمال والمستثمرين. تضمن الاستعانة بالمكاتب والمستشارين القانونيين المعتمدين إنجاز المعاملات بدقة وسرعة وبما يتوافق مع أحكام قانون الشركات السوري.</p>

      <h2>أنواع الشركات التجارية في سوريا والإجراءات</h2>
      <ul>
        <li><strong>الشركات المحدودة المسؤولية (ذ.م.م):</strong> الخيار الأكثر شيوعاً للمشاريع الناشئة والشركات المتوسطة.</li>
        <li><strong>الشركات المساهمة المغفلة:</strong> للمشاريع الكبيرة والتطوير العقاري والاستثماري.</li>
        <li><strong>المؤسسات الفردية:</strong> للمهن الحرة والأعمال الفردية التجارية.</li>
      </ul>

      <h2>خطوات التأسيس والتسجيل القانونية خطوة بخطوة</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">مراحل استخراج السجل التجاري وتسجيل الشركة في دمشق:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. حجز الاسم التجاري لدى وزارة التجارة الداخلية وحماية المستهلك.</li>
          <li>2. تنظيم عقد تأسيس الشركة والنظام الأساسي وتوثيقه لدى الكاتب العدل.</li>
          <li>3. إثبات عقد إيجار موثق أو عقد ملكية للمقر التجاري في دمشق.</li>
          <li>4. فتح حساب بنكي واستيداع رأس المال المطلوب قانوناً.</li>
          <li>5. استخراج السجل التجاري والتسجيل لدى غرفة تجارة دمشق والمالية.</li>
        </ol>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">استشر خبراء تأسيس وتسجيل الشركات في دمشق</h3>
        <p className="text-sm text-muted-foreground my-2">احصل على استشارات قانونية وتنفيذ معاملات التأسيس والتسجيل عبر خبراء معتمدين في وسيط.</p>
        <a href="/ar/services/business-setup/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">خدمات تأسيس الشركات في دمشق ←</a>
      </div>
    `,
  },

  // Article 4: Electrician in Aleppo (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'electrician-aleppo-guide',
    title: 'Aleppo Electrician Guide',
    titleAr: 'دليل فنيي الكهرباء والصيانة المنزلية في حلب: شروط الأمان والسلامة',
    metaDescription: 'دليل شامل لخدمات صيانة الكهرباء والتمديدات المنزلية والصناعية في مدينة حلب. نصائح اختيار الكهربائي الماهر وعروض الأسعار عبر وسيط.',
    metaKeywords: 'كهربائي حلب, صيانة كهرباء حلب, فني كهرباء العزيزية, صيانة طابلوهات حلب',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>خدمات الصيانة الكهربائية في مدينة حلب</h2>
      <p>تتميز مدينة حلب بحركتها الصناعية والتجارية والسكنية النشطة، مما يجعل الطلب على صيانة التمديدات الكهربائية السكنية والصناعية أمرًا حيوياً. سواء كنت في العزيزية، الشهباء، الميريديان، أو الحمدانية، ستحتاج دائماً إلى خدمات كهربائي محترف.</p>

      <h2>أبرز خدمات الصيانة الكهربائية المتاحة في حلب</h2>
      <ul>
        <li>اصلاح وصيانة تابلوهات الكهرباء والقواطع الرئيسية.</li>
        <li>تركيب شبكات الإينفرتر والبطاريات والمولدات وتوزيع الأحمال.</li>
        <li>تمديد الشبكات الكهربائية الجديدة للمنازل والمحلات التجارية.</li>
      </ul>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>تواصل مع أفضل فنيي الكهرباء في حلب</h3>
        <p>استقبل عروض أسعار تنافسية من فنيين معتمدين ومجربين في مدينة حلب.</p>
        <a href="/ar/services/electrician/aleppo" className="btn-primary">تصفح كهربائيي حلب ←</a>
      </div>
    `,
  },

  // Article 5: AC Repair in Aleppo (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'ac-repair-aleppo-guide',
    title: 'Aleppo AC Repair Guide',
    titleAr: 'دليل تركيب وصيانة التكييف في حلب: حلول التبريد الصيفية والتفاصيل الفنية',
    metaDescription: 'دليل خدمات تركيب وصيانة المكيفات في حلب. حلول التبريد، غسيل المكيفات، وإصلاح الكومبريسور بواسطة فنيين موثوقين.',
    metaKeywords: 'صيانة تكييف حلب, تصليح مكيفات حلب, فني مكيفات حلب, غسيل مكيفات حلب',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>صيانة المكيفات في حلب لمواجهة موجات الحر</h2>
      <p>يعتبر التكييف عنصرًا أساسيًا للحفاظ على بيئة مريحة في منازل ومكاتب حلب. تساعد الصيانة الدورية قبل بدء الصيف في تجنب الأعطال المفاجئة وتوفير استهلاك الطاقة.</p>

      <h2>خدمات التكييف المتوفرة في حلب</h2>
      <ul>
        <li>فك وتركيب ونقل المكيفات من موقع لآخر.</li>
        <li>فحص وشحن غاز الفريون المعتمد.</li>
        <li>تنظيف وغسيل الوحدات الداخلية والخارجية.</li>
      </ul>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>أطلب خدمة صيانة تكييف في حلب الآن</h3>
        <p>قارن العروض والأسعار من أفضل ورشات التكييف المعتمدة عبر وسيط.</p>
        <a href="/ar/services/ac-services/aleppo" className="btn-primary">صيانة تكييف في حلب ←</a>
      </div>
    `,
  },

  // Article 6: Home Cleaning in Damascus (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'home-cleaning-damascus-guide',
    title: 'Damascus Home Cleaning Guide',
    titleAr: 'دليل خدمات تنظيف المنازل في دمشق: النظافة الشاملة والتعقيم للمنازل والمكاتب',
    metaDescription: 'دليل شامل لشركات وخدمات تنظيف المنازل في دمشق. تنظيف السجاد، غسيل الكنب، والتنظيف بعد البناء بأعلى جودة عبر وسيط.',
    metaKeywords: 'تنظيف منازل دمشق, شركة تنظيف دمشق, تنظيف سجاد دمشق, تنظيف شقق دمشق',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>خدمات تنظيف المنازل والمكاتب في دمشق</h2>
      <p>تسعى الأسر والشركات في دمشق دائماً للحفاظ على بيئة صحية ونظيفة. توفر شركات التنظيف المعتمدة عبر وسيط خدمات تنظيف دورية وشاملة تشمل الشقق، الفلل، والمكاتب.</p>

      <h2>أنواع خدمات التنظيف المتاحة</h2>
      <ul>
        <li><strong>التنظيف العميق للمنازل:</strong> جلي وتلميع الأرضيات، تنظيف المطابخ والحمامات وتعقيمها.</li>
        <li><strong>تنظيف بعد البناء والإكساء:</strong> إزالة آثار الطلاء والشحوم والأتربة المستعصية.</li>
        <li><strong>غسيل السجاد والكنب بالبخار:</strong> تنظيف المفروشات في الموقع وتجفيفها فوراً.</li>
      </ul>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>احصل على خدمة تنظيف منازل موثوقة في دمشق</h3>
        <p>قارن عروض شركات التنظيف الموثوقة واطلب الخدمة مجاناً.</p>
        <a href="/ar/services/home-cleaning/damascus" className="btn-primary">شركات تنظيف المنازل في دمشق ←</a>
      </div>
    `,
  },

  // Article 7: Painter in Damascus (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'painter-damascus-guide',
    title: 'Damascus Painter Guide',
    titleAr: 'دليل الدهان والديكور الداخلي في دمشق: اختيار أنواع الطلاء والألوان المناسبة',
    metaDescription: 'دليل خدمات الدهان والطلاء والديكور الداخلي في دمشق. اختيار الدهانات الزيتية والبلاستيكية وحل مشاكل الرطوبة مع معلمين دهان موثوقين.',
    metaKeywords: 'دهان دمشق, معلم دهان دمشق, طلاء منازل دمشق, معالجة الرطوبة دمشق',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>أعمال الدهان والطلاء والديكور في دمشق</h2>
      <p>تجديد طلاء المنزل يمنح العقار مظهراً جديداً وقيمة جمالية عالية. يتطلب الدهان الاحترافي اختيار المواد المناسبة وتحضير الجدران بشكل صحيح لمعالجة الرطوبة والتصدعات.</p>

      <h2>خطوات الدهان الناجح</h2>
      <ol>
        <li>معالجة الرطوبة والنش والتقشير في الجدران.</li>
        <li>سحب المعجون وتنعيم الأسطح بالصنفرة.</li>
        <li>تطبيق وجه الأساس (الأساس المائي أو الزيتي).</li>
        <li>تطبيق وجوه الطلاء النهائي باللون المختار.</li>
      </ol>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>ابحث عن معلم دهان ممتاز في دمشق</h3>
        <p>استقبل عروض أسعار من أفضل حرفيي الدهان والديكور عبر منصة وسيط.</p>
        <a href="/ar/services/painter/damascus" className="btn-primary">معلم دهان في دمشق ←</a>
      </div>
    `,
  },

  // Article 8: Company Registration in Syria (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'company-registration-syria-guide',
    title: 'Syria Company Registration Guide',
    titleAr: 'دليل تسجيل الشركات والمؤسسات في سوريا: الشروط والأوراق المطلوبة',
    metaDescription: 'دليل إجراءات تسجيل الشركات والمؤسسات التجارية في سوريا. الشروط القانونية، التكاليف، والأوراق الرسمية المطلوبة.',
    metaKeywords: 'تسجيل شركات سوريا, السجل التجاري سوريا, قانون الشركات سوريا, ترخيص تجاري سوريا',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>التسجيل القانوني للشركات والمؤسسات في سوريا</h2>
      <p>يتطلب بدء النشاط التجاري في سوريا التسجيل السليم وفق أحكام قانون الشركات السوري لحماية الحقوق والالتزام بالأنظمة الضريبية والتجارية.</p>

      <h2>الأوراق والمستندات المطلوبة لتسجيل شركة</h2>
      <ol>
        <li>عقد تأسيس الشركة ونظامها الأساسي.</li>
        <li>إثبات ملكية أو عقد إيجار موثق لمقر الشركة.</li>
        <li>صورة عن الوثائق الشخصية للشركاء والمؤسسين.</li>
        <li>موافقة الجهات التنظيمية والمهنية ذات الصلة.</li>
      </ol>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>تواصل مع مكاتب تسجيل الشركات المعتمدة</h3>
        <p>قارن العروض والخدمات القانونية المتاحة عبر وسيط لتسجيل شركتك بأمان.</p>
        <a href="/ar/services/company-registration/damascus" className="btn-primary">خدمات تسجيل الشركات ←</a>
      </div>
    `,
  },

  // Article 9: Contracting in Aleppo (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'contracting-aleppo-guide',
    title: 'Aleppo Contracting Guide',
    titleAr: 'دليل شركات المقاولات والإكساء في حلب: مراحل البناء والترميم الهندسي',
    metaDescription: 'دليل شركات المقاولات والإكساء والتأهيل الهندسي في حلب. الإشراف الهندسي، حساب التكاليف، والتنفيذ بضمان الجودة عبر وسيط.',
    metaKeywords: 'مقاولات حلب, إكساء حلب, مهندس مدني حلب, ترميم مباني حلب',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>قطاع المقاولات والإكساء الهندسي في حلب</h2>
      <p>تشهد مدينة حلب حركة ترميم وإكساء واسعة للمباني السكنية والتجارية. تضمن الشراكة مع شركات مقاولات ومهندسين مدنيين تنفيذ المشاريع وفق المخططات الهندسية المعتمدة.</p>

      <h2>مراحل تنفيذ أعمال المقاولات والإكساء</h2>
      <ul>
        <li>دراسة المخططات المعمارية والإنشائية وحساب كميات المواد.</li>
        <li>أعمال الهيكل والعظم وتدعيم المنشآت.</li>
        <li>أعمال الإكساء الداخلي والخارجي (الكهرباء، السباكة، اللياسة، والدهان).</li>
      </ul>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>ابحث عن أفضل شركات المقاولات في حلب</h3>
        <p>استقبل عروض أسعار للمشاريع الهندسية والإكساء من شركات معتمدة في حلب.</p>
        <a href="/ar/services/contracting/aleppo" className="btn-primary">شركات المقاولات في حلب ←</a>
      </div>
    `,
  },

  // Article 10: Airport Driver in Damascus (KEEP AS DRAFT - BATCH 2)
  {
    slug: 'airport-driver-damascus-guide',
    title: 'Damascus Airport Driver Guide',
    titleAr: 'دليل خدمة توصيل مطار دمشق الدولي: الحجز والراحة والسلامة في التنقل',
    metaDescription: 'دليل خدمات التوصيل والمقعد الخاص لمطار دمشق الدولي. الحجز المسبق، الراحة، والسلامة مع سائقين موثوقين وسيارات حديثة.',
    metaKeywords: 'توصيل مطار دمشق, سائق مطار دمشق, تكسي مطار دمشق, توصيل المطار دمشق',
    isPublished: false, // DRAFT MODE
    contentAr: `
      <h2>خدمات التوصيل والنقل لمطار دمشق الدولي</h2>
      <p>سواء كنت قادماً إلى سوريا أو مغادراً عبر مطار دمشق الدولي، فإن حجز سائق خاص مسبقاً يوفر عليك عناء الانتظار ويضمن وصولك في الوقت المحدد بآمان وراحة.</p>

      <h2>مزايا حجز سائق توصيل المطار عبر وسيط</h2>
      <ul>
        <li>الالتزام التام بالمواعيد والاستقبال في صالة الوصول.</li>
        <li>سيارات حديثة ومكيفة تتناسب مع عدد المسافرين وحقائب السفر.</li>
        <li>أسعار محددة ومسبقة دون أي تكاليف إضافية غير متوقعة.</li>
      </ul>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6">
        <h3>احجز توصيل مطار دمشق الآن</h3>
        <p>تواصل مع سائقين موثوقين واحجز رحلتك للمطار بكل سهولة وسرعة.</p>
        <a href="/ar/services/airport-driver/damascus" className="btn-primary">توصيل مطار دمشق عبر وسيط ←</a>
      </div>
    `,
  },
];

async function seedDraftArticles() {
  console.log('--- UPSERTING REFINED BATCH 1 ARTICLES (CORRECTED TITLES & ARABIC QUALITY) ---');

  for (const article of draftArticles) {
    try {
      await prisma.cMSPage.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          titleAr: article.titleAr,
          content: article.contentAr,
          contentAr: article.contentAr,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          isPublished: article.isPublished,
        },
        create: {
          slug: article.slug,
          title: article.title,
          titleAr: article.titleAr,
          content: article.contentAr,
          contentAr: article.contentAr,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          isPublished: article.isPublished,
        },
      });
      console.log(`[UPSERTED REFINED]: ${article.slug} -> title: ${article.titleAr}`);
    } catch (err) {
      console.error(`Error upserting article ${article.slug}:`, err);
    }
  }

  console.log('\nSUCCESS! Refined title typos & updated AC guide to crystal-clear Syrian Arabic.');
}

seedDraftArticles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
