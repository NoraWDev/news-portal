"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconUser,
  IconBell,
  IconShieldLock,
  IconPalette,
  IconCreditCard,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconCheck,
  IconArrowUpRight,
  IconUpload,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { currentUser } from "@/data";

const notificationPrefs = [
  {
    id: "notif-breaking",
    title: "تنبيهات الأخبار العاجلة",
    desc: "إرسال إشعار فوري عند نشر أي خبر عاجل أو تغطية استثنائية.",
    channel: "تنبيه فوري",
    on: true,
  },
  {
    id: "notif-comments",
    title: "إشعارات تعليقات القراء",
    desc: "تنبيه هيئة التحرير عند إضافة تعليقات جديدة تحتاج إلى تدقيق أو موافقة.",
    channel: "لوحة التحكم",
    on: true,
  },
  {
    id: "notif-security",
    title: "سجل الأمان وتسجيل الدخول",
    desc: "إشعار بريدي عند تسجيل الدخول من جهاز جديد أو تغيير كلمة المرور.",
    channel: "البريد الإلكتروني",
    on: true,
  },
  {
    id: "notif-reports",
    title: "التقرير الإحصائي الأسبوعي",
    desc: "إرسال ملخص أسبوعي بأكثر الأخبار مشاهدة وتفاعلاً.",
    channel: "البريد الإلكتروني",
    on: false,
  },
];

const sessions = [
  {
    id: "s1",
    device: "MacBook Pro · Chrome",
    location: "صنعاء، اليمن",
    last: "نشط الآن",
    current: true,
    icon: IconDeviceLaptop,
  },
  {
    id: "s2",
    device: "iPhone 15 Pro · Safari",
    location: "صنعاء، اليمن",
    last: "منذ ساعتين",
    current: false,
    icon: IconDeviceMobile,
  },
  {
    id: "s3",
    device: "Windows PC · Edge",
    location: "عدن، اليمن",
    last: "أمس",
    current: false,
    icon: IconDeviceLaptop,
  },
];

