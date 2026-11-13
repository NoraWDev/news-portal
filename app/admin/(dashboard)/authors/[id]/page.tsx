"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getAdminAuthorById, updateAuthor, uploadImageAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowRight, IconDeviceFloppy, IconUser, IconCloudUpload } from "@tabler/icons-react";

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.id as string;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authorId) return;
    getAdminAuthorById(authorId).then((res) => {
      if (res.success && res.data) {
        const a = res.data as any;
        setName(a.name || "");
        setBio(a.bio || "");
        setAvatarUrl(a.avatar_url || "");
      } else {
        toast.error("تعذر تحميل بيانات الكاتب");
        router.push("/admin/authors");
      }
      setIsLoading(false);
    });
  }, [authorId, router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImageAction(formData);
    if (res.success && res.url) {
      setAvatarUrl(res.url);
      toast.success("تم رفع الصورة بنجاح");
    } else {
      toast.error("فشل رفع الصورة", { description: res.error });
    }
    setIsUploading(false);
    e.target.value = "";
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الكاتب");
      return;
    }
    setIsSubmitting(true);
    const res = await updateAuthor(authorId, {
      name: name.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("تم تحديث بيانات الكاتب بنجاح");
      router.push("/admin/authors");
    } else {
      toast.error("حدث خطأ", { description: res.error });
    }
  }

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground text-sm">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="تعديل بيانات الكاتب" description={`تعديل بيانات: ${name}`} />
        <Button variant="outline" asChild>
          <Link href="/admin/authors" className="flex items-center gap-1.5">
            <IconArrowRight className="size-4" />
            العودة للكتّاب
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">بيانات الكاتب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author-name">الاسم الكامل *</Label>
                <Input
                  id="author-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-bio">نبذة عن الكاتب</Label>
                <Textarea
                  id="author-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصورة الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="صورة الكاتب"
                    className="size-24 rounded-full object-cover border-2 border-[#7a1a26]"
                  />
                ) : (
                  <div className="size-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <IconUser className="size-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center gap-2 w-full cursor-pointer border border-dashed border-border rounded-lg p-3 text-sm text-muted-foreground hover:border-[#7a1a26] hover:text-[#7a1a26] transition"
                >
                  <IconCloudUpload className="size-4" />
                  {isUploading ? "جاري الرفع..." : "تغيير الصورة"}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="avatar-url" className="text-xs text-muted-foreground">
                  أو أدخل رابط الصورة مباشرة
                </Label>
                <Input
                  id="avatar-url"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            disabled={isSubmitting}
            onClick={handleSave}
            className="w-full bg-[#7a1a26] hover:bg-[#5c131d] text-white"
          >
            <IconDeviceFloppy className="size-4 ml-1.5" />
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </div>
    </div>
  );
}
