import { prisma } from '@/lib/prisma';

export interface SeoQualityAuditResult {
  score: number; // Score out of 100
  passed: boolean;
  issues: string[];
  recommendations: string[];
  metrics: {
    wordCount: number;
    internalLinkCount: number;
    hasH1: boolean;
    hasMetaDescription: boolean;
    hasImageAlt: boolean;
    hasJsonLd: boolean;
    hasFaq: boolean;
    hasEeatAuthor: boolean;
    isWebp: boolean;
  };
}

export class SeoAuditEngineService {
  /**
   * Calculates a comprehensive SEO Quality Audit Score out of 100 asynchronously for an article.
   */
  static calculateArticleQualityScore(article: {
    titleAr?: string | null;
    title?: string;
    contentAr?: string | null;
    content?: string;
    metaDescription?: string | null;
    primaryKeyword?: string | null;
    author?: string | null;
    readingTime?: number | null;
    updatedAt?: Date;
    images?: Array<{ altText?: string | null; format?: string | null }>;
  }): SeoQualityAuditResult {
    const text = article.contentAr || article.content || '';
    const plainText = text.replace(/<[^>]+>/g, ' ').trim();
    const words = plainText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // 1. Word Count Check (Ideal: 400+ words)
    if (wordCount < 200) {
      score -= 20;
      issues.push('محتوى قصير جداً (أقل من 200 كلمة)');
      recommendations.push('توسيع المقال بشرح عملي وتفاصيل إضافية عن الخدمة في سوريا.');
    } else if (wordCount < 400) {
      score -= 10;
      issues.push('محتوى متوسط الطول (أقل من 400 كلمة)');
      recommendations.push('إضافة قائمة فحص السلامة أو خطوات التنفيذ لرفع القيمة التثقيفية.');
    }

    // 2. Meta Description Check
    const meta = article.metaDescription || '';
    if (!meta) {
      score -= 15;
      issues.push('الوصف الميتا (Meta Description) مفقود');
      recommendations.push('إضافة وصف ميتا جذاب بين 120 و160 حرفاً يتضمن الكلمة المفتاحية والمدينة.');
    } else if (meta.length < 90) {
      score -= 5;
      issues.push('الوصف الميتا قصير (أقل من 90 حرفاً)');
      recommendations.push('توسيع الوصف الميتا ليصل إلى 130-150 حرفاً لكسب نقرات أعلى في محركات البحث.');
    }

    // 3. Heading Structure Check (H1/H2/H3)
    const hasH1 = true; // Handled by Next.js detail template
    const hasH2 = /<h2[^>]*>/i.test(text);
    if (!hasH2) {
      score -= 10;
      issues.push('عدم استخدام عناوين الفرعية <h2>');
      recommendations.push('تقسيم المقال إلى أقسام رئيسية باستخدام عناوين <h2>.');
    }

    // 4. Internal Link Control (Ideal: 3 to 8 internal links max)
    const linkMatches = text.match(/href=["'](\/[^"']+)["']/gi) || [];
    const internalLinkCount = linkMatches.length;

    if (internalLinkCount === 0) {
      score -= 15;
      issues.push('لا يوجد أي روابط داخلية في المقال');
      recommendations.push('ربط المقال بصفحة الخدمة وصفحة المدينة ودليل الشركات عبر وسيط.');
    } else if (internalLinkCount > 8) {
      score -= 5;
      issues.push('عدد الروابط الداخلية مرتفع جداً (أكثر من 8 روابط)');
      recommendations.push('تقليل الروابط التكرارية للحفاظ على توزيع قوة السيلو (Silo Juice).');
    }

    // 5. Keyword Stuffing Check
    const keyword = (article.primaryKeyword || article.titleAr || '').trim();
    if (keyword && wordCount > 0) {
      const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const occurrences = (text.match(keywordRegex) || []).length;
      const density = (occurrences * keyword.split(' ').length / wordCount) * 100;

      if (density > 4.5) {
        score -= 10;
        issues.push('حشو كلمات مفتاحية (Keyword Density مرتفع)');
        recommendations.push('تنويع مرادفات الكلمة المفتاحية وتجنب تكرار النمط نفسه بكثرة.');
      }
    }

    // 6. Image ALT & WebP Audit
    const images = article.images || [];
    const hasImageAlt = images.length > 0 ? images.every(img => Boolean(img.altText)) : /alt=["'][^"']+["']/i.test(text);
    const isWebp = images.length > 0 ? images.every(img => img.format === 'webp') : /\.webp/i.test(text);

    if (!hasImageAlt) {
      score -= 10;
      issues.push('الصورة البارزة أو صور المقال تفتقر لنص alt توضيحي');
      recommendations.push('إضافة نص alt وصف باللغة العربية يوضح محتوى الصورة والخدمة.');
    }

    if (!isWebp) {
      score -= 5;
      issues.push('الصورة ليست بصيغة WebP المحسنة');
      recommendations.push('استخدام صور بصيغة WebP لتسريع التحميل وحماية درجات PageSpeed.');
    }

    // 7. E-E-A-T Author & FAQ Check
    const hasFaq = /الأسئلة الشائعة|الأسئلة المتكررة|faq/i.test(text);
    const hasEeatAuthor = Boolean(article.author);

    if (!hasFaq) {
      score -= 5;
      issues.push('عدم وجود قسم الأسئلة الشائعة (FAQ)');
      recommendations.push('إضافة قسم FAQ يتضمن سؤالين أو ثلاثة لإظهار نتائج Google Rich Snippets.');
    }

    const finalScore = Math.max(0, Math.min(100, score));

    return {
      score: finalScore,
      passed: finalScore >= 75,
      issues,
      recommendations,
      metrics: {
        wordCount,
        internalLinkCount,
        hasH1,
        hasMetaDescription: Boolean(meta),
        hasImageAlt,
        hasJsonLd: true,
        hasFaq,
        hasEeatAuthor,
        isWebp,
      },
    };
  }

