'use client';

import { useState } from 'react';

type Props = {
  title: string;
  url: string;
};

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        شارك الخبر
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {/* واتساب */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="مشاركة عبر واتساب"
          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe59] active:scale-95 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.983 0C5.373 0 0 5.372 0 11.979c0 2.113.554 4.098 1.523 5.822L0 24l6.351-1.498A11.934 11.934 0 0011.983 24c6.61 0 11.983-5.372 11.983-11.979C23.966 5.372 18.593 0 11.983 0zm0 21.818a9.846 9.846 0 01-5.023-1.371l-.361-.214-3.741.882.916-3.638-.235-.374a9.808 9.808 0 01-1.505-5.246c0-5.428 4.42-9.845 9.849-9.845 5.428 0 9.849 4.417 9.849 9.845s-4.421 9.961-9.749 9.961z" />
          </svg>
          واتساب
        </a>

        {/* فيسبوك */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="مشاركة عبر فيسبوك"
          className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#1465d8] active:scale-95 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          فيسبوك
        </a>

        {/* تليجرام */}
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="مشاركة عبر تليجرام"
          className="inline-flex items-center gap-1.5 bg-[#0088CC] hover:bg-[#0077b5] active:scale-95 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          تليجرام
        </a>

        {/* نسخ الرابط */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="نسخ رابط الخبر"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition active:scale-95 ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              تم النسخ!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              نسخ الرابط
            </>
          )}
        </button>
      </div>
    </div>
  );
}
