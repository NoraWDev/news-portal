import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const cleanQ = (q || '').trim();
  const title = cleanQ
    ? `نتائج البحث عن: ${cleanQ} | أجراس اليمن الإخبارية`
    : 'البحث في الأخبار | أجراس اليمن الإخبارية';

  return {
    title,
    description: 'ابحث في أرشيف الأخبار والتقارير والمقالات على منصة أجراس اليمن الإخبارية.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  let results: any[] = [];
  let errorOccurred = false;

  if (query.length > 0) {
    try {
      results = await prisma.articles.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          category: {
            select: { name: true, slug: true },
          },
          author: {
            select: { name: true, slug: true, avatar_url: true },
          },
        },
        orderBy: [
          { published_at: 'desc' },
          { created_at: 'desc' },
        ],
        take: 40,
      });
    } catch (err) {
      console.error('[SearchPage] DB error during search:', err);
      errorOccurred = true;
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      {/* عنوان الصفحة و Breadcrumb */}
      <section className="bg-[#08243d] border-b border-[#0a2e4d]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2">
            <Link href="/" className="hover:text-white transition">
              الرئيسية
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-white font-bold">البحث</span>
          </div>

          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-8 bg-[#7a1a26] rounded-full inline-block" />
            {query ? (
              <>
                نتائج البحث عن: <span className="text-[#ffd1d6]">«{query}»</span>
              </>
            ) : (
              'البحث في الموقع'
            )}
            {query && (
              <span className="text-xs sm:text-sm font-normal text-gray-300 mr-auto">
                {results.length} نتيجة
              </span>
            )}
          </h1>

          {/* حقل بحث مباشر في الصفحة */}
          <form
            action="/search"
            method="GET"
            className="mt-4 max-w-xl flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="ابحث عن خبر، تقرير، أو كاتب..."
                className="w-full bg-[#102d4a] border border-[#1e4873] rounded-lg py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#7a1a26]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#7a1a26] hover:bg-[#5c131d] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shrink-0 cursor-pointer"
            >
              بحث
            </button>
          </form>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {!query ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-10 sm:p-14 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-[#08243d] text-lg font-black mb-2">
              اكتب كلمة البحث أعلاه
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              يمكنك البحث في كافة الأخبار والتقارير المنشورة بكلمة أو عبارة محددة.
            </p>
          </div>
        ) : errorOccurred ? (
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-10 text-center max-w-md mx-auto">
            <div className="text-4xl mb-3 text-red-500">⚠️</div>
            <h2 className="text-[#08243d] text-base font-bold mb-2">
              حدث خطأ أثناء إجراء البحث
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4">
              يرجى التحقق من الاتصال وإعادة المحاولة.
            </p>
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="inline-block bg-[#7a1a26] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </Link>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-10 sm:p-14 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">📰</div>
            <h2 className="text-[#08243d] text-lg font-black mb-2">
              لا توجد نتائج مطابقة
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-5">
              لم نعثر على أي أخبار تتضمن «{query}». جرب استخدام كلمات أكثر عمومية أو تأكد من صحة الكلمات.
            </p>
            <Link
              href="/latest-news"
              className="inline-block bg-[#7a1a26] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#5c131d] transition"
            >
              تصفح أحدث الأخبار ←
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {results.map((article: any) => {
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
                  <Link
                    href={
                      isOpinion && article.author
                        ? `/author/${article.author.slug}`
                        : `/article/${article.slug}`
                    }
                    className="block relative overflow-hidden"
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

                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        {article.category && (
                          <Link
                            href={`/category/${article.category.slug}`}
                            className="inline-block bg-[#7a1a26] text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black hover:bg-[#5c131d] transition"
                          >
                            {article.category.name}
                          </Link>
                        )}
                        {isOpinion && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                            <span>بقلم:</span>
                            <span className="font-bold text-[#7a1a26]">{authorName}</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/article/${article.slug}`}>
                        <h3 className="text-[#08243d] text-xs sm:text-[13px] md:text-sm font-bold leading-snug sm:leading-5 group-hover:text-[#7a1a26] transition line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>

                      {article.excerpt && (
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[9px] sm:text-[10px] text-gray-400">
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
      </main>

      <Footer />
    </div>
  );
}
