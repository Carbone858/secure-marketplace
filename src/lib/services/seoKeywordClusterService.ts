import { prisma } from '@/lib/prisma';

export interface TopicClusterItem {
  id: string;
  title: string;
  slug: string;
  isPillarPage: boolean;
  pillarTopic: string | null;
  primaryKeyword: string | null;
  targetCity: string | null;
  targetService: string | null;
}

export class SeoKeywordClusterService {
  /**
   * Generates automatic Pillar & Topic Cluster suggestions for Admin review.
   */
  static getClusterSuggestions() {
    return [
      {
        pillarTitle: 'دليل خدمات وصيانة الكهرباء في دمشق',
        pillarTopic: 'damascus-electrical-cluster',
        targetCity: 'damascus',
        targetService: 'electrician',
        suggestedArticles: [
          'electrician-damascus-guide',
          'ac-repair-damascus-guide',
        ],
      },
      {
        pillarTitle: 'دليل المقاولات والصيانة التأسيسية في حلب',
        pillarTopic: 'aleppo-construction-cluster',
        targetCity: 'aleppo',
        targetService: 'contracting',
        suggestedArticles: [
          'contracting-aleppo-guide',
          'electrician-aleppo-guide',
          'ac-repair-aleppo-guide',
        ],
      },
      {
        pillarTitle: 'دليل تأسيس وإدارة الشركات في سوريا',
        pillarTopic: 'syria-business-cluster',
        targetCity: 'damascus',
        targetService: 'business-setup',
        suggestedArticles: [
          'business-setup-damascus-guide',
          'company-registration-syria-guide',
        ],
      },
    ];
  }

  /**
   * Assigns an article to a Topic Cluster as a Pillar Page or Supporting Page with Admin approval.
   */
  static async assignTopicCluster(
    articleId: string,
    isPillarPage: boolean,
    pillarTopic: string
  ): Promise<void> {
    await prisma.cMSPage.update({
      where: { id: articleId },
      data: {
        isPillarPage,
        pillarTopic,
      },
    });
  }
}
