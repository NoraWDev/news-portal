'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

// التحقق الأمني الداخلي لضمان عدم تنفيذ أي إجراء إداري دون جلسة تسجيل صالحة
async function verifyAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('غير مصرح لك بالوصول: يرجى تسجيل الدخول أولاً');
  }

  return user;
}

// Helper to convert Prisma BigInt objects to plain JS objects/strings
function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

// -------------------------------------------------------------
// 1. الأخبار (Articles / News)
// -------------------------------------------------------------
export async function getAdminArticles() {
  try {
    await verifyAdminSession();
    const list = await prisma.articles.findMany({
      include: {
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminArticles error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب الأخبار', data: [] };
  }
}

export async function createArticle(payload: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category_id?: string;
  author_name?: string;
  featured_image?: string;
  status?: string;
  is_featured?: boolean;
}) {
  try {
    await verifyAdminSession();
    const slug =
      payload.slug?.trim() ||
      payload.title
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-') + '-' + Date.now();

    const created = await prisma.articles.create({
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        content: payload.content || payload.excerpt || '',
        category_id: payload.category_id ? BigInt(payload.category_id) : null,
        author_name: payload.author_name || 'هيئة التحرير',
        featured_image: payload.featured_image,
        status: payload.status || 'published',
        is_featured: !!payload.is_featured,
        published_at: payload.status === 'draft' ? null : new Date(),
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createArticle error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة الخبر' };
  }
}

export async function deleteArticle(id: string) {
  try {
    await verifyAdminSession();
    await prisma.articles.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath('/admin/blog');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteArticle error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف الخبر' };
  }
}

// -------------------------------------------------------------
// 2. الأقسام (Categories)
// -------------------------------------------------------------
export async function getAdminCategories() {
  try {
    await verifyAdminSession();
    const list = await prisma.categories.findMany({
      include: {
        _count: {
          select: {
            articles: true,
            videos: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminCategories error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب الأقسام', data: [] };
  }
}

export async function createCategory(payload: {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
}) {
  try {
    await verifyAdminSession();
    const slug =
      payload.slug?.trim() ||
      payload.name
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-') + '-' + Date.now();

    const created = await prisma.categories.create({
      data: {
        name: payload.name,
        slug,
        description: payload.description,
        image_url: payload.image_url,
        is_active: true,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createCategory error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة القسم' };
  }
}

export async function updateCategory(
  id: string,
  payload: { name?: string; description?: string; is_active?: boolean }
) {
  try {
    await verifyAdminSession();
    const updated = await prisma.categories.update({
      where: { id: BigInt(id) },
      data: payload,
    });
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateCategory error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث القسم' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await verifyAdminSession();
    await prisma.categories.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteCategory error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف القسم' };
  }
}

// -------------------------------------------------------------
// 3. الفيديوهات (Videos)
// -------------------------------------------------------------
export async function getAdminVideos() {
  try {
    await verifyAdminSession();
    const list = await prisma.videos.findMany({
      include: {
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminVideos error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب الفيديوهات', data: [] };
  }
}

export async function createVideo(payload: {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category_id?: string;
  is_featured?: boolean;
}) {
  try {
    await verifyAdminSession();
    const created = await prisma.videos.create({
      data: {
        title: payload.title,
        description: payload.description,
        video_url: payload.video_url,
        thumbnail_url: payload.thumbnail_url,
        category_id: payload.category_id ? BigInt(payload.category_id) : null,
        is_featured: !!payload.is_featured,
        published_at: new Date(),
      },
    });

    revalidatePath('/admin/videos');
    revalidatePath('/');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createVideo error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة الفيديو' };
  }
}

export async function updateVideo(
  id: string,
  payload: {
    title?: string;
    description?: string;
    video_url?: string;
    thumbnail_url?: string;
    category_id?: string;
    is_featured?: boolean;
    published_at?: string | null;
  }
) {
  try {
    await verifyAdminSession();
    const updated = await prisma.videos.update({
      where: { id: BigInt(id) },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && { description: payload.description }),
        ...(payload.video_url !== undefined && { video_url: payload.video_url }),
        ...(payload.thumbnail_url !== undefined && { thumbnail_url: payload.thumbnail_url }),
        ...(payload.category_id !== undefined && {
          category_id: payload.category_id ? BigInt(payload.category_id) : null,
        }),
        ...(payload.is_featured !== undefined && { is_featured: payload.is_featured }),
        ...(payload.published_at !== undefined && {
          published_at: payload.published_at ? new Date(payload.published_at) : null,
        }),
      },
      include: { category: true },
    });

    revalidatePath('/admin/videos');
    revalidatePath('/');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateVideo error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث الفيديو' };
  }
}

export async function deleteVideo(id: string) {
  try {
    await verifyAdminSession();
    await prisma.videos.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath('/admin/videos');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteVideo error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف الفيديو' };
  }
}

// -------------------------------------------------------------
// 4. التعليقات (Comments)
// -------------------------------------------------------------
export async function getAdminComments() {
  try {
    await verifyAdminSession();
    const list = await prisma.comments.findMany({
      include: {
        article: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminComments error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب التعليقات', data: [] };
  }
}

export async function updateCommentStatus(id: string, status: string) {
  try {
    await verifyAdminSession();
    const updated = await prisma.comments.update({
      where: { id: BigInt(id) },
      data: { status },
    });
    revalidatePath('/admin/reviews');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateCommentStatus error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث حالة التعليق' };
  }
}

export async function deleteComment(id: string) {
  try {
    await verifyAdminSession();
    await prisma.comments.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    console.error('deleteComment error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف التعليق' };
  }
}

// -------------------------------------------------------------
// 5. الإعلانات (Ads)
// -------------------------------------------------------------
export async function getAdminAds() {
  try {
    await verifyAdminSession();
    const list = await prisma.ads.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminAds error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب الإعلانات', data: [] };
  }
}

export async function createAd(payload: {
  title: string;
  image_url?: string;
  target_url?: string;
  position: string;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}) {
  try {
    await verifyAdminSession();
    const created = await prisma.ads.create({
      data: {
        title: payload.title,
        image_url: payload.image_url,
        target_url: payload.target_url,
        position: payload.position,
        is_active: payload.is_active ?? true,
        starts_at: payload.starts_at ? new Date(payload.starts_at) : null,
        ends_at: payload.ends_at ? new Date(payload.ends_at) : null,
      },
    });

    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createAd error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة الإعلان' };
  }
}

export async function updateAd(
  id: string,
  payload: {
    title?: string;
    image_url?: string;
    target_url?: string;
    position?: string;
    is_active?: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
  }
) {
  try {
    await verifyAdminSession();
    const updated = await prisma.ads.update({
      where: { id: BigInt(id) },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.image_url !== undefined && { image_url: payload.image_url }),
        ...(payload.target_url !== undefined && { target_url: payload.target_url }),
        ...(payload.position !== undefined && { position: payload.position }),
        ...(payload.is_active !== undefined && { is_active: payload.is_active }),
        ...(payload.starts_at !== undefined && {
          starts_at: payload.starts_at ? new Date(payload.starts_at) : null,
        }),
        ...(payload.ends_at !== undefined && {
          ends_at: payload.ends_at ? new Date(payload.ends_at) : null,
        }),
      },
    });

    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateAd error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث الإعلان' };
  }
}

export async function toggleAdStatus(id: string, is_active: boolean) {
  try {
    await verifyAdminSession();
    const updated = await prisma.ads.update({
      where: { id: BigInt(id) },
      data: { is_active },
    });
    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('toggleAdStatus error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث حالة الإعلان' };
  }
}

export async function deleteAd(id: string) {
  try {
    await verifyAdminSession();
    await prisma.ads.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath('/admin/discounts');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteAd error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف الإعلان' };
  }
}

// -------------------------------------------------------------
// 6. نظرة عامة (Overview Stats)
// -------------------------------------------------------------
export async function getAdminOverviewCounts() {
  try {
    await verifyAdminSession();
    const [articlesCount, publishedCount, categoriesCount, videosCount, commentsCount, adsCount] =
      await Promise.all([
        prisma.articles.count(),
        prisma.articles.count({ where: { status: 'published' } }),
        prisma.categories.count(),
        prisma.videos.count(),
        prisma.comments.count(),
        prisma.ads.count({ where: { is_active: true } }),
      ]);

    return {
      success: true,
      data: {
        articlesCount,
        publishedCount,
        categoriesCount,
        videosCount,
        commentsCount,
        adsCount,
      },
    };
  } catch (error: any) {
    console.error('getAdminOverviewCounts error:', error?.message);
    return {
      success: false,
      data: null,
    };
  }
}
