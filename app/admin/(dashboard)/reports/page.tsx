"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  IconCalendar,
  IconChevronDown,
  IconDownload,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconReportAnalytics,
  IconUsers,
  IconEye,
  IconClock,
  IconChartBar,
  IconDotsVertical,
  IconStar,
  IconShare,
  IconArticle,
  IconDeviceLaptop,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
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
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type StatCard as StatCardType } from "@/data";

const RANGES = [
  "آخر 7 أيام",
  "آخر 30 يوماً",
  "آخر 90 يوماً",
  "الربع الحالي",
  "منذ بداية العام",
];

const barConfig = {
  views: { label: "المشاهدات", color: "var(--chart-1)" },
  visitors: { label: "الزيارات", color: "var(--chart-2)" },
} satisfies ChartConfig;

const newsMonthlyAnalytics = [
  { month: "يناير", views: 98000, visitors: 32000 },
  { month: "فبراير", views: 112000, visitors: 38000 },
  { month: "مارس", views: 135000, visitors: 45000 },
  { month: "أبريل", views: 128000, visitors: 41000 },
  { month: "مايو", views: 146000, visitors: 49000 },
  { month: "يونيو", views: 162000, visitors: 54000 },
  { month: "يوليو", views: 175000, visitors: 58000 },
  { month: "أغسطس", views: 189000, visitors: 62000 },
  { month: "سبتمبر", views: 198000, visitors: 66000 },
  { month: "أكتوبر", views: 215000, visitors: 71000 },
];

const kpis: StatCardType[] = [
  {
    label: "إجمالي المشاهدات",
    value: "1,485,200",
    change: 14.2,
    trend: "up",
    hint: "مقارنة بالفترة السابقة",
  },
  {
    label: "الزيارات الفريدة",
    value: "428,600",
    change: 9.4,
    trend: "up",
    hint: "مقارنة بالفترة السابقة",
  },
  {
    label: "متوسط وقت القراءة",
    value: "03:45 د",
    change: 11.8,
    trend: "up",
    hint: "مقارنة بالفترة السابقة",
  },
  {
    label: "معدل الارتداد",
    value: "38.5%",
    change: 2.1,
    trend: "down",
    hint: "تحسن في بقاء القراء",
  },
];

const savedReports = [
  {
    id: "R-01",
    name: "ملخص الأداء الصحفي الشهري",
    description: "تقرير تفصيلي لحركة المشاهدات وتفاعل القراء بحسب الأقسام الإخبارية.",
    icon: IconReportAnalytics,
    cadence: "شهرياً",
    lastRun: "قبل يومين",
  },
  {
    id: "R-02",
    name: "تحليلات مصادر الزيارات وقنوات النشر",
    description: "توزيع الزيارات عبر محركات البحث، وسائل التواصل، والتطبيقات الإخبارية.",
    icon: IconShare,
    cadence: "أسبوعياً",
    lastRun: "أمس",
  },
  {
    id: "R-03",
    name: "تقرير إنتاجية وتغطيات محرري الأخبار",
    description: "إحصائيات نشر الأخبار والتقارير الميدانية لكل محرر ومراسل صحفي.",
    icon: IconUsers,
    cadence: "شهرياً",
    lastRun: "منذ 4 أيام",
  },
  {
    id: "R-04",
    name: "تقرير تفاعل القراء والتعليقات والمشاركات",
    description: "رصد الأخبار الأكثر إثارة للنقاش ونسب المشاركة عبر المنصات الاجتماعية.",
    icon: IconArticle,
    cadence: "يومياً",
    lastRun: "اليوم 08:30 ص",
  },
];

