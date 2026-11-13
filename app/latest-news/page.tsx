import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLatestNews } from '@/app/actions/latest-news';
import LatestNewsClient from './LatestNewsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'أحدث الأخبار | أجراس اليمن الإخبارية',
  description: 'متابعة حية ومستمرة لجميع الأخبار والتغطيات الصحفية من منصة أجراس اليمن الإخبارية لحظة بلحظة.',
  openGraph: {
    title: 'أحدث الأخبار | أجراس اليمن الإخبارية',
    description: 'متابعة حية ومستمرة لجميع الأخبار والتغطيات الصحفية من منصة أجراس اليمن الإخبارية لحظة بلحظة.',
  },
};

export default async function LatestNewsPage() {
  let initialItems: any[] = [];
  let initialHasMore = false;
  let totalCount = 0;

  try {
    const res = await getLatestNews(0);
    initialItems = res.items;
    initialHasMore = res.hasMore;
    totalCount = res.total;
  } catch (err) {
    console.error('[LatestNewsPage] Failed to fetch initial latest news:', err);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      {/* عنوان الصفحة و Breadcrumb */}
      <section className="bg-[#08243d] border-b border-[#0a2e4d]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Link href="/" className="hover:text-white transition">
              الرئيسية
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-white font-bold">أحدث الأخبار</span>
          </div>

          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-8 bg-[#7a1a26] rounded-full inline-block" />
            أحدث الأخبار
            <span className="text-sm font-normal text-gray-300 mr-auto">
              {totalCount} خبر
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm mt-1 leading-6 max-w-2xl">
            متابعة شاملة ومستمرة لجميع المستجدات والتقارير الصحفية لحظة بلحظة من كافة الأقسام.
          </p>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* رأس القسم */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg font-black">
            <span className="w-1.5 h-5 sm:h-6 bg-[#7a1a26] rounded-full" />
            جميع الأخبار المنشورة
          </h2>
          <span className="text-xs text-gray-400 font-semibold">
            مرتبة من الأحدث إلى الأقدم
          </span>
        </div>

        {initialItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">📰</div>
            <h3 className="text-[#08243d] text-base sm:text-lg font-black mb-2">
              لا توجد أخبار منشورة حالياً
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">
              تابعونا للمزيد من التغطيات الإخبارية والمستجدات.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#7a1a26] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black hover:bg-[#5c131d] transition"
            >
              العودة للرئيسية ←
            </Link>
          </div>
        ) : (
          <LatestNewsClient
            initialItems={initialItems}
            initialHasMore={initialHasMore}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
