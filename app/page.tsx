import Header from '@/components/Header';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getFeaturedArticle, getLatestArticles, getMostReadArticles, getFeaturedVideo, getLatestVideos, type ArticleWithCategory, type VideoWithCategory } from '@/lib/data/home';

export default async function Home() {
  const [featuredArticle, latestArticles, mostReadArticles, featuredVideo, latestVideos] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(4),
    getMostReadArticles(4),
    getFeaturedVideo(),
    getLatestVideos(3),
  ]);

  const ads = [1, 2, 3];

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden">
      <Header />

      {/* ================= القسم الرئيسي ================= */}
      <section
        className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-7"
        dir="rtl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[3.2fr_1fr] gap-3 sm:gap-4 items-start">
          
          {/* ================= الإعلانات - يسار في الديسكتوب، وأسفل الخبر في الجوال ================= */}
          <aside className="order-2 lg:order-2 flex flex-col gap-3">
            {ads.map((ad) => (
              <Link
                key={ad}
                href="/advertise"
                className="
                  relative
                  h-[95px]
                  sm:h-[115px]
                  md:h-[125px]
                  lg:h-[92px]
                  xl:h-[101px]
                  overflow-hidden
                  rounded-xl
                  bg-[#08090b]
                  border border-[#5c131d]/50
                  hover:border-[#7a1a26]
                  transition
                  shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                  block
                  group
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
                <div
                  className="
                    absolute
                    -top-10
                    -right-10
                    w-32
                    h-32
                    rounded-full
                    bg-[#7a1a26]/15
                    blur-2xl
                  "
                />
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    w-[85px]
                    h-full
                    opacity-70
                    pointer-events-none
                  "
                >
                  <div className="absolute top-0 right-[-35px] w-[2px] h-[145px] bg-[#7a1a26]/70 rotate-[-43deg]" />
                  <div className="absolute top-0 right-[-20px] w-[1px] h-[145px] bg-white/30 rotate-[-43deg]" />
                </div>
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-24
                    h-[1px]
                    bg-gradient-to-r
                    from-[#7a1a26]
                    to-transparent
                  "
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-2 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/agras-bg.png"
                    alt="أجراس اليمن"
                    className="
                      w-[48px]
                      sm:w-[58px]
                      md:w-[68px]
                      h-auto
                      object-contain
                      drop-shadow-md
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    "
                  />
                  <div className="text-white text-[10px] sm:text-[11px] md:text-xs font-bold mt-1">
                    مساحتك الإعلانية هنا
                  </div>
                  <span className="text-[#d4737f] text-[9px] font-semibold mt-0.5 group-hover:text-white transition">
                    أعلن معنا ←
                  </span>
                </div>
              </Link>
            ))}
          </aside>

          {/* ================= الخبر الرئيسي - يمين ================= */}
          {featuredArticle ? (
          <Link
            href={`/article/${featuredArticle.slug}`}
            className="
              order-1
              lg:order-1
              relative
              lg:h-[calc(3*(92px)+24px)]
              xl:h-[calc(3*(101px)+24px)]
              h-[330px]
              sm:h-[390px]
              md:h-[440px]
              overflow-hidden
              rounded-xl
              bg-[#031321]
              shadow-[0_6px_25px_rgba(0,0,0,0.16)]
              block
              group
            "
          >
            <img
              src={featuredArticle.featured_image || "/yemen-bg.jpg"}
              alt={featuredArticle.title}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
                brightness-125
                contrast-[1.05]
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-[#020b14]/80 via-55% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020b14]/20 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end px-3.5 pb-3 sm:px-6 sm:pb-4 lg:px-7 lg:pb-4">
              {featuredArticle.category && (
                <div className="mb-1.5">
                  <span className="inline-flex items-center bg-[#7a1a26] text-white px-2.5 py-0.5 rounded-md text-[10px] md:text-[11px] font-black">
                    {featuredArticle.category.name}
                  </span>
                </div>
              )}
              <h1 className="text-white text-sm sm:text-lg md:text-xl lg:text-[21px] xl:text-[23px] font-bold leading-snug sm:leading-[1.35] max-w-full lg:max-w-[850px] drop-shadow-md">
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p className="text-gray-300 text-[10px] sm:text-xs leading-relaxed mt-1 max-w-full lg:max-w-[820px] line-clamp-2">
                  {featuredArticle.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2 pt-2 border-t border-white/15 text-gray-300 text-[9px] sm:text-[10px] md:text-[11px]">
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  {new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="h-2.5 w-px bg-white/20" />
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                  {featuredArticle.views_count.toString()} مشاهدة
                </span>
                <span className="h-2.5 w-px bg-white/20" />
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 20l1.2-3.1A7.4 7.4 0 0 1 4.5 12a7.5 7.5 0 0 1 15.5-.5Z" /></svg>
                  {featuredArticle.comments_count.toString()} تعليق
                </span>
              </div>
            </div>
          </Link>
          ) : (
            <div className="order-1 lg:order-1 relative lg:h-[calc(3*(92px)+24px)] xl:h-[calc(3*(101px)+24px)] h-[330px] sm:h-[390px] md:h-[440px] bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">لا يوجد خبر رئيسي</span>
            </div>
          )}
        </div>
      </section>

      {/* ================= المحتوى الأوسط (أحدث الأخبار + الأكثر قراءة للجوال + الفيديوهات + أعلن معنا للجوال) ================= */}
      <section
        className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6"
        dir="rtl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[3.2fr_1fr] gap-3 sm:gap-4 items-start">
          <div className="min-w-0 flex flex-col gap-4">
            
            {/* صندوق أحدث الأخبار */}
            <div className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 border-b border-gray-200">
                <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg md:text-xl font-black">
                  <span className="w-1.5 h-5 sm:h-6 bg-[#7a1a26] rounded-full"></span>
                  أحدث الأخبار
                </h2>
                <Link
                  href="/latest-news"
                  className="text-xs sm:text-sm font-bold text-gray-400 hover:text-[#08243d] transition"
                >
                  عرض الكل ←
                </Link>
              </div>

              <div className="px-3 sm:px-4 md:px-5">
                {latestArticles.length > 0 ? latestArticles.map((article: ArticleWithCategory) => (
                  <article key={article.id.toString()} className="flex flex-row items-start gap-3 sm:gap-4 md:gap-5 py-3.5 sm:py-4 border-b border-gray-200 last:border-b-0">
                    <img
                      src={article.featured_image || "/news-government.png"}
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
                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString('ar-YE')}</span>
                        <span>•</span>
                        <span>{article.views_count.toString()} مشاهدة</span>
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="min-h-[250px] sm:min-h-[380px] md:min-h-[420px] flex items-center justify-center text-center text-gray-400 font-semibold text-sm">
                    لا توجد أخبار حديثة حالياً
                  </div>
                )}
              </div>
            </div>

            {/* ================= قسم الأكثر قراءة (يظهر في الجوال فقط هنا لمنع التكرار) ================= */}
            <div className="lg:hidden bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="flex items-center gap-2 text-[#08243d] text-base sm:text-lg font-black">
                  <span className="text-[#7a1a26] text-lg sm:text-xl">♨</span>
                  الأكثر قراءة
                </h2>
              </div>
              <div className="px-3">
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-base sm:text-lg w-5 shrink-0 text-center">1</span>
                  <img src="/news-economy.png" alt="أسعار الصرف" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">تراجع أسعار الصرف في عدن والمحافظات</h3>
                    <span className="text-gray-400 text-[10px]">منذ 12 ساعة</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-base sm:text-lg w-5 shrink-0 text-center">2</span>
                  <img src="/news-government.png" alt="الحكومة اليمنية" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">الحكومة اليمنية تؤكد استمرار جهودها</h3>
                    <span className="text-gray-400 text-[10px]">منذ 9 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-base sm:text-lg w-5 shrink-0 text-center">3</span>
                  <img src="/news-military.png" alt="خبر عسكري" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">الجيش اليمني يعلن تنفيذ عملية نوعية</h3>
                    <span className="text-gray-400 text-[10px]">منذ 7 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-base sm:text-lg w-5 shrink-0 text-center">4</span>
                  <img src="/news-port.png" alt="ميناء عدن" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">اتفاقية جديدة لدعم قطاع الموانئ في اليمن</h3>
                    <span className="text-gray-400 text-[10px]">منذ 5 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3">
                  <span className="text-[#7a1a26] font-black text-base sm:text-lg w-5 shrink-0 text-center">5</span>
                  <img src="/news-government.png" alt="تطورات في المحافظات" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">تطورات جديدة في المحافظات اليمنية</h3>
                    <span className="text-gray-400 text-[10px]">منذ 4 ساعات</span>
                  </div>
                </article>
              </div>
            </div>

            {/* ================= قسم الفيديوهات ================= */}
            <div className="relative overflow-hidden rounded-xl bg-[#050608] border border-[#5c131d]/40 shadow-[0_6px_25px_rgba(0,0,0,0.25)]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#5c131d]/15 blur-3xl" />
                <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
              </div>

              {/* عنوان قسم الفيديوهات */}
              <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-4 sm:px-5 md:px-7 pt-4 sm:pt-5 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#7a1a26] flex items-center justify-center">
                    <span className="text-white text-sm sm:text-lg mr-0.5">▶</span>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-black">
                    فيديوهات
                  </h2>
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-l from-[#7a1a26] via-[#7a1a26]/60 to-transparent" />
                <Link
                  href="/videos"
                  className="hidden sm:flex items-center gap-2 text-gray-300 text-sm md:text-base font-bold whitespace-nowrap hover:text-white transition"
                >
                  <span>عرض جميع الفيديوهات</span>
                  <span className="text-lg">←</span>
                </Link>
              </div>

              {/* محتوى الفيديوهات */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-4 px-3 sm:px-4 md:px-6 pb-4 sm:pb-5">
                
                {/* الفيديو الرئيسي */}
                {featuredVideo ? (
                  <article className="group relative min-h-[280px] xs:min-h-[310px] sm:min-h-[340px] md:min-h-[380px] overflow-hidden rounded-xl border border-neutral-700/80 bg-[#000000]">
                    <Link href={`/video/${featuredVideo.id}`} className="block relative w-full h-full min-h-[280px] xs:min-h-[310px] sm:min-h-[340px] md:min-h-[380px]">
                      <img
                        src={featuredVideo.thumbnail_url || "/yemen-bg.jpg"}
                        alt={featuredVideo.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 via-55% to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/30 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white/90 bg-black/45 backdrop-blur-sm flex items-center justify-center transition duration-300 group-hover:scale-110 group-hover:bg-[#5c131d]/30">
                          <span className="text-white text-xl sm:text-2xl md:text-3xl mr-[-2px]">▶</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 left-0 z-10 px-3.5 sm:px-5 md:px-7 pb-3.5 sm:pb-5">
                        {featuredVideo.category && (
                          <span className="inline-flex items-center bg-black/80 border border-[#7a1a26] text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black mb-2 sm:mb-3">
                            {featuredVideo.category.name}
                          </span>
                        )}
                        <h3 className="text-white text-base sm:text-xl md:text-2xl font-black leading-snug sm:leading-[1.35] max-w-[650px] line-clamp-2">
                          {featuredVideo.title}
                        </h3>
                        {featuredVideo.description && (
                          <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm leading-relaxed sm:leading-6 mt-1.5 sm:mt-2 max-w-[680px] line-clamp-2">
                            {featuredVideo.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/15 text-gray-300 text-[10px] sm:text-xs md:text-sm">
                          <span className="flex items-center gap-1.5 sm:gap-2">
                            <span>◷</span>
                            {new Date(featuredVideo.published_at || featuredVideo.created_at).toLocaleDateString('ar-YE')}
                          </span>
                          <span className="flex items-center gap-1.5 sm:gap-2">
                            <span>◉</span>
                            {featuredVideo.views_count.toString()} مشاهدة
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ) : (
                  <div className="group relative min-h-[280px] sm:min-h-[320px] md:min-h-[380px] overflow-hidden rounded-xl border border-gray-600 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">لا يوجد فيديو رئيسي</span>
                  </div>
                )}

                {/* الفيديوهات الجانبية */}
                <div className="flex flex-col gap-2.5 sm:gap-3 justify-between">
                  {latestVideos.length > 0 ? latestVideos.map((video: VideoWithCategory) => (
                    <Link key={video.id.toString()} href={`/video/${video.id}`} className="block group">
                      <article className="flex flex-row gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl border border-white/20 bg-[#0f1014]/90 hover:border-[#5c131d] transition duration-300 items-center">
                        <div className="relative w-[100px] xs:w-[115px] sm:w-[130px] md:w-[140px] aspect-[16/10] shrink-0 overflow-hidden rounded-lg bg-black">
                          <img
                            src={video.thumbnail_url || "/news-port.png"}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/85 border border-white flex items-center justify-center text-white text-[10px] sm:text-xs">
                              ▶
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-full">
                          {video.category && (
                            <span className="self-start border border-[#7a1a26] text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold">
                              {video.category.name}
                            </span>
                          )}
                          <h3 className="text-white text-[11px] sm:text-xs md:text-sm font-black leading-snug sm:leading-5 mt-1 line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[10px] mt-1 sm:mt-1.5">
                            <span>{new Date(video.published_at || video.created_at).toLocaleDateString('ar-YE')}</span>
                            <span>{video.views_count.toString()} مشاهدة</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )) : (
                    <div className="py-8 text-center text-gray-400">لا توجد فيديوهات حديثة</div>
                  )}
                </div>

              </div>

              {/* رابط الجوال للفيديوهات */}
              <div className="relative z-10 sm:hidden px-4 pb-4">
                <Link
                  href="/videos"
                  className="flex items-center justify-center gap-2 w-full border border-[#7a1a26] text-white py-2.5 rounded-lg text-xs font-bold bg-[#14151a]"
                >
                  عرض جميع الفيديوهات
                  <span>←</span>
                </Link>
              </div>
            </div>

            {/* ================= قسم أعلن معنا (يظهر في الجوال والتابلت هنا بتصميم مناسب وسهل الضغط) ================= */}
            <div className="lg:hidden">
              <section className="relative overflow-hidden rounded-xl bg-[#08090b] border border-[#5c131d]/50 shadow-sm p-4 sm:p-5 text-right">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#7a1a26]/15 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-white text-lg sm:text-xl font-black">أعلن معنا</h2>
                        <span className="text-[#7a1a26] text-xl font-black">+</span>
                      </div>
                      <p className="text-gray-300 text-xs font-semibold mt-0.5">وصل إعلانك إلى جمهور واسع في اليمن والعالم</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-black/60 border border-neutral-700/60 flex items-center justify-center shrink-0">
                      <span className="text-white text-2xl">📣</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center py-1">
                    <div className="bg-[#121318] p-2 rounded-lg border border-white/5">
                      <div className="text-[#d4737f] text-base mb-0.5">✦</div>
                      <span className="text-white text-[10px] font-bold block">مواقع إخبارية</span>
                    </div>
                    <div className="bg-[#121318] p-2 rounded-lg border border-white/5">
                      <div className="text-[#d4737f] text-base mb-0.5">◉</div>
                      <span className="text-white text-[10px] font-bold block">جمهور مستهدف</span>
                    </div>
                    <div className="bg-[#121318] p-2 rounded-lg border border-white/5">
                      <div className="text-[#d4737f] text-base mb-0.5">✥</div>
                      <span className="text-white text-[10px] font-bold block">أعلى مصداقية</span>
                    </div>
                  </div>
                  <Link
                    href="/advertise"
                    className="mt-3.5 w-full flex items-center justify-center gap-2 bg-[#7a1a26] hover:bg-[#5c131d] active:scale-[0.98] text-white py-2.5 rounded-lg text-xs font-black shadow-md transition"
                  >
                    ابدأ الآن
                    <span>←</span>
                  </Link>
                </div>
              </section>
            </div>

            {/* ================= مساحة إعلانية كبرى تحت الفيديوهات ================= */}
            <section className="w-full" dir="rtl">
              <div className="
                relative
                w-full
                min-h-[150px]
                sm:min-h-[180px]
                md:h-56
                py-5
                px-4
                overflow-hidden
                rounded-xl
                bg-[#08090b]
                border border-[#5c131d]/50
                shadow-[0_4px_20px_rgba(0,0,0,0.2)]
                flex flex-col
                items-center
                justify-center
                group
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#7a1a26]/15 blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-[120px] h-full opacity-60 pointer-events-none">
                  <div className="absolute top-0 right-[-40px] w-[2px] h-[200px] bg-[#7a1a26]/70 rotate-[-43deg]" />
                  <div className="absolute top-0 right-[-20px] w-[1px] h-[200px] bg-white/30 rotate-[-43deg]" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/agras-bg.png"
                    alt="أجراس اليمن الإخبارية"
                    className="w-[60px] sm:w-[75px] md:w-[90px] h-auto object-contain mb-1.5 opacity-90 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-white text-sm sm:text-base md:text-xl font-black tracking-wide">
                    مساحة إعلانية كبرى — مساحتك الإعلانية هنا
                  </h3>
                  <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm mt-1 max-w-md">
                    اجعل إعلانك التجاري يظهر هنا بمساحة بارزة وواسعة لزوار موقع أجراس اليمن الإخبارية.
                  </p>
                  <Link
                    href="/advertise"
                    className="mt-2.5 sm:mt-3 inline-block bg-[#7a1a26] hover:bg-[#5c131d] text-white px-5 py-1.5 rounded-md text-[11px] sm:text-xs font-black shadow-md transition"
                  >
                    احجز مساحتك الآن ←
                  </Link>
                </div>
              </div>
            </section>

          </div>

          {/* ================= الجانب المقابل للكمبيوتر (أعلن معنا والنشرة والأكثر قراءة) ================= */}
          <div className="hidden lg:flex flex-col gap-4">
            
            {/* أعلن معنا */}
            <section className="relative overflow-hidden rounded-xl bg-[#08090b] border border-[#5c131d]/40 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#7a1a26]/15 blur-2xl" />
              <div className="relative z-10 p-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <h2 className="text-white text-2xl font-black">أعلن معنا</h2>
                  <span className="text-[#7a1a26] text-2xl font-black">+</span>
                </div>
                <p className="text-gray-300 text-sm font-semibold mt-1 leading-6">وصل إعلانك إلى جمهور واسع</p>
                <div className="flex justify-center py-3">
                  <div className="w-20 h-16 rounded-lg bg-black/60 border border-neutral-700/60 flex items-center justify-center">
                    <span className="text-white text-4xl">📣</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[#7a1a26] text-lg">✦</div>
                    <span className="text-white text-[10px] font-bold">مواقع إخبارية</span>
                  </div>
                  <div>
                    <div className="text-[#7a1a26] text-lg">◉</div>
                    <span className="text-white text-[10px] font-bold">مستهدف</span>
                  </div>
                  <div>
                    <div className="text-[#7a1a26] text-lg">✥</div>
                    <span className="text-white text-[10px] font-bold">مصداقية</span>
                  </div>
                </div>
                <Link
                  href="/advertise"
                  className="mt-4 mx-auto flex w-fit items-center justify-center gap-2 bg-[#7a1a26] text-white px-7 py-2 rounded-md text-sm font-black hover:bg-[#5c131d] transition"
                >
                  ابدأ الآن
                  <span>←</span>
                </Link>
              </div>
            </section>

            {/* اشترك في نشرتنا الإخبارية */}
            <section className="relative overflow-hidden rounded-xl bg-[#08090b] border border-[#5c131d]/40 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f13] via-[#08090b] to-[#020304]" />
              <div className="relative z-10 p-5 text-right">
                <div className="flex items-center justify-end gap-3 mb-3">
                  <h2 className="text-white text-lg font-black">اشترك في نشرتنا الإخبارية</h2>
                  <span className="text-white text-3xl">✉</span>
                </div>
                <p className="text-gray-300 text-xs leading-6 mb-3">كن أول من يصلك آخر الأخبار والتحديثات من منصة أجراس اليمن الإخبارية</p>
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
                <div className="grid grid-cols-3 border-t border-white/10 mt-4 pt-3 text-center">
                  <div>
                    <div className="text-[#7a1a26] text-lg">★</div>
                    <span className="text-gray-300 text-[9px] font-bold">محتوى مميز</span>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="text-[#7a1a26] text-lg">▣</div>
                    <span className="text-gray-300 text-[9px] font-bold">تقارير حصرية</span>
                  </div>
                  <div>
                    <div className="text-[#7a1a26] text-lg">ϟ</div>
                    <span className="text-gray-300 text-[9px] font-bold">أخبار عاجلة</span>
                  </div>
                </div>
              </div>
            </section>

            {/* الأكثر قراءة للكمبيوتر (نفس الموضع والحجم الدقيق) */}
            <section className="bg-white rounded-xl border border-[#dbe3ea] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="flex items-center gap-2 text-[#08243d] text-lg font-black">
                  <span className="text-[#7a1a26] text-xl">♨</span>
                  الأكثر قراءة
                </h2>
              </div>
              <div className="px-3">
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-lg w-5">1</span>
                  <img src="/news-economy.png" alt="أسعار الصرف" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">تراجع أسعار الصرف في عدن والمحافظات</h3>
                    <span className="text-gray-400 text-[10px]">منذ 12 ساعة</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-lg w-5">2</span>
                  <img src="/news-government.png" alt="الحكومة اليمنية" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">الحكومة اليمنية تؤكد استمرار جهودها</h3>
                    <span className="text-gray-400 text-[10px]">منذ 9 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-lg w-5">3</span>
                  <img src="/news-military.png" alt="خبر عسكري" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">الجيش اليمني يعلن تنفيذ عملية نوعية</h3>
                    <span className="text-gray-400 text-[10px]">منذ 7 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <span className="text-[#7a1a26] font-black text-lg w-5">4</span>
                  <img src="/news-port.png" alt="ميناء عدن" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">اتفاقية جديدة لدعم قطاع الموانئ في اليمن</h3>
                    <span className="text-gray-400 text-[10px]">منذ 5 ساعات</span>
                  </div>
                </article>
                <article className="flex items-center gap-3 py-3">
                  <span className="text-[#7a1a26] font-black text-lg w-5">5</span>
                  <img src="/news-government.png" alt="تطورات في المحافظات" className="w-14 h-14 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#08243d] text-xs font-bold leading-5 line-clamp-2">تطورات جديدة في المحافظات اليمنية</h3>
                    <span className="text-gray-400 text-[10px]">منذ 4 ساعات</span>
                  </div>
                </article>
              </div>
            </section>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
