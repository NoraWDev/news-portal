'use client';

import { useState, useRef } from 'react';
import { submitComment } from './actions';

export type CommentItem = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

type Props = {
  articleId: string;
  initialComments: CommentItem[];
};

export default function CommentsSection({ articleId, initialComments }: Props) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    formData.set('article_id', articleId);

    try {
      const result = await submitComment(formData);
      if (result.success && result.comment) {
        // إضافة التعليق فورياً في الواجهة دون الحاجة لتحديث الصفحة
        setComments((prev) => [...prev, result.comment!]);
        setState('success');
        setSuccessMsg('تم نشر تعليقك بنجاح ومشاركته في الموقع.');
        formRef.current?.reset();

        // إخفاء رسالة النجاح بعد 5 ثوانٍ للعودة للوضع الطبيعي
        setTimeout(() => {
          setState('idle');
          setSuccessMsg('');
        }, 5000);
      } else {
        setState('error');
        setErrorMsg(result.error || 'حدث خطأ غير معروف');
      }
    } catch {
      setState('error');
      setErrorMsg('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      {/* عنوان قسم التعليقات مع العداد التفاعلي */}
      <h2 className="text-lg font-black text-[#08243d] mb-5 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-[#7a1a26] rounded-full inline-block" />
        التعليقات
        {comments.length > 0 && (
          <span className="text-sm font-bold text-gray-400">({comments.length})</span>
        )}
      </h2>

      {/* قائمة التعليقات */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[#f8fafc] border border-[#dbe3ea] rounded-xl p-4 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-full bg-[#f1e7e9] flex items-center justify-center shrink-0">
                  <span className="text-[#7a1a26] text-sm font-black">
                    {comment.author_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#08243d]">{comment.author_name}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString('ar-YE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-6">
          لا توجد تعليقات بعد. كن أول من يعلّق!
        </p>
      )}

      {/* نموذج إضافة تعليق */}
      <div className="mt-6 bg-white rounded-xl border border-[#dbe3ea] p-4 sm:p-5">
        <h3 className="text-base font-black text-[#08243d] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#7a1a26] rounded-full inline-block" />
          أضف تعليقاً
        </h3>

        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          {/* حقل الاسم فقط (تمت إزالة البريد الإلكتروني) */}
          <div>
            <label htmlFor="author_name" className="block text-xs font-bold text-gray-600 mb-1">
              الاسم <span className="text-[#7a1a26]">*</span>
            </label>
            <input
              id="author_name"
              name="author_name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              placeholder="اسمك الكريم"
              disabled={state === 'loading'}
              className="w-full sm:max-w-md border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#7a1a26] disabled:opacity-60 bg-white"
            />
          </div>

          {/* نص التعليق */}
          <div>
            <label htmlFor="content" className="block text-xs font-bold text-gray-600 mb-1">
              التعليق <span className="text-[#7a1a26]">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              placeholder="اكتب تعليقك هنا..."
              disabled={state === 'loading'}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#7a1a26] resize-none disabled:opacity-60 bg-white"
            />
          </div>

          {state === 'error' && (
            <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ {errorMsg}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={state === 'loading'}
              className="bg-[#7a1a26] hover:bg-[#5c131d] active:scale-[0.98] text-white px-6 py-2 rounded-lg text-sm font-black transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {state === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  جارٍ النشر...
                </>
              ) : (
                'نشر التعليق'
              )}
            </button>

            <p className="text-[11px] text-gray-400">
              نرجو الالتزام بآداب الحوار والذوق العام.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
