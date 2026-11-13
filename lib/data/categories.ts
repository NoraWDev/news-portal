import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// أنواع مشتقة من Prisma
export type CategoryWithCount = Prisma.categoriesGetPayload<object> & {
  _count?: { articles: number };
};

export type ArticleWithCategoryAndAuthor = Prisma.articlesGetPayload<{
  include: { category: true; author: true };
}>;

export type ArticleWithCategory = ArticleWithCategoryAndAuthor;

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
      author: true,
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

/**
 * جلب التقارير العامة فقط (غير المرتبطة بكاتب رأي)
 */
export async function getGeneralReports(
  limit = 20,
  page = 1
): Promise<ArticleWithCategory[]> {
  const skip = (page - 1) * limit;
  return prisma.articles.findMany({
    where: {
      status: 'published',
      category: { slug: 'reports', is_active: true },
      author_id: null,
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: limit,
    skip,
  });
}

export async function getGeneralReportsCount(): Promise<number> {
  return prisma.articles.count({
    where: {
      status: 'published',
      category: { slug: 'reports', is_active: true },
      author_id: null,
    },
  });
}

/**
 * جلب مقالات الرأي المنشورة فقط (المرتبطة بكتّاب)
 */
export async function getPublishedOpinions(
  limit = 20,
  page = 1
): Promise<ArticleWithCategory[]> {
  const skip = (page - 1) * limit;
  return prisma.articles.findMany({
    where: {
      status: 'published',
      author_id: { not: null },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: limit,
    skip,
  });
}

export async function getPublishedOpinionsCount(): Promise<number> {
  return prisma.articles.count({
    where: {
      status: 'published',
      author_id: { not: null },
    },
  });
}
