import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'من نحن | أجراس اليمن الإخبارية',
  description: 'منصة إعلامية يمنية مستقلة تُعنى بمتابعة الشأن اليمني والعربي والدولي بمهنية وموضوعية، من اليمن إلى العالم.',
};

export default function AboutPage() {
  const principles = [
    'الالتزام بالثوابت الوطنية ووحدة اليمن وسيادته واستقلال قراره.',
    'الإنسان وكرامته وحقوقه في صدارة أولوياتنا.',
    'المهنية والمصداقية وتحري الدقة في نقل الأخبار.',
    'احترام التعددية وحق الاختلاف وحرية التعبير.',
    'الفصل بين الخبر والرأي والتحليل.',
    'رفض العنصرية والمناطقية وخطاب الكراهية والتحريض.',
    'مساءلة الفساد والانتهاكات والتجاوزات دون انتقائية.',
    'تصحيح الأخطاء وتحمل المسؤولية المهنية والأخلاقية.',
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
            <span className="text-white font-bold">من نحن</span>
          </nav>

          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
            <span className="w-1.5 h-7 sm:h-9 bg-[#7a1a26] rounded-full inline-block" />
            من نحن
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1.5 font-semibold">
            أجراس اليمن الإخبارية | من اليمن إلى العالم
          </p>
        </div>
      </section>

      {/* ===== المحتوى الرئيسي ===== */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="bg-white rounded-2xl border border-[#dbe3ea] shadow-sm p-6 sm:p-10 md:p-12 space-y-8">

          {/* المقدمة والتعريف */}
          <div className="space-y-5 text-gray-800 text-base sm:text-lg leading-relaxed sm:leading-loose">
            <p className="font-semibold text-[#08243d] text-lg sm:text-xl border-r-4 border-[#7a1a26] pr-4 py-1">
              أجراس اليمن الإخبارية | من اليمن إلى العالم
            </p>

            <p>
              أجراس اليمن الإخبارية منصة إعلامية مستقلة، تُعنى بمتابعة الشأن اليمني والعربي والدولي، وتقديم الأخبار والتقارير والتحليلات بمهنية وموضوعية، انطلاقًا من إيماننا بأن الإعلام مسؤولية، وأن الحقيقة حق للجمهور وليست امتيازًا لأحد.
            </p>

            <p>
              نستمد رسالتنا من التزام راسخ بالثوابت الوطنية، وفي مقدمتها وحدة اليمن وسيادته واستقلال قراره الوطني، والإيمان بقيم الجمهورية والمواطنة المتساوية والحرية والعدالة والكرامة الإنسانية.
            </p>

            <p>
              ونضع الإنسان في صميم اهتمامنا الإعلامي، ونمنح قضاياه وحقوقه ومعاناته وتطلعاته المساحة التي تستحقها، إيمانًا بأن كرامة الإنسان وحقه في الحياة والحرية والعيش الكريم يجب أن تظل فوق الحسابات السياسية والانتماءات الضيقة.
            </p>

            <p>
              نؤمن بإعلام مسؤول لا يصادر الحقيقة ولا يحتكرها، ولا يجعل من الاختلاف ذريعة للإقصاء أو الكراهية، بل يسعى إلى كشف الوقائع ومساءلة مواطن الخلل، والدفاع عن حق المجتمع في المعرفة، والانتصار لقضايا الوطن والإنسان بضمير مهني ووطني حي.
            </p>
          </div>

          {/* الرؤية والرسالة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {/* رؤيتنا */}
            <div className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-5 sm:p-6">
              <h2 className="text-[#08243d] text-lg sm:text-xl font-black mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
                رؤيتنا
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                أن نكون منصة إعلامية يمنية مستقلة وفاعلة، تسهم في تشكيل وعي عام يستند إلى المعرفة والحقيقة، وتواكب الأحداث برؤية مهنية ومسؤولة.
              </p>
            </div>

            {/* رسالتنا */}
            <div className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-5 sm:p-6">
              <h2 className="text-[#08243d] text-lg sm:text-xl font-black mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
                رسالتنا
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                تقديم محتوى إعلامي موثوق ومتوازن، وتحري الدقة في نقل المعلومات، واحترام حق الجمهور في المعرفة، والالتزام بأخلاقيات العمل الصحفي، والانحياز لقضايا الإنسان والوطن والحقوق والحريات.
              </p>
            </div>
          </div>

          {/* مبادئنا */}
          <div className="pt-2">
            <h2 className="text-[#08243d] text-lg sm:text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
              مبادئنا
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {principles.map((principle, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#f8fafc] border border-gray-100 text-sm sm:text-base text-gray-800 leading-relaxed"
                >
                  <span className="text-[#7a1a26] font-bold text-base mt-0.5 shrink-0">✦</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* الخاتمة والشعار */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <div className="inline-block bg-[#faf5f6] border border-[#7a1a26]/20 rounded-xl px-6 py-4">
              <p className="text-[#7a1a26] font-black text-lg sm:text-xl mb-1">
                أجراس اليمن الإخبارية
              </p>
              <p className="text-[#08243d] font-bold text-sm sm:text-base">
                من اليمن إلى العالم.. صوت للوطن وضمير للإنسان.
              </p>
            </div>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
