"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getAdminArticleById, updateArticle, getAdminCategories } from "@/app/admin/actions";
import {
  IconDeviceFloppy,
  IconWorld,
  IconArrowRight,
  IconTrash,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("published");
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [catsRes, articleRes] = await Promise.all([
        getAdminCategories(),
        getAdminArticleById(articleId),
      ]);

      if (catsRes.success && catsRes.data) {
        setCategoriesList(catsRes.data.map((c: any) => ({ id: c.id.toString(), name: c.name })));
      }

      if (articleRes.success && articleRes.data) {
        const art = articleRes.data;
        setTitle(art.title || "");
        setContent(art.content || "");
        setExcerpt(art.excerpt || "");
        setAuthorName(art.author_name || "هيئة التحرير");
        setFeaturedImage(art.featured_image || "");
        setCategoryId(art.category_id ? art.category_id.toString() : "");
        setIsFeatured(!!art.is_featured);
        setStatus(art.status || "published");
      } else {
        toast.error("تعذر تحميل بيانات الخبر", { description: articleRes.error });
        router.push("/admin/blog");
      }
      setIsLoading(false);
    }

    if (articleId) {
      loadData();
    }
  }, [articleId, router]);

  async function handleUpdate(targetStatus?: 'published' | 'draft') {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الخبر");
      return;
    }
    setIsSubmitting(true);
    const finalStatus = targetStatus || status;
    const res = await updateArticle(articleId, {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      author_name: authorName.trim() || 'هيئة التحرير',
      category_id: categoryId || undefined,
      featured_image: featuredImage.trim() || undefined,
      is_featured: isFeatured,
      status: finalStatus,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("تم تحديث الخبر بنجاح", {
        description: `“${title.trim()}” تم حفظ التعديلات.`,
      });
      router.push("/admin/blog");
    } else {
      toast.error("حدث خطأ أثناء التحديث", { description: res.error });
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground text-sm">
        جاري تحميل تفاصيل الخبر...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="تعديل الخبر"
          description={`تعديل تفاصيل الخبر: ${title}`}
        />
        <Button variant="outline" asChild>
          <Link href="/admin/blog" className="flex items-center gap-1.5">
            <IconArrowRight className="size-4" />
            العودة للأخبار
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* RIGHT — main editor */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تفاصيل الخبر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">عنوان الخبر *</Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-name">اسم الكاتب أو المصدر</Label>
                <Input
                  id="author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-content">محتوى الخبر *</Label>
                  <span className="text-xs text-muted-foreground">
                    {content.trim() ? `${content.trim().split(/\s+/).length} كلمة` : "0 كلمة"}
                  </span>
                </div>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="leading-relaxed font-normal text-base"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">المقتطف أو العنوان الفرعي (Excerpt)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* LEFT — settings (in RTL) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تصنيف وحالة الخبر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">حالة النشر</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">القسم *</Label>
                {categoriesList.length > 0 ? (
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="اختر القسم..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesList.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-xs text-muted-foreground py-2">جاري تحميل الأقسام...</div>
                )}
              </div>

              {/* خيار تعيين كخبر رئيسي */}
              <div className="pt-3 border-t border-border/60">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mt-1 size-4 rounded border-gray-300 text-[#7a1a26] focus:ring-[#7a1a26] cursor-pointer"
                  />
                  <div className="flex-1 select-none">
                    <span className="text-sm font-bold text-foreground block">تعيين كخبر رئيسي</span>
                    <span className="text-xs text-muted-foreground block mt-0.5 leading-relaxed">
                      عند التفعيل، سيظهر هذا الخبر في أعلى الصفحة الرئيسية كخبر رئيسي للموقع مع استبدال الخبر الرئيسي السابق.
                    </span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصورة البارزة للخبر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
              />
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="image-url" className="text-xs text-muted-foreground">أو أدخل رابط صورة مباشر (URL)</Label>
                <Input
                  id="image-url"
                  placeholder="https://... أو /news-government.png"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              disabled={isSubmitting}
              onClick={() => handleUpdate()}
              className="w-full bg-[#7a1a26] hover:bg-[#5c131d] text-white"
            >
              <IconDeviceFloppy className="size-4 ml-1.5" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            {status === 'draft' ? (
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleUpdate('published')}
                className="w-full"
              >
                <IconWorld className="size-4 ml-1.5" />
                نشر الخبر الآن
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleUpdate('draft')}
                className="w-full"
              >
                تحويل إلى مسودة
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
