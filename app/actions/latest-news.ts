'use server';

import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 12;

export interface LatestNewsItem {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  views_count: string;
  author_name: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string | null; slug: string; avatar_url: string | null } | null;
}

export interface LatestNewsResult {
  items: LatestNewsItem[];
  hasMore: boolean;
  total: number;
}

export async function getLatestNews(page: number = 0): Promise<LatestNewsResult> {
  const safePage = Math.max(0, page);

  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      where: { status: 'published' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, slug: true, avatar_url: true } },
      },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' },
        { id: 'desc' },
      ],
      skip: safePage * PAGE_SIZE,
      take: PAGE_SIZE + 1,
    }),
    prisma.articles.count({ where: { status: 'published' } }),
  ]);

  const hasMore = articles.length > PAGE_SIZE;
  const rawItems = hasMore ? articles.slice(0, PAGE_SIZE) : articles;

  const items: LatestNewsItem[] = rawItems.map((a) => ({
    id: a.id.toString(),
    title: a.title,
    slug: a.slug,
    featured_image: a.featured_image,
    published_at: a.published_at ? a.published_at.toISOString() : null,
    created_at: a.created_at.toISOString(),
    views_count: a.views_count.toString(),
    author_name: a.author_name,
    category: a.category ? { name: a.category.name, slug: a.category.slug } : null,
    author: a.author
      ? { name: a.author.name, slug: a.author.slug, avatar_url: a.author.avatar_url }
      : null,
  }));

  return {
    items,
    hasMore,
    total,
  };
}
