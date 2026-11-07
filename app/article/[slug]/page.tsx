import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  return prisma.articles.findFirst({
    where: {
      slug,
      status: 'published', // حصر العرض على الأخبار المنشورة فقط
    },
    include: {
      category: true,
    },
  });
}

async function getRelatedArticles(categoryId: bigint | null, currentArticleId: bigint) {
  if (!categoryId) return [];
  return prisma.articles.findMany({
    where: {
      category_id: categoryId,
      id: { not: currentArticleId },
      status: 'published',
    },
    take: 3,
    orderBy: {
      published_at: 'desc',
    },
    include: {
      category: true,
    },
  });
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
            <span className="font-semibold text-gray-700">
              بقلم: {article.author_name || 'هيئة التحرير'}
            </span>
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
        </article>

        {/* أخبار ذات صلة */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#08243d] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
              أخبار ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id.toString()}
                  href={`/article/${rel.slug}`}
                  className="bg-white rounded-xl border border-[#dbe3ea] overflow-hidden hover:shadow-md transition group flex flex-col"
                >
                  {rel.featured_image && (
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.featured_image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-[#08243d] group-hover:text-[#7a1a26] transition line-clamp-2 leading-6">
                      {rel.title}
                    </h3>
                    <div className="mt-2 text-[10px] text-gray-400">
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
