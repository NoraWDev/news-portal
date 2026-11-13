'use server';

import { prisma } from '@/lib/prisma';

export type BreakingNewsItem = {
  id: string;
  title: string;
  slug: string;
};

/**
 * جلب الأخبار العاجلة:
 * 1. إذا وُجدت أخبار محددة كعاجلة (is_breaking: true) ومنشورة (status: 'published')، تُعرض هذه الأخبار فقط.
 * 2. إذا لم توجد أخبار عاجلة محددة، يتم تلقائياً جلب آخر 5 أخبار منشورة.
 * 3. لا تعرض أي مسودات أو أخبار غير منشورة مطلقاً.
 * 4. إذا لم توجد أي أخبار منشورة على الإطلاق، تُرجع مصفوفة فارغة ليختفي الشريط بالكامل.
 */
export async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  try {
    // 1. البحث عن الأخبار المحددة كعاجلة ومنشورة فقط
    const breaking = await prisma.articles.findMany({
      where: {
        is_breaking: true,
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        published_at: 'desc',
      },
      take: 10,
    });

    if (breaking.length > 0) {
      return breaking.map((a) => ({
        id: a.id.toString(),
        title: a.title,
        slug: a.slug,
      }));
    }

    // 2. إذا لم توجد أخبار عاجلة محددة، جلب آخر 5 أخبار منشورة تلقائياً
    const latest = await prisma.articles.findMany({
      where: {
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        published_at: 'desc',
      },
      take: 5,
    });

    return latest.map((a) => ({
      id: a.id.toString(),
      title: a.title,
      slug: a.slug,
    }));
  } catch (error: any) {
    console.error('[getBreakingNews] error:', error?.message);
    return [];
  }
}
