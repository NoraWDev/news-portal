"use client";

import { useState, useRef } from "react";
import { IconCloudUpload, IconCheck, IconTrash, IconLoader2 } from "@tabler/icons-react";
import { uploadImageAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "الصورة البارزة للخبر" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يتجاوز 5 ميجابايت");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    toast.loading("جاري رفع الصورة إلى التخزين الدائم...", { id: "upload-image" });

    try {
      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        onChange(res.url);
        toast.success("تم رفع الصورة بنجاح", { id: "upload-image" });
      } else {
        toast.error("فشل في رفع الصورة", {
          id: "upload-image",
          description: res.error || "تأكد من صلاحيات الاتصال بالتخزين",
        });
      }
    } catch (err: any) {
      toast.error("حدث خطأ غير متوقع أثناء الرفع", {
        id: "upload-image",
        description: err.message,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-neutral-950 shadow-sm group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="المعاينة"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                تغيير الصورة
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onChange("")}
                disabled={isUploading}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <IconCheck className="size-3.5" />
            <span>تم ربط وتخزين الصورة بنجاح</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-9 text-center transition hover:bg-muted/40 hover:border-primary/50 cursor-pointer disabled:opacity-60"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {isUploading ? (
              <IconLoader2 className="size-5 animate-spin text-primary" />
            ) : (
              <IconCloudUpload className="size-5" />
            )}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {isUploading ? "جاري رفع الصورة..." : "اضغط لاختيار صورة من جهازك"}
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WEBP حتى 5 ميجابايت (تُرفع إلى Supabase Storage)
          </span>
        </button>
      )}
    </div>
  );
}
