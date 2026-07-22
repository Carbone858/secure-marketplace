import { prisma } from '@/lib/prisma';
import { SocialPlatform, SocialPostStatus } from '@prisma/client';

export interface SocialMediaCaptionSet {
  facebook: string;
  instagram: string;
  x: string;
  linkedin: string;
  youtube: string;
}

export class SocialMediaGeneratorService {
  /**
   * Generates platform-specific social media post drafts for a given CMS article.
   * Does NOT auto-publish. Saves as DRAFT for Admin review and manual export.
   */
  static async generateAndSaveDraftPosts(articleId: string): Promise<void> {
    const article = await prisma.cMSPage.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        titleAr: true,
        title: true,
        slug: true,
        metaDescription: true,
        primaryKeyword: true,
        targetCity: true,
      },
    });

    if (!article) return;

    const title = article.titleAr || article.title;
    const city = article.targetCity === 'aleppo' ? 'حلب' : 'دمشق';
    const keyword = article.primaryKeyword || title;
    const url = `https://www.wassitt.com/ar/blog/${article.slug}`;

    const captions: Record<SocialPlatform, string> = {
      FACEBOOK: `📣 جديد مدونة وسيط: ${title}\n\nهل تبحث عن أفضل خدمات ${keyword} في ${city}؟ يقدم لك هذا الدليل الشامل كل ما تحتاج معرفته حول الخطوات والتكاليف وإرشادات الأمان والسلامة.\n\nاقرأ المقال الكامل واحصل على عروض أسعار من فنيين معتمدين:\n🔗 ${url}\n\n#وسيط #سوريا #${city.replace(' ', '_')} #صيانة_منزلية #خدمات_سوريا`,

      INSTAGRAM: `✨ ${title}\n\nإليك أهم النصائح والمعلومات حول ${keyword} في ${city} 🇸🇾\n\n📌 ما ينبغي معرفته قبل البدء:\n• التمديدات والصيانة الوقائية\n• اختيار الفني أو الشركة الموثوقة\n• ضمان الأمان والسلامة\n\n🔗 اضغط على الرابط في البايو أو زُر:\n${url}\n.\n.\n#وسيط #سوريا #${city.replace(' ', '_')} #صيانة #دليل_وسيط #دمشق #حلب #خدمات`,

      X: `📌 جديد مدونة وسيط:\n${title}\n\nتعرف على إرشادات وتكاليف ${keyword} في ${city} 🇸🇾\n\nاقرأ التفاصيل واحصل على عروض أسعار:\n🔗 ${url}\n\n#وسيط #${city.replace(' ', '_')} #سوريا`,

      LINKEDIN: `💼 تقرير وسيط للخدمات والأعمال: ${title}\n\nفي إطار تعزيز الشفافية وتأهيل سوق الخدمات والشركات في سوريا، يقدم وسيط هذا الدليل المتخصص حول ${keyword} في ${city}.\n\nيقدم التقرير تحليلاً تشغيلياً واشتراطات الجودة وإجراءات التسجيل والصيانة.\n\nرابط المقال الشامل:\n🔗 ${url}\n\n#وسيط #إدارة_الأعمال #سوريا #خدمات_الشركات #${city.replace(' ', '_')}`,

      YOUTUBE: `📝 ملخص دليل وسيط: ${title}\n\nنشارك معكم أهم المحاور الواردة في مقالنا الجديد على مدونة وسيط حول ${keyword} في مدينة ${city}.\n\nقراءة المقال الكامل على الموقع:\n🔗 ${url}\n\nشاركونا آراءكم واستفساراتكم في التعليقات!`,
    };

    // Upsert draft posts for each platform
    for (const [platform, content] of Object.entries(captions)) {
      const p = platform as SocialPlatform;
      const existing = await prisma.socialPost.findFirst({
        where: { articleId, platform: p },
      });

      if (existing) {
        await prisma.socialPost.update({
          where: { id: existing.id },
          data: { content },
        });
      } else {
        await prisma.socialPost.create({
          data: {
            articleId,
            platform: p,
            content,
            status: SocialPostStatus.DRAFT,
          },
        });
      }
    }
  }
}
