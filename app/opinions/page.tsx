import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المقالات | أجراس اليمن الإخبارية',
  description: 'مقالات الرأي والتحليلات السياسية والفكرية بأقلام نخبة من الكتاب والباحثين في الشأن اليمني والإقليمي.',
  openGraph: {
    title: 'المقالات | أجراس اليمن الإخبارية',
    description: 'مقالات الرأي والتحليلات السياسية والفكرية بأقلام نخبة من الكتاب والباحثين في الشأن اليمني والإقليمي.',
  },
};

export default async function OpinionsPage() {
  let opinions: any[] = [];
  let opinionsCount = 0;

  try {
    [opinions, opinionsCount] = await Promise.all([
      prisma.articles.findMany({
        where: {
          status: 'published',
          author_id: { not: null },
        },
        include: {
          category: true,
          author: true,
        },
        orderBy: [
          { published_at: 'desc' },
          { created_at: 'desc' },
        ],
        take: 30,
      }),
      prisma.articles.count({
        where: {
          status: 'published',
          author_id: { not: null },
        },
      }),
    ]);
  } catch (err) {
    console.error('[OpinionsPage] DB Error:', err);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      {/* ===== عنوان الصفحة والـ Breadcrumb ===== */}
      <section className="bg-[#08243d] border-b border-[#0a2e4d]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Link href="/" className="hover:text-white transition">
              الرئيسية
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-white font-bold">المقالات</span>
          </div>

          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-8 bg-[#7a1a26] rounded-full inline-block" />
            المقالات
            <span className="text-sm font-normal text-gray-300 mr-auto">
              {opinionsCount} مقال
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm mt-1 leading-6 max-w-2xl">
            مقالات الرأي والتحليلات السياسية والفكرية لنخبة من الكتاب والمحللين الصحفيين.
          </p>
        </div>
      </section>

      {/* ===== المحتوى الرئيسي ===== */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* رأس القسم */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg font-black">
            <span className="w-1.5 h-5 sm:h-6 bg-[#7a1a26] rounded-full" />
            أحدث مقالات الرأي
          </h2>
          <span className="text-xs text-gray-400 font-semibold">
            {opinionsCount} مقال منشور
          </span>
        </div>

        {opinions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="text-[#08243d] text-base sm:text-lg font-black mb-2">
              لا توجد مقالات رأي منشورة حالياً
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">
              تابعونا لقراءة أحدث مقالات الرأي والتحليلات الفكرية فور نشرها.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#7a1a26] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black hover:bg-[#5c131d] transition"
            >
              العودة للرئيسية ←
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
            {opinions.map((article: any) => {
              const author = article.author;
              const authorAvatar = author?.avatar_url;
              const authorName = author?.name || article.author_name || 'كاتب رأي';

              return (
                <article
                  key={article.id.toString()}
                  className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col"
                >
                  {/* رأس بطاقة الكاتب */}
                  <div className="p-3 sm:p-4 bg-gradient-to-b from-[#faf5f6] to-white border-b border-gray-100 flex flex-col items-center text-center">
                    {author ? (
                      <Link
                        href={`/author/${author.slug}`}
                        className="group/author flex flex-col items-center"
                        title={`صفحة الكاتب ${authorName}`}
                      >
                        {authorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-[#7a1a26] p-0.5 shadow-sm group-hover/author:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#f1e7e9] border-2 border-[#7a1a26] flex items-center justify-center group-hover/author:scale-105 transition duration-300">
                            <span className="text-[#7a1a26] text-xl sm:text-2xl font-black">
                              {authorName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="mt-2 text-xs sm:text-sm font-bold text-[#7a1a26] group-hover/author:underline line-clamp-1">
                          {authorName}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">
                          ✍️
                        </div>
                        <span className="mt-2 text-xs sm:text-sm font-bold text-gray-700">
                          {authorName}
                        </span>
                      </div>
                    )}
                    {author?.bio && (
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[180px]">
                        {author.bio}
                      </p>
                    )}
                  </div>

                  {/* نص المقال والبيانات */}
                  <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
                    <Link href={`/article/${article.slug}`} className="block">
                      <h3 className="text-[#08243d] text-xs sm:text-[13px] md:text-sm font-black leading-snug sm:leading-5 group-hover:text-[#7a1a26] transition line-clamp-3">
                        {article.title}
                      </h3>
                    </Link>

                    {article.excerpt && (
                      <p className="hidden md:block text-gray-400 text-xs leading-5 mt-1.5 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-gray-100 text-[9px] sm:text-[10px] text-gray-400">
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
