import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAuthorBySlug } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getAuthorBySlug(decodeURIComponent(slug));
  if (!res.success || !res.data) return { title: 'الكاتب غير موجود | أجراس اليمن' };
  const author = res.data as any;
  return {
    title: `${author.name} | أجراس اليمن الإخبارية`,
    description: author.bio || `مقالات الكاتب ${author.name}`,
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getAuthorBySlug(decodeURIComponent(slug));

  if (!res.success || !res.data) {
    notFound();
  }

  const author = res.data as any;
  const articles = author.articles ?? [];

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* بطاقة الكاتب */}
        <div className="bg-white rounded-2xl border border-[#dbe3ea] shadow-sm p-6 sm:p-10 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* الصورة */}
          {author.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatar_url}
              alt={author.name}
              className="size-28 sm:size-32 rounded-full object-cover border-4 border-[#7a1a26] shrink-0"
            />
          ) : (
            <div className="size-28 sm:size-32 rounded-full bg-[#f1e7e9] border-4 border-[#7a1a26] flex items-center justify-center shrink-0">
              <span className="text-[#7a1a26] text-4xl font-black">
                {author.name.charAt(0)}
              </span>
            </div>
          )}

          {/* البيانات */}
          <div className="flex-1 text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-[#08243d] mb-2">
              {author.name}
            </h1>
            {author.bio && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                {author.bio}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 bg-[#f8fafc] border border-[#dbe3ea] rounded-full px-4 py-1.5 text-sm text-[#7a1a26] font-semibold">
              {articles.length} مقال منشور
            </div>
          </div>
        </div>

        {/* قائمة المقالات */}
        <section>
          <h2 className="text-lg sm:text-xl font-black text-[#08243d] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
            مقالات {author.name}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              لا توجد مقالات منشورة لهذا الكاتب حتى الآن.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="bg-white rounded-xl border border-[#dbe3ea] overflow-hidden hover:shadow-md transition group flex flex-col"
                >
                  {/* صورة الكاتب كصورة المقال */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#f1e7e9] relative flex items-center justify-center">
                    {author.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={author.avatar_url}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <span className="text-[#7a1a26] text-3xl sm:text-5xl font-black opacity-30">
                        {author.name.charAt(0)}
                      </span>
                    )}
                    {/* تصنيف القسم */}
                    {article.category && (
                      <span className="absolute top-2 right-2 bg-[#7a1a26] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">
                        {article.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-[#08243d] group-hover:text-[#7a1a26] transition line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-6">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="hidden md:block text-xs text-gray-500 mt-2 line-clamp-2 leading-5">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-gray-400">
                      {new Date(article.published_at || article.created_at).toLocaleDateString('ar-YE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