const topArticles = [
  {
    id: "ART-01",
    title: "تدشين مشاريع تنموية جديدة في محافظة حضرموت",
    category: "محلي",
    author: "أحمد الشمري",
    views: 45200,
    comments: 84,
    shares: 1240,
    avgTime: "04:12",
  },
  {
    id: "ART-02",
    title: "تقرير شامل عن تقلبات أسعار الصرف والتأثير على السلع",
    category: "اقتصاد",
    author: "سارة العتيبي",
    views: 38900,
    comments: 112,
    shares: 980,
    avgTime: "05:30",
  },
  {
    id: "ART-03",
    title: "أجراس اليمن ترصد استعدادات المنتخب الوطني لبطولة آسيا",
    category: "رياضة",
    author: "فهد الدوسري",
    views: 31400,
    comments: 63,
    shares: 820,
    avgTime: "03:15",
  },
  {
    id: "ART-04",
    title: "افتتاح معرض صنعاء للخط العربي والمخطوطات النادرة",
    category: "ثقافة",
    author: "نورة القحطاني",
    views: 24800,
    comments: 41,
    shares: 610,
    avgTime: "03:40",
  },
  {
    id: "ART-05",
    title: "مؤتمر صحفي: إطلاق خدمات الجيل الرابع المحدثة",
    category: "تقنية",
    author: "خالد المالكي",
    views: 19500,
    comments: 29,
    shares: 430,
    avgTime: "02:50",
  },
];

export default function ReportsPage() {
  const [range, setRange] = useState("آخر 30 يوماً");

  function exportReport(format: "csv" | "pdf", name: string) {
    toast.success(`جارٍ تصدير تقرير (${format.toUpperCase()})`, {
      description: `تم إعداد ملف "${name}" وتجهيزه للتنزيل.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="التحليلات والتقارير"
        description="متابعة مؤشرات القراءة، المشاهدات، الزيارات، وسلوك قراء أجراس اليمن."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <IconCalendar className="size-4" />
              <span>{range}</span>
              <IconChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuRadioGroup value={range} onValueChange={setRange}>
              {RANGES.map((r) => (
                <DropdownMenuRadioItem key={r} value={r}>
                  {r}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <IconDownload className="size-4" />
              <span>تصدير البيانات</span>
              <IconChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportReport("csv", "المؤشرات الإخبارية")}>
              <IconFileTypeCsv className="size-4" /> تصدير ملف CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportReport("pdf", "التقرير التحليلي الشامل")}>
              <IconFileTypePdf className="size-4" /> تصدير ملف PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} stat={kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>حركة المشاهدات والزيارات الشهرية</CardTitle>
            <CardDescription>
              مقارنة بين إجمالي مشاهدات الصفحات وأعداد الزوار الفريدين على مدار العام.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="aspect-auto h-[320px] w-full">
              <BarChart
                data={newsMonthlyAnalytics}
                margin={{ left: 12, right: 12, top: 12 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(v) => `${Number(v).toLocaleString()} زيارة`}
                    />
                  }
                />
                <Bar
                  dataKey="views"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  name="المشاهدات"
                />
                <Bar
                  dataKey="visitors"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                  name="الزوار"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>مصادر حركة الزيارات</CardTitle>
            <CardDescription>
              توزيع وصول القراء حسب القنوات والمنصات.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-2">
            <TrafficDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* Top Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>الأخبار الأكثر قراءة وتفاعلاً</CardTitle>
          <CardDescription>
            المقالات الإخبارية التي حققت أعلى نسب وصول وتفاعل خلال الفترة المحددة.
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">عنوان المقال الإخباري</TableHead>
              <TableHead className="text-start">القسم</TableHead>
              <TableHead className="text-start">الكاتب / المحرر</TableHead>
              <TableHead className="text-start">المشاهدات</TableHead>
              <TableHead className="text-start">التعليقات</TableHead>
              <TableHead className="text-start">المشاركات</TableHead>
              <TableHead className="text-start">متوسط القراءة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topArticles.map((art) => (
              <TableRow key={art.id}>
                <TableCell className="font-medium text-foreground">
                  {art.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{art.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{art.author}</TableCell>
                <TableCell className="font-semibold tabular-nums text-primary">
                  {art.views.toLocaleString()}
                </TableCell>
                <TableCell className="tabular-nums">{art.comments}</TableCell>
                <TableCell className="tabular-nums">{art.shares}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {art.avgTime} د
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Saved Reports Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">تقارير إخبارية جاهزة للتنزيل</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {savedReports.map((rep) => (
            <Card key={rep.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <rep.icon className="size-5" />
                </div>
                <CardTitle className="mt-3 text-base leading-snug">
                  {rep.name}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {rep.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>التكرار: {rep.cadence}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-primary"
                  onClick={() => exportReport("pdf", rep.name)}
                >
                  <IconDownload className="size-3.5" /> تحميل
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
