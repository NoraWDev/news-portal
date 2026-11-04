"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getAdminComments,
  updateCommentStatus,
  deleteComment,
} from "@/app/admin/actions";
import {
  IconSearch,
  IconDotsVertical,
  IconCircleCheck,
  IconMessageReply,
  IconFlag,
  IconTrash,
  IconSend,
  IconMessage2,
  IconX,
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CommentStatus = "مقبول" | "قيد المراجعة" | "مرفوض";

type CommentItem = {
  id: string;
  author: string;
  avatar: string;
  article: string;
  body: string;
  date: string;
  status: CommentStatus;
  reply?: string;  // محلي فقط — لا يوجد في DB حالياً
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ترجمة قيم DB → واجهة */
function dbStatusToUi(dbStatus: string): CommentStatus {
  if (dbStatus === "approved") return "مقبول";
  if (dbStatus === "rejected") return "مرفوض";
  return "قيد المراجعة"; // pending أو أي قيمة أخرى
}

/** ترجمة قيم الواجهة → DB */
function uiStatusToDb(uiStatus: CommentStatus): string {
  if (uiStatus === "مقبول") return "approved";
  if (uiStatus === "مرفوض") return "rejected";
  return "pending";
}

/** يولّد رابط avatar من بذرة نصية */
function avatarSeed(name: string) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

/** يحوّل سجل DB إلى CommentItem */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToComment(c: any): CommentItem {
  return {
    id: String(c.id),
    author: c.author_name ?? "مجهول",
    avatar: avatarSeed(c.author_name ?? "unknown"),
    article: c.article?.title ?? "—",
    body: c.content ?? "",
    date: c.created_at
      ? new Date(c.created_at).toISOString().split("T")[0]
      : "",
    status: dbStatusToUi(c.status ?? "pending"),
    reply: undefined,
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const statusStyles: Record<CommentStatus, { badge: string; text: string }> = {
  مقبول: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    text: "مقبول",
  },
  "قيد المراجعة": {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    text: "قيد المراجعة",
  },
  مرفوض: {
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    text: "مرفوض",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [tab, setTab] = useState<"all" | CommentStatus>("all");
  const [query, setQuery] = useState("");
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CommentItem | null>(null);

  // ── Fetch from DB ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getAdminComments();
      if (res.success && res.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setComments((res.data as any[]).map(mapDbToComment));
      } else {
        toast.error("فشل في جلب التعليقات من قاعدة البيانات");
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    return {
      all: comments.length,
      published: comments.filter((c) => c.status === "مقبول").length,
      pending: comments.filter((c) => c.status === "قيد المراجعة").length,
      flagged: comments.filter((c) => c.status === "مرفوض").length,
    };
  }, [comments]);

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        c.author.toLowerCase().includes(q) ||
        c.article.toLowerCase().includes(q) ||
        c.body.toLowerCase().includes(q)
      );
    });
  }, [comments, tab, query]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** تغيير حالة التعليق في DB ثم في الـ state */
  function handleSetStatus(id: string, newStatus: CommentStatus) {
    startTransition(async () => {
      const res = await updateCommentStatus(id, uiStatusToDb(newStatus));
      if (res.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        toast.success(`تم تغيير حالة التعليق إلى: ${newStatus}`);
      } else {
        toast.error(res.error ?? "فشل في تحديث حالة التعليق");
      }
    });
  }

  /** إرسال الرد — محلي فقط (لا يوجد حقل reply في DB) */
  function handleSendReply(id: string) {
    if (!replyText.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reply: replyText.trim() } : c))
    );
    setReplyText("");
    setReplyOpen(null);
    toast.success("تم إرسال رد هيئة التحرير بنجاح");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="التعليقات"
        description="متابعة وإدارة تعليقات القراء على الأخبار والتقارير الصحفية في أجراس اليمن."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">إجمالي التعليقات</CardDescription>
            <CardTitle className="text-2xl font-bold">{counts.all}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">التعليقات المقبولة</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {counts.published}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">قيد المراجعة والتدقيق</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {counts.pending}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">التعليقات المرفوضة</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {counts.flagged}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as typeof tab)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 sm:w-auto">
              <TabsTrigger value="all">الكل ({counts.all})</TabsTrigger>
              <TabsTrigger value="مقبول">مقبول ({counts.published})</TabsTrigger>
              <TabsTrigger value="قيد المراجعة">
                قيد المراجعة ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="مرفوض">مرفوض ({counts.flagged})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="البحث باسم القارئ أو محتوى التعليق..."
              className="ps-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          جارٍ تحميل التعليقات...
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={item.avatar} alt={item.author} />
                      <AvatarFallback>{item.author.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{item.author}</span>
                        <Badge
                          variant="outline"
                          className={statusStyles[item.status].badge}
                        >
                          {statusStyles[item.status].text}
                        </Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        تعليق على خبر:{" "}
                        <span className="font-medium text-foreground">
                          «{item.article}»
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    {item.status !== "مقبول" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        onClick={() => handleSetStatus(item.id, "مقبول")}
                      >
                        <IconCircleCheck className="size-3.5" /> قبول
                      </Button>
                    )}
                    {item.status !== "مرفوض" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        onClick={() => handleSetStatus(item.id, "مرفوض")}
                      >
                        <IconFlag className="size-3.5" /> رفض
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setReplyOpen(replyOpen === item.id ? null : item.id);
                            setReplyText(item.reply ?? "");
                          }}
                        >
                          <IconMessageReply className="size-4" /> رد هيئة التحرير
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSetStatus(item.id, "قيد المراجعة")}
                        >
                          <IconMessage2 className="size-4" /> تعيين كقيد المراجعة
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <IconTrash className="size-4" /> حذف التعليق
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Body */}
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {item.body}
                </p>

                {/* Existing Reply */}
                {item.reply && replyOpen !== item.id && (
                  <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-semibold text-primary">
                        رد هيئة التحرير (أجراس اليمن):
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-[11px]"
                        onClick={() => {
                          setReplyOpen(item.id);
                          setReplyText(item.reply ?? "");
                        }}
                      >
                        تعديل الرد
                      </Button>
                    </div>
                    <p className="mt-1 text-foreground/80">{item.reply}</p>
                  </div>
                )}

                {/* Reply Box */}
                {replyOpen === item.id && (
                  <div className="mt-4 space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>كتابة رد رسمي من هيئة التحرير:</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setReplyOpen(null)}
                      >
                        <IconX className="size-3.5" />
                      </Button>
                    </div>
                    <Textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب رد التحرير الموجه للقارئ هنا..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyOpen(null)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendReply(item.id)}
                        className="gap-1.5"
                      >
                        <IconSend className="size-3.5" /> نشر الرد
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground">
              لا توجد تعليقات تطابق هذا التبويب أو معايير البحث.
            </Card>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        name={deleteTarget ? `تعليق ${deleteTarget.author}` : "التعليق"}
        description={
          deleteTarget
            ? `هل أنت متأكد من حذف تعليق القارئ "${deleteTarget.author}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          const target = deleteTarget;
          setDeleteTarget(null);
          startTransition(async () => {
            const res = await deleteComment(target.id);
            if (res.success) {
              setComments((prev) => prev.filter((c) => c.id !== target.id));
              toast.success("تم حذف التعليق بنجاح");
            } else {
              toast.error(res.error ?? "فشل في حذف التعليق");
            }
          });
        }}
      />
    </div>
  );
}
