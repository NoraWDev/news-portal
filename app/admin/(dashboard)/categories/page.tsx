"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/actions";
import {
  IconPlus,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconDeviceLaptop,
  IconHome,
  IconSparkles,
  IconBallFootball,
  IconHeart,
  IconCategory,
  IconLayoutGrid,
  IconList,
  IconPackage,
  IconArrowUpRight,
  IconReceipt,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

type Category = {
  id: string;
  name: string;
  description: string;
  articles: number;
  icon: IconType;
  color: string;
};

const tint: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};
const colorCycle = Object.keys(tint);

const initialCategories: Category[] = [
  {
    id: "CAT-01",
    name: "سياسة",
    description: "الأخبار والتغطيات السياسية المحلية والدولية والقرارات الرسمية.",
    articles: 340,
    icon: IconCategory,
    color: "blue",
  },
  {
    id: "CAT-02",
    name: "محلي",
    description: "متابعة الأحداث والأنشطة والفعاليات داخل المناطق والمدن.",
    articles: 520,
    icon: IconHome,
    color: "emerald",
  },
  {
    id: "CAT-03",
    name: "اقتصاد",
    description: "أسواق المال، الطاقة، الاستثمار، ومؤشرات الاقتصاد الوطني والعالمي.",
    articles: 280,
    icon: IconReceipt,
    color: "amber",
  },
  {
    id: "CAT-04",
    name: "رياضة",
    description: "تغطيات المباريات والبطولات المحلية والعالمية وأخبار الأندية والرياضيين.",
    articles: 410,
    icon: IconBallFootball,
    color: "rose",
  },
  {
    id: "CAT-05",
    name: "مجتمع",
    description: "قضايا المجتمع، الثقافة، المبادرات الإنسانية والتوعوية وحياة الناس.",
    articles: 190,
    icon: IconHeart,
    color: "violet",
  },
  {
    id: "CAT-06",
    name: "تقنية",
    description: "أحدث الابتكارات، الذكاء الاصطناعي، الأمن السيبراني والأجهزة الذكية.",
    articles: 230,
    icon: IconDeviceLaptop,
    color: "teal",
  },
  {
    id: "CAT-07",
    name: "ثقافة وفنون",
    description: "الفنون، الأدب، التراث، المعارض والفعاليات الثقافية المنوعة.",
    articles: 150,
    icon: IconSparkles,
    color: "sky",
  },
  {
    id: "CAT-08",
    name: "دولي",
    description: "الأخبار العالمية والشؤون الإقليمية والعلاقات الدبلوماسية الدولية.",
    articles: 310,
    icon: IconPackage,
    color: "orange",
  },
];

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: IconType;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    getAdminCategories().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const dbCats: Category[] = res.data.map((item: any, idx: number) => ({
          id: item.id.toString(),
          name: item.name,
          description: item.description || "لا يوجد وصف مدخل.",
          articles: Number(item._count?.articles || 0),
          icon: IconCategory,
          color: colorCycle[idx % colorCycle.length],
        }));
        setCats(dbCats);
      }
    });
  }, []);

  const stats = useMemo(() => {
    const totalCats = cats.length;
    const totalArticles = cats.reduce((s, c) => s + c.articles, 0);
    const largest =
      cats.length > 0
        ? cats.reduce((a, b) => (b.articles > a.articles ? b : a))
        : null;
    const avg = totalCats > 0 ? Math.round(totalArticles / totalCats) : 0;
    return { totalCats, totalArticles, largest, avg };
  }, [cats]);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = ((data.get("name") as string) ?? "").trim();
    const description = ((data.get("description") as string) ?? "").trim();
    if (!name) return;

    if (editing) {
      await updateCategory(editing.id, { name, description });
      setCats((prev) =>
        prev.map((c) =>
          c.id === editing.id ? { ...c, name, description } : c
        )
      );
      toast.success("تم تحديث القسم", { description: name });
    } else {
      const res = await createCategory({ name, description });
      const newId = res.success && res.data?.id ? res.data.id.toString() : `CAT-${Date.now()}`;
      setCats((prev) => {
        const color = colorCycle[prev.length % colorCycle.length];
        const next: Category = {
          id: newId,
          name,
          description: description || "لا يوجد وصف مدخل.",
          articles: 0,
          icon: IconCategory,
          color,
        };
        return [...prev, next];
      });
      toast.success("تم إنشاء القسم بنجاح", { description: name });
    }
    setDialogOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأقسام"
        description="إدارة وتصنيف الأقسام الإخبارية وتوزيع المحتوى في موقع أجراس اليمن الإخبارية."
      >
        <div className="hidden items-center rounded-lg border p-0.5 sm:flex">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("grid")}
            aria-label="عرض الشبكة"
          >
            <IconLayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("list")}
            aria-label="عرض القائمة"
          >
            <IconList className="size-4" />
          </Button>
        </div>
        <Button onClick={openAdd}>
          <IconPlus className="size-4" /> إضافة قسم
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="إجمالي الأقسام"
          value={stats.totalCats.toLocaleString()}
          icon={IconCategory}
        />
        <StatTile
          label="إجمالي الأخبار"
          value={stats.totalArticles.toLocaleString()}
          icon={IconPackage}
        />
        <StatTile
          label="القسم الأكثر نشاطًا"
          value={stats.largest?.name ?? "—"}
          icon={IconArrowUpRight}
        />
        <StatTile
          label="متوسط الأخبار لكل قسم"
          value={stats.avg.toLocaleString()}
          icon={IconLayoutGrid}
        />
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cats.map((cat) => (
            <Card key={cat.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      tint[cat.color] ?? tint.blue
                    )}
                  >
                    <cat.icon className="size-5" />
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                      >
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">إجراءات القسم</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEdit(cat)}>
                        <IconPencil className="size-4" /> تعديل
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setDeleteTarget(cat)}
                      >
                        <IconTrash className="size-4" /> حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="pt-2 text-base">{cat.name}</CardTitle>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground tabular-nums">
                    {cat.articles.toLocaleString()}
                  </span>{" "}
                  خبر
                </span>
                <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                  إدارة <IconArrowUpRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="ps-6">القسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="text-end">عدد الأخبار</TableHead>
                    <TableHead className="w-10 pe-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cats.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="ps-6">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg",
                              tint[cat.color] ?? tint.blue
                            )}
                          >
                            <cat.icon className="size-4" />
                          </span>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-sm text-muted-foreground">
                        <span className="line-clamp-1">{cat.description}</span>
                      </TableCell>
                      <TableCell className="text-end font-medium tabular-nums">
                        {cat.articles.toLocaleString()}
                      </TableCell>
                      <TableCell className="pe-6 text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <IconDotsVertical className="size-4" />
                              <span className="sr-only">إجراءات القسم</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => openEdit(cat)}>
                              <IconPencil className="size-4" /> تعديل
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setDeleteTarget(cat)}
                            >
                              <IconTrash className="size-4" /> حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add / edit dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <form key={editing?.id ?? "new"} onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "تعديل القسم" : "إضافة قسم جديد"}
              </DialogTitle>
              <DialogDescription>
                {editing
                  ? "تعديل تفاصيل وبيانات هذا القسم الإخباري."
                  : "إنشاء تصنيف وقسم جديد لتنظيم الأخبار والمقالات."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">اسم القسم</Label>
                <Input
                  id="cat-name"
                  name="name"
                  placeholder="مثال: سياسة، اقتصاد، محلي..."
                  defaultValue={editing?.name ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-description">الوصف</Label>
                <Textarea
                  id="cat-description"
                  name="description"
                  placeholder="وصف مختصر لمجال الأخبار التي تندرج تحت هذا القسم."
                  defaultValue={editing?.description ?? ""}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-parent">القسم الرئيسي</Label>
                <Select name="parent" defaultValue="none">
                  <SelectTrigger id="cat-parent" className="w-full">
                    <SelectValue placeholder="اختر القسم الرئيسي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون (قسم رئيسي)</SelectItem>
                    {cats
                      .filter((c) => c.id !== editing?.id)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit">
                {editing ? "حفظ التغييرات" : "إضافة القسم"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.name ?? "القسم"}
        description={
          deleteTarget
            ? `سيؤدي هذا الإجراء إلى حذف قسم (${deleteTarget.name}) بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.`
            : undefined
        }
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteCategory(deleteTarget.id);
            setCats((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            toast.success("تم حذف القسم بنجاح");
          }
        }}
      />
    </div>
  );
}
