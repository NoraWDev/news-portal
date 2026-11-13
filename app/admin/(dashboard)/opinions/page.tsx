"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminOpinions, deleteArticle } from "@/app/admin/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconCirclePlus, IconPencil, IconTrash, IconFileText, IconUser } from "@tabler/icons-react";

type Opinion = {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  author: { id: string; name: string; avatar_url: string | null } | null;
  category: { name: string } | null;
};

export default function OpinionsPage() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadOpinions() {
    setIsLoading(true);
    const res = await getAdminOpinions();
    if (res.success && res.data) {
      setOpinions(res.data as Opinion[]);
    } else {
      toast.error("فشل في تحميل المقالات");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadOpinions();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`هل أنت متأكد من حذف المقال "${title}"؟`)) return;
    setDeleting(id);
    const res = await deleteArticle(id);
    if (res.success) {
      toast.success("تم حذف المقال بنجاح");
      setOpinions((prev) => prev.filter((o) => o.id !== id));
    } else {
      toast.error("فشل في الحذف", { description: res.error });
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="مقالات الرأي"
          description="مقالات الرأي والتحليل المرتبطة بكتّاب محددين."
        />
        <Button asChild className="bg-[#7a1a26] hover:bg-[#5c131d] text-white">
          <Link href="/admin/opinions/new" className="flex items-center gap-1.5">
            <IconCirclePlus className="size-4" />
            إضافة مقال
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">جاري التحميل...</div>
      ) : opinions.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          <IconFileText className="size-10 mx-auto mb-3 opacity-30" />
          <p>لا توجد مقالات بعد. أضف أول مقال الآن.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عنوان المقال</TableHead>
                <TableHead className="text-right hidden md:table-cell">الكاتب</TableHead>
                <TableHead className="text-right hidden md:table-cell">القسم</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opinions.map((op) => (
                <TableRow key={op.id}>
                  <TableCell>
                    <p className="font-semibold text-sm line-clamp-2">{op.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(op.created_at).toLocaleDateString("ar-YE")}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {op.author ? (
                      <div className="flex items-center gap-2">
                        {op.author.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={op.author.avatar_url}
                            alt={op.author.name}
                            className="size-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                            <IconUser className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm">{op.author.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {op.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        op.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {op.status === "published" ? "منشور" : "مسودة"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/opinions/${op.id}`}>
                          <IconPencil className="size-3.5 ml-1" />
                          تعديل
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleting === op.id}
                        onClick={() => handleDelete(op.id, op.title)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <IconTrash className="size-3.5 ml-1" />
                        {deleting === op.id ? "..." : "حذف"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