const systemLicenses = [
  { id: "LIC-2026", date: "01 أكتوبر 2026", amount: "ترخيص سنوي معتمد" },
  { id: "LIC-2025", date: "01 أكتوبر 2025", amount: "مكتمل" },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(notificationPrefs.map((n) => [n.id, n.on]))
  );
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionList, setSessionList] = useState(sessions);

  const saved = (message: string, description?: string) => () =>
    toast.success(message, description ? { description } : undefined);

  const revokeSession = (id: string, device: string) => {
    setSessionList((prev) => prev.filter((s) => s.id !== id));
    toast.success("تم إنهاء الجلسة بنجاح", { description: device });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="إدارة الحساب الشخصي، وتفضيلات الإشعارات، والأمان، وإعدادات لوحة التحكم."
      />

      <Tabs defaultValue="general" className="gap-6">
        <div className="overflow-x-auto">
          <TabsList className="mb-4">
            <TabsTrigger value="general">
              <IconUser className="size-4" /> الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <IconBell className="size-4" /> الإشعارات
            </TabsTrigger>
            <TabsTrigger value="security">
              <IconShieldLock className="size-4" /> الأمان والدخول
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <IconPalette className="size-4" /> المظهر واللغة
            </TabsTrigger>
            <TabsTrigger value="billing">
              <IconCreditCard className="size-4" /> التراخيص والنظام
            </TabsTrigger>
          </TabsList>
        </div>

        {/* GENERAL */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>بيانات الحساب الشخصي</CardTitle>
              <CardDescription>
                المعلومات الشخصية التي تظهر لفريق التحرير وفي سجل النشر.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="size-16">
                  {currentUser.avatar && (
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    أت
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saved("تم تحديث الصورة", "تم حفظ الصورة الرمزية الجديدة.")}
                  >
                    <IconUpload className="size-4" /> تغيير الصورة
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saved("تمت استعادة الصورة الافتراضية")}
                  >
                    حذف
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input id="username" defaultValue="ayoubtamimi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={currentUser.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">الرتبة التحريرية</Label>
                  <Select defaultValue="chief">
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chief">رئيس التحرير</SelectItem>
                      <SelectItem value="managing">مدير التحرير</SelectItem>
                      <SelectItem value="editor">محرر صحفي</SelectItem>
                      <SelectItem value="reporter">مراسل ميداني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">النبذة التعريفية</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  defaultValue="رئيس تحرير منصة أجراس اليمن الإخبارية — صحفي وكاتب مهتم بالشؤون اليمنية والإقليمية."
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t">
              <Button variant="ghost" onClick={saved("تم إلغاء التغييرات")}>
                إلغاء
              </Button>
              <Button
                onClick={saved("تم حفظ التعديلات", "تم تحديث بيانات الملف الشخصي بنجاح.")}
              >
                حفظ التعديلات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
              <CardDescription>
                اختر نوعية التنبيهات التي ترغب باستلامها أثناء إدارة الأخبار.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {notificationPrefs.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={n.id} className="font-medium">{n.title}</Label>
                      <Badge variant="outline" className="text-xs">
                        {n.channel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    id={n.id}
                    checked={prefs[n.id]}
                    onCheckedChange={(v) =>
                      setPrefs((p) => ({ ...p, [n.id]: v }))
                    }
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end border-t">
              <Button
                onClick={saved(
                  "تم حفظ التفضيلات",
                  "تم تحديث إعدادات الإشعارات الخاصة بك بنجاح."
                )}
              >
                حفظ التفضيلات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة المرور</CardTitle>
              <CardDescription>
                احرص على استخدام كلمة مرور قوية تحتوي على أحرف ورموز وأرقام.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current">كلمة المرور الحالية</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">كلمة المرور الجديدة</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">تأكيد كلمة المرور الجديدة</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t">
              <Button
                onClick={saved(
                  "تم تحديث كلمة المرور",
                  "يرجى استخدام كلمة المرور الجديدة في المرة القادمة."
                )}
              >
                تحديث كلمة المرور
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المصادقة الثنائية (2FA)</CardTitle>
              <CardDescription>
                حماية إضافية لحسابك تتطلب رمز تحقق عند تسجيل الدخول.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">تطبيق المصادقة (Authenticator)</Label>
                <p className="text-xs text-muted-foreground">
                  طلب رمز أمان مؤقت من التطبيق عند تسجيل الدخول.
                </p>
              </div>
              <Switch
                id="2fa"
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الأجهزة والجلسات النشطة</CardTitle>
              <CardDescription>
                قائمة بالأجهزة المسجلة دخولها حالياً إلى لوحة التحكم.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {sessionList.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <s.icon className="size-5 text-muted-foreground" />
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {s.device}
                      {s.current && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                          هذا الجهاز
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {s.location} · {s.last}
                    </p>
                  </div>
                  {!s.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ms-auto text-xs text-destructive hover:text-destructive"
                      onClick={() => revokeSession(s.id, s.device)}
                    >
                      إنهاء الجلسة
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المظهر واللغة</CardTitle>
              <CardDescription>
                تخصيص العرض واللغة والتوقيت المعتمد في لوحة التحكم.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>مظهر لوحة التحكم (داكن / فاتح)</Label>
                  <p className="text-xs text-muted-foreground">
                    يمكنك التبديل بسهولة بين الوضع الفاتح والداكن من خلال زر المظهر في الشريط العلوي وقائمة المستخدم.
                  </p>
                </div>
                <Badge variant="outline">هوية أجراس اليمن</Badge>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lang">لغة واجهة التحكم</Label>
                  <Select defaultValue="ar">
                    <SelectTrigger id="lang" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية (اليمن)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">المنطقة الزمنية</Label>
                  <Select defaultValue="sanaa">
                    <SelectTrigger id="tz" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sanaa">توقيت صنعاء ومكة (GMT+3)</SelectItem>
                      <SelectItem value="cairo">توقيت القاهرة (GMT+2)</SelectItem>
                      <SelectItem value="dubai">توقيت دبي (GMT+4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t">
              <Button
                onClick={saved(
                  "تم حفظ تفضيلات المظهر",
                  "تم تطبيق إعدادات العرض بنجاح."
                )}
              >
                حفظ التغييرات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* BILLING / LICENSES */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>باقة وترخيص لوحة الإدارة</CardTitle>
              <CardDescription>
                معلومات ترخيص نظام إدارة المحتوى الصحفي لموقع أجراس اليمن.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 rounded-xl border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">باقة المؤسسات الإخبارية المتقدمة</span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      مرخص ونشط
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    تاريخ التجديد السنوي: 01 أكتوبر 2027
                  </p>
                </div>
                <div className="text-start sm:text-end">
                  <div className="text-xl font-bold text-primary">
                    أجراس اليمن الإخبارية
                  </div>
                  <span className="text-xs text-muted-foreground">
                    نظام إدارة الأخبار المتكامل
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجل التراخيص والتحديثات</CardTitle>
              <CardDescription>أرشيف سجل ترخيص المنصة.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {systemLicenses.map((lic) => (
                <div
                  key={lic.id}
                  className="flex items-center gap-4 py-3 text-sm first:pt-0 last:pb-0"
                >
                  <IconCheck className="size-4 text-emerald-500" />
                  <span className="font-medium">{lic.id}</span>
                  <span className="text-xs text-muted-foreground">{lic.date}</span>
                  <span className="ms-auto text-xs font-medium text-primary">
                    {lic.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
