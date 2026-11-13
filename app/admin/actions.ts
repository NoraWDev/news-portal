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
// 0. رفع الصور والوسائط (Media Upload) عبر خادم مؤمّن للأدمن فقط
// -------------------------------------------------------------
export async function uploadImageAction(formData: FormData) {
  try {
    const adminUser = await verifyAdminSession();
    if (!adminUser || adminUser.email !== 'rasdnews@gmail.com') {
      return { success: false, error: 'غير مصرح لك برفع الصور. متاح فقط لحساب الأدمن المعتمد.' };
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'لم يتم تحديد أي ملف للرفع' };
    }

    // التحقق من حجم ونوع الملف
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'الملف المحدد ليس صورة صالحة' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'حجم الصورة يتجاوز الحد المسموح به (5 ميجابايت)' };
    }

    const supabase = await createClient();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('news-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('news-media')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      fileName,
    };
  } catch (error: any) {
    console.error('uploadImageAction error:', error?.message);
    return { success: false, error: error?.message || 'فشل في رفع الصورة' };
  }
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
  is_breaking?: boolean;
}) {
  try {
    await verifyAdminSession();
    const slug =
      payload.slug?.trim() ||
      payload.title
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-') + '-' + Date.now();

    // إذا تم تعيين الخبر كخبر رئيسي، نقوم بإلغاء صفة الرئيسي عن أي خبر سابق لضمان وجود خبر رئيسي واحد فقط
    if (payload.is_featured) {
      await prisma.articles.updateMany({
        where: { is_featured: true },
        data: { is_featured: false },
      });
    }

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
        is_breaking: !!payload.is_breaking,
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

export async function getAdminArticleById(id: string) {
  try {
    await verifyAdminSession();
    const article = await prisma.articles.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
      },
    });
    if (!article) return { success: false, error: 'الخبر غير موجود' };
    return { success: true, data: serialize(article) };
  } catch (error: any) {
    console.error('getAdminArticleById error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب تفاصيل الخبر' };
  }
}

export async function updateArticle(
  id: string,
  payload: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    category_id?: string;
    author_name?: string;
    featured_image?: string;
    status?: string;
    is_featured?: boolean;
    is_breaking?: boolean;
  }
) {
  try {
    await verifyAdminSession();
    const dataToUpdate: any = {};
    if (payload.title !== undefined) dataToUpdate.title = payload.title;
    if (payload.slug !== undefined) dataToUpdate.slug = payload.slug;
    if (payload.excerpt !== undefined) dataToUpdate.excerpt = payload.excerpt;
    if (payload.content !== undefined) dataToUpdate.content = payload.content;
    if (payload.author_name !== undefined) dataToUpdate.author_name = payload.author_name;
    if (payload.featured_image !== undefined) dataToUpdate.featured_image = payload.featured_image;
    if (payload.is_featured !== undefined) dataToUpdate.is_featured = payload.is_featured;
    if (payload.is_breaking !== undefined) dataToUpdate.is_breaking = payload.is_breaking;
    if (payload.category_id !== undefined) {
      dataToUpdate.category_id = payload.category_id ? BigInt(payload.category_id) : null;
    }
    if (payload.status !== undefined) {
      dataToUpdate.status = payload.status;
      if (payload.status === 'published') {
        dataToUpdate.published_at = new Date();
      }
    }

    // إذا تم تعيين الخبر كخبر رئيسي، نلغي صفة الرئيسي عن الأخبار الأخرى باستثناء هذا الخبر
    if (payload.is_featured) {
      await prisma.articles.updateMany({
        where: {
          is_featured: true,
          id: { not: BigInt(id) },
        },
        data: { is_featured: false },
      });
    }

    const updated = await prisma.articles.update({
      where: { id: BigInt(id) },
      data: dataToUpdate,
    });

    revalidatePath('/admin/blog');
    revalidatePath('/');
    revalidatePath(`/article/${updated.slug}`);
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateArticle error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث الخبر' };
  }
}

export async function toggleBreakingArticle(id: string, is_breaking: boolean) {
  try {
    await verifyAdminSession();
    const updated = await prisma.articles.update({
      where: { id: BigInt(id) },
      data: { is_breaking },
    });
    revalidatePath('/admin/blog');
    revalidatePath('/');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('toggleBreakingArticle error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تغيير حالة الخبر العاجل' };
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
// 6. الكتّاب (Authors)
// -------------------------------------------------------------
export async function getAdminAuthors() {
  try {
    await verifyAdminSession();
    const list = await prisma.authors.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminAuthors error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب الكتّاب', data: [] };
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const author = await prisma.authors.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: 'published' },
          orderBy: { published_at: 'desc' },
          include: { category: true },
        },
      },
    });
    if (!author) return { success: false, error: 'الكاتب غير موجود' };
    return { success: true, data: serialize(author) };
  } catch (error: any) {
    console.error('getAuthorBySlug error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب بيانات الكاتب' };
  }
}

