'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Search, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Share2, 
  Globe, 
  Filter, 
  TrendingUp, 
  Layers, 
  Link as LinkIcon,
  Image as ImageIcon,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Award,
  Sparkles,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface AuditedArticle {
  id: string;
  slug: string;
  titleAr: string;
  status: string;
  isPublished: boolean;
  targetCity: string | null;
  targetService: string | null;
  primaryKeyword: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  indexedStatus: boolean;
  auditScore: number;
  auditPassed: boolean;
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
  socialPosts: Array<{ platform: string; content: string }>;
  updatedAt: string;
}

export default function AdminSeoDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'audit' | 'social' | 'gap'>('overview');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [deletedPostKeys, setDeletedPostKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAuditData();
  }, []);

  async function fetchAuditData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/audit');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Fetch SEO audit error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">جاري فحص وتدقيق محرك SEO وسيط...</p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const gsc = data?.gscSummary || {};
  const articles: AuditedArticle[] = data?.articles || [];

  const filteredArticles = articles.filter(article => {
    if (cityFilter !== 'all' && article.targetCity !== cityFilter) return false;
    if (statusFilter !== 'all' && article.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 p-1 md:p-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2 text-foreground">
            <Award className="w-8 h-8 text-primary" /> لوحة تحكم محرك السلطة SEO (Authority Engine)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مراقبة وتدقيق الروابط الداخلية (Silo)، درجات E-E-A-T، جودة المحتوى، ونشاط منصة وسيط في سوريا.
          </p>
        </div>
        <Button onClick={fetchAuditData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> تحديث التدقيق
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{summary.averageHealthScore}/100</div>
              <p className="text-xs text-muted-foreground font-medium">متوسط جودة SEO</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{summary.publishedCount} / {summary.totalArticles}</div>
              <p className="text-xs text-muted-foreground font-medium">المقالات المنشورة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{summary.totalInternalLinks}</div>
              <p className="text-xs text-muted-foreground font-medium">روابط السيلو الداخلية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{summary.orphanPagesCount}</div>
              <p className="text-xs text-muted-foreground font-medium">صفحات يتيمة (Orphan)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <BarChart3 className="w-4 h-4" /> نظرة عامة ومقاييس Google GSC
        </button>
        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'clusters' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Layers className="w-4 h-4" /> المجموعات العنقودية (Topic Clusters)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'audit' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <AlertTriangle className="w-4 h-4" /> حارس الجودة والتدقيق (/100)
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'social' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Share2 className="w-4 h-4" /> مولد منشورات التواصل الاجتماعي
        </button>
        <button
          onClick={() => setActiveTab('gap')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'gap' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-4 h-4" /> خريطة الفرص والفرغات (Content Gap)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-bold text-muted-foreground">تصفية التقرير:</span>
        <select 
          value={cityFilter} 
          onChange={e => setCityFilter(e.target.value)}
          className="text-xs px-3 py-1.5 border rounded-lg bg-background text-foreground"
        >
          <option value="all">كل المدن</option>
          <option value="damascus">دمشق</option>
          <option value="aleppo">حلب</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-1.5 border rounded-lg bg-background text-foreground"
        >
          <option value="all">كل الحالات</option>
          <option value="PUBLISHED">منشور (PUBLISHED)</option>
          <option value="DRAFT">مسودة (DRAFT)</option>
        </select>
      </div>

      {/* TAB 1: Overview & GSC */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> جاهزية الربط مع Google Search Console (GSC Architecture)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                تم تجهيز هيكل البيانات لاستقبال النقر والظهور والمتوسط فور تفعيل مفاتيح API الخاصة بـ Google Search Console دون الحاجة لتغيير الكود.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-lg font-bold text-foreground">{gsc.totalImpressions || 0}</div>
                  <div className="text-xs text-muted-foreground">إجمالي الظهور (Impressions)</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-lg font-bold text-foreground">{gsc.totalClicks || 0}</div>
                  <div className="text-xs text-muted-foreground">إجمالي النقرات (Clicks)</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-lg font-bold text-foreground">{gsc.averageCtr || 0}%</div>
                  <div className="text-xs text-muted-foreground">متوسط نسبة النقر (CTR)</div>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <div className="text-lg font-bold text-foreground">{gsc.averagePosition || 0}</div>
                  <div className="text-xs text-muted-foreground">متوسط الترتيب (Position)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Overview Table */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <table className="w-full text-xs text-start">
              <thead className="bg-muted/50 font-bold border-b">
                <tr>
                  <th className="p-3">عنوان المقال</th>
                  <th className="p-3">المدينة والخدمة</th>
                  <th className="p-3">الكلمة المفتاحية الرئيسية</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">درجة الجودة</th>
                  <th className="p-3 text-end">معاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold">{article.titleAr}</td>
                    <td className="p-3 text-muted-foreground">
                      {article.targetCity === 'aleppo' ? 'حلب' : 'دمشق'} / {article.targetService || 'عام'}
                    </td>
                    <td className="p-3 font-mono text-primary">{article.primaryKeyword || article.titleAr}</td>
                    <td className="p-3">
                      <Badge variant={article.isPublished ? 'default' : 'secondary'} className="text-[10px]">
                        {article.isPublished ? 'منشور' : 'مسودة'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className={`font-bold px-2 py-0.5 rounded ${article.auditScore >= 80 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {article.auditScore} / 100
                      </span>
                    </td>
                    <td className="p-3 text-end">
                      <a href={`/ar/blog/${article.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> فتح
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Clusters */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> المجموعات العنقودية المقترحة (Topic Silo Architecture)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-muted/30 rounded-xl border">
                <div className="font-bold text-sm text-foreground">🟢 العنقود 1: دليل خدمات وصيانة الكهرباء في دمشق (Pillar Topic)</div>
                <p className="text-muted-foreground my-1">يربط الصفحة المحورية بصفحة الخدمة وتغطية الأحياء والمقالات الداعمة.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">كهربائي دمشق</Badge>
                  <Badge variant="outline">صيانة التكييف دمشق</Badge>
                  <Badge variant="outline">تمديدات الإينفرتر والطاقة</Badge>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border">
                <div className="font-bold text-sm text-foreground">🟢 العنقود 2: دليل المقاولات والإكساء في حلب (Pillar Topic)</div>
                <p className="text-muted-foreground my-1">يربط خدمات المقاولات، كهربائي حلب، وتبريد وتكييف حلب.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">مقاولات حلب</Badge>
                  <Badge variant="outline">كهربائي حلب</Badge>
                  <Badge variant="outline">صيانة تكييف حلب</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Audit Guard */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {filteredArticles.map(article => (
            <Card key={article.id} className="border shadow-xs hover:border-primary/30 transition-all">
              <CardHeader className="pb-3 border-b bg-muted/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base font-black text-foreground">{article.titleAr}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {article.targetCity === 'aleppo' ? 'حلب' : 'دمشق'} / {article.targetService || 'عام'}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">https://www.wassitt.com/ar/blog/{article.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-base font-black px-3 py-1 rounded-xl shadow-xs ${article.auditScore >= 80 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                    درجة الجودة: {article.auditScore} / 100
                  </span>
                  <a href={`/ar/blog/${article.slug}`} target="_blank" rel="noreferrer" className="p-2 border rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Diagnostic Indicators Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className="font-bold text-foreground">📝 {article.metrics?.wordCount || 0}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">عدد الكلمات</div>
                  </div>
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className="font-bold text-foreground">🔗 {article.metrics?.internalLinkCount || 0}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">روابط داخلية</div>
                  </div>
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className={`font-bold ${article.metrics?.hasMetaDescription ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {article.metrics?.hasMetaDescription ? '✅ مكتمل' : '⚠️ مفقود'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">الوصف الميتا</div>
                  </div>
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className={`font-bold ${article.metrics?.hasImageAlt ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {article.metrics?.hasImageAlt ? '✅ WebP/Alt' : '⚠️ بحاجة لـ Alt'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">نص الصورة الوصفي</div>
                  </div>
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className={`font-bold ${article.metrics?.hasFaq ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {article.metrics?.hasFaq ? '✅ يوجد FAQ' : 'لا يوجد FAQ'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">الأسئلة الشائعة</div>
                  </div>
                  <div className="p-2.5 bg-muted/30 rounded-lg text-center border">
                    <div className={`font-bold ${article.metrics?.hasEeatAuthor ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {article.metrics?.hasEeatAuthor ? '✅ توثيق E-E-A-T' : 'افتراضي'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">بيانات الكاتب والخبير</div>
                  </div>
                </div>

                {/* Issues & Recommendations Split View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
                    <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> الملاحظات والنقاط المفقودة:
                    </div>
                    {article.issues.length > 0 ? (
                      <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                        {article.issues.map((iss, i) => (
                          <li key={i}>{iss}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-emerald-600 font-bold">لا يوجد أي نقاط مفقودة - المقال ممتاز 100%!</p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 space-y-2">
                    <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> التوصيات لرفع الترتيب في Google:
                    </div>
                    {article.recommendations.length > 0 ? (
                      <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                        {article.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-emerald-600 font-bold">المقال مهيأ تماماً لشبكة سيلو وسلطة البحث!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: Social Generator */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {filteredArticles.map(article => (
            <Card key={article.id}>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>📱 مسودات التواصل الاجتماعي: {article.titleAr}</span>
                  <Badge variant="outline" className="text-[10px]">مراجعة وتصدير المشرف (Draft)</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.socialPosts.map(post => {
                    const postKey = `${article.id}-${post.platform}`;
                    if (deletedPostKeys[postKey]) return null;

                    return (
                      <div key={post.platform} className="bg-muted/30 p-4 rounded-xl border space-y-2 relative group">
                        <div className="flex items-center justify-between font-bold border-b pb-2">
                          <span className="text-primary font-black">{post.platform}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() => handleCopy(post.content, postKey)}
                            >
                              {copiedIndex === postKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" /> تم النسخ
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> نسخ النص
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="حذف هذا المنشور"
                              onClick={() => setDeletedPostKeys(prev => ({ ...prev, [postKey]: true }))}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap font-sans text-muted-foreground bg-background p-3 rounded-lg border leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 5: Content Gap */}
      {activeTab === 'gap' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> خريطة فرص التغطية في سوريا (Content Gap Roadmap)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(data?.contentGapOpportunities || []).map((opp: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border rounded-xl gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span>🎯 {opp.titleAr || `فرصة تغطية في ${opp.cityAr}`}</span>
                      <Badge variant="outline" className="text-[10px]">{opp.cityAr || 'سوريا'}</Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                      <span>📌 نية البحث: <strong className="text-foreground">{opp.searchIntent}</strong></span>
                      <span>•</span>
                      <span>💰 القيمة المقدرة: <strong className="text-emerald-600">{opp.estimatedMonthlyValue}</strong></span>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-black text-xs px-3 py-1 whitespace-nowrap">
                    درجة الأولوية: {opp.priorityScore} / 100
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
