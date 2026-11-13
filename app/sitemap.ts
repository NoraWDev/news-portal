import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ajrasalyemen.news';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/latest-news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/opinions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const [articles, categories, authors] = await Promise.all([
      prisma.articles.findMany({
        where: { status: 'published' },
        select: { slug: true, updated_at: true, published_at: true },
        orderBy: { published_at: 'desc' },
        take: 500,
      }),
      prisma.categories.findMany({
        select: { slug: true },
      }),
      prisma.authors.findMany({
        select: { slug: true },
      }),
    ]);

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
      url: `${siteUrl}/article/${art.slug}`,
      lastModified: art.updated_at || art.published_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
      url: `${siteUrl}/author/${author.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
  } catch (err) {
    console.error('[sitemap] Failed to load dynamic items:', err);
    return staticRoutes;
  }
}
