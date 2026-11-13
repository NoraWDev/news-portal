import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getCategoryBySlug,
  getArticlesByCategorySlug,
  getArticlesCountBySlug,
  getGeneralReports,
  getGeneralReportsCount,
  type ArticleWithCategory,
} from '@/lib/data/categories';

// ===== إعدادات الصفحة =====
export const dynamic = 'force-dynamic';

// ===== توليد البيانات الوصفية =====
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return { title: 'القسم غير موجود | أجراس اليمن الإخبارية' };
    }
    return {
      title: `${category.name} | أجراس اليمن الإخبارية`,
      description:
        category.description ||
        `آخر أخبار ${category.name} من منصة أجراس اليمن الإخبارية`,
      openGraph: {
        title: `${category.name} | أجراس اليمن الإخبارية`,
        description:
          category.description ||
          `آخر أخبار ${category.name} من منصة أجراس اليمن الإخبارية`,
      },
    };
  } catch {
    return { title: 'أجراس اليمن الإخبارية' };
  }
}

// ===== الصفحة الرئيسية =====
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isReports = slug === 'reports';

  let category;
  let articles: ArticleWithCategory[] = [];
  let articlesCount = 0;

  try {
    category = await getCategoryBySlug(slug);
  } catch (err) {
    console.error('[CategoryPage] DB error:', err);
  }

  if (!category) {
    notFound();
  }

  try {
    if (isReports) {
      [articles, articlesCount] = await Promise.all([
        getGeneralReports(20),
        getGeneralReportsCount(),
      ]);
    } else {
      [articles, articlesCount] = await Promise.all([
        getArticlesByCategorySlug(slug, 20),
        getArticlesCountBySlug(slug),
      ]);
    }
  } catch (err) {
    console.error('[CategoryPage] Articles fetch error:', err);
  }

  const categoryTotalLabel = isReports
    ? `${articlesCount} تقرير`
    : `${articlesCount} خبر`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      {/* ===== عنوان القسم ===== */}
      <section className="bg-[#08243d] border-b border-[#0a2e4d]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Link href="/" className="hover:text-white transition">
              الرئيسية
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-white font-bold">
              {category.name}
            </span>
          </div>
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-8 bg-[#7a1a26] rounded-full inline-block" />
            {category.name}
            <span className="text-sm font-normal text-gray-300 mr-auto">
              {categoryTotalLabel}
            </span>
          </h1>
          {category.description && (
            <p className="text-gray-300 text-sm mt-1 leading-6 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* ===== المحتوى ===== */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* رأس القسم */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg font-black">
            <span className="w-1.5 h-5 sm:h-6 bg-[#7a1a26] rounded-full" />
            {isReports ? 'آخر التقارير المنشورة' : `آخر أخبار ${category?.name}`}
          </h2>
          <span className="text-xs text-gray-400 font-semibold">
            {articlesCount} {isReports ? 'تقرير' : 'خبر'}
          </span>
        </div>

        {/* قائمة الأخبار والتقارير */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-10 text-center">
            <div className="text-4xl mb-3">📰</div>
            <h2 className="text-[#08243d] text-base sm:text-lg font-black mb-2">
              {isReports ? 'لا توجد تقارير في هذا القسم حالياً' : 'لا توجد أخبار في هذا القسم حالياً'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              تابعونا لمتابعة آخر المستجدات والتحليلات
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 bg-[#7a1a26] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black hover:bg-[#5c131d] transition"
            >
              العودة للرئيسية ←
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
            {articles.map((article: ArticleWithCategory) => {
              const isOpinion = Boolean(article.author);
              const authorAvatar = article.author?.avatar_url;
              const authorName = article.author?.name || article.author_name;
              const cardImage = isOpinion
                ? authorAvatar || null
                : article.featured_image || '/news-government.png';

              return (
                <article
                  key={article.id.toString()}
                  className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col"
                >
                  {/* صورة البطاقة */}
                  <Link
                    href={isOpinion && article.author ? `/author/${article.author.slug}` : `/article/${article.slug}`}
                    className="block relative overflow-hidden"
                    title={isOpinion ? `صفحة الكاتب ${authorName}` : article.title}
                  >
                    {isOpinion && cardImage ? (
                      <div className="aspect-[16/10] bg-gradient-to-br from-[#f1e7e9] to-[#fdf3f4] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cardImage}
                          alt={authorName || ''}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 sm:border-4 border-[#7a1a26] shadow-sm group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : isOpinion && !cardImage ? (
                      <div className="aspect-[16/10] bg-gradient-to-br from-[#f1e7e9] to-[#fdf3f4] flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7a1a26]/10 border-2 sm:border-4 border-[#7a1a26] flex items-center justify-center group-hover:scale-105 transition duration-300">
                          <span className="text-[#7a1a26] text-2xl sm:text-3xl font-black">
                            {authorName?.charAt(0) || 'ك'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cardImage!}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}

                    {isOpinion && (
                      <span className="absolute top-2 right-2 bg-[#7a1a26] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        مقال رأي
                      </span>
                    )}
                  </Link>

                  {/* تفاصيل البطاقة */}
                  <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
                    <div>
                      {/* الوسم والكاتب */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        {article.category && (
                          <span className="inline-block bg-[#7a1a26] text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black">
                            {article.category.name}
                          </span>
                        )}
                        {isOpinion && article.author && (
                          <span className="text-[10px] text-gray-500 font-semibold">
                            بقلم: <span className="text-[#7a1a26] font-bold">{authorName}</span>
                          </span>
                        )}
                      </div>

                      {/* عنوان الخبر */}
                      <Link href={`/article/${article.slug}`}>
                        <h3 className="text-[#08243d] text-xs sm:text-[13px] md:text-sm font-bold leading-snug sm:leading-5 group-hover:text-[#7a1a26] transition line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                    </div>

                    {/* التاريخ والمشاهدات */}
                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-gray-100 text-[9px] sm:text-[10px] text-gray-400">
                      <span>
                        {new Date(
                          article.published_at || article.created_at
                        ).toLocaleDateString('ar-YE')}
                      </span>
                      <span>{article.views_count.toString()} مشاهدة</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
