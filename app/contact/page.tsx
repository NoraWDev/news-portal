import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaFacebookF, FaWhatsapp, FaTelegramPlane, FaPhone, FaEnvelope } from 'react-icons/fa';

export const metadata = {
  title: 'تواصل معنا | أجراس اليمن الإخبارية',
  description: 'يسعدنا استقبال استفساراتكم وملاحظاتكم ومقترحاتكم والتعاون الإعلامي والصحفي مع منصة أجراس اليمن الإخبارية.',
};

export default function ContactPage() {
  const contactScopes = [
    'الاستفسارات والملاحظات التحريرية.',
    'إرسال الأخبار والتقارير والمواد الصحفية.',
    'التعاون الإعلامي والإعلاني.',
    'تصحيح المعلومات والإبلاغ عن الأخطاء.',
    'المقترحات والشراكات الإعلامية.',
  ];

  const activeSocialLinks = [
    {
      name: 'فيسبوك',
      href: 'https://www.facebook.com/share/19DaAxy4Za/',
      Icon: FaFacebookF,
      bgColor: 'bg-[#1877f2]',
      hoverColor: 'hover:bg-[#155fc0]',
    },
    {
      name: 'واتساب',
      href: 'https://chat.whatsapp.com/I1IbYuzlLXgJuUOf2Uok4K?s=sh&p=a&iam=2',
      Icon: FaWhatsapp,
      bgColor: 'bg-[#25d366]',
      hoverColor: 'hover:bg-[#1ebc57]',
    },
    {
      name: 'تليجرام',
      href: 'https://t.me/+U-QOQTuWUJ9xk0qB',
      Icon: FaTelegramPlane,
      bgColor: 'bg-[#229ed9]',
      hoverColor: 'hover:bg-[#1c87ba]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden" dir="rtl">
      <Header />

      {/* ===== مسار التنقل والعنوان الرئيسي ===== */}
      <section className="bg-[#08243d] border-b border-[#0a2e4d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2">
            <Link href="/" className="hover:text-white transition">
              الرئيسية
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-white font-bold">تواصل معنا</span>
          </nav>

          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-9 bg-[#7a1a26] rounded-full inline-block" />
            تواصل معنا
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1.5 font-semibold">
            أجراس اليمن الإخبارية | من اليمن إلى العالم
          </p>
        </div>
      </section>

      {/* ===== المحتوى الرئيسي ===== */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-[#dbe3ea] shadow-sm p-6 sm:p-10 md:p-12 space-y-8">

          {/* المقدمة */}
          <div className="space-y-4 text-gray-800 text-base sm:text-lg leading-relaxed sm:leading-loose">
            <p className="font-semibold text-[#08243d] text-lg sm:text-xl border-r-4 border-[#7a1a26] pr-4 py-1">
              أجراس اليمن الإخبارية | من اليمن إلى العالم
            </p>

            <p>
              نؤمن بأن التواصل مع الجمهور جزء أصيل من رسالتنا الإعلامية، وأن ملاحظات القراء وآراءهم ومقترحاتهم تسهم في تطوير العمل الصحفي والارتقاء بمستوى المحتوى.
            </p>

            <p>
              يسعدنا استقبال استفساراتكم وملاحظاتكم ومقترحاتكم، كما نرحب بالتعاون الإعلامي والصحفي، واستقبال الأخبار والبلاغات والمواد الصحفية من المراسلين والمصادر المختلفة.
            </p>
          </div>

          {/* قنوات التواصل المباشر */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* الهاتف والتواصل المباشر */}
            <div className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#7a1a26]/10 border border-[#7a1a26] flex items-center justify-center text-[#7a1a26]">
                    <FaPhone className="text-sm" />
                  </div>
                  <h2 className="text-[#08243d] text-lg sm:text-xl font-black">
                    الهاتف والتواصل المباشر
                  </h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-6">
                  يمكنكم الاتصال مباشرة بفريق التحرير والإدارة عبر الأرقام التالية:
                </p>
              </div>

              <div className="space-y-2.5" dir="ltr">
                <a
                  href="tel:+967777328522"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-[#7a1a26] hover:shadow-sm transition font-bold text-sm sm:text-base text-[#08243d] group"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="group-hover:text-[#7a1a26] transition">+967 777 328 522</span>
                </a>
                <a
                  href="tel:+967738782863"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-[#7a1a26] hover:shadow-sm transition font-bold text-sm sm:text-base text-[#08243d] group"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="group-hover:text-[#7a1a26] transition">+967 738 782 863</span>
                </a>
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#7a1a26]/10 border border-[#7a1a26] flex items-center justify-center text-[#7a1a26]">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <h2 className="text-[#08243d] text-lg sm:text-xl font-black">
                    البريد الإلكتروني
                  </h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-6">
                  لمراسلتنا بالمقترحات والأخبار والمواد التحريرية والإعلانية:
                </p>
              </div>

              <div dir="ltr">
                <a
                  href="mailto:ajrasalyemen.news@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-white border border-gray-200 hover:border-[#7a1a26] hover:shadow-sm transition font-bold text-xs sm:text-sm md:text-base text-[#08243d] group break-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="group-hover:text-[#7a1a26] transition">ajrasalyemen.news@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* مجالات التواصل */}
          <div className="pt-2">
            <h2 className="text-[#08243d] text-lg sm:text-xl font-black mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
              مجالات التواصل
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contactScopes.map((scope, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc] border border-gray-100 text-sm sm:text-base text-gray-800"
                >
                  <span className="text-[#7a1a26] font-bold text-base shrink-0">✦</span>
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-xs sm:text-sm mt-4 leading-relaxed bg-[#f8fafc] p-3.5 rounded-lg border-r-2 border-[#7a1a26]">
              نحرص على التعامل مع جميع المراسلات باهتمام ومهنية، مع مراعاة خصوصية المعلومات والمصادر التي تتطلب السرية.
            </p>
          </div>

          {/* منصات التواصل الاجتماعي الفعلية داخل الصفحة */}
          <div className="pt-2">
            <h2 className="text-[#08243d] text-lg sm:text-xl font-black mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
              تابعونا على منصات التواصل
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              انضموا إلى منصاتنا الرسمية لمتابعة التغطيات الحية والأخبار العاجلة:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeSocialLinks.map(({ name, href, Icon, bgColor, hoverColor }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-xl text-white font-bold text-sm sm:text-base ${bgColor} ${hoverColor} transition shadow-sm hover:shadow`}
                >
                  <Icon className="text-lg" />
                  <span>{name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* الخاتمة والشعار */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <div className="inline-block bg-[#faf5f6] border border-[#7a1a26]/20 rounded-xl px-6 py-4">
              <p className="text-[#7a1a26] font-black text-lg sm:text-xl mb-1">
                أجراس اليمن الإخبارية
              </p>
              <p className="text-[#08243d] font-bold text-sm sm:text-base">
                نقترب من الحدث وننقل الحقيقة.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
