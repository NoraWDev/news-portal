"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconArrowUpRight,
  IconDownload,
  IconDotsVertical,
  IconRefresh,
  IconPhoto,
  IconReportAnalytics,
  IconPencil,
  IconEye,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { RevenueAreaChart } from "@/components/charts/revenue-area-chart";
import { TrafficDonutChart } from "@/components/charts/traffic-donut-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getAdminOverviewCounts,
  getAdminArticles,
  getAdminComments,
  getAdminAds,
} from "@/app/admin/actions";
import { recentActivity, newsByCategory, type StatCard as StatCardType } from "@/data";

function ChartMenu({ title }: { title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconDotsVertical className="size-4" />
          <span className="sr-only">خيارات {title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onSelect={() =>
            toast.success(`تم تحديث ${title}`, {
              description: "يتم عرض أحدث البيانات المتاحة.",
            })
          }
        >
          <IconRefresh className="size-4" /> تحديث
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast.success("تم تصدير الرسم", {
              description: `تم حفظ ${title} كصورة PNG.`,
            })
          }
        >
          <IconPhoto className="size-4" /> تحميل PNG
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            toast("فتح التقرير الكامل", {
              description: `جاري تجهيز تقرير تفصيلي لـ ${title}.`,
            })
          }
        >
          <IconReportAnalytics className="size-4" /> عرض التقرير الكامل
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<{
    articlesCount: number;
    publishedCount: number;
    categoriesCount: number;
    videosCount: number;
    commentsCount: number;
    adsCount: number;
  }>({
    articlesCount: 0,
    publishedCount: 0,
    categoriesCount: 0,
    videosCount: 0,
    commentsCount: 0,
    adsCount: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestCommentsList, setLatestCommentsList] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeAdsList, setActiveAdsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [countsRes, articlesRes, commentsRes, adsRes] = await Promise.all([
          getAdminOverviewCounts(),
          getAdminArticles(),
          getAdminComments(),
          getAdminAds(),
        ]);

        if (countsRes.success && countsRes.data) {
          setCounts(countsRes.data);
        }
        if (articlesRes.success && articlesRes.data) {
          setLatestArticles((articlesRes.data as any[]).slice(0, 6));
        }
        if (commentsRes.success && commentsRes.data) {
          setLatestCommentsList((commentsRes.data as any[]).slice(0, 5));
        }
        if (adsRes.success && adsRes.data) {
          setActiveAdsList((adsRes.data as any[]).slice(0, 5));
        }
      } catch (err: any) {
        console.error("Dashboard data load error:", err?.message);
        toast.error("فشل في تحميل بعض إحصائيات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats: StatCardType[] = useMemo(() => {
    return [
      {
        label: "إجمالي الأخبار",
        value: counts.articlesCount.toLocaleString(),
        change: 12.5,
        trend: "up",
        hint: `منها ${counts.publishedCount} خبر منشور في الموقع`,
      },
      {
        label: "الأخبار المنشورة",
        value: counts.publishedCount.toLocaleString(),
        change: 8.2,
        trend: "up",
        hint: `${counts.articlesCount - counts.publishedCount} مسودة غير منشورة`,
      },
      {
        label: "الأقسام والفيديوهات",
        value: `${counts.categoriesCount} / ${counts.videosCount}`,
        change: 5.4,
        trend: "up",
        hint: `${counts.categoriesCount} قسم و ${counts.videosCount} مقطع فيديو`,
      },
      {
        label: "التعليقات والإعلانات",
        value: `${counts.commentsCount} / ${counts.adsCount}`,
        change: 3.1,
        trend: "up",
        hint: `${counts.commentsCount} تعليق و ${counts.adsCount} إعلان نشط`,
      },
    ];
  }, [counts]);

  function handleExport() {
    toast.success("تم تصدير التقرير", {
      description: "جارٍ تجهيز تقرير لوحة التحكم للتنزيل.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="مرحبًا بك في لوحة تحكم أجراس اليمن 👋"
        description="إليك ملخصًا لأحدث نشاطات موقع أجراس اليمن الإخبارية اليوم."
      >
        <Button variant="outline" onClick={handleExport}>
          <IconDownload className="size-4" /> تصدير تقرير
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>المشاهدات والزيارات — آخر 30 يومًا</CardTitle>
            <CardDescription>
              معدل مشاهدات وزيارات الأخبار خلال الـ 30 يومًا الماضية
            </CardDescription>
            <CardAction>
              <ChartMenu title="المشاهدات والزيارات" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأخبار حسب الأقسام</CardTitle>
            <CardDescription>توزيع الأخبار المنشورة على الأقسام الرئيسية</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficDonutChart />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            {newsByCategory.map((t) => (
              <div key={t.category} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: t.fill }}
                />
                <span className="text-muted-foreground">{t.category}</span>
                <span className="ms-auto font-medium tabular-nums">
                  {t.value.toLocaleString()}
                </span>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>

      {/* Latest News Table */}
      <Card>
        <CardHeader>
          <CardTitle>أحدث الأخبار</CardTitle>
          <CardDescription>آخر الأخبار والتقارير الصحفية المضافة في النظام</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog">
                عرض الكل <IconArrowUpRight className="size-4" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-6">عنوان الخبر</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الكاتب</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="pe-6 text-end">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestArticles.map((n) => {
                const dateStr = n.created_at
                  ? new Date(n.created_at).toISOString().split("T")[0]
                  : "—";
                const viewsCount = Number(n.views_count ?? 0);
                const statusLabel =
                  n.status === "published"
                    ? "منشور"
                    : n.is_featured
                    ? "عاجل"
                    : "مسودة";

                return (
                  <TableRow key={n.id}>
                    <TableCell className="ps-6 max-w-xs">
                      <span className="font-medium line-clamp-1">{n.title}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {n.category?.name ?? "عام"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {n.author_name ?? "هيئة التحرير"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {viewsCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {dateStr}
                    </TableCell>
                    <TableCell>
                      <NewsStatusBadge status={statusLabel} />
                    </TableCell>
                    <TableCell className="pe-6 text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                            <span className="sr-only">إجراءات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/news/${n.slug || n.id}`} target="_blank">
                              <IconEye className="size-4" /> عرض الخبر
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/blog`}>
                              <IconPencil className="size-4" /> إدارة الأخبار
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {latestArticles.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                    لا توجد أخبار مسجلة حالياً في قاعدة البيانات.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Latest Comments & Active Ads */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>آخر التعليقات</CardTitle>
            <CardDescription>أحدث تفاعلات وتعليقات القراء على الأخبار المنشورة</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/reviews">
                  عرض الكل <IconArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="ps-6">المعلّق</TableHead>
                  <TableHead>نص التعليق</TableHead>
                  <TableHead>الخبر المرتبط</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="pe-6 text-end">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestCommentsList.map((c) => {
                  const author = c.author_name ?? "مجهول";
                  const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(author)}`;
                  const dateStr = c.created_at
                    ? new Date(c.created_at).toISOString().split("T")[0]
                    : "—";
                  const statusLabel =
                    c.status === "approved"
                      ? "موافق عليه"
                      : c.status === "rejected"
                      ? "مرفوض"
                      : "معلّق";

                  return (
                    <TableRow key={c.id}>
                      <TableCell className="ps-6">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarImage src={avatar} alt={author} />
                            <AvatarFallback>{author.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium whitespace-nowrap">{author}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm text-foreground">{c.content}</p>
                      </TableCell>
                      <TableCell className="max-w-xs text-muted-foreground">
                        <span className="line-clamp-1 text-xs">
                          {c.article?.title ?? "خبر عام"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                        {dateStr}
                      </TableCell>
                      <TableCell>
                        <CommentStatusBadge status={statusLabel} />
                      </TableCell>
                      <TableCell className="pe-6 text-end">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/reviews">
                            إدارة
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {latestCommentsList.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-6 text-center text-muted-foreground">
                      لا توجد تعليقات مسجلة حالياً.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Ads List */}
        <Card>
          <CardHeader>
            <CardTitle>الإعلانات النشطة</CardTitle>
            <CardDescription>متابعة الحملات ومواقع الظهور في الموقع</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/discounts">
                  عرض الكل <IconArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {activeAdsList.map((ad) => {
              const statusLabel = ad.is_active ? "نشط" : "متوقف";
              const dateStr = ad.ends_at
                ? new Date(ad.ends_at).toISOString().split("T")[0]
                : "مستمر";

              return (
                <div
                  key={ad.id}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ad.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ad.position} · ينتهي: {dateStr}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <AdStatusBadge status={statusLabel} />
                  </div>
                </div>
              );
            })}

            {activeAdsList.length === 0 && !loading && (
              <p className="py-6 text-center text-xs text-muted-foreground">
                لا توجد حملات إعلانية مسجلة حالياً.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Editorial Activity */}
      <Card>
        <CardHeader>
          <CardTitle>نشاط فريق التحرير</CardTitle>
          <CardDescription>آخر العمليات التي تمت على الأخبار والمحتوى.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-5 border-s ps-6">
            {recentActivity.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -start-[31px] top-0.5">
                  <Avatar className="size-6 ring-4 ring-background">
                    <AvatarImage src={a.avatar} alt={a.user} />
                    <AvatarFallback>{a.user.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </span>
                <p className="text-sm">
                  <span className="font-medium">{a.user}</span> {a.action}{" "}
                  {a.target && <span className="font-medium">{a.target}</span>}
                </p>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function NewsStatusBadge({ status }: { status: string }) {
  if (status === "منشور") return <Badge variant="success">منشور</Badge>;
  if (status === "عاجل") return <Badge variant="danger">عاجل</Badge>;
  return <Badge variant="draft">مسودة</Badge>;
}

function CommentStatusBadge({ status }: { status: string }) {
  if (status === "موافق عليه") return <Badge variant="success">موافق عليه</Badge>;
  if (status === "مرفوض") return <Badge variant="danger">مرفوض</Badge>;
  return <Badge variant="warning">معلّق</Badge>;
}

function AdStatusBadge({ status }: { status: string }) {
  if (status === "نشط") return <Badge variant="success">نشط</Badge>;
  if (status === "متوقف") return <Badge variant="warning">متوقف</Badge>;
  return <Badge variant="draft">منتهي</Badge>;
}
