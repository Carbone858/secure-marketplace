export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-middleware';
import { SeoAuditEngineService } from '@/lib/services/seoAuditEngineService';
import { SocialMediaGeneratorService } from '@/lib/services/socialMediaGeneratorService';

export async function GET(request: NextRequest) {
  try {
    // Security Check: Admin Auth required via authenticateRequest
    const auth = await authenticateRequest(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const articles = await prisma.cMSPage.findMany({
      include: {
        images: true,
        socialPosts: true,
        auditHistories: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalArticles = articles.length;
    const publishedCount = articles.filter(a => a.isPublished || a.status === 'PUBLISHED').length;
    const draftCount = articles.filter(a => !a.isPublished || a.status === 'DRAFT').length;

    let totalScore = 0;
    let totalInternalLinks = 0;
    let totalImages = 0;
    let missingAltCount = 0;
    let orphanPagesCount = 0;

    const auditedArticles = articles.map(article => {
      const audit = SeoAuditEngineService.calculateArticleQualityScore({
        titleAr: article.titleAr,
        title: article.title,
        contentAr: article.contentAr,
        content: article.content,
        metaDescription: article.metaDescription,
        primaryKeyword: article.primaryKeyword,
        author: article.author,
        readingTime: article.readingTime,
        updatedAt: article.updatedAt,
        images: article.images,
      });

      totalScore += audit.score;
      totalInternalLinks += audit.metrics.internalLinkCount;
      totalImages += article.images.length;
      if (!audit.metrics.hasImageAlt) missingAltCount++;
      if (audit.metrics.internalLinkCount === 0) orphanPagesCount++;

      const socialPosts = article.socialPosts.length > 0
        ? article.socialPosts
        : SocialMediaGeneratorService.generateCaptionsArray({
            titleAr: article.titleAr,
            title: article.title,
            primaryKeyword: article.primaryKeyword,
            targetCity: article.targetCity,
            slug: article.slug,
          });

      return {
        id: article.id,
        slug: article.slug,
        titleAr: article.titleAr || article.title,
        status: article.status,
        isPublished: article.isPublished,
        targetCity: article.targetCity,
        targetService: article.targetService,
        primaryKeyword: article.primaryKeyword,
        impressions: article.impressions,
        clicks: article.clicks,
        ctr: article.ctr,
        averagePosition: article.averagePosition,
        indexedStatus: article.indexedStatus,
        auditScore: audit.score,
        auditPassed: audit.passed,
        issues: audit.issues,
        recommendations: audit.recommendations,
        metrics: audit.metrics,
        socialPosts,
        images: article.images,
        updatedAt: article.updatedAt,
      };
    });

    const averageHealthScore = totalArticles > 0 ? Math.round(totalScore / totalArticles) : 100;

    // GSC Ready Summary
    const gscSummary = {
      totalImpressions: articles.reduce((acc, a) => acc + (a.impressions || 0), 0),
      totalClicks: articles.reduce((acc, a) => acc + (a.clicks || 0), 0),
      averageCtr: articles.length > 0 ? (articles.reduce((acc, a) => acc + (a.ctr || 0), 0) / articles.length).toFixed(2) : 0,
      averagePosition: articles.length > 0 ? (articles.reduce((acc, a) => acc + (a.averagePosition || 0), 0) / articles.length).toFixed(1) : 0,
      indexedPagesCount: articles.filter(a => a.indexedStatus).length,
    };

    // Duplicate Audit Checker
    const titles = articles.map(a => a.titleAr || a.title);
    const duplicateTitles = titles.filter((item, index) => titles.indexOf(item) !== index);

    // Content Gap Roadmap Opportunities
    const gapOpportunities = [
      SeoAuditEngineService.calculateContentGapPriority('electrician', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('electrician', 'aleppo'),
      SeoAuditEngineService.calculateContentGapPriority('ac-services', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('ac-services', 'aleppo'),
      SeoAuditEngineService.calculateContentGapPriority('business-setup', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('contracting', 'aleppo'),
      SeoAuditEngineService.calculateContentGapPriority('home-cleaning', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('painter', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('company-registration', 'damascus'),
      SeoAuditEngineService.calculateContentGapPriority('airport-driver', 'damascus'),
    ];

    return NextResponse.json({
      summary: {
        totalArticles,
        publishedCount,
        draftCount,
        averageHealthScore,
        totalInternalLinks,
        orphanPagesCount,
        missingAltCount,
        totalImages,
      },
      gscSummary,
      duplicateAudits: {
        duplicateTitles,
        hasDuplicateTitles: duplicateTitles.length > 0,
      },
      articles: auditedArticles,
      contentGapOpportunities: gapOpportunities,
    });
  } catch (error) {
    console.error('SEO Audit API error:', error);
    return NextResponse.json({ error: 'Failed to run SEO audit.' }, { status: 500 });
  }
}