export async function getAdminAuthorById(id: string) {
  try {
    await verifyAdminSession();
    const author = await prisma.authors.findUnique({ where: { id: BigInt(id) } });
    if (!author) return { success: false, error: 'الكاتب غير موجود' };
    return { success: true, data: serialize(author) };
  } catch (error: any) {
    console.error('getAdminAuthorById error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب بيانات الكاتب' };
  }
}

export async function createAuthor(payload: {
  name: string;
  slug?: string;
  bio?: string;
  avatar_url?: string;
}) {
  try {
    await verifyAdminSession();
    const slug =
      payload.slug?.trim() ||
      payload.name
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-') + '-' + Date.now();

    const created = await prisma.authors.create({
      data: {
        name: payload.name.trim(),
        slug,
        bio: payload.bio?.trim() || null,
        avatar_url: payload.avatar_url?.trim() || null,
      },
    });
    revalidatePath('/admin/authors');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createAuthor error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة الكاتب' };
  }
}

export async function updateAuthor(
  id: string,
  payload: { name?: string; bio?: string; avatar_url?: string }
) {
  try {
    await verifyAdminSession();
    const updated = await prisma.authors.update({
      where: { id: BigInt(id) },
      data: {
        ...(payload.name !== undefined && { name: payload.name.trim() }),
        ...(payload.bio !== undefined && { bio: payload.bio.trim() || null }),
        ...(payload.avatar_url !== undefined && { avatar_url: payload.avatar_url.trim() || null }),
      },
    });
    revalidatePath('/admin/authors');
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateAuthor error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث الكاتب' };
  }
}

export async function deleteAuthor(id: string) {
  try {
    await verifyAdminSession();
    // author_id يصبح NULL في articles تلقائياً (ON DELETE SET NULL)
    await prisma.authors.delete({ where: { id: BigInt(id) } });
    revalidatePath('/admin/authors');
    return { success: true };
  } catch (error: any) {
    console.error('deleteAuthor error:', error?.message);
    return { success: false, error: error?.message || 'فشل في حذف الكاتب' };
  }
}

// نسخة محدّثة من createArticle تدعم author_id
export async function createOpinion(payload: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category_id?: string;
  author_id?: string;
  status?: string;
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
        title: payload.title.trim(),
        slug,
        excerpt: payload.excerpt?.trim(),
        content: payload.content.trim(),
        category_id: payload.category_id ? BigInt(payload.category_id) : null,
        author_id: payload.author_id ? BigInt(payload.author_id) : null,
        status: payload.status || 'published',
        is_featured: false,
        published_at: payload.status === 'draft' ? null : new Date(),
      },
    });
    revalidatePath('/admin/opinions');
    revalidatePath('/category/reports');
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    console.error('createOpinion error:', error?.message);
    return { success: false, error: error?.message || 'فشل في إضافة المقال' };
  }
}

export async function getAdminOpinions() {
  try {
    await verifyAdminSession();
    const list = await prisma.articles.findMany({
      where: { author_id: { not: null } },
      include: { category: true, author: true },
      orderBy: { created_at: 'desc' },
    });
    return { success: true, data: serialize(list) };
  } catch (error: any) {
    console.error('getAdminOpinions error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب المقالات', data: [] };
  }
}

export async function getAdminOpinionById(id: string) {
  try {
    await verifyAdminSession();
    const article = await prisma.articles.findUnique({
      where: { id: BigInt(id) },
      include: { category: true, author: true },
    });
    if (!article) return { success: false, error: 'المقال غير موجود' };
    return { success: true, data: serialize(article) };
  } catch (error: any) {
    console.error('getAdminOpinionById error:', error?.message);
    return { success: false, error: error?.message || 'فشل في جلب المقال' };
  }
}

export async function updateOpinion(
  id: string,
  payload: {
    title?: string;
    excerpt?: string;
    content?: string;
    category_id?: string;
    author_id?: string;
    status?: string;
  }
) {
  try {
    await verifyAdminSession();
    const dataToUpdate: any = {};
    if (payload.title !== undefined) dataToUpdate.title = payload.title.trim();
    if (payload.excerpt !== undefined) dataToUpdate.excerpt = payload.excerpt.trim() || null;
    if (payload.content !== undefined) dataToUpdate.content = payload.content.trim();
    if (payload.category_id !== undefined)
      dataToUpdate.category_id = payload.category_id ? BigInt(payload.category_id) : null;
    if (payload.author_id !== undefined)
      dataToUpdate.author_id = payload.author_id ? BigInt(payload.author_id) : null;
    if (payload.status !== undefined) {
      dataToUpdate.status = payload.status;
      if (payload.status === 'published') dataToUpdate.published_at = new Date();
    }

    const updated = await prisma.articles.update({
      where: { id: BigInt(id) },
      data: dataToUpdate,
    });
    revalidatePath('/admin/opinions');
    revalidatePath('/category/reports');
    revalidatePath(`/article/${updated.slug}`);
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    console.error('updateOpinion error:', error?.message);
    return { success: false, error: error?.message || 'فشل في تحديث المقال' };
  }
}

// -------------------------------------------------------------
// 7. نظرة عامة (Overview Stats)
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
