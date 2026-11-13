"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminAuthors, deleteAuthor } from "@/app/admin/actions";
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
import { IconCirclePlus, IconPencil, IconTrash, IconUser } from "@tabler/icons-react";

type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  _count?: { articles: number };
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadAuthors() {
    setIsLoading(true);
    const res = await getAdminAuthors();
    if (res.success && res.data) {
      setAuthors(res.data as Author[]);
    } else {
      toast.error("فشل في تحميل الكتّاب", { description: res.error });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`هل أنت متأكد من حذف الكاتب "${name}"؟\nستبقى مقالاته بدون كاتب محدد.`)) return;
    setDeleting(id);
    const res = await deleteAuthor(id);
    if (res.success) {
      toast.success("تم حذف الكاتب بنجاح");
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } else {
      toast.error("فشل في الحذف", { description: res.error });
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="إدارة الكتّاب"
          description="قائمة الكتّاب والمحررين في أجراس اليمن الإخبارية."
        />
        <Button asChild className="bg-[#7a1a26] hover:bg-[#5c131d] text-white">
          <Link href="/admin/authors/new" className="flex items-center gap-1.5">
            <IconCirclePlus className="size-4" />
            إضافة كاتب
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">جاري التحميل...</div>
      ) : authors.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          <IconUser className="size-10 mx-auto mb-3 opacity-30" />
          <p>لا يوجد كتّاب بعد. أضف أول كاتب الآن.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكاتب</TableHead>
                <TableHead className="text-right hidden md:table-cell">النبذة</TableHead>
                <TableHead className="text-center">المقالات</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {author.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={author.avatar_url}
                          alt={author.name}
                          className="size-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                          <IconUser className="size-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{author.name}</p>
                        <p className="text-xs text-muted-foreground">/{author.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs">
                    <span className="line-clamp-2">{author.bio || "—"}</span>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {author._count?.articles ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/authors/${author.id}`}>
                          <IconPencil className="size-3.5 ml-1" />
                          تعديل
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleting === author.id}
                        onClick={() => handleDelete(author.id, author.name)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <IconTrash className="size-3.5 ml-1" />
                        {deleting === author.id ? "..." : "حذف"}
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
