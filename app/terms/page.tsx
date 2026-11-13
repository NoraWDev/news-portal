import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'شروط الاستخدام | أجراس اليمن الإخبارية',
  description: 'شروط وأحكام استخدام منصة أجراس اليمن الإخبارية وحقوق النشر والملكية الفكرية.',
};

export default function TermsPage() {
  const sections = [
    {
      num: 'أولاً',
      title: 'قبول الشروط والأحكام',
      text: 'يُعد استخدامكم لمنصة «أجراس اليمن الإخبارية» وتصفح محتواها موافقة صريحة وكاملة على هذه الشروط والأحكام والالتزام بها. إذا كنتم لا توافقون على أي جزء من هذه الشروط، فيرجى التوقف عن استخدام الموقع.',
    },
    {
      num: 'ثانياً',
      title: 'حقوق الملكية الفكرية والنشر',
      text: 'جميع محتويات الموقع من نصوص، وتقارير صحفية، وصور، وفيديوهات، وتصاميم، وشعارات، هي ملك لمنصة «أجراس اليمن الإخبارية» أو مرخصة لها ومحمية بموجب قوانين حقوق المؤلف والملكية الفكرية. يُسمح بالاقتباس المحدود للأغراض الصحفية والبحثية بشرط الإشارة الواضحة والصريحة إلى المصدر ووضع رابط مباشر للخبر أو المادة الأصلية.',
    },
    {
      num: 'ثالثاً',
      title: 'الاستخدام المشروع والمحظورات',
      text: 'يلتزم المستخدم بعدم استخدام المنصة في أي غرض غير قانوني، أو نشر أو إعادة تداول أي محتوى يحث على العنف أو الكراهية أو العنصرية أو التمييز المناطقي، أو التشهير بالأشخاص والجهات، أو محاولة تعطيل الموقع وسيرفراته أو اختراق أمن البيانات.',
    },
    {
      num: 'رابعاً',
      title: 'إخلاء المسؤولية التحريرية',
      text: 'تبذل هيئة تحرير «أجراس اليمن الإخبارية» أقصى جهد لتحري الدقة والمصداقية في نشر الأخبار والتقارير. وتعبر مقالات الرأي المنشورة في قسم «المقالات» عن آراء كتابها فقط ولا تمثل بالضرورة الرأي الرسمي لإدارة المنصة أو هيئة التحرير.',
    },
    {
      num: 'خامساً',
      title: 'مشاركات القراء والتعليقات',
      text: 'في حال إتاحة التعليقات أو إرسال المواد التحريرية، يتحمل المستخدم كامل المسؤولية القانونية والأخلاقية عن أي محتوى يقوم بنشره أو إرساله، وتحتفظ إدارة الموقع بالحق في حذف أو حجب أي تعليق أو مادة تخالف المعايير المهنية والقانونية دون سابق إنذار.',
    },
    {
      num: 'سادساً',
      title: 'تعديل الشروط وسريانها',
      text: 'تحتفظ المنصة بالحق في تعديل أو تحديث هذه الشروط في أي وقت وفق مقتضيات العمل والتطورات القانونية. وتصبح التعديلات نافذة فور نشرها على هذه الصفحة.',
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
            <span className="text-white font-bold">شروط الاستخدام</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
              <span className="w-1.5 h-7 sm:h-9 bg-[#7a1a26] rounded-full inline-block" />
              شروط الاستخدام
            </h1>
            <span className="inline-block bg-[#020b14] border border-[#7a1a26]/40 text-gray-300 px-3 py-1 rounded-md text-xs font-semibold w-fit">
              آخر تحديث: نوفمبر 2026
            </span>
          </div>
        </div>
      </section>

      {/* ===== المحتوى الرئيسي ===== */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-[#dbe3ea] shadow-sm p-6 sm:p-10 md:p-12 space-y-6">

          <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed border-b border-gray-100 pb-6">
            <p className="font-semibold text-[#08243d] text-base sm:text-lg">
              أجراس اليمن الإخبارية | اتفاقية وشروط الاستخدام
            </p>
            <p>
              تحكم هذه الاتفاقية ضوابط وشروط استخدام منصة «أجراس اليمن الإخبارية» والخدمات والمحتويات الإعلامية المرتبطة بها.
            </p>
          </div>

          {/* البنود من أولاً حتى سادساً */}
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-4 sm:p-5 hover:border-[#7a1a26]/40 transition"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="bg-[#7a1a26] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md">
                    {sec.num}
                  </span>
                  <h2 className="text-[#08243d] font-bold text-base sm:text-lg">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed sm:leading-loose">
                  {sec.text}
                </p>
              </div>
            ))}
          </div>

          {/* الخاتمة والشعار */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <div className="inline-block bg-[#faf5f6] border border-[#7a1a26]/20 rounded-xl px-6 py-4">
              <p className="text-[#7a1a26] font-black text-lg sm:text-xl mb-1">
                أجراس اليمن الإخبارية
              </p>
              <p className="text-[#08243d] font-bold text-sm sm:text-base">
                من اليمن إلى العالم.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
