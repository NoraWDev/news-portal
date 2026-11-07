import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// أنواع مشتقة من Prisma
export type CategoryWithCount = Prisma.categoriesGetPayload<object> & {
  _count?: { articles: number };
};

export type ArticleWithCategory = Prisma.articlesGetPayload<{
  include: { category: true };
}>;

/**
 * جلب جميع الأقسام النشطة مرتبة حسب المعرف
 */
export async function getActiveCategories(): Promise<CategoryWithCount[]> {
  return prisma.categories.findMany({
    where: { is_active: true },
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });
}

/**
 * جلب قسم واحد بواسطة الـ slug
 * يُرجع null إذا لم يوجد القسم أو كان غير نشط
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithCount | null> {
  return prisma.categories.findFirst({
    where: { slug, is_active: true },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });
}

/**
 * جلب المقالات المنشورة لقسم معين بواسطة الـ slug
 */
export async function getArticlesByCategorySlug(
  slug: string,
  limit = 20,
  page = 1
): Promise<ArticleWithCategory[]> {
  const skip = (page - 1) * limit;
  return prisma.articles.findMany({
    where: {
      status: 'published',
      category: { slug, is_active: true },
    },
    include: {
      category: true,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: limit,
    skip,
  });
}

/**
 * عدد المقالات المنشورة في قسم معين
 */
export async function getArticlesCountBySlug(slug: string): Promise<number> {
  return prisma.articles.count({
    where: {
      status: 'published',
      category: { slug, is_active: true },
    },
  });
}
