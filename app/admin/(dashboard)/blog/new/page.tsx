"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createArticle, getAdminCategories } from "@/app/admin/actions";
import {
  IconBold,
  IconItalic,
  IconList,
  IconLink,
  IconPhoto,
  IconQuote,
  IconCloudUpload,
  IconDeviceFloppy,
  IconWorld,
  IconX,
  IconArrowRight,
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorName, setAuthorName] = useState("هيئة التحرير");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAdminCategories().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCategoriesList(res.data.map((c: any) => ({ id: c.id.toString(), name: c.name })));
        setCategoryId(res.data[0].id.toString());
      }
    });
  }, []);

  async function handleSave(status: 'published' | 'draft') {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الخبر");
      return;
    }
    if (!content.trim()) {
      toast.error("يرجى كتابة محتوى الخبر");
      return;
    }
    setIsSubmitting(true);
    const res = await createArticle({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      author_name: authorName.trim() || 'هيئة التحرير',
      category_id: categoryId || undefined,
      featured_image: featuredImage.trim() || undefined,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      status,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(status === 'published' ? "تم نشر الخبر بنجاح" : "تم حفظ المسودة بنجاح", {
        description: `“${title.trim()}” ${status === 'published' ? 'متاح الآن على الموقع.' : 'محفوظ في المسودات.'}`,
      });
      router.push("/admin/blog");
    } else {
      toast.error("حدث خطأ", { description: res.error });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="إضافة خبر جديد"
          description="تحرير ونشر خبر أو تقرير صحفي جديد على منصة أجراس اليمن الإخبارية."
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
              <CardTitle className="text-base">تفاصيل الخبر الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">عنوان الخبر *</Label>
                <Input
                  id="post-title"
                  placeholder="أدخل عنواناً جذاباً ودقيقاً للخبر..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-name">اسم الكاتب أو المصدر</Label>
                <Input
                  id="author-name"
                  placeholder="مثال: هيئة التحرير، أو اسم الصحفي..."
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
                  placeholder="اكتب التفاصيل الكاملة للخبر هنا..."
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
                placeholder="ملخص قصير من سطرين يظهر في بطاقات الأخبار والصفحة الرئيسية..."
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
              <CardTitle className="text-base">تصنيف الخبر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              {/* خيار تعيين كخبر عاجل */}
              <div className="pt-3 border-t border-border/60">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="mt-1 size-4 rounded border-red-300 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                  <div className="flex-1 select-none">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <span>⚡</span> تعيين كخبر عاجل
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5 leading-relaxed">
                      عند التفعيل، سيظهر هذا الخبر في شريط الأخبار العاجلة أعلى الموقع فور نشره.
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
              onClick={() => handleSave('published')}
              className="w-full bg-[#7a1a26] hover:bg-[#5c131d] text-white"
            >
              <IconWorld className="size-4 ml-1.5" />
              {isSubmitting ? "جاري النشر..." : "نشر الخبر الآن"}
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleSave('draft')}
              className="w-full"
            >
              <IconDeviceFloppy className="size-4 ml-1.5" />
              حفظ كمسودة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
