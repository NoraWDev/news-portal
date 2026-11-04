'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { 
  FaFacebookF, 
  FaYoutube, 
  FaTelegramPlane, 
  FaInstagram, 
  FaSearch,
  FaHome,
  FaAngleDown,
  FaChevronLeft,
  FaBolt,
  FaCalendarAlt,
  FaPenNib,
  FaGlobe
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';

export default function Header() {
  const categories = [
    { name: 'سياسه', slug: 'yemen' },
    { name: 'محليات', slug: 'politics' },
    { name: 'اقتصاد', slug: 'economy' },
    { name: ' دولي ', slug: 'world' },
    { name: 'ثقافه', slug: 'tech' },
    { name: 'قضايا ', slug: 'sports' },
    { name: 'التقارير', slug: 'health' },
  ];
  
  const moreCategories = [
    { name: 'الصحة', slug: 'health' },
    { name: 'المجتمع', slug: 'society' },
    { name: 'رياضه', slug: 'variety' },
    { name: 'تكنلوجيا', slug: 'local' },
    { name: 'محافظات', slug: 'governorates' },
    { name: 'تحقيقات  ', slug: 'special' },
  ];

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full text-white font-sans dir-rtl">
      {/* 1. الشريط العلوي */}
      <div className="bg-[#0c0d0e] text-xs md:text-sm font-medium py-1.5 px-8 border-b border-neutral-800 flex flex-row-reverse justify-between items-center text-gray-400">
        <div className="flex flex-row-reverse items-center gap-2">
          <FaPenNib className="text-[#7a1a26] text-sm" />
          <span>رئيس التحرير : <strong className="text-white font-semibold">أيوب التميمي</strong></span>
        </div>

        <div className="flex flex-row-reverse items-center gap-2">
          <FaCalendarAlt className="text-[#7a1a26] text-sm" />
          <span>السبت 12 سبتمبر 2026</span>
        </div>

        <div className="flex flex-row-reverse items-center gap-2">
          <FaGlobe className="text-[#7a1a26] text-sm" />
          <span>من اليمن إلى العالم</span>
        </div>
      </div>

      {/* 2. الهيدر الرئيسي مع خلفية العلم يميناً وخريطة العالم يساراً */}
      <div className="relative w-full h-[120px] sm:h-[135px] md:h-[150px] overflow-hidden border-b border-neutral-800 bg-[#000000] flex items-center justify-center">
        
        {/* صورة العلم والبيئة اليمنية على الجانب الأيمن */}
        <div className="absolute top-0 right-0 h-full w-2/5 sm:w-1/3 pointer-events-none z-0 overflow-hidden">
          <img 
            src="/yemen-bg.jpg" 
            alt="اليمن" 
            className="w-full h-full object-cover object-right sm:object-center opacity-75"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* خريطة العالم (world-map.png) على الجانب الأيسر تحت الأيقونات والشريط */}
        <div className="absolute top-0 left-0 h-full w-2/5 sm:w-1/3 pointer-events-none z-0 overflow-hidden">
          <img 
            src="/world-map.png" 
            alt="خريطة العالم" 
            className="w-full h-full object-cover object-center opacity-40"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* الشعار والعبارة الفرعية بالمنتصف */}
        <Link href="/" className="relative z-10 flex flex-col items-center justify-center text-center cursor-pointer group -mt-2">
          <img 
            src="/agras-bg.png" 
            alt="أجراس اليمن الإخبارية" 
            className="h-18 sm:h-22 md:h-26 lg:h-28 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <p className="mt-1 text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-gray-200/95 text-center whitespace-nowrap leading-none drop-shadow-md">
            مصداقية • سرعة • من قلب اليمن إلى العالم
          </p>
        </Link>

        {/* أزرار البحث والتواصل على اليسار (فوق الخريطة) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 md:left-8 z-20 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#121316]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-neutral-700/80 shadow-2xl">
            <div className="flex items-center gap-1">
              {[
                { Icon: FaXTwitter, href: '#' },
                { Icon: FaFacebookF, href: '#' },
                { Icon: FaYoutube, href: '#' },
                { Icon: FaTelegramPlane, href: '#' },
                { Icon: FaInstagram, href: '#' },
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx} 
                  href={href} 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-neutral-700 bg-[#1c1d22] flex items-center justify-center text-gray-200 hover:bg-neutral-100 hover:text-black transition"
                >
                  <Icon className="text-xs sm:text-sm" />
                </a>
              ))}
            </div>

            <div className="relative min-w-[105px] sm:min-w-[150px] md:min-w-[180px]">
              <input 
                type="text" 
                dir="rtl"
                placeholder="ابحث..." 
                className="w-full bg-[#18191d] border border-neutral-700 rounded-full py-0.5 sm:py-1 pr-2.5 sm:pr-3 pl-7 sm:pl-8 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-neutral-500"
              />
              <FaSearch className="absolute left-2 sm:left-2.5 top-1.5 sm:top-2 text-gray-400 text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. شريط الأقسام */}
      <nav className="bg-[#000000] border-b border-[#5c131d]/40" dir="rtl">
        <div className="max-w-7xl mx-auto px-6 relative z-50">
          <div className="flex items-center justify-center gap-8 md:gap-12 py-3 w-full overflow-visible relative z-50">
            <Link href="/" className="flex items-center gap-2 text-white pb-1 border-b-2 border-[#7a1a26] whitespace-nowrap">
              <FaHome className="text-lg" />
              <span className="text-sm md:text-base font-bold">الرئيسية</span>
            </Link>

            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 text-white hover:text-[#7a1a26] transition whitespace-nowrap text-sm md:text-base font-semibold"
              >
                <span>{cat.name}</span>
              </Link>
            ))}

            <div ref={moreRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1.5 text-white hover:text-[#7a1a26] transition whitespace-nowrap text-sm md:text-base font-semibold"
              >
                <span>المزيد</span>
                <FaAngleDown className={`text-xs transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-[#0c0d10] border border-[#5c131d]/60 rounded-lg shadow-2xl overflow-hidden z-50">
                  {moreCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-white text-xs font-bold hover:bg-[#5c131d] hover:text-white transition border-b border-white/5 last:border-b-0"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[#7a1a26]">‹</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. شريط الأخبار العاجلة */}
      <div className="bg-[#f8fafc] text-gray-900" dir="rtl">
        <div className="py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto bg-[#7a1a26] flex items-center text-white text-xl font-bold shadow-sm rounded-md overflow-hidden">
            <div className="bg-[#000000] px-5 py-2.5 flex items-center gap-2 text-base tracking-wide shrink-0">
              <FaBolt className="text-[#f9f9f9] animate-pulse text-xl" />
              <span className="text-white font-extrabold text-2xl">عاجل</span>
            </div>
            
            <div className="flex-1 overflow-hidden px-4 relative flex items-center">
              <div className="whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                <span className="text-base md:text-lg font-semibold text-white px-4">
                  الحكومة اليمنية تؤكد استمرار جهودها لتحقيق السلام الشامل في اليمن
                </span>
                <span className="text-white font-bold">|</span>
                <span className="text-base md:text-lg font-semibold text-white px-4">
                  الجيش اليمني يعلن تنفيذ عملية نوعية ضد مواقع للحوثيين في الجوف
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-3 border-l border-black/40 shrink-0">
              <button className="p-1 hover:bg-black/30 rounded transition">
                <FaChevronLeft className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}