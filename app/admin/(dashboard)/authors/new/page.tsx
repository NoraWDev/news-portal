"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAuthor, uploadImageAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowRight, IconDeviceFloppy, IconUser, IconCloudUpload } from "@tabler/icons-react";

export default function NewAuthorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    // reset input
    e.target.value = "";
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الكاتب");
      return;
    }
    setIsSubmitting(true);
    const res = await createAuthor({
      name: name.trim(),
      bio: bio.trim() || undefined,
      avatar_url: avatarUrl.trim() || undefined,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("تم إضافة الكاتب بنجاح");
      router.push("/admin/authors");
    } else {
      toast.error("حدث خطأ", { description: res.error });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="إضافة كاتب جديد" description="أضف كاتبًا أو محررًا جديدًا إلى الموقع." />
        <Button variant="outline" asChild>
          <Link href="/admin/authors" className="flex items-center gap-1.5">
            <IconArrowRight className="size-4" />
            العودة للكتّاب
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
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
                  placeholder="مثال: أحمد محمد..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-bio">نبذة عن الكاتب</Label>
                <Textarea
                  id="author-bio"
                  placeholder="وصف مختصر عن الكاتب وخبرته الصحفية..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصورة الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview */}
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

              {/* Upload */}
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center gap-2 w-full cursor-pointer border border-dashed border-border rounded-lg p-3 text-sm text-muted-foreground hover:border-[#7a1a26] hover:text-[#7a1a26] transition"
                >
                  <IconCloudUpload className="size-4" />
                  {isUploading ? "جاري الرفع..." : "رفع صورة"}
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

              {/* Manual URL */}
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
            {isSubmitting ? "جاري الحفظ..." : "حفظ الكاتب"}
          </Button>
        </div>
      </div>
    </div>
  );
}
