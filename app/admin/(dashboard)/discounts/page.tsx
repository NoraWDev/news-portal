"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getAdminAds,
  createAd,
  updateAd,
  toggleAdStatus,
  deleteAd,
} from "@/app/admin/actions";
import {
  IconPlus,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconSpeakerphone,
  IconCopy,
  IconCircleCheck,
  IconPlayerPause,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type AdStatus = "نشط" | "متوقف" | "منتهي";
type AdPosition = "أعلى الموقع (Header)" | "الشريط الجانبي (Sidebar)" | "داخل المقال (In-Article)" | "أسفل الصفحة (Footer)";

type Advertisement = {
  id: string;
  name: string;
  client: string;
  position: AdPosition;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  status: AdStatus;
  targetUrl: string;
  imageUrl: string;
  isActive: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveAdStatus(isActive: boolean, endsAt: string | null): AdStatus {
  if (endsAt) {
    const end = new Date(endsAt);
    if (!isNaN(end.getTime()) && end < new Date()) {
      return "منتهي";
    }
  }
  return isActive ? "نشط" : "متوقف";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToAd(ad: any): Advertisement {
  const isActive = !!ad.is_active;
  const endsAtStr = ad.ends_at ? new Date(ad.ends_at).toISOString().split("T")[0] : "";
  const startsAtStr = ad.starts_at ? new Date(ad.starts_at).toISOString().split("T")[0] : "";

  return {
    id: String(ad.id),
    name: ad.title ?? "إعلان بدون عنوان",
    client: "الجهة المعلنة",
    position: (ad.position as AdPosition) || "أعلى الموقع (Header)",
    impressions: 0,
    clicks: 0,
    startDate: startsAtStr || (ad.created_at ? new Date(ad.created_at).toISOString().split("T")[0] : ""),
    endDate: endsAtStr || "—",
    status: deriveAdStatus(isActive, ad.ends_at),
    targetUrl: ad.target_url ?? "",
    imageUrl: ad.image_url ?? "",
    isActive,
  };
}

const statusStyles: Record<AdStatus, string> = {
  نشط: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  متوقف: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  منتهي: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DiscountsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Advertisement | null>(null);

  // Form
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [position, setPosition] = useState<AdPosition>("أعلى الموقع (Header)");
  const [targetUrl, setTargetUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<AdStatus>("نشط");

  // ── Fetch from DB ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getAdminAds();
      if (res.success && res.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAds((res.data as any[]).map(mapDbToAd));
      } else {
        toast.error("فشل في جلب الإعلانات من قاعدة البيانات");
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return ads.filter((ad) => {
      const matchStatus = statusFilter === "all" || ad.status === statusFilter;
      const matchPos = positionFilter === "all" || ad.position === positionFilter;
      return matchStatus && matchPos;
    });
  }, [ads, statusFilter, positionFilter]);

  const kpis = useMemo(() => {
    const total = ads.length;
    const active = ads.filter((a) => a.status === "نشط").length;
    const totalImpressions = ads.reduce((acc, curr) => acc + curr.impressions, 0);
    const totalClicks = ads.reduce((acc, curr) => acc + curr.clicks, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
    return { total, active, totalImpressions, avgCtr };
  }, [ads]);

  function openCreate() {
    setEditingAd(null);
    setName("");
    setClient("");
    setPosition("أعلى الموقع (Header)");
    setTargetUrl("https://");
    setImageUrl("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
    setStatus("نشط");
    setDialogOpen(true);
  }

  function openEdit(ad: Advertisement) {
    setEditingAd(ad);
    setName(ad.name);
    setClient(ad.client);
    setPosition(ad.position);
    setTargetUrl(ad.targetUrl);
    setImageUrl(ad.imageUrl);
    setStartDate(ad.startDate === "—" ? "" : ad.startDate);
    setEndDate(ad.endDate === "—" ? "" : ad.endDate);
    setStatus(ad.status);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الحملة الإعلانية");
      return;
    }

    const isActive = status === "نشط";

    startTransition(async () => {
      if (editingAd) {
        const res = await updateAd(editingAd.id, {
          title: name.trim(),
          position,
          target_url: targetUrl.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          is_active: isActive,
          starts_at: startDate || undefined,
          ends_at: endDate || undefined,
        });

        if (res.success && res.data) {
          setAds((prev) =>
            prev.map((a) => (a.id === editingAd.id ? mapDbToAd(res.data) : a))
          );
          toast.success("تم تحديث بيانات الحملة الإعلانية بنجاح");
          setDialogOpen(false);
        } else {
          toast.error(res.error ?? "فشل في تحديث الحملة الإعلانية");
        }
      } else {
        const res = await createAd({
          title: name.trim(),
          position,
          target_url: targetUrl.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          is_active: isActive,
          starts_at: startDate || undefined,
          ends_at: endDate || undefined,
        });

        if (res.success && res.data) {
          setAds((prev) => [mapDbToAd(res.data), ...prev]);
          toast.success("تم إنشاء المساحة الإعلانية الجديدة");
          setDialogOpen(false);
        } else {
          toast.error(res.error ?? "فشل في إضافة الإعلان");
        }
      }
    });
  }

  function toggleStatus(ad: Advertisement) {
    const nextIsActive = !ad.isActive;
    startTransition(async () => {
      const res = await toggleAdStatus(ad.id, nextIsActive);
      if (res.success) {
        setAds((prev) =>
          prev.map((a) =>
            a.id === ad.id
              ? {
                  ...a,
                  isActive: nextIsActive,
                  status: deriveAdStatus(nextIsActive, a.endDate === "—" ? null : a.endDate),
                }
              : a
          )
        );
        toast.success(`تم تغيير حالة الإعلان بنجاح`);
      } else {
        toast.error(res.error ?? "فشل في تغيير حالة الإعلان");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعلانات"
        description="إدارة المساحات الإعلانية والبنرات والحملات الترويجية في موقع أجراس اليمن."
      >
        <Button onClick={openCreate}>
          <IconPlus className="size-4" /> إضافة إعلان جديد
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">إجمالي الحملات</CardDescription>
            <CardTitle className="text-2xl font-bold">{kpis.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">الإعلانات النشطة حالياً</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {kpis.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">إجمالي مرات الظهور</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {kpis.totalImpressions.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">متوسط نسبة النقر (CTR)</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {kpis.avgCtr}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="متوقف">متوقف</SelectItem>
                <SelectItem value="منتهي">منتهي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="موقع الظهور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المساحات</SelectItem>
                <SelectItem value="أعلى الموقع (Header)">أعلى الموقع (Header)</SelectItem>
                <SelectItem value="داخل المقال (In-Article)">داخل المقال (In-Article)</SelectItem>
                <SelectItem value="الشريط الجانبي (Sidebar)">الشريط الجانبي (Sidebar)</SelectItem>
                <SelectItem value="أسفل الصفحة (Footer)">أسفل الصفحة (Footer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground">
            عدد الحملات المعروضة: {filtered.length}
          </span>
        </CardContent>
      </Card>

      {/* Ads Table */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          جارٍ تحميل الإعلانات...
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">اسم الإعلان / الحملة</TableHead>
                <TableHead className="text-start">المعلن</TableHead>
                <TableHead className="text-start">المساحة وموضع الظهور</TableHead>
                <TableHead className="text-start">مرات الظهور</TableHead>
                <TableHead className="text-start">النقرات</TableHead>
                <TableHead className="text-start">تاريخ الانتهاء</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="w-[80px] text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex flex-col">
                      <span>{ad.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {ad.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{ad.client}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      <IconSpeakerphone className="size-3.5" />
                      {ad.position}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {ad.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="tabular-nums font-medium">
                    {ad.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">
                    {ad.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[ad.status]}>
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(ad)}>
                          <IconPencil className="size-4" /> تعديل الحملة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(ad)}>
                          {ad.isActive ? (
                            <>
                              <IconPlayerPause className="size-4" /> إيقاف مؤقت
                            </>
                          ) : (
                            <>
                              <IconCircleCheck className="size-4" /> تفعيل الإعلان
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (ad.targetUrl) {
                              navigator.clipboard.writeText(ad.targetUrl);
                              toast.success("تم نسخ الرابط المستهدف");
                            } else {
                              toast.info("لا يوجد رابط مستهدف مسجل");
                            }
                          }}
                        >
                          <IconCopy className="size-4" /> نسخ الرابط
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(ad)}
                        >
                          <IconTrash className="size-4" /> حذف الإعلان
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="p-8 text-center text-muted-foreground">
                    لا توجد إعلانات مطابقة لمعايير البحث.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAd ? "تعديل المساحة الإعلانية" : "إضافة حملة إعلانية جديدة"}
            </DialogTitle>
            <DialogDescription>
              حدد موقع ظهور البنر الإعلاني وبيانات المعلن وفترة النشر.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ad-name">اسم الحملة الإعلانية</Label>
              <Input
                id="ad-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: إعلان بنك الأمل - أعلى الصفحة"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ad-client">اسم المعلن / الجهة الراعية</Label>
              <Input
                id="ad-client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="مثال: شركة يمن موبايل"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ad-pos">موضع الظهور في الموقع</Label>
                <Select
                  value={position}
                  onValueChange={(v) => setPosition(v as AdPosition)}
                >
                  <SelectTrigger id="ad-pos">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أعلى الموقع (Header)">أعلى الموقع (Header)</SelectItem>
                    <SelectItem value="داخل المقال (In-Article)">داخل المقال (In-Article)</SelectItem>
                    <SelectItem value="الشريط الجانبي (Sidebar)">الشريط الجانبي (Sidebar)</SelectItem>
                    <SelectItem value="أسفل الصفحة (Footer)">أسفل الصفحة (Footer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ad-status">حالة الحملة</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as AdStatus)}
                >
                  <SelectTrigger id="ad-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="متوقف">متوقف</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ad-url">الرابط المستهدف (URL)</Label>
              <Input
                id="ad-url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://client-site.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ad-img">رابط صورة البنر الإعلاني (اختياري)</Label>
              <Input
                id="ad-img"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ad-start">تاريخ البدء</Label>
                <Input
                  id="ad-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ad-end">تاريخ الانتهاء</Label>
                <Input
                  id="ad-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button onClick={handleSave}>
              {editingAd ? "حفظ التعديلات" : "إضافة الحملة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        name={deleteTarget ? deleteTarget.name : "الإعلان"}
        description={
          deleteTarget
            ? `هل أنت متأكد من حذف الحملة الإعلانية "${deleteTarget.name}"؟`
            : undefined
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          const target = deleteTarget;
          setDeleteTarget(null);
          startTransition(async () => {
            const res = await deleteAd(target.id);
            if (res.success) {
              setAds((prev) => prev.filter((a) => a.id !== target.id));
              toast.success("تم حذف الحملة الإعلانية بنجاح");
            } else {
              toast.error(res.error ?? "فشل في حذف الإعلان");
            }
          });
        }}
      />
    </div>
  );
}
