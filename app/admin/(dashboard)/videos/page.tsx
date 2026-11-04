"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getAdminVideos,
  getAdminCategories,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/app/admin/actions";
import {
  IconPlus,
  IconEye,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconSearch,
  IconBrandYoutube,
  IconPlayerPlay,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────

type VideoStatus = "منشور" | "مسودة" | "مجدول";

/** نوع VideoItem مشتق من بيانات قاعدة البيانات الحقيقية */
type VideoItem = {
  id: string;           // BigInt → string بعد serialize
  title: string;
  description: string;
  category: string;     // اسم القسم من category.name
  category_id: string;  // id القسم
  views: number;        // views_count
  date: string;         // created_at مُنسَّق
  url: string;          // video_url
  thumbnail: string;    // thumbnail_url
  published_at: string | null;
  status: VideoStatus;  // مشتقة من published_at
  is_featured: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** يحوّل published_at إلى حالة منطقية */
function deriveStatus(published_at: string | null): VideoStatus {
  if (!published_at) return "مسودة";
  const d = new Date(published_at);
  return d > new Date() ? "مجدول" : "منشور";
}

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80";

/** يحوّل سجل DB إلى VideoItem للواجهة */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToVideo(v: any): VideoItem {
  return {
    id: String(v.id),
    title: v.title ?? "",
    description: v.description ?? "",
    category: v.category?.name ?? "—",
    category_id: v.category_id ? String(v.category_id) : "",
    views: Number(v.views_count ?? 0),
    date: v.created_at
      ? new Date(v.created_at).toISOString().split("T")[0]
      : "",
    url: v.video_url ?? "",
    thumbnail: v.thumbnail_url ?? FALLBACK_THUMB,
    published_at: v.published_at ?? null,
    status: deriveStatus(v.published_at ?? null),
    is_featured: !!v.is_featured,
  };
}

/** يحوّل VideoStatus إلى قيمة published_at للحفظ */
function statusToPublishedAt(status: VideoStatus): string | null {
  if (status === "منشور") return new Date().toISOString();
  if (status === "مجدول") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }
  return null; // مسودة
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const statusBadge: Record<VideoStatus, string> = {
  منشور: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  مسودة: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  مجدول: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideosPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);

  // Form fields (متوافق مع حقول DB الحقيقية)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState<VideoStatus>("منشور");

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // ── Fetch from DB ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [vidsRes, catsRes] = await Promise.all([
        getAdminVideos(),
        getAdminCategories(),
      ]);

      if (vidsRes.success && vidsRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setVideos((vidsRes.data as any[]).map(mapDbToVideo));
      } else {
        toast.error("فشل في جلب الفيديوهات من قاعدة البيانات");
      }

      if (catsRes.success && catsRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCategories((catsRes.data as any[]).map((c) => ({ id: String(c.id), name: c.name })));
      }

      setLoading(false);
    }
    load();
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      const matchCategory =
        categoryFilter === "all" || v.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" || v.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [videos, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = videos.length;
    const published = videos.filter((v) => v.status === "منشور").length;
    const totalViews = videos.reduce((acc, curr) => acc + curr.views, 0);
    const drafts = videos.filter((v) => v.status === "مسودة").length;
    return { total, published, totalViews, drafts };
  }, [videos]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openCreate() {
    setEditingVideo(null);
    setTitle("");
    setDescription("");
    setCategoryId("");
    setUrl("");
    setThumbnailUrl("");
    setStatus("منشور");
    setDialogOpen(true);
  }

  function openEdit(v: VideoItem) {
    setEditingVideo(v);
    setTitle(v.title);
    setDescription(v.description);
    setCategoryId(v.category_id);
    setUrl(v.url);
    setThumbnailUrl(v.thumbnail === FALLBACK_THUMB ? "" : v.thumbnail);
    setStatus(v.status);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان الفيديو");
      return;
    }
    if (!url.trim()) {
      toast.error("يرجى إدخال رابط الفيديو");
      return;
    }

    const published_at = statusToPublishedAt(status);

    startTransition(async () => {
      if (editingVideo) {
        // ── تعديل فيديو موجود ─────────────────────────────────────────────
        const res = await updateVideo(editingVideo.id, {
          title,
          description,
          video_url: url,
          thumbnail_url: thumbnailUrl || undefined,
          category_id: categoryId || undefined,
          published_at,
        });
        if (res.success && res.data) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === editingVideo.id ? mapDbToVideo(res.data) : v
            )
          );
          toast.success("تم تحديث بيانات الفيديو بنجاح");
          setDialogOpen(false);
        } else {
          toast.error(res.error ?? "فشل في تحديث الفيديو");
        }
      } else {
        // ── إضافة فيديو جديد ──────────────────────────────────────────────
        const res = await createVideo({
          title,
          description,
          video_url: url,
          thumbnail_url: thumbnailUrl || undefined,
          category_id: categoryId || undefined,
        });
        if (res.success && res.data) {
          setVideos((prev) => [mapDbToVideo(res.data), ...prev]);
          toast.success("تمت إضافة الفيديو الجديد بنجاح");
          setDialogOpen(false);
        } else {
          toast.error(res.error ?? "فشل في إضافة الفيديو");
        }
      }
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="الفيديوهات"
        description="إدارة ونشر التقارير المصورة ومقاطع الفيديو الإخبارية في أجراس اليمن."
      >
        <Button onClick={openCreate}>
          <IconPlus className="size-4" /> إضافة فيديو جديد
        </Button>
      </PageHeader>

      {/* KPI Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">إجمالي الفيديوهات</CardDescription>
            <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">الفيديوهات المنشورة</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.published}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">إجمالي المشاهدات</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">المسودات والمجدول</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.drafts}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث في عناوين ووصف الفيديوهات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="محلي">محلي</SelectItem>
                <SelectItem value="اقتصاد">اقتصاد</SelectItem>
                <SelectItem value="رياضة">رياضة</SelectItem>
                <SelectItem value="ثقافة">ثقافة</SelectItem>
                <SelectItem value="تقنية">تقنية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="منشور">منشور</SelectItem>
                <SelectItem value="مسودة">مسودة</SelectItem>
                <SelectItem value="مجدول">مجدول</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          جارٍ تحميل الفيديوهات...
        </Card>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((v) => (
              <Card key={v.id} className="group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                      <IconPlayerPlay className="size-5 fill-current" />
                    </div>
                  </div>
                  <span className="absolute start-2 top-2">
                    <Badge variant="outline" className={statusBadge[v.status]}>
                      {v.status}
                    </Badge>
                  </span>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-primary">{v.category}</span>
                    <span className="tabular-nums">{v.date}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug">
                    {v.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {v.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <IconEye className="size-4" />
                      <span className="tabular-nums">{v.views.toLocaleString()} مشاهدة</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(v)}>
                          <IconPencil className="size-4" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toast.info("رابط الفيديو", { description: v.url })
                          }
                        >
                          <IconBrandYoutube className="size-4" /> فتح الرابط
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(v)}
                        >
                          <IconTrash className="size-4" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground">
              لا توجد فيديوهات مطابقة لمعايير البحث الحالية.
            </Card>
          )}
        </>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "تعديل الفيديو" : "إضافة فيديو جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل مقطع الفيديو الإخباري ورابط النشر.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="vid-title">عنوان الفيديو</Label>
              <Input
                id="vid-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنواناً جذاباً للفيديو..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vid-desc">وصف الفيديو</Label>
              <Textarea
                id="vid-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة موجزة عن محتوى التقرير المصور..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vid-status">الحالة</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as VideoStatus)}
                >
                  <SelectTrigger id="vid-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="منشور">منشور</SelectItem>
                    <SelectItem value="مسودة">مسودة</SelectItem>
                    <SelectItem value="مجدول">مجدول</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vid-cat-id">القسم (اختياري)</Label>
                <Select
                  value={categoryId || "none"}
                  onValueChange={(val) => setCategoryId(val === "none" ? "" : val)}
                >
                  <SelectTrigger id="vid-cat-id">
                    <SelectValue placeholder="اختر القسم..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون قسم</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vid-url">رابط الفيديو (YouTube)</Label>
                <Input
                  id="vid-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vid-thumb">رابط الصورة المصغرة (اختياري)</Label>
                <Input
                  id="vid-thumb"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleSave}>
              {editingVideo ? "حفظ التعديلات" : "إضافة الفيديو"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        name={deleteTarget ? deleteTarget.title : "الفيديو"}
        description={
          deleteTarget
            ? `هل أنت متأكد من حذف الفيديو "${deleteTarget.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          const target = deleteTarget;
          setDeleteTarget(null);
          startTransition(async () => {
            const res = await deleteVideo(target.id);
            if (res.success) {
              setVideos((prev) => prev.filter((v) => v.id !== target.id));
              toast.success("تم حذف الفيديو بنجاح");
            } else {
              toast.error(res.error ?? "فشل في حذف الفيديو");
            }
          });
        }}
      />
    </div>
  );
}
