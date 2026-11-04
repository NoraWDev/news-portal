import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// أنواع صريحة مشتقة من Prisma تشمل العلاقات
export type ArticleWithCategory = Prisma.articlesGetPayload<{
  include: { category: true };
}>;

export type VideoWithCategory = Prisma.videosGetPayload<{
  include: { category: true };
}>;

export async function getFeaturedArticle() {
  return prisma.articles.findFirst({
    where: { 
      is_featured: true,
      status: 'published'
    },
    include: {
      category: true,
    },
    orderBy: {
      published_at: 'desc',
    },
  });
}

export async function getLatestArticles(limit = 4) {
  return prisma.articles.findMany({
    where: {
      status: 'published'
    },
    include: {
      category: true,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: limit,
  });
}

export async function getMostReadArticles(limit = 4) {
  return prisma.articles.findMany({
    where: {
      status: 'published'
    },
    include: {
      category: true,
    },
    orderBy: {
      views_count: 'desc',
    },
    take: limit,
  });
}

export async function getFeaturedVideo() {
  return prisma.videos.findFirst({
    where: {
      is_featured: true
    },
    include: {
      category: true,
    },
    orderBy: {
      published_at: 'desc',
    },
  });
}

export async function getLatestVideos(limit = 3) {
  return prisma.videos.findMany({
    include: {
      category: true,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: limit,
  });
}
