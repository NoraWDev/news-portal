import Link from 'next/link';
import {
  FaFacebookF,
  FaYoutube,
  FaTelegramPlane,
  FaInstagram,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import {
  FaXTwitter,
  FaLocationDot,
  FaLink,
  FaPenNib,
} from 'react-icons/fa6';

export default function Footer() {
  const socialClass =
    'w-8 h-8 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-xs hover:bg-[#7a1a26] hover:text-white transition';

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[#060709] text-white border-t border-[#5c131d]/60 text-xs"
    >
      {/* الخلفية الأصلية */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.035]"
          style={{ backgroundImage: "url('/world-map.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,19,29,0.12),transparent_65%)]" />
      </div>

      {/* ثلاثة أعمدة متساوية لضمان تمركز الشعار */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start">
          {/* اليمين: تواصل معنا */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-sm font-bold text-white">تواصل معنا</h3>
            </div>
            <div className="space-y-1.5 text-[11px] md:text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white">
                  <FaLocationDot className="text-[10px]" />
                </div>
                <span>صنعاء - اليمن - شارع الخمسين</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white">
                  <FaPhone className="text-[10px]" />
                </div>
                <span dir="ltr" className="text-left whitespace-nowrap text-[10px] lg:text-xs">
                  +967 777 328 522 / +967 738 782 863
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white">
                  <FaEnvelope className="text-[10px]" />
                </div>
                <span dir="ltr">info@rasdnews.com</span>
              </div>
            </div>
          </div>

          {/* الوسط: الشعار الأصلي والوصف */}
          <div className="flex flex-col items-center text-center min-w-0">
            <img
              src="/agras-bg.png"
              alt="أجراس اليمن الإخبارية"
              className="w-[110px] md:w-[125px] h-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
            />
            <div className="flex items-center justify-center gap-1.5 mt-1.5 whitespace-nowrap">
              <span className="w-5 h-[2px] bg-[#7a1a26]" />
              <span className="text-xs md:text-sm font-bold text-gray-200">أخبار اليمن</span>
              <span className="text-[#7a1a26] text-xs">|</span>
              <span className="text-xs md:text-sm font-bold tracking-wide text-gray-200">أجراس اليمن الإخبارية</span>
              <span className="w-5 h-[2px] bg-[#7a1a26]" />
            </div>
            <p className="mt-1.5 text-[11px] md:text-xs text-gray-400 leading-5 max-w-[260px]">
              منصة إخبارية يمنية مستقلة من اليمن إلى العالم
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <FaPenNib className="text-[#7a1a26] text-[10px]" />
              <span>برمجة المهندسة</span>
              <span className="font-bold text-white">نورا أيوب التميمي</span>
            </div>
          </div>

          {/* اليسار: الروابط وأيقونات التواصل */}
          <div className="min-w-0 md:justify-self-end w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-sm font-bold text-white">رابط الموقع</h3>
              <FaLink className="text-[#7a1a26] text-xs" />
            </div>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-[11px] md:text-xs text-gray-300">
              <li><Link href="/" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> الرئيسية</Link></li>
              <li><Link href="/about" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> من نحن</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> سياسة الخصوصية</Link></li>
              <li><Link href="/contact" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> تواصل معنا</Link></li>
            </ul>
            <div className="flex items-center gap-2 mt-4 mb-2">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-xs font-bold text-white">تابعنا على</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a href="#" aria-label="إكس" className={socialClass}><FaXTwitter /></a>
              <a href="#" aria-label="فيسبوك" className={socialClass}><FaFacebookF /></a>
              <a href="#" aria-label="يوتيوب" className={socialClass}><FaYoutube /></a>
              <a href="#" aria-label="تليجرام" className={socialClass}><FaTelegramPlane /></a>
              <a href="#" aria-label="إنستغرام" className={socialClass}><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الحقوق الأصلي */}
      <div className="relative border-t border-[#5c131d]/40 bg-[#020304]">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-center text-center text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-gray-300 flex-wrap justify-center">
            <span>جميع الحقوق محفوظة © 2026</span>
            <span className="text-[#7a1a26]">|</span>
            <span className="font-bold text-white">أجراس اليمن الإخبارية</span>
            <span className="text-[#7a1a26]">|</span>
            <span className="font-bold text-white">أخبار اليمن</span>
          </div>
        </div>
      </div>
      <div className="h-[2px] bg-[#5c131d]" />
    </footer>
  );
}
