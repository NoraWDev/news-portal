'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getLatestNews, type LatestNewsItem } from '@/app/actions/latest-news';

type LatestNewsClientProps = {
  initialItems: LatestNewsItem[];
  initialHasMore: boolean;
};

export default function LatestNewsClient({
  initialItems,
  initialHasMore,
}: LatestNewsClientProps) {
  const [items, setItems] = useState<LatestNewsItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getLatestNews(page);
      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newUniqueItems = res.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newUniqueItems];
      });
      setHasMore(res.hasMore);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      console.error('[LatestNewsClient] Failed to load more:', err);
      setError('تعذر تحميل المزيد من الأخبار حالياً. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* شبكة الأخبار بتصميم متجاوب ونفس كروت الموقع */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
        {items.map((article) => {
          const isOpinion = Boolean(article.author);
          const authorAvatar = article.author?.avatar_url;
          const authorName = article.author?.name || article.author_name;
          const cardImage = isOpinion
            ? authorAvatar || null
            : article.featured_image || '/news-government.png';

          return (
            <article
              key={article.id}
              className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col"
            >
              <Link
                href={
                  isOpinion && article.author
                    ? `/author/${article.author.slug}`
                    : `/article/${article.slug}`
                }
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

              <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
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
                        {article.author ? (
                          <Link
                            href={`/author/${article.author.slug}`}
                            className="font-bold text-[#7a1a26] hover:underline"
                          >
                            {authorName}
                          </Link>
                        ) : (
                          <span className="font-bold text-[#7a1a26]">{authorName}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-[#08243d] text-xs sm:text-[13px] md:text-sm font-bold leading-snug sm:leading-5 group-hover:text-[#7a1a26] transition line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-gray-100 text-[9px] sm:text-[10px] text-gray-400">
                  <span>
                    {new Date(
                      article.published_at || article.created_at
                    ).toLocaleDateString('ar-YE')}
                  </span>
                  <span>{article.views_count} مشاهدة</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* قسم زر تحميل المزيد وحالات الخطأ والتحميل */}
      <div className="mt-8 sm:mt-10 text-center">
        {error && (
          <div className="mb-4 inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm px-4 py-2.5 rounded-lg">
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={handleLoadMore}
              className="text-[#7a1a26] font-bold underline hover:text-[#5c131d] cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {hasMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-[#7a1a26] hover:bg-[#5c131d] active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>جاري جلب الأخبار...</span>
              </>
            ) : (
              <>
                <span>تحميل المزيد من الأخبار</span>
                <span className="text-base leading-none">↓</span>
              </>
            )}
          </button>
        ) : items.length > 0 ? (
          <div className="inline-block py-2 px-4 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200">
            تم عرض جميع الأخبار المنشورة ({items.length} خبر)
          </div>
        ) : null}
      </div>
    </div>
  );
}
