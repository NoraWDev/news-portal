"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminArticles, deleteArticle } from "@/app/admin/actions";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconMessage2,
  IconLayoutGrid,
  IconList,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconFileText,
  IconWorld,
  IconClipboardText,
  IconMessages,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PostStatus = "منشور" | "مسودة" | "مجدول";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  category: string;
  status: PostStatus;
  date: string;
  views: number;
  comments: number;
  gradient: string;
};

const statusStyles: Record<PostStatus, string> = {
  منشور: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  مسودة: "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  مجدول: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

function gradient(a: number, b: number) {
  return `linear-gradient(135deg, var(--chart-${a}), var(--chart-${b}))`;
}

const POSTS: Post[] = [
  {
    id: "POST-01",
    title: "مجلس الوزراء يعتمد الميزانية العامة للدولة للعام المالي الجديد",
    excerpt:
      "أقر مجلس الوزراء الميزانية العامة للدولة مع التركيز على مشاريع البنية التحتية والتحول الرقمي والرعاية الصحية وتطوير الخدمات.",
    author: "أحمد الشمري",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ahmed",
    category: "سياسة",
    status: "منشور",
    date: "2026-10-03",
    views: 12480,
    comments: 34,
    gradient: gradient(1, 2),
  },
  {
    id: "POST-02",
    title: "افتتاح أكبر مشروع للطاقة الشمسية في منطقة الشرق الأوسط",
    excerpt:
      "تدشين محطة الطاقة المتجددة بقدرة إنتاجية تتجاوز 1500 ميجاواط لدعم شبكة الكهرباء الوطنية وتقليل الانبعاثات الكربونية.",
    author: "سارة العتيبي",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sara",
    category: "اقتصاد",
    status: "منشور",
    date: "2026-10-02",
    views: 8920,
    comments: 19,
    gradient: gradient(3, 4),
  },
  {
    id: "POST-03",
    title: "المنتخب الوطني يتأهل إلى نهائيات كأس العالم بعد فوز تاريخي",
    excerpt:
      "حقق المنتخب الوطني فوزًا ثمينًا ومستحقًا في الجولة الحاسمة من التصفيات المؤهلة للمونديال وسط احتفالات جماهيرية واسعة.",
    author: "خالد المالكي",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=khaled",
    category: "رياضة",
    status: "منشور",
    date: "2026-10-01",
    views: 34200,
    comments: 88,
    gradient: gradient(5, 1),
  },
  {
    id: "POST-04",
    title: "إطلاق منصة وطنية جديدة لدعم ريادة الأعمال والمشاريع الصغيرة",
    excerpt:
      "مبادرة جديدة تقدم تسهيلات تمويلية واستشارات قانونية وتقنية لرواد الأعمال بهدف تنمية قطاع المنشآت الصغيرة والمتوسطة.",
    author: "نورة القحطاني",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=noura",
    category: "اقتصاد",
    status: "منشور",
    date: "2026-09-30",
    views: 5640,
    comments: 12,
    gradient: gradient(2, 3),
  },
  {
    id: "POST-05",
    title: "تحذيرات من موجة طقس استثنائية تؤثر على عدة مناطق",
    excerpt:
      "المركز الوطني للأرصاد ينبه إلى رياح نشطة وانخفاض في مدى الرؤية الأفقية ويدعو إلى توخي الحذر واتباع إرشادات السلامة.",
    author: "فهد الدوسري",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=fahad",
    category: "محلي",
    status: "مجدول",
    date: "2026-10-04",
    views: 0,
    comments: 0,
    gradient: gradient(4, 5),
  },
  {
    id: "POST-06",
    title: "تقرير خاص: تسارع وتيرة التحول الرقمي في القطاع الحكومي",
    excerpt:
      "دراسة تحليلية ترصد نسبة أتمتة المعاملات الحكومية وتأثيرها على سرعة إنجاز خدمات المواطنين والمقيمين وتطوير الأداء.",
    author: "عبدالله السبيعي",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=abdullah",
    category: "تقنية",
    status: "مسودة",
    date: "2026-10-01",
    views: 0,
    comments: 0,
    gradient: gradient(1, 3),
  },
];

const CATEGORIES = [
  "سياسة",
  "محلي",
  "اقتصاد",
  "رياضة",
  "مجتمع",
  "تقنية",
];

function formatDate(iso: string) {
  return iso;
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogPage() {
  const [rows, setRows] = useState<Post[]>(POSTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getAdminArticles().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const dbRows: Post[] = res.data.map((item: any, idx: number) => ({
          id: item.id.toString(),
          title: item.title,
          excerpt: item.excerpt || '',
          author: item.author_name || 'هيئة التحرير',
          authorAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${item.author_name || 'admin'}`,
          category: item.category?.name || 'محلي',
          status: (item.status === 'published' ? 'منشور' : item.status === 'scheduled' ? 'مجدول' : 'مسودة') as PostStatus,
          date: item.published_at ? new Date(item.published_at).toISOString().split('T')[0] : new Date(item.created_at).toISOString().split('T')[0],
          views: Number(item.views_count || 0),
          comments: Number(item.comments_count || 0),
          gradient: gradient((idx % 5) + 1, ((idx + 1) % 5) + 1),
        }));
        setRows(dbRows);
      }
    });
  }, []);

  const deleting = rows.find((p) => p.id === deleteId) ?? null;

  const stats = useMemo(() => {
    const published = rows.filter((p) => p.status === "منشور").length;
    const drafts = rows.filter((p) => p.status === "مسودة").length;
    const views = rows.reduce((s, p) => s + p.views, 0);
    const comments = rows.reduce((s, p) => s + p.comments, 0);
    return { published, drafts, views, comments };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      const matchesStatus = status === "all" || p.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rows, search, category, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأخبار"
        description="إدارة وتحرير ونشر الأخبار والمقالات في موقع أجراس اليمن الإخبارية."
      >
        <Button asChild>
          <Link href="/admin/blog/new">
            <IconPlus className="size-4" /> إضافة خبر
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="الأخبار المنشورة"
          value={stats.published.toLocaleString()}
          icon={IconWorld}
        />
        <StatTile
          label="المسودات"
          value={stats.drafts.toLocaleString()}
          icon={IconClipboardText}
        />
        <StatTile
          label="إجمالي المشاهدات"
          value={stats.views.toLocaleString()}
          icon={IconEye}
        />
        <StatTile
          label="التعليقات"
          value={stats.comments.toLocaleString()}
          icon={IconMessages}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في الأخبار…"
            className="ps-9"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="منشور">منشور</SelectItem>
              <SelectItem value="مسودة">مسودة</SelectItem>
              <SelectItem value="مجدول">مجدول</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              aria-label="عرض الجدول"
            >
              <IconList className="size-4" />
            </Button>

            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="عرض الشبكة"
            >
              <IconLayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <IconFileText className="size-7 opacity-50" />
            <p>لا توجد أخبار مطابقة للتصفية.</p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden pt-0">
              <div
                className="relative flex h-40 items-center justify-center"
                style={{ background: p.gradient }}
              >
                <span className="select-none text-6xl font-bold text-white/25">
                  {p.title.slice(0, 1)}
                </span>
                <Badge
                  variant="secondary"
                  className={`absolute end-3 top-3 ${statusStyles[p.status]}`}
                >
                  {p.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className="absolute bottom-3 start-3 bg-black/30 font-normal text-white backdrop-blur-sm"
                >
                  {p.category}
                </Badge>
              </div>
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href="/admin/blog/new"
                    className="line-clamp-2 font-semibold leading-snug tracking-tight hover:underline"
                  >
                    {p.title}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-me-2 -mt-1 size-8 shrink-0"
                      >
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">إجراءات الخبر</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href="/admin/blog/new">
                          <IconPencil className="size-4" /> تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          toast.success("تم نسخ الرابط", {
                            description: "تم نسخ رابط الخبر إلى الحافظة.",
                          })
                        }
                      >
                        <IconEye className="size-4" /> عرض
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setDeleteId(p.id)}
                      >
                        <IconTrash className="size-4" /> حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {p.excerpt}
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarImage src={p.authorAvatar} alt={p.author} />
                    <AvatarFallback>{p.author.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{p.author}</p>
                    <p className="truncate text-xs text-muted-foreground tabular-nums">
                      {p.date}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground tabular-nums">
                  <span className="flex items-center gap-1">
                    <IconEye className="size-3.5" />
                    {p.views > 0 ? p.views.toLocaleString() : "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMessage2 className="size-3.5" />
                    {p.comments}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-4 text-right font-medium">الخبر</th>
                  <th className="p-4 text-right font-medium">القسم</th>
                  <th className="p-4 text-right font-medium">الكاتب</th>
                  <th className="p-4 text-right font-medium">المشاهدات</th>
                  <th className="p-4 text-right font-medium">التاريخ</th>
                  <th className="p-4 text-right font-medium">الحالة</th>
                  <th className="p-4 text-right font-medium">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{p.title}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">{p.author}</td>
                    <td className="p-4">{p.views.toLocaleString()}</td>
                    <td className="p-4">{formatDate(p.date)}</td>
                    <td className="p-4">
                      <Badge className={statusStyles[p.status]}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            toast.success("تم نسخ الرابط", {
                              description: "تم نسخ رابط الخبر إلى الحافظة.",
                            })
                          }
                        >
                          <IconEye className="size-4" />
                        </Button>

                        <Button variant="ghost" size="icon" asChild>
                          <Link href="/admin/blog/new">
                            <IconPencil className="size-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(p.id)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        name={deleting?.title ?? "الخبر"}
        onConfirm={async () => {
          if (deleteId) {
            await deleteArticle(deleteId);
            setRows((prev) => prev.filter((p) => p.id !== deleteId));
            toast.success("تم حذف الخبر بنجاح");
          }
        }}
      />
    </div>
  );
}