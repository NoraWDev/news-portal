'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { 
  FaFacebookF, 
  FaWhatsapp, 
  FaTelegramPlane, 
  FaInstagram, 
  FaSearch, 
  FaHome, 
  FaAngleDown, 
  FaChevronLeft, 
  FaBolt, 
  FaCalendarAlt, 
  FaPenNib, 
  FaGlobe, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';

export default function Header() {
  const categories = [
    { name: 'سياسة', slug: 'politics' },
    { name: 'محليات', slug: 'local' },
    { name: 'اقتصاد', slug: 'economy' },
    { name: 'دولي', slug: 'world' },
    { name: 'ثقافة', slug: 'culture' },
    { name: 'قضايا', slug: 'issues' },
    { name: 'التقارير', slug: 'reports' },
  ];
  
  const moreCategories = [
    { name: 'الصحة', slug: 'health' },
    { name: 'المجتمع', slug: 'society' },
    { name: 'الرياضة', slug: 'sports' },
    { name: 'تكنولوجيا', slug: 'technology' },
    { name: 'محافظات', slug: 'governorates' },
    { name: 'تحقيقات', slug: 'investigations' },
  ];

  const socialLinks = [
    { Icon: FaXTwitter, href: '#', label: 'إكس' },
    { Icon: FaFacebookF, href: 'https://www.facebook.com/share/19DaAxy4Za/', label: 'فيسبوك' },
    { Icon: FaWhatsapp, href: 'https://chat.whatsapp.com/I1IbYuzlLXgJuUOf2Uok4K?s=sh&p=a&iam=2', label: 'واتساب' },
    { Icon: FaTelegramPlane, href: 'https://t.me/+U-QOQTuWUJ9xk0qB', label: 'تليجرام' },
    { Icon: FaInstagram, href: '#', label: 'إنستغرام' },
  ];

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // إغلاق قائمة "المزيد" عند النقر خارجها
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

  // منع التمرير في الخلفية عند فتح قائمة الجوال
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // إغلاق القائمة الجوال عند تكبير الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header dir="rtl" className="w-full text-white font-sans">
      {/* 1. الشريط العلوي */}
      <div className="bg-[#0c0d0e] text-[10px] sm:text-xs md:text-sm font-medium py-1 sm:py-1.5 px-3 sm:px-6 lg:px-8 border-b border-neutral-800 flex flex-row-reverse justify-between items-center text-gray-400">
        <div className="flex flex-row-reverse items-center gap-1.5 sm:gap-2 min-w-0">
          <FaPenNib className="text-[#7a1a26] text-[10px] sm:text-sm shrink-0" />
          <span className="truncate">رئيس التحرير : <strong className="text-white font-semibold">أيوب التميمي</strong></span>
        </div>

        <div className="flex flex-row-reverse items-center gap-1.5 sm:gap-2 shrink-0">
          <FaCalendarAlt className="text-[#7a1a26] text-[10px] sm:text-sm shrink-0" />
          <span className="whitespace-nowrap">السبت 12 سبتمبر 2026</span>
        </div>

        <div className="hidden sm:flex flex-row-reverse items-center gap-2 shrink-0">
          <FaGlobe className="text-[#7a1a26] text-sm shrink-0" />
          <span>من اليمن إلى العالم</span>
        </div>
      </div>

      {/* 2. الهيدر الرئيسي مع خلفية العلم يميناً وخريطة العالم يساراً */}
      <div className="relative w-full h-[95px] sm:h-[120px] md:h-[140px] lg:h-[150px] overflow-hidden border-b border-neutral-800 bg-[#000000] flex items-center justify-center">
        
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
        <Link href="/" className="relative z-10 flex flex-col items-center justify-center text-center cursor-pointer group px-2">
          <img 
            src="/agras-bg.png" 
            alt="أجراس اليمن الإخبارية" 
            className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs md:text-sm font-medium tracking-wide text-gray-200/95 text-center whitespace-nowrap leading-none drop-shadow-md">
            مصداقية • سرعة • من قلب اليمن إلى العالم
          </p>
        </Link>

        {/* أزرار البحث والتواصل على اليسار (للكمبيوتر فقط: فوق الخريطة) */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 md:left-8 z-20 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#121316]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-neutral-700/80 shadow-2xl">
            <div className="flex items-center gap-1">
              {socialLinks.map(({ Icon, href, label }, idx) => (
                <a 
                  key={idx} 
                  href={href} 
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
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

      {/* 3. شريط الأقسام (نسخة الكمبيوتر) */}
      <nav className="hidden lg:block bg-[#000000] border-b border-[#5c131d]/40" dir="rtl">
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
                className="flex items-center gap-1.5 text-white hover:text-[#7a1a26] transition whitespace-nowrap text-sm md:text-base font-semibold cursor-pointer"
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

      {/* 3. شريط الأقسام المخصص للجوال والتابلت (Mobile Navigation Bar: أنيق ومدمج ومتوازن) */}
      <nav className="lg:hidden bg-[#090a0d] border-b border-[#5c131d]/40 px-2.5 sm:px-4 py-1.5" dir="rtl">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* زر فتح القائمة الجانبية Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-1.5 bg-[#17181d] hover:bg-[#7a1a26] active:scale-95 text-white px-2.5 py-1 rounded-md border border-neutral-700/80 hover:border-[#7a1a26] transition text-[11px] font-bold shrink-0 cursor-pointer"
            aria-label="فتح القائمة الرئيسية"
          >
            <FaBars className="text-xs text-[#d4737f]" />
            <span>الأقسام</span>
          </button>

          {/* روابط وصول سريع قابلة للتمرير برفق وخفة */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5 text-xs">
            <Link
              href="/"
              className="whitespace-nowrap px-2 py-0.5 rounded text-white font-bold bg-[#7a1a26] text-[10px] sm:text-[11px]"
            >
              الرئيسية
            </Link>
            {categories.slice(0, 4).map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.slug}`}
                className="whitespace-nowrap px-1.5 py-0.5 rounded text-gray-300 hover:text-white hover:bg-neutral-800 text-[10px] sm:text-[11px] font-medium transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* زر البحث للجوال */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition shrink-0 cursor-pointer border ${
              isMobileSearchOpen 
                ? 'bg-[#7a1a26] text-white border-[#7a1a26]' 
                : 'bg-[#17181d] text-gray-300 border-neutral-700 hover:text-white'
            }`}
            aria-label="البحث"
          >
            <FaSearch className="text-[11px]" />
          </button>
        </div>

        {/* حقل البحث السريع المنسدل */}
        {isMobileSearchOpen && (
          <div className="mt-1.5 pt-1.5 border-t border-neutral-800">
            <div className="relative w-full">
              <input
                type="text"
                dir="rtl"
                placeholder="ابحث عن خبر، مقال، أو موضوع..."
                className="w-full bg-[#14151a] border border-[#5c131d]/70 rounded-md py-1.5 pr-2.5 pl-8 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#7a1a26]"
                autoFocus
              />
              <FaSearch className="absolute left-2.5 top-2 text-gray-400 text-xs" />
            </div>
          </div>
        )}
      </nav>

      {/* قائمة الجوال المنبثقة الشاملة (Mobile Drawer Menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" dir="rtl">
          {/* الخلفية المظللة */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* لوحة القائمة الجانبية (Drawer من اليمين) */}
          <div className="fixed top-0 right-0 bottom-0 w-[84%] max-w-[340px] bg-[#0c0d11] border-l border-[#5c131d]/60 shadow-2xl flex flex-col z-[101] overflow-hidden">
            
            {/* هيدر القائمة */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#07080a]">
              <div className="flex items-center gap-2">
                <img src="/agras-bg.png" alt="أجراس اليمن" className="h-7 w-auto object-contain" />
                <span className="text-sm font-black text-white">أجراس اليمن الإخبارية</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#7a1a26] text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="إغلاق القائمة"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* حقل البحث داخل القائمة */}
            <div className="p-3 border-b border-neutral-800 bg-[#0e0f14]">
              <div className="relative">
                <input
                  type="text"
                  dir="rtl"
                  placeholder="ابحث في الموقع..."
                  className="w-full bg-[#17181f] border border-neutral-700 rounded-lg py-2 pr-3 pl-8 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#7a1a26]"
                />
                <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 text-xs" />
              </div>
            </div>

            {/* محتوى الروابط القابل للتمرير */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {/* القسم الرئيسي */}
              <div>
                <div className="text-[10px] font-bold text-[#d4737f] uppercase tracking-wider mb-2 px-2">
                  الأقسام الإخبارية
                </div>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#7a1a26]/20 text-white font-bold text-xs border border-[#7a1a26]/40 transition hover:bg-[#7a1a26]"
                  >
                    <div className="flex items-center gap-2">
                      <FaHome className="text-sm text-[#d4737f]" />
                      <span>الصفحة الرئيسية</span>
                    </div>
                    <span className="text-xs text-[#d4737f]">‹</span>
                  </Link>

                  {categories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-200 hover:text-white hover:bg-neutral-800/60 font-semibold text-xs transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-neutral-500 text-xs">‹</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* المزيد من الأقسام والتصنيفات */}
              <div>
                <div className="text-[10px] font-bold text-[#d4737f] uppercase tracking-wider mb-2 px-2">
                  المزيد من التصنيفات
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {moreCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#14151a] hover:bg-[#7a1a26]/30 text-gray-300 hover:text-white text-[11px] font-semibold border border-neutral-800/80 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[#7a1a26] text-[10px]">‹</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* صفحات الموقع السريعة */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="text-[10px] font-bold text-gray-400 mb-2 px-2">
                  عن الموقع
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 text-gray-400 hover:text-white transition">من نحن</Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 text-gray-400 hover:text-white transition">اتصل بنا</Link>
                  <Link href="/videos" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 text-gray-400 hover:text-white transition">الفيديوهات</Link>
                  <Link href="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 text-gray-400 hover:text-white transition">الخصوصية</Link>
                </div>
              </div>
            </div>

            {/* الفوتر الخاص بالقائمة: شبكات التواصل */}
            <div className="p-3 border-t border-neutral-800 bg-[#07080a] flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold">تابعنا:</span>
              <div className="flex items-center gap-1.5">
                {socialLinks.map(({ Icon, href, label }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target={href !== '#' ? '_blank' : undefined}
                    rel={href !== '#' ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="w-7 h-7 rounded-full border border-neutral-700 bg-[#16171c] flex items-center justify-center text-gray-300 hover:bg-[#7a1a26] hover:text-white transition text-xs"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. شريط الأخبار العاجلة (مدمج ورشيق على الجوال، ويحافظ على أبعاده للكمبيوتر) */}
      <div className="bg-[#f8fafc] text-gray-900" dir="rtl">
        <div className="py-1 sm:py-2 md:py-4 px-2 sm:px-4 md:px-6">
          <div className="max-w-7xl mx-auto bg-[#7a1a26] flex items-center text-white shadow-sm rounded-md overflow-hidden">
            <div className="bg-[#000000] px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 flex items-center gap-1.5 sm:gap-2 shrink-0">
              <FaBolt className="text-[#f9f9f9] animate-pulse text-xs sm:text-base md:text-xl" />
              <span className="text-white font-extrabold text-xs sm:text-base md:text-2xl">عاجل</span>
            </div>
            
            <div className="flex-1 overflow-hidden px-2 sm:px-4 relative flex items-center">
              <div className="whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                <span className="text-[11px] sm:text-sm md:text-lg font-semibold text-white px-2 sm:px-4">
                  الحكومة اليمنية تؤكد استمرار جهودها لتحقيق السلام الشامل في اليمن
                </span>
                <span className="text-white font-bold opacity-70">|</span>
                <span className="text-[11px] sm:text-sm md:text-lg font-semibold text-white px-2 sm:px-4">
                  الجيش اليمني يعلن تنفيذ عملية نوعية ضد مواقع للحوثيين في الجوف
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-1.5 sm:px-2 md:px-3 border-l border-black/40 shrink-0">
              <button className="p-0.5 sm:p-1 hover:bg-black/30 rounded transition text-xs sm:text-sm" aria-label="التالي">
                <FaChevronLeft />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
