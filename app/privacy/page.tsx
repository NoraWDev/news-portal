import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'سياسة الخصوصية | أجراس اليمن الإخبارية',
  description: 'سياسة الخصوصية وحماية البيانات في منصة أجراس اليمن الإخبارية.',
};

export default function PrivacyPage() {
  const sections = [
    {
      num: 'أولاً',
      title: 'مقدمة وجمع المعلومات',
      text: 'تلتزم منصة «أجراس اليمن الإخبارية» باحترام وحماية خصوصية مستخدميها وزوارها. قد نقوم بجمع بعض المعلومات غير الشخصية تلقائيًا عند تصفح الموقع، مثل نوع المتصفح، وعنوان بروتوكول الإنترنت (IP)، والصفحات التي تمت زيارتها، وذلك لأغراض تحسين الأداء وتجربة التصفح.',
    },
    {
      num: 'ثانياً',
      title: 'استخدام المعلومات الشخصية',
      text: 'في حال تواصلكم معنا عبر البريد الإلكتروني أو نماذج المراسلة أو الاشتراك في النشرة الإخبارية، فإننا نستخدم البيانات المقدمة طوعًا (مثل الاسم والبريد الإلكتروني) للرد على الاستفسارات والتواصل التحريري فقط، ولا نبيع أو نؤجر هذه المعلومات لأي طرف ثالث.',
    },
    {
      num: 'ثالثاً',
      title: 'ملفات تعريف الارتباط (Cookies)',
      text: 'يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل حركة المرور وتقديم محتوى ملائم. يحق للمستخدم ضبط إعدادات المتصفح لرفض ملفات تعريف الارتباط أو تنبيهه عند إرسالها.',
    },
    {
      num: 'رابعاً',
      title: 'أمن وحماية البيانات',
      text: 'نتخذ التدابير الفنية والإدارية المناسبة لحماية البيانات المخزنة من الوصول غير المصرح به أو التعديل أو الإفصاح غير القانوني، مع الأخذ بالاعتبار طبيعة نقل البيانات عبر الإنترنت.',
    },
    {
      num: 'خامساً',
      title: 'الروابط الخارجية والمواقع الشريكة',
      text: 'قد يحتوي موقعنا على روابط لمواقع ومنصات خارجية. منصة «أجراس اليمن الإخبارية» ليست مسؤولة عن ممارسات الخصوصية أو محتوى تلك المواقع الخارجية، وننصح المستخدمين بالاطلاع على سياسات الخصوصية الخاصة بها.',
    },
    {
      num: 'سادساً',
      title: 'مشاركة البيانات مع أطراف ثالثة',
      text: 'لا نشارك أي معلومات شخصية تعريفية مع أي جهات خارجية إلا في الحالات التي يقتضيها القانون أو لحماية الحقوق القانونية للمنصة وسلامة مستخدميها.',
    },
    {
      num: 'سابعاً',
      title: 'حقوق المستخدم وخيارات التحكم',
      text: 'يحق للمستخدم طلب تعديل أو حذف أي معلومات شخصية قام بتزويدنا بها، أو إلغاء الاشتراك في المراسلات والنشرات البريدية في أي وقت عبر رابط الإلغاء أو مراسلتنا مباشرة.',
    },
    {
      num: 'ثامناً',
      title: 'خصوصية الأطفال والقُصّر',
      text: 'موقعنا مخصص لجمهور القراء العام، ولا نجمع عن قصد أي معلومات تعريفية شخصية من الأطفال دون سن السن القانونية. في حال علمنا بجمع بيانات قاصر دون موافقة ولي الأمر، سنتخذ الخطوات لحذفها فورًا.',
    },
    {
      num: 'تاسعاً',
      title: 'التعديلات على سياسة الخصوصية',
      text: 'تحتفظ إدارة المنصة بالحق في تعديل أو تحديث هذه السياسة كلما دعت الحاجة بما يواكب التطورات التنظيمية والتقنية، ويتم نشر أي تحديث على هذه الصفحة مع تحديد تاريخ التحديث.',
    },
    {
      num: 'عاشراً',
      title: 'التواصل والاستفسار',
      text: 'إذا كانت لديكم أي استفسارات أو ملاحظات حول سياسة الخصوصية وحماية البيانات، يسعدنا تواصلكم معنا عبر البريد الرسمي: ajrasalyemen.news@gmail.com.',
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
            <span className="text-white font-bold">سياسة الخصوصية</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
              <span className="w-1.5 h-7 sm:h-9 bg-[#7a1a26] rounded-full inline-block" />
              سياسة الخصوصية
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
              أجراس اليمن الإخبارية | بيان حماية الخصوصية والمعلومات
            </p>
            <p>
              توضح هذه الوثيقة المبادئ والإجراءات التي تتبعها منصة «أجراس اليمن الإخبارية» في التعامل مع البيانات والمعلومات عند استخدامكم لموقعنا الإلكتروني وخدماتنا الإخبارية.
            </p>
          </div>

          {/* البنود من أولاً حتى عاشراً */}
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
                خصوصيتكم محل اهتمامنا وثقتكم مسؤوليتنا.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
