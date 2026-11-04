"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createArticle } from "@/app/admin/actions";
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
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
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

const CATEGORIES = [
  "سياسة",
  "محلي",
  "اقتصاد",
  "رياضة",
  "مجتمع",
  "تقنية",
];

const TOOLBAR: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { icon: IconBold, label: "عريض" },
  { icon: IconItalic, label: "مائل" },
  { icon: IconList, label: "قائمة نقطية" },
  { icon: IconLink, label: "إدراج رابط" },
  { icon: IconPhoto, label: "إدراج صورة" },
  { icon: IconQuote, label: "اقتباس" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("سياسة");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function publish() {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الخبر");
      return;
    }
    setIsSubmitting(true);
    const res = await createArticle({
      title: title.trim(),
      content: content.trim() || title.trim(),
      excerpt: excerpt.trim() || undefined,
      status: "published",
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("تم نشر الخبر", {
        description: `“${title.trim()}” متاح الآن على الموقع.`,
      });
      router.push("/admin/blog");
    } else {
      toast.error("فشل في نشر الخبر", { description: res.error });
    }
  }

  async function saveDraft() {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الخبر");
      return;
    }
    setIsSubmitting(true);
    const res = await createArticle({
      title: title.trim(),
      content: content.trim() || title.trim(),
      excerpt: excerpt.trim() || undefined,
      status: "draft",
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("تم حفظ المسودة", {
        description: "يمكنك العودة وإكمال تحرير الخبر ونشره لاحقًا.",
      });
      router.push("/admin/blog");
    } else {
      toast.error("فشل في حفظ المسودة", { description: res.error });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة خبر جديد"
        description="كتابة مسودة الخبر، وتحديد القسم وتفاصيل النشر في موقع أجراس اليمن الإخبارية."
      >
        <Button variant="outline" asChild>
          <Link href="/admin/blog">
            <IconX className="size-4" /> إلغاء
          </Link>
        </Button>
        <Button onClick={publish} disabled={isSubmitting}>
          <IconWorld className="size-4" /> {isSubmitting ? "جاري النشر..." : "نشر الخبر"}
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* RIGHT — editor (in RTL) */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="sr-only">
                  عنوان الخبر
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان الخبر الرئيسي..."
                  className="h-auto border-0 px-0 py-1 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0 md:text-3xl dark:bg-transparent"
                />
              </div>

              <Separator />

              {/* Faux rich-text toolbar */}
              <div className="flex flex-wrap items-center gap-1">
                {TOOLBAR.map((t) => (
                  <Button
                    key={t.label}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    onClick={() => toast(t.label, { description: "تم تطبيق التنسيق." })}
                  >
                    <t.icon className="size-4" />
                    <span className="sr-only">{t.label}</span>
                  </Button>
                ))}
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ابدأ بكتابة تفاصيل الخبر والمحتوى هنا..."
                rows={18}
                className="resize-none border-0 px-0 text-base leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">المقتطف الصحفي</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="ملخص موجز يظهر في المعاينات وشريط الأخبار ونتائج البحث..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* LEFT — settings (in RTL) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">إعدادات النشر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select defaultValue="مسودة">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مسودة">مسودة</SelectItem>
                    <SelectItem value="منشور">منشور</SelectItem>
                    <SelectItem value="مجدول">مجدول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">القسم</Label>
                <Select defaultValue="سياسة">
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">الوسوم (Tags)</Label>
                <Input
                  id="tags"
                  placeholder="أخبار, عاجل, تقرير"
                />
                <p className="text-xs text-muted-foreground">
                  افصل بين الكلمات الدلالية بفاصلة.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish-date">تاريخ النشر</Label>
                <Input id="publish-date" type="date" defaultValue="2026-10-04" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصورة البارزة</CardTitle>
            </CardHeader>
            <CardContent>
              <button
                type="button"
                onClick={() =>
                  toast("رفع صورة بارزة", {
                    description: "اسحب صورة إلى هنا أو تصفح ملفاتك.",
                  })
                }
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <IconCloudUpload className="size-5" />
                </span>
                <span className="text-sm font-medium">رفع صورة الخبر البارزة</span>
                <span className="text-xs text-muted-foreground">
                  صيغ PNG أو JPG أو WEBP حتى 5 ميجابايت
                </span>
              </button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button onClick={publish}>
              <IconWorld className="size-4" /> نشر الخبر
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              <IconDeviceFloppy className="size-4" /> حفظ كمسودة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
