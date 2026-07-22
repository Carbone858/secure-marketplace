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
  // Article 1: Electrician in Damascus (PUBLISHED IN BATCH 1)
  {
    slug: 'electrician-damascus-guide',
    title: 'Damascus Electrician Guide',
    titleAr: 'دليل اختيار أفضل كهربائي في دمشق: النصائح والتكاليف وشروط الأمان',
    metaDescription: 'دليل شامل لاختيار فني كهربائي موثوق في دمشق. تعرف على أعطال الكهرباء الشائعة، نصائح الأمان، وأنظمة الإينفرتر وكيفية الحصول على أفضل عروض الأسعار عبر وسيط.',
    metaKeywords: 'كهربائي دمشق, صيانة كهرباء دمشق, فني كهرباء المزة, صيانة قواطع كهربائية دمشق, تركيب اينفرتر دمشق',
    isPublished: true,
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

  // Article 2: AC Repair in Damascus (PUBLISHED IN BATCH 1)
  {
    slug: 'ac-repair-damascus-guide',
    title: 'Damascus AC Services Guide',
    titleAr: 'دليل صيانة وإصلاح المكيفات في دمشق: كيفية الحفاظ على التبريد وحل الأعطال',
    metaDescription: 'دليل عملي وواضح لصيانة وإصلاح المكيفات في دمشق. تعلم كيفية غسيل الفلاتر، التأكد من غاز الفريون، وحماية المكيف عند عودة التيار الكهربائي مع خبراء وسيط.',
    metaKeywords: 'صيانة تكييف دمشق, تصليح مكيفات دمشق, شحن فريون دمشق, فني تكييف سبليت دمشق, تنظيف مكيفات دمشق',
    isPublished: true,
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

  // Article 3: Business Setup in Damascus (PUBLISHED IN BATCH 1)
  {
    slug: 'business-setup-damascus-guide',
    title: 'Damascus Business Setup Guide',
    titleAr: 'دليل تأسيس وتسجيل الشركات في دمشق: الإجراءات القانونية والسجل التجاري',
    metaDescription: 'دليل شامل لتأسيس وتسجيل الشركات والمؤسسات التجارية في دمشق. الخطوات القانونية، استخراج السجل التجاري، والاستشارات القانونية عبر وسيط.',
    metaKeywords: 'تأسيس شركات دمشق, تسجيل شركات دمشق, سجل تجاري دمشق, محامي شركات دمشق, ترخيص شركة دمشق, تأسيس شركة ذ م م دمشق',
    isPublished: true,
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

  // Article 4: Electrician in Aleppo (EXPANDED DRAFT)
  {
    slug: 'electrician-aleppo-guide',
    title: 'Aleppo Electrician Guide',
    titleAr: 'دليل اختيار أفضل كهربائي في حلب: التمديدات وأعطال التابلوهات والأمان',
    metaDescription: 'دليل شامل لاختيار فني كهربائي موثوق في حلب. فحص التمديدات الكهربائية، صيانة قواطع التابلوهات، وربط شبكات الإينفرتر والمولدات في أحياء حلب عبر وسيط.',
    metaKeywords: 'كهربائي حلب, صيانة كهرباء حلب, فني كهرباء العزيزية, صيانة طابلوهات حلب, اينفرتر حلب',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="فني كهربائي وصيانة تمديدات في حلب - وسيط" 
          title="فني كهربائي في حلب"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          صيانة وتمديد الشبكات الكهربائية وقواطع الحماية في أحياء حلب السكنية والصناعية
        </figcaption>
      </figure>

      <h2>خدمات الصيانة الكهربائية في أحياء مدينة حلب</h2>
      <p>تتميز مدينة حلب بحركتها الصناعية والتجارية والسكنية النشطة، مما يجعل الطلب على صيانة التمديدات الكهربائية امراً حيوياً ومستمراً. سواء كنت تقيم في أحياء العزيزية، الشهباء، الميريديان، الحمدانية، السريان، أو الفرقان، فستحتاج دائماً لخدمات فني كهربائي خبير وموثوق.</p>

      <h2>أهم الأعطال الكهربائية في حلب وكيفية التعامل معها</h2>
      <ul>
        <li><strong>أعطال قواطع التابلوهات وتذبذب الفولت:</strong> احتراق القواطع بسبب الأحمال العالية للمولدات والمكيفات.</li>
        <li><strong>تركيب شبكات الإينفرتر والإنارة البديلة:</strong> تمديد خطوط الإينفرتر المستقلة والبطاريات بطريقة آمنة تعزل خطوط الشبكة الرئيسية.</li>
        <li><strong>صيانة خطوط المولدات (الأمبيرات):</strong> ضبط القواطع الأوتوماتيكية لحماية المنظومات عند التحويل بين المولد والكهرباء الرئيسية.</li>
      </ul>

      <h2>قائمة أمان وتأكد قبل الاستعانة بكهربائي في حلب</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">خطوات السلامة الكهربائية المنزلية:</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ فصل التيار الكهربائي الرئيسي بالكامل قبل فحص التابلوه أو الأسلاك.</li>
          <li>✔ التأكد من استخدام أسلاك نحاسية ذات مقاطع معتمدة (مثل 4 ملم للمكيفات وسخانات المياه).</li>
          <li>✔ الاتفاق الشفاف على قيمة القطع وأجرة اليد قبل بدء عملية التمديد أو الإصلاح.</li>
        </ul>
      </div>

      <h2>الأسئلة الشائعة</h2>
      <h3>هل يغطي فنيو الكهرباء كافة مناطق حلب؟</h3>
      <p>نعم، يقدم الفنيون والشركات المعتمدة في وسيط خدمات الصيانة المنزلية والطوارئ لكافة أحياء حلب.</p>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">هل تفتش عن كهربائي موثوق في حلب؟</h3>
        <p className="text-sm text-muted-foreground my-2">أرسل طلبك مجاناً عبر منصة وسيط وقارن عروض أسعار أفضل الفنيين المعتمدين بمدينة حلب.</p>
        <a href="/ar/services/electrician/aleppo" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">تصفح كهربائيي حلب عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 5: AC Repair in Aleppo (EXPANDED DRAFT)
  {
    slug: 'ac-repair-aleppo-guide',
    title: 'Aleppo AC Repair Guide',
    titleAr: 'دليل تركيب وصيانة المكيفات في حلب: التبريد الفعال وإعادة تعبئة غاز التبريد',
    metaDescription: 'دليل خدمات صيانة وتركيب مكيفات الهواء في حلب. حلول التبريد الصيفية، تنظيف الفلاتر، وإعادة تعبئة غاز التبريد مع أفضل الفنيين في حلب.',
    metaKeywords: 'صيانة تكييف حلب, تصليح مكيفات حلب, فني مكيفات حلب, غسيل مكيفات حلب, فريون حلب',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1631545806606-53c4d7d34190?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="تركيب وصيانة مكيفات السبليت والمكيفات المركزية في حلب - وسيط" 
          title="صيانة المكيفات في حلب"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          تركيب وصيانة مكيفات السبليت والمكيفات المركزية
        </figcaption>
      </figure>

      <h2>صيانة المكيفات في حلب لمواجهة درجات الحرارة الصيفية</h2>
      <p>يعتبر المكيف أساسياً لتوفير بيئة مريحة في منازل ومكاتب مدينة حلب. إن إجراء الصيانة الوقائية قبل بدء الصيف يضمن الحفاظ على قدرة التبريد ويقلل من الأعطال المفاجئة واستهلاك الطاقة.</p>

      <h2>أشهر مشاكل المكيفات وكيفية معالجتها في حلب</h2>
      <ul>
        <li><strong>ضعف خروج الهواء البارد:</strong> غالباً ناتج عن انسداد الفلاتر بالأتربة أو نقص الفريون.</li>
        <li><strong>تنقيط الماء داخل الغرفة:</strong> انسداد مجرى خرطوم التصريف الخارجي بالأوساخ.</li>
        <li><strong>ارتفاع صوت الكمبريسور:</strong> حاجة المحرك للتشحيم أو فحص المروحة المكثفة.</li>
      </ul>

      <h2>خطوات الصيانة والغسيل الشامل للمكيف في حلب</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">برنامج العناية بالمكيف:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. غسيل الفلاتر الداخلية وتنظيف الوحدة الخارجية من الأتربة العالقة.</li>
          <li>2. فحص ضغط غاز الفريون والتأكد من خلو المواسير النحاسية من أي تسريب.</li>
          <li>3. تركيب قاطع حماية كهربائية لمواجهة تغيرات الجهد المفاجئة.</li>
        </ol>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">أطلب خدمة صيانة تكييف في حلب الآن</h3>
        <p className="text-sm text-muted-foreground my-2">احصل على عروض أسعار منافسة من ورشات وفنيي التكييف المعتمدين بمدينة حلب.</p>
        <a href="/ar/services/ac-services/aleppo" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">صيانة تكييف في حلب عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 6: Home Cleaning in Damascus (EXPANDED DRAFT)
  {
    slug: 'home-cleaning-damascus-guide',
    title: 'Damascus Home Cleaning Guide',
    titleAr: 'دليل خدمات تنظيف المنازل في دمشق: النظافة الشاملة والتعقيم للمنازل والمكاتب',
    metaDescription: 'دليل كامل لخدمات وشركات تنظيف المنازل في دمشق. تنظيف الشقق، جلي الأرضيات، غسيل السجاد والكنب بالبخار، والتنظيف بعد الإكساء مع خبراء وسيط.',
    metaKeywords: 'تنظيف منازل دمشق, شركة تنظيف دمشق, تنظيف سجاد دمشق, تنظيف شقق دمشق, جلي بلاط دمشق',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="خدمات تنظيف منازل وشقق في دمشق - وسيط" 
          title="تنظيف المنازل والمكاتب في دمشق"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          خدمات النظافة الشاملة للمنازل والشقق والمؤسسات التجارية في دمشق
        </figcaption>
      </figure>

      <h2>خدمات تنظيف المنازل والمكاتب في أحياء دمشق</h2>
      <p>تحرص العائلات والشركات في دمشق على الحفاظ على بيئة صحية ونظيفة دائماً. توفر مكاتب وشركات التنظيف الموثوقة عبر منصة وسيط خدمات تنظيف متكاملة للشقق والفلل والمكاتب في المزة، المالكي، كفرسوسة، دمر، وجرمانا.</p>

      <h2>أنواع خدمات التنظيف المتاحة في دمشق</h2>
      <ul>
        <li><strong>التنظيف الدوري والشامل للمنازل:</strong> غسيل الأرضيات، تنظيف المطابخ والحمامات وتعقيمها بالكامل.</li>
        <li><strong>تنظيف ما بعد البناء والإكساء:</strong> كشط آثار الدهان والشحوم والأتربة المستعصية عن السيراميك والنوافذ.</li>
        <li><strong>غسيل السجاد والكنب بالبخار:</strong> تنظيف المفروشات في مكانها بأحدث أجهزة البخار وتجفيفها السريع.</li>
        <li><strong>جلي وتلميع الرخام والبلاط:</strong> إجلاء التصدعات وإعادة اللمعان الطبيعي للأرضيات.</li>
      </ul>

      <h2>قائمة التنسيق والتدقيق لخدمة التنظيف</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">نصائح لضمان أفضل نتيجة تنظيف:</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ تحديد مهام التنظيف المطلوب إنجازها بدقة قبل بدء العمل.</li>
          <li>✔ التأكد من استخدام مواد تنظيف وتعقيم آمنة وغير ضارة بالمفروشات والصحة.</li>
          <li>✔ معاينة النوافذ والأرضيات والمطابخ قبل استلام العمل النهائي من الفريق.</li>
        </ul>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">احصل على خدمة تنظيف منازل موثوقة في دمشق</h3>
        <p className="text-sm text-muted-foreground my-2">أرسل طلبك مجاناً وقارن عروض أسعار شركات وفنيي التنظيف المعتمدين في دمشق.</p>
        <a href="/ar/services/home-cleaning/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">شركات تنظيف المنازل في دمشق ←</a>
      </div>
    `,
  },

  // Article 7: Painter in Damascus (EXPANDED DRAFT)
  {
    slug: 'painter-damascus-guide',
    title: 'Damascus Painter Guide',
    titleAr: 'دليل الدهان والديكور الداخلي في دمشق: اختيار الطلاء ومعالجة الرطوبة',
    metaDescription: 'دليل خدمات الدهان والطلاء والديكور الداخلي في دمشق. خطوات اختيار الدهانات المائية والزيتية، معالجة رطوبة الجدران، واختيار معلم دهان ممتاز عبر وسيط.',
    metaKeywords: 'دهان دمشق, معلم دهان دمشق, طلاء منازل دمشق, معالجة الرطوبة دمشق, ديكور داخلي دمشق',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="أعمال الدهان والديكور الداخلي في دمشق - وسيط" 
          title="معلم دهان وديكور في دمشق"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          أعمال الدهان والطلاء وتجديد ديكورات المنازل والمحلات التجارية في دمشق
        </figcaption>
      </figure>

      <h2>أعمال الدهان والطلاء والتجديد الداخلي في دمشق</h2>
      <p>يعد تجديد طلاء المنزل خطوة أساسية لمنح العقار مظهرًا عصريًا وقيمة جمالية مرتفعة. يتطلب تنفيذ أعمال الدهان جودة عالية في تحضير الأسطح ومعالجة التصدعات والرطوبة قبل تطبيق طبقات الطلاء النهائية.</p>

      <h2>كيفية معالجة رطوبة وتقشر الجدران قبل الدهان</h2>
      <p>تعتبر الرطوبة من أبرز المشاكل التي تواجه جدران منازل دمشق. لعلاجها بشكل دائم، يتبع معلم الدهان المحترف الإجراءات التالية:</p>
      <ul>
        <li>كشط وتقشير الدهان القديم والمعجون المتأثر بالرطوبة حتى الوصول إلى السطح الإسمنتي الصلب.</li>
        <li>طلاء السطح بمادة عازلة للنش والرطوبة (العزل المائي).</li>
        <li>سحب معجون خارجي مائي مقاوم للرطوبة وتنعيمه جيداً بالصنفرة.</li>
        <li>تطبيق طلاء أساس (برايمر) متين قبل تنفيذ اللون النهائي.</li>
      </ul>

      <h2>خطوات الدهان الناجح للجدران والأسقف</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">مراحل تنفيذ أعمال الدهان:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. حماية الأرضيات والأثاث بتغطيتها بالبلاستيك الشفاف والورق اللاصق.</li>
          <li>2. سحب وجهين معجون وتنعيم السطح تماماً لإخفاء التموجات.</li>
          <li>3. تطبيق وجهي طلاء باللون المختار باستخدام رول عالي الجودة لضمان التجانس.</li>
        </ol>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">ابحث عن معلم دهان ممتاز في دمشق</h3>
        <p className="text-sm text-muted-foreground my-2">أضف طلبك مجاناً عبر منصة وسيط واستقبل عروض أسعار من أفضل حرفيي الدهان والديكور بدمشق.</p>
        <a href="/ar/services/painter/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">معلم دهان في دمشق عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 8: Company Registration in Syria (EXPANDED DRAFT)
  {
    slug: 'company-registration-syria-guide',
    title: 'Syria Company Registration Guide',
    titleAr: 'دليل تسجيل الشركات والمؤسسات في سوريا: الشروط القانونية والسجل التجاري',
    metaDescription: 'دليل خطوة بخطوة لتسجيل الشركات والمؤسسات التجارية في سوريا. الشروط الرسمية، استخراج السجل التجاري، الانتساب لغرف التجارة والتسجيل الضريبي.',
    metaKeywords: 'تسجيل شركات سوريا, السجل التجاري سوريا, قانون الشركات سوريا, ترخيص تجاري سوريا, غرفة تجارة دمشق',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="تسجيل وتأسيس الشركات والمؤسسات التجارية في سوريا - وسيط" 
          title="تسجيل الشركات والسجل التجاري في سوريا"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          إجراءات التسجيل القانوني للشركات والسجل التجاري والمالية في سوريا
        </figcaption>
      </figure>

      <h2>التسجيل القانوني والرسمي للشركات في سوريا</h2>
      <p>يتطلب بدء أي نشاط تجاري أو استثماري في سوريا إتمام التسجيل القانوني الصحيح وفق قانون الشركات والتجارة السوري، لحماية حقوق الشركاء والالتزام بالأنظمة الضريبية والتجارية الرسمية.</p>

      <h2>الأوراق والمستندات المطلوبة لتسجيل شركة في سوريا</h2>
      <ul>
        <li><strong>طلب حجز الاسم التجاري:</strong> تقديم طلب رسم اسم الشركة لدى وزارة التجارة الداخلية.</li>
        <li><strong>عقد التأسيس والنظام الأساسي:</strong> إعداد وتوثيق عقد الشركة لدى الكاتب العدل.</li>
        <li><strong>إثبات مقر الشركة:</strong> تقديم عقد ملكية أو عقد إيجار موثق رسمياً لمقر الشركة التجاري.</li>
        <li><strong>الوثائق الشخصية:</strong> صور الهويات الشخصية أو الجوازات للمؤسسين والشركاء مع إخراج قيد مدني.</li>
      </ul>

      <h2>خطوات استخراج السجل التجاري والتسجيل الضريبي</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">مراحل التسجيل الرسمية:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. إيداع رأس المال المحدد في حساب بنكي مخصص باسم الشركة قيد التأسيس.</li>
          <li>2. صدور قرار المصادقة على النظام الأساسي ونشره في الجريدة الرسمية.</li>
          <li>3. التسجيل في السجل التجاري والانتساب لغرفة التجارة في المحافظة المعنية.</li>
          <li>4. فتح الملف الضريبي واستخراج المصلحة المالية للشركة.</li>
        </ol>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">تواصل مع خبراء ومكاتب تسجيل الشركات في سوريا</h3>
        <p className="text-sm text-muted-foreground my-2">احصل على استشارات قانونية وتنفيذ معاملات التسجيل والسجل التجاري عبر وسيط.</p>
        <a href="/ar/services/company-registration/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">خدمات تسجيل الشركات عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 9: Contracting in Aleppo (EXPANDED DRAFT)
  {
    slug: 'contracting-aleppo-guide',
    title: 'Aleppo Contracting Guide',
    titleAr: 'دليل شركات المقاولات والإكساء في حلب: مراحل البناء والترميم الهندسي',
    metaDescription: 'دليل شامل لشركات المقاولات والإكساء الهندسي في حلب. أعمال الترميم، إكساء المباني السكنية والتجارية، والإشراف الهندسي المعتمد عبر وسيط.',
    metaKeywords: 'مقاولات حلب, إكساء حلب, مهندس مدني حلب, ترميم مباني حلب, بناء حلب',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="شركات المقاولات والإكساء والترميم في حلب - وسيط" 
          title="شركات المقاولات والإكساء في حلب"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          تنفيذ مشاريع المقاولات والإكساء الداخلي والخارجي والترميم الهندسي في حلب
        </figcaption>
      </figure>

      <h2>قطاع المقاولات والإكساء والترميم الهندسي في حلب</h2>
      <p>تشهد مدينة حلب حركة ترميم وإكساء هندسي متواصلة للمنازل والمحلات والمنشآت التجارية. إن التعاقد مع شركات مقاولات ومهندسين مدنيين معتمدين يضمن تنفيذ الأعمال طبقاً للمواصفات الهندسية واشتراطات السلامة العالية.</p>

      <h2>مراحل تنفيذ مشاريع المقاولات والإكساء في حلب</h2>
      <ul>
        <li><strong>الدراسة والتصميم المخطط:</strong> رفع القياسات وإعداد المخططات المعمارية والإنشائية وحساب كشوف الكميات.</li>
        <li><strong>أعمال الهيكل والتدعيم:</strong> بناء التدعيمات الخرسانية أو معالجة التصدعات الإنشائية بحرفية هندسية.</li>
        <li><strong>الإكساء الأساسي (الإكساء الأسود):</strong> تنفيذ أعمال التمديدات الكهربائية والصحية، واللياسة الإسمنتية، والعزل المائي والحراري، وتجهيز المبنى لاستقبال أعمال التشطيب النهائي مثل البلاط والدهان والأبواب والنوافذ، بما في ذلك عزل الأسطح والوجائب (الحواف والجدران المحيطة بالسطح) لمنع تسرب المياه.</li>
        <li><strong>التشطيبات النهائية:</strong> تركيب السيراميك والرخام، أعمال الدهان والديكور، وتركيب الأبواب والنوافذ.</li>
      </ul>

      <h2>قائمة تدقيق واختيار شركة مقاولات في حلب</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">شروط العقد الهندسي الناجح:</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ صياغة عقد تفصيلي يوضح المواصفات الفنية للمواد وتاريخ التسليم المعتمد.</li>
          <li>✔ اعتماد جدول دفعات مالي يرتبط بإنجاز كل مرحلة هندسية على حدة.</li>
          <li>✔ وجود مهندس مشرف يتابع جودة التنفيذ واختبار الضغط للتمديدات السباكية والكهربائية.</li>
        </ul>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">ابحث عن أفضل شركات المقاولات في حلب</h3>
        <p className="text-sm text-muted-foreground my-2">أرسل طلبك مجاناً عبر منصة وسيط واستقبل عروض أسعار للمشاريع الهندسية والإكساء بمدينة حلب.</p>
        <a href="/ar/services/contracting/aleppo" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">شركات المقاولات في حلب عبر وسيط ←</a>
      </div>
    `,
  },

  // Article 10: Airport Driver in Damascus (EXPANDED DRAFT)
  {
    slug: 'airport-driver-damascus-guide',
    title: 'Damascus Airport Driver Guide',
    titleAr: 'دليل خدمة توصيل مطار دمشق الدولي: الحجز المسبق والراحة والسلامة',
    metaDescription: 'دليل خدمات التوصيل والتنقل لمطار دمشق الدولي. حجز سيارة سائق خاص، أسعار التوصيل، متابعة مواعيد الطيران، والراحة التامة عبر وسيط.',
    metaKeywords: 'توصيل مطار دمشق, سائق مطار دمشق, تكسي مطار دمشق, توصيل المطار دمشق, حجز سيارة مطار دمشق',
    isPublished: false,
    contentAr: `
      <figure className="my-6 overflow-hidden rounded-2xl border shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop&fm=webp" 
          alt="خدمة توصيل مطار دمشق الدولي سيارة وسائق - وسيط" 
          title="توصيل مطار دمشق الدولي"
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover max-h-[450px]"
        />
        <figcaption className="text-xs text-center text-muted-foreground p-2 bg-muted/40">
          خدمات التنقل والتوصيل المباشر لمطار دمشق الدولي بسيارات حديثة وسائقين محترفين
        </figcaption>
      </figure>

      <h2>خدمات التوصيل والنقل لمطار دمشق الدولي</h2>
      <p>سواء كنت قادماً إلى سوريا عبر مطار دمشق الدولي أو مغادراً، فإن حجز سيارة وسائق خاص مسبقاً يوفر عليك عناء الانتظار ويضمن وصولك الآمن والمريح في الوقت المحدد دون أي تأخير.</p>

      <h2>مزايا حجز سائق خاص لتوصيل المطار عبر وسيط</h2>
      <ul>
        <li><strong>الالتزام بالمواعيد ومتابعة الطيران:</strong> يتابع السائق ميعاد وصول أو مغادرة رحلتك لضمان وجوده في الوقت المطلوب.</li>
        <li><strong>سيارات حديثة ومكيفة:</strong> توفير سيارات سياحية وسيارات عائلية تتسع لكافة المسافرين والأمتعة.</li>
        <li><strong>الشفافية في الأسعار:</strong> الاتفاق على قيمة التوصيل مسبقاً دون أي رسوم إضافية مخفية.</li>
        <li><strong>خدمة الاستقبال في صالة الوصول:</strong> استقبال المسافرين بالقرب من بوابة الخروج ومساعدتهم في نقل الحقائب.</li>
      </ul>

      <h2>نصائح لحجز توصيل المطار بسلاسة</h2>
      <div className="bg-muted/40 p-5 rounded-2xl border my-4">
        <h3 className="text-base font-bold text-foreground mb-3">توصيات قبل انطلاق الرحلة:</h3>
        <ul className="space-y-2 text-sm">
          <li>✔ حجز التوصيل قبل 24 ساعة على الأقل من موعد الطيران.</li>
          <li>✔ تزويد السائق برقم الرحلة وعدد الحقائب الكبيرة للتأكد من حجم السيارة المناسب.</li>
          <li>✔ الانطلاق نحو المطار قبل الموعد المحدد برحلتك بـ 3 ساعات على الأقل لتأمين إجراءات الجوازات والأمتعة.</li>
        </ul>
      </div>

      <div className="seo-cta-box bg-primary/10 p-6 rounded-2xl my-6 border border-primary/20">
        <h3 className="font-bold text-lg text-foreground">احجز توصيل مطار دمشق الدولي الآن</h3>
        <p className="text-sm text-muted-foreground my-2">تواصل مع سائقين معتمدين واحجز سيارة توصيل المطار بكل سهولة وسرعة عبر وسيط.</p>
        <a href="/ar/services/airport-driver/damascus" className="inline-block px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">توصيل مطار دمشق عبر وسيط ←</a>
      </div>
    `,
  },
];

async function seedDraftArticles() {
  console.log('--- UPSERTING REFINED & EXPANDED DRAFT ARTICLES (CITY MATCHED & WEBP IMAGES) ---');

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
      console.log(`[UPSERTED EXPANDED]: ${article.slug} (isPublished: ${article.isPublished})`);
    } catch (err) {
      console.error(`Error upserting article ${article.slug}:`, err);
    }
  }

  console.log('\nSUCCESS! All 7 draft articles expanded with WebP stock figures, Syrian checklists, and city links.');
}

seedDraftArticles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
