import Link from 'next/link';
import {
  FaFacebookF,
  FaWhatsapp,
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

  const socialLinks = [
    { Icon: FaXTwitter, href: '#', label: 'إكس' },
    { Icon: FaFacebookF, href: 'https://www.facebook.com/share/19DaAxy4Za/', label: 'فيسبوك' },
    { Icon: FaWhatsapp, href: 'https://chat.whatsapp.com/I1IbYuzlLXgJuUOf2Uok4K?s=sh&p=a&iam=2', label: 'واتساب' },
    { Icon: FaTelegramPlane, href: 'https://t.me/+U-QOQTuWUJ9xk0qB', label: 'تليجرام' },
    { Icon: FaInstagram, href: '#', label: 'إنستغرام' },
  ];

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[#060709] text-white border-t border-[#5c131d]/60 text-xs w-full"
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
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* اليمين: تواصل معنا */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-sm font-bold text-white">تواصل معنا</h3>
            </div>
            <div className="space-y-2.5 text-[11px] md:text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white">
                  <FaLocationDot className="text-[10px]" />
                </div>
                <span className="leading-snug">صنعاء - اليمن - شارع الخمسين</span>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white mt-0.5 sm:mt-0">
                  <FaPhone className="text-[10px]" />
                </div>
                <div dir="ltr" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-left text-[11px] lg:text-xs">
                  <a href="tel:+967777328522" className="hover:text-white transition whitespace-nowrap">
                    +967 777 328 522
                  </a>
                  <span className="text-gray-500 hidden sm:inline">/</span>
                  <a href="tel:+967738782863" className="hover:text-white transition whitespace-nowrap">
                    +967 738 782 863
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7a1a26]/80 flex items-center justify-center text-white">
                  <FaEnvelope className="text-[10px]" />
                </div>
                <a href="mailto:ajrasalyemen.news@gmail.com" dir="ltr" className="hover:text-white transition break-all">
                  ajrasalyemen.news@gmail.com
                </a>
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
            <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
              <span className="w-4 sm:w-5 h-[2px] bg-[#7a1a26]" />
              <span className="text-xs md:text-sm font-bold text-gray-200">أخبار اليمن</span>
              <span className="text-[#7a1a26] text-xs">|</span>
              <span className="text-xs md:text-sm font-bold tracking-wide text-gray-200">أجراس اليمن الإخبارية</span>
              <span className="w-4 sm:w-5 h-[2px] bg-[#7a1a26]" />
            </div>
            <p className="mt-2 text-[11px] md:text-xs text-gray-400 leading-5 max-w-[280px]">
              منصة إخبارية يمنية مستقلة من اليمن إلى العالم
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <FaPenNib className="text-[#7a1a26] text-[10px]" />
              <span>برمجة المهندسة</span>
              <span className="font-bold text-white">نورا التميمي</span>
            </div>
          </div>

          {/* اليسار: الروابط وأيقونات التواصل */}
          <div className="min-w-0 md:justify-self-end w-full md:w-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-sm font-bold text-white">روابط سريعة</h3>
              <FaLink className="text-[#7a1a26] text-xs" />
            </div>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-2 text-[11px] md:text-xs text-gray-300">
              <li><Link href="/" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> الرئيسية</Link></li>
              <li><Link href="/about" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> تواصل معنا</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition flex items-center gap-1"><span className="text-[#7a1a26]">‹</span> شروط الاستخدام</Link></li>
            </ul>
            <div className="flex items-center gap-2 mt-4 mb-2.5">
              <span className="w-6 h-[2px] bg-[#7a1a26]" />
              <h3 className="text-xs font-bold text-white">تابعنا على</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className={socialClass}
                >
                  <Icon />
                </a>
              ))}
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
