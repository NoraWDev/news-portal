"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getAdminOpinionById, updateOpinion, getAdminAuthors, getAdminCategories } from "@/app/admin/actions";
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

export default function EditOpinionPage() {
  const router = useRouter();
  const params = useParams();
  const opinionId = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("published");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!opinionId) return;
    async function loadData() {
      setIsLoading(true);
      const [authorsRes, catsRes, opRes] = await Promise.all([
        getAdminAuthors(),
        getAdminCategories(),
        getAdminOpinionById(opinionId),
      ]);
      if (authorsRes.success && authorsRes.data) {
        setAuthors(authorsRes.data.map((a: any) => ({ id: a.id, name: a.name, avatar_url: a.avatar_url })));
      }
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data.map((c: any) => ({ id: c.id.toString(), name: c.name })));
      }
      if (opRes.success && opRes.data) {
        const op = opRes.data as any;
        setTitle(op.title || "");
        setContent(op.content || "");
        setExcerpt(op.excerpt || "");
        setAuthorId(op.author_id ? op.author_id.toString() : "");
        setCategoryId(op.category_id ? op.category_id.toString() : "");
        setStatus(op.status || "published");
      } else {
        toast.error("تعذر تحميل بيانات المقال");
        router.push("/admin/opinions");
      }
      setIsLoading(false);
    }
    loadData();
  }, [opinionId, router]);

  async function handleSave(targetStatus?: "published" | "draft") {
    if (!title.trim()) { toast.error("يرجى كتابة عنوان المقال"); return; }
    if (!authorId) { toast.error("يرجى اختيار الكاتب"); return; }
    setIsSubmitting(true);
    const res = await updateOpinion(opinionId, {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      author_id: authorId,
      category_id: categoryId || undefined,
      status: targetStatus || status,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("تم تحديث المقال بنجاح");
      router.push("/admin/opinions");
    } else {
      toast.error("حدث خطأ", { description: res.error });
    }
  }

  const selectedAuthor = authors.find((a) => a.id === authorId);

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground text-sm">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="تعديل المقال" description={`تعديل: ${title}`} />
        <Button variant="outline" asChild>
          <Link href="/admin/opinions" className="flex items-center gap-1.5">
            <IconArrowRight className="size-4" />
            العودة للمقالات
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الكاتب *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={authorId} onValueChange={setAuthorId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الكاتب..." />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAuthor && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  {selectedAuthor.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedAuthor.avatar_url} alt={selectedAuthor.name} className="size-10 rounded-full object-cover" />
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">القسم والحالة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر القسم..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              disabled={isSubmitting}
              onClick={() => handleSave()}
              className="w-full bg-[#7a1a26] hover:bg-[#5c131d] text-white"
            >
              <IconDeviceFloppy className="size-4 ml-1.5" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            {status === "draft" && (
              <Button variant="outline" disabled={isSubmitting} onClick={() => handleSave("published")} className="w-full">
                <IconWorld className="size-4 ml-1.5" />
                نشر الآن
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