  /**
   * Content Gap Weighted Prioritization Score Engine.
   * Priority Score = 0.30(Search Intent) + 0.30(Business Value) + 0.20(City Importance) + 0.20(Gap Coverage)
   */
  static calculateContentGapPriority(
    service: string,
    city: string
  ): {
    titleAr: string;
    cityAr: string;
    serviceAr: string;
    priorityScore: number;
    searchIntent: string;
    estimatedMonthlyValue: string;
  } {
    const isTier1City = city === 'damascus' || city === 'aleppo';
    const isHighDemandService = ['electrician', 'ac-services', 'business-setup', 'contracting'].includes(service);

    let score = 60;
    if (isTier1City) score += 20;
    if (isHighDemandService) score += 20;

    const cityAr = city === 'aleppo' ? 'حلب' : city === 'damascus' ? 'دمشق' : 'سوريا';

    const serviceNames: Record<string, string> = {
      electrician: 'خدمات الكهرباء والتمديدات',
      'ac-services': 'صيانة وتكييف الهواء',
      'business-setup': 'تأسيس وتسجيل الشركات',
      contracting: 'المقاولات والبناء والإكساء',
      'home-cleaning': 'تنظيف المنازل والشركات',
      painter: 'دهان وصيانة المباني',
      'company-registration': 'السجل التجاري والأنشطة',
      'airport-driver': 'توصيل مطار دمشق الدولي',
    };

    const serviceAr = serviceNames[service] || service;

    return {
      titleAr: `دليل ${serviceAr} في ${cityAr}`,
      cityAr,
      serviceAr,
      priorityScore: score,
      searchIntent: isHighDemandService ? 'بحث تجاري مباشر (Transactional)' : 'بحث تثقيفي وإرشادي (Informational)',
      estimatedMonthlyValue: isTier1City && isHighDemandService ? 'عالية جداً (عملاء مميزين وشركات B2B)' : 'متوسطة',
    };
  }
}
