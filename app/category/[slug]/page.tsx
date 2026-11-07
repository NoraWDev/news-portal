import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getCategoryBySlug,
  getArticlesByCategorySlug,
  getArticlesCountBySlug,
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
    [articles, articlesCount] = await Promise.all([
      getArticlesByCategorySlug(slug, 20),
      getArticlesCountBySlug(slug),
    ]);
  } catch (err) {
    console.error('[CategoryPage] Articles fetch error:', err);
  }

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
              {articlesCount} خبر
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
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-8 text-center">
            <div className="text-4xl mb-3">📰</div>
            <h2 className="text-[#08243d] text-lg font-black mb-2">
              لا توجد أخبار في هذا القسم حالياً
            </h2>
            <p className="text-gray-400 text-sm">
              تابعونا لمتابعة آخر المستجدات والأخبار
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 bg-[#7a1a26] text-white px-5 py-2 rounded-lg text-sm font-black hover:bg-[#5c131d] transition"
            >
              العودة للرئيسية ←
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

            {/* المقالات - العمود الرئيسي */}
            <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg font-black">
                  <span className="w-1.5 h-5 sm:h-6 bg-[#7a1a26] rounded-full" />
                  آخر أخبار {category?.name}
                </h2>
                <span className="text-xs text-gray-400 font-semibold">
                  {articlesCount} خبر
                </span>
              </div>

              <div className="px-3 sm:px-4 md:px-5">
                {articles.map((article: ArticleWithCategory) => (
                  <article
                    key={article.id.toString()}
                    className="flex flex-row items-start gap-3 sm:gap-4 md:gap-5 py-3.5 sm:py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <img
                      src={article.featured_image || '/news-government.png'}
                      alt={article.title}
                      className="w-24 h-20 sm:w-32 sm:h-24 md:w-36 md:h-28 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {article.category && (
                        <span className="inline-block bg-[#7a1a26] text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] md:text-xs font-black mb-1 sm:mb-1.5">
                          {article.category.name}
                        </span>
                      )}
                      <Link href={`/article/${article.slug}`}>
                        <h3 className="text-[#08243d] text-xs sm:text-sm md:text-base font-black leading-snug sm:leading-6 md:leading-7 hover:text-[#7a1a26] transition line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                      {article.excerpt && (
                        <p className="hidden sm:block text-gray-400 text-xs md:text-sm leading-6 mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] md:text-xs text-gray-400">
                        <span>
                          {new Date(
                            article.published_at || article.created_at
                          ).toLocaleDateString('ar-YE')}
                        </span>
                        <span>•</span>
                        <span>{article.views_count.toString()} مشاهدة</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* الشريط الجانبي */}
            <aside className="hidden lg:flex flex-col gap-4">

              {/* أعلن معنا */}
              <section className="relative overflow-hidden rounded-xl bg-[#08090b] border border-[#5c131d]/40 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#7a1a26]/15 blur-2xl" />
                <div className="relative z-10 p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <h2 className="text-white text-2xl font-black">أعلن معنا</h2>
                    <span className="text-[#7a1a26] text-2xl font-black">+</span>
                  </div>
                  <p className="text-gray-300 text-sm font-semibold mt-1 leading-6">
                    وصل إعلانك إلى جمهور واسع
                  </p>
                  <div className="flex justify-center py-3">
                    <div className="w-20 h-16 rounded-lg bg-black/60 border border-neutral-700/60 flex items-center justify-center">
                      <span className="text-white text-4xl">📣</span>
                    </div>
                  </div>
                  <Link
                    href="/advertise"
                    className="mt-2 mx-auto flex w-fit items-center justify-center gap-2 bg-[#7a1a26] text-white px-7 py-2 rounded-md text-sm font-black hover:bg-[#5c131d] transition"
                  >
                    ابدأ الآن ←
                  </Link>
                </div>
              </section>

              {/* النشرة الإخبارية */}
              <section className="relative overflow-hidden rounded-xl bg-[#08090b] border border-[#5c131d]/40 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
                <div className="relative z-10 p-5 text-right">
                  <div className="flex items-center justify-end gap-3 mb-3">
                    <h2 className="text-white text-lg font-black">
                      اشترك في نشرتنا الإخبارية
                    </h2>
                    <span className="text-white text-3xl">✉</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-6 mb-3">
                    كن أول من يصلك آخر الأخبار والتحديثات من منصة أجراس اليمن الإخبارية
                  </p>
                  <input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    dir="rtl"
                    className="w-full bg-[#020304] border border-neutral-700 rounded-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#7a1a26]"
                  />
                  <button
                    type="button"
                    className="mt-2 w-full cursor-pointer bg-[#7a1a26] text-white rounded-md py-2 text-sm font-black hover:bg-[#5c131d] transition"
                  >
                    اشترك
                  </button>
                </div>
              </section>

            </aside>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
