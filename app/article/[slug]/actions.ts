'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// حماية بسيطة: قائمة كلمات الرسائل المزعجة الشائعة
const SPAM_PATTERNS = [
  /\b(viagra|casino|poker|sex|porn|xxx|bitcoin|crypto|hack|free money)\b/i,
  /(https?:\/\/[^\s]{5,}.*){3,}/i, // 3 روابط أو أكثر = spam
];

function isSpam(text: string): boolean {
  return SPAM_PATTERNS.some((p) => p.test(text));
}

export async function submitComment(formData: FormData) {
  const articleId = formData.get('article_id') as string;
  const authorName = (formData.get('author_name') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  // التحقق من المدخلات: الاسم ونص التعليق مطلوبان فقط
  if (!articleId || !authorName || !content) {
    return { success: false, error: 'الاسم ونص التعليق مطلوبان' };
  }

  if (authorName.length < 2 || authorName.length > 80) {
    return { success: false, error: 'الاسم يجب أن يكون بين 2 و80 حرفاً' };
  }

  if (content.length < 5 || content.length > 2000) {
    return { success: false, error: 'التعليق يجب أن يكون بين 5 و2000 حرف' };
  }

  // فحص الـ spam والحماية الأساسية
  if (isSpam(authorName) || isSpam(content)) {
    return { success: false, error: 'تعذّر إرسال التعليق. يرجى مراجعة المحتوى.' };
  }

  try {
    // التحقق من وجود المقال
    const article = await prisma.articles.findUnique({
      where: { id: BigInt(articleId) },
      select: { id: true, slug: true, status: true },
    });

    if (!article || article.status !== 'published') {
      return { success: false, error: 'المقال غير موجود' };
    }

    // حفظ التعليق مباشرة بحالة approved وفقاً لطلب المستخدم (دون انتظار موافقة)
    const newComment = await prisma.comments.create({
      data: {
        article_id: BigInt(articleId),
        author_name: authorName,
        author_email: null,
        content,
        status: 'approved',
      },
    });

    // زيادة عداد التعليقات في المقال
    try {
      await prisma.articles.update({
        where: { id: BigInt(articleId) },
        data: { comments_count: { increment: 1 } },
      });
    } catch {
      // عدم تعطيل التعليق إذا تعذر تحديث العداد
    }

    // تحديث cache صفحة الخبر
    revalidatePath(`/article/${article.slug}`);

    return {
      success: true,
      comment: {
        id: newComment.id.toString(),
        author_name: newComment.author_name,
        content: newComment.content,
        created_at: newComment.created_at.toISOString(),
      },
    };
  } catch (error: any) {
    console.error('[submitComment] error:', error?.message);
    return { success: false, error: 'حدث خطأ أثناء حفظ التعليق، يرجى المحاولة مجدداً' };
  }
}

export async function getApprovedComments(articleId: bigint) {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        article_id: articleId,
        status: 'approved',
      },
      orderBy: { created_at: 'asc' },
      select: {
        id: true,
        author_name: true,
        content: true,
        created_at: true,
      },
    });

    // تحويل BigInt وDate إلى أنواع قابلة للتسلسل
    return comments.map((c) => ({
      id: c.id.toString(),
      author_name: c.author_name,
      content: c.content,
      created_at: c.created_at.toISOString(),
    }));
  } catch (error: any) {
    console.error('[getApprovedComments] error:', error?.message);
    return [];
  }
}
