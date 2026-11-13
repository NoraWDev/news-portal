"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOpinion, getAdminAuthors, getAdminCategories } from "@/app/admin/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { IconArrowRight, IconDeviceFloppy, IconWorld, IconUser } from "@tabler/icons-react";

type Author = { id: string; name: string; avatar_url: string | null };
type Category = { id: string; name: string };

export default function NewOpinionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // جلب الكتّاب والأقسام
    getAdminAuthors().then((res) => {
      if (res.success && res.data) {
        setAuthors(res.data.map((a: any) => ({ id: a.id, name: a.name, avatar_url: a.avatar_url })));
      }
    });
    getAdminCategories().then((res) => {
      if (res.success && res.data) {
        const list = res.data.map((c: any) => ({ id: c.id.toString(), name: c.name }));
        setCategories(list);
        // تعيين قسم "التقارير" افتراضيًا
        const reports = list.find((c: Category) => c.name.includes("تقارير") || c.id === "7");
        if (reports) setCategoryId(reports.id);
      }
    });
  }, []);

  async function handleSave(status: "published" | "draft") {
    if (!title.trim()) { toast.error("يرجى كتابة عنوان المقال"); return; }
    if (!content.trim()) { toast.error("يرجى كتابة محتوى المقال"); return; }
    if (!authorId) { toast.error("يرجى اختيار الكاتب"); return; }

    setIsSubmitting(true);
    const res = await createOpinion({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      author_id: authorId,
      category_id: categoryId || undefined,
      status,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(status === "published" ? "تم نشر المقال بنجاح" : "تم حفظ المسودة");
      router.push("/admin/opinions");
    } else {
      toast.error("حدث خطأ", { description: res.error });
    }
  }

  // الكاتب المحدد لعرض بياناته
  const selectedAuthor = authors.find((a) => a.id === authorId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="إضافة مقال رأي جديد" description="إضافة مقال مرتبط بكاتب محدد." />
        <Button variant="outline" asChild>
          <Link href="/admin/opinions" className="flex items-center gap-1.5">
            <IconArrowRight className="size-4" />
            العودة للمقالات
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main editor */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تفاصيل المقال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المقال *</Label>
                <Input
                  id="title"
                  placeholder="أدخل عنوان المقال..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-semibold"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">محتوى المقال *</Label>
                  <span className="text-xs text-muted-foreground">
                    {content.trim() ? `${content.trim().split(/\s+/).length} كلمة` : "0 كلمة"}
                  </span>
                </div>
                <Textarea
                  id="content"
                  placeholder="اكتب محتوى المقال هنا..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="leading-relaxed text-base"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">المقتطف (Excerpt)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ملخص قصير يظهر في قوائم المقالات..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* اختيار الكاتب */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الكاتب *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {authors.length === 0 ? (
                <div className="text-sm text-muted-foreground py-2">
                  لا يوجد كتّاب بعد.{" "}
                  <Link href="/admin/authors/new" className="text-[#7a1a26] underline">
                    أضف كاتبًا أولاً
                  </Link>
                </div>
              ) : (
                <Select value={authorId} onValueChange={setAuthorId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الكاتب..." />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* معاينة الكاتب المختار */}
              {selectedAuthor && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  {selectedAuthor.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedAuthor.avatar_url}
                      alt={selectedAuthor.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                      <IconUser className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-semibold text-sm">{selectedAuthor.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* القسم */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">القسم</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر القسم..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-xs text-muted-foreground py-2">جاري تحميل الأقسام...</div>
              )}
            </CardContent>
          </Card>

          {/* أزرار الحفظ */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              disabled={isSubmitting}
              onClick={() => handleSave("published")}
              className="w-full bg-[#7a1a26] hover:bg-[#5c131d] text-white"
            >
              <IconWorld className="size-4 ml-1.5" />
              {isSubmitting ? "جاري النشر..." : "نشر المقال الآن"}
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleSave("draft")}
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
