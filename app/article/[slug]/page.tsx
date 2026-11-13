import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import ShareButtons from './ShareButtons';
import CommentsSection from './CommentsSection';
import { getApprovedComments } from './actions';

export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  return prisma.articles.findFirst({
    where: {
      slug,
      status: 'published', // حصر العرض على الأخبار المنشورة فقط
    },
    include: {
      category: true,
      author: true,
    },
  });
}

async function getRelatedArticles(categoryId: bigint | null, currentArticleId: bigint) {
  let related: any[] = [];
  try {
    if (categoryId) {
      related = await prisma.articles.findMany({
        where: {
          category_id: categoryId,
          id: { not: currentArticleId },
          status: 'published',
        },
        take: 4,
        orderBy: [{ published_at: 'desc' }, { created_at: 'desc' }],
        include: {
          category: true,
        },
      });
    }

    if (related.length < 4) {
      const excludeIds = [currentArticleId, ...related.map((r) => r.id)];
      const fallback = await prisma.articles.findMany({
        where: {
          id: { notIn: excludeIds },
          status: 'published',
        },
        take: 4 - related.length,
        orderBy: [{ published_at: 'desc' }, { created_at: 'desc' }],
        include: {
          category: true,
        },
      });
      related = [...related, ...fallback];
    }
  } catch (err) {
    console.error('[ArticlePage] Failed to fetch related articles:', err);
  }

  return related;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticle(decodedSlug);

  if (!article) {
    return { title: 'الخبر غير موجود | أجراس اليمن الإخبارية' };
  }

  return {
    title: `${article.title} | أجراس اليمن الإخبارية`,
    description: article.excerpt || article.title,
    openGraph: {
      title: `${article.title} | أجراس اليمن الإخبارية`,
      description: article.excerpt || article.title,
      images: article.featured_image ? [article.featured_image] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticle(decodedSlug);

  if (!article) {
    notFound();
  }

  // تحديث عداد المشاهدات بهدوء
  try {
    await prisma.articles.update({
      where: { id: article.id },
      data: { views_count: { increment: 1 } },
    });
  } catch {
    // تجاهل أخطاء زيادة العداد غير الحرجة
  }

  const related = await getRelatedArticles(article.category_id, article.id);
  const approvedComments = await getApprovedComments(article.id);

  // رابط الخبر الكامل للمشاركة
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ajrasalyemen.news';
  const articleUrl = `${siteUrl}/article/${article.slug}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* مسار التنقل Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#7a1a26] transition">الرئيسية</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} className="hover:text-[#7a1a26] transition">
                {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-400 line-clamp-1">{article.title}</span>
        </nav>

        {/* جسم الخبر */}
        <article className="bg-white rounded-2xl border border-[#dbe3ea] shadow-sm p-5 sm:p-8">
          {/* تصنيف الخبر */}
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block bg-[#7a1a26] text-white px-3 py-1 rounded-md text-xs font-bold mb-3 hover:bg-[#5c131d] transition"
            >
              {article.category.name}
            </Link>
          )}

          {/* عنوان الخبر */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#08243d] leading-snug sm:leading-relaxed mb-4">
            {article.title}
          </h1>

          {/* تفاصيل الكاتب والتاريخ والمشاهدات */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-4 mb-6 border-b border-gray-100 text-xs text-gray-500">
            {/* بيانات الكاتب */}
            {article.author ? (
              <Link
                href={`/author/${article.author.slug}`}
                className="flex items-center gap-2 group"
              >
                {article.author.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.author.avatar_url}
                    alt={article.author.name}
                    className="size-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-[#f1e7e9] flex items-center justify-center text-[#7a1a26] font-black text-sm">
                    {article.author.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-gray-700 group-hover:text-[#7a1a26] transition">
                  {article.author.name}
                </span>
              </Link>
            ) : (
              <span className="font-semibold text-gray-700">
                بقلم: {article.author_name || 'هيئة التحرير'}
              </span>
            )}
            <span>•</span>
            <span>
              {new Date(article.published_at || article.created_at).toLocaleDateString('ar-YE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>{article.views_count.toString()} مشاهدة</span>
          </div>

          {/* المقتطف / العنوان الفرعي */}
          {article.excerpt && (
            <div className="bg-[#f8fafc] border-r-4 border-[#7a1a26] p-4 rounded-l-lg mb-6 text-gray-700 text-sm sm:text-base font-semibold leading-relaxed">
              {article.excerpt}
            </div>
          )}

          {/* الصورة البارزة */}
          {article.featured_image && (
            <div className="relative w-full rounded-xl overflow-hidden mb-8 max-h-[500px] bg-neutral-900 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* محتوى الخبر */}
          <div className="text-gray-800 text-base sm:text-lg leading-loose space-y-4 whitespace-pre-line font-normal">
            {article.content}
          </div>

          {/* بطاقة الكاتب أسفل المقال */}
          {article.author && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href={`/author/${article.author.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#dbe3ea] hover:border-[#7a1a26] hover:shadow-sm transition group"
              >
                {article.author.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.author.avatar_url}
                    alt={article.author.name}
                    className="size-16 rounded-full object-cover border-2 border-[#7a1a26] shrink-0"
                  />
                ) : (
                  <div className="size-16 rounded-full bg-[#f1e7e9] border-2 border-[#7a1a26] flex items-center justify-center shrink-0">
                    <span className="text-[#7a1a26] text-2xl font-black">
                      {article.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">عن الكاتب</p>
                  <p className="font-bold text-[#08243d] group-hover:text-[#7a1a26] transition text-sm sm:text-base">
                    {article.author.name}
                  </p>
                  {article.author.bio && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-5">
                      {article.author.bio}
                    </p>
                  )}
                </div>
                <span className="text-[#7a1a26] text-xs font-semibold shrink-0 group-hover:underline">
                  جميع المقالات ←
                </span>
              </Link>
            </div>
          )}

          {/* أزرار المشاركة */}
          <ShareButtons title={article.title} url={articleUrl} />

          {/* قسم التعليقات */}
          <CommentsSection
            articleId={article.id.toString()}
            initialComments={approvedComments}
          />
        </article>

        {/* أخبار ذات صلة */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#08243d] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
              أخبار ذات صلة
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id.toString()}
                  href={`/article/${rel.slug}`}
                  className="bg-white rounded-xl border border-[#dbe3ea] overflow-hidden hover:shadow-md transition group flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.featured_image || '/news-government.png'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {rel.category && (
                        <span className="inline-block bg-[#7a1a26]/10 text-[#7a1a26] text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
                          {rel.category.name}
                        </span>
                      )}
                      <h3 className="text-xs sm:text-sm font-bold text-[#08243d] group-hover:text-[#7a1a26] transition line-clamp-2 leading-snug sm:leading-5">
                        {rel.title}
                      </h3>
                    </div>
                    <div className="mt-2 text-[9px] sm:text-[10px] text-gray-400">
                      {new Date(rel.published_at || rel.created_at).toLocaleDateString('ar-YE')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
