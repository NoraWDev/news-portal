"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  IconUserPlus,
  IconUsers,
  IconBuildingSkyscraper,
  IconCircleDot,
  IconMailForward,
  IconSearch,
  IconLayoutGrid,
  IconLayoutList,
  IconDotsVertical,
  IconMail,
  IconMapPin,
  IconEye,
  IconMessage,
  IconUserCog,
  IconTrash,
  IconSend,
  IconClock,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DeleteDialog } from "@/components/delete-dialog";
import { cn } from "@/lib/utils";
import { team, currentUser, type TeamMember } from "@/data";

const departmentStyles: Record<string, string> = {
  التحرير: "bg-primary/10 text-primary border-primary/20",
  المراسلون: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "التدقيق اللغوي": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "الإعلام المرئي": "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  "الدعم الفني": "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

const statusDot: Record<TeamMember["status"], string> = {
  Active: "bg-emerald-500",
  Away: "bg-amber-500",
  Offline: "bg-slate-400 dark:bg-slate-500",
};

const statusLabel: Record<TeamMember["status"], string> = {
  Active: "نشط حالياً",
  Away: "في مهمة ميدانية",
  Offline: "غير متصل",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

type PendingInvite = {
  email: string;
  role: string;
  department: string;
  invitedBy: string;
  sent: string;
};

const initialInvites: PendingInvite[] = [
  {
    email: "yasser.adnan@ajras-al-yemen.net",
    role: "محرر شؤون محلية",
    department: "التحرير",
    invitedBy: "أيوب التميمي",
    sent: "منذ يومين",
  },
  {
    email: "huda.saleh@ajras-al-yemen.net",
    role: "مراسلة ميدانية",
    department: "المراسلون",
    invitedBy: "أحمد الشمري",
    sent: "منذ 4 أيام",
  },
];

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="space-y-2.5 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function MemberActions({
  member,
  onRemove,
}: {
  member: TeamMember;
  onRemove: (member: TeamMember) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 shrink-0">
          <IconDotsVertical className="size-4" />
          <span className="sr-only">خيارات العضو</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onSelect={() =>
            toast.info(`صلاحيات: ${member.name}`, {
              description: `الدور الحالي: ${member.role} (${member.department})`,
            })
          }
        >
          <IconUserCog className="size-4" /> تعديل الصلاحيات
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            navigator.clipboard.writeText(member.email);
            toast.success("تم نسخ البريد الإلكتروني");
          }}
        >
          <IconMail className="size-4" /> مراسلة العضو
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => onRemove(member)}
        >
          <IconTrash className="size-4" /> حذف من الفريق
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(team);
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteDept, setInviteDept] = useState("التحرير");
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(team.map((m) => m.department))).sort(),
    []
  );

  const stats = useMemo(
    () => ({
      members: members.length,
      departments: new Set(members.map((m) => m.department)).size,
      active: members.filter((m) => m.status === "Active").length,
    }),
    [members]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q);
      const matchesDept = department === "all" || m.department === department;
      return matchesSearch && matchesDept;
    });
  }, [members, search, department]);

  const handleExport = () =>
    toast.success("تم تصدير قائمة الفريق", {
      description: `تم إعداد بيانات ${members.length} عضواً بصيغة CSV.`,
    });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;
    const invite: PendingInvite = {
      email,
      role: inviteRole.trim() || "محرر صحفي",
      department: inviteDept,
      invitedBy: currentUser.name,
      sent: "الآن",
    };
    setInvites((prev) => [invite, ...prev]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("");
    setInviteDept("التحرير");
    toast.success("تم إرسال دعوة الانضمام بنجاح", { description: email });
  };

  const handleRemoveMember = () => {
    if (!removeTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
    toast.success(`تم حذف ${removeTarget.name} من الفريق`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المستخدمون وهيئة التحرير"
        description="إدارة حسابات فريق التحرير والمراسلين والصحفيين وتحديد الصلاحيات في أجراس اليمن."
      >
        <Button variant="outline" size="sm" onClick={handleExport}>
          <IconMailForward className="size-4" /> تصدير القائمة
        </Button>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <IconUserPlus className="size-4" /> إضافة صحفي / دعوة
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="إجمالي الفريق"
          value={stats.members.toLocaleString()}
          hint="عبر جميع الأقسام التحريرية"
          icon={IconUsers}
        />
        <StatTile
          label="الأقسام المتخصصة"
          value={stats.departments.toLocaleString()}
          hint="التحرير، المراسلون، التدقيق، الميديا"
          icon={IconBuildingSkyscraper}
        />
        <StatTile
          label="المتواجدون حالياً"
          value={stats.active.toLocaleString()}
          hint="نشط في لوحة التحكم"
          icon={IconCircleDot}
        />
        <StatTile
          label="الدعوات المعلقة"
          value={invites.length.toLocaleString()}
          hint="بانتظار قبول الانضمام"
          icon={IconMailForward}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث بالاسم أو البريد أو المسمى..."
              className="ps-9"
            />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
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
            variant={view === "table" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("table")}
            aria-label="عرض الجدول"
          >
            <IconLayoutList className="size-4" />
          </Button>
        </div>
      </div>

      {/* Member Cards Grid */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 end-0 size-3 rounded-full ring-2 ring-background",
                          statusDot[member.status]
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold leading-none">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", departmentStyles[member.department])}
                      >
                        {member.department}
                      </Badge>
                    </div>
                  </div>
                  <MemberActions member={member} onRemove={setRemoveTarget} />
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <IconMapPin className="size-3.5" />
                    <span>{member.location}</span>
                  </div>
                  <span className="tabular-nums font-medium">
                    {statusLabel[member.status]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">العضو</TableHead>
                <TableHead className="text-start">المسمى التحريري</TableHead>
                <TableHead className="text-start">القسم</TableHead>
                <TableHead className="text-start">المدينة / الموقع</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="w-[80px] text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={m.avatar} alt={m.name} />
                        <AvatarFallback>{initials(m.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", departmentStyles[m.department])}
                    >
                      {m.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.location}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span className={cn("size-2 rounded-full", statusDot[m.status])} />
                      {statusLabel[m.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <MemberActions member={m} onRemove={setRemoveTarget} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Invite Member Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>دعوة عضو جديد لهيئة التحرير</DialogTitle>
            <DialogDescription>
              أدخل البريد الإلكتروني للمحرر أو المراسل لتوجيه دعوة انضمام للوحة التحكم.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">البريد الإلكتروني</Label>
              <Input
                id="inv-email"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="editor@ajras-al-yemen.net"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inv-role">المسمى التحريري</Label>
              <Input
                id="inv-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                placeholder="مثال: مراسل صحفي ميداني"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inv-dept">القسم</Label>
              <Select value={inviteDept} onValueChange={setInviteDept}>
                <SelectTrigger id="inv-dept">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="التحرير">التحرير</SelectItem>
                  <SelectItem value="المراسلون">المراسلون</SelectItem>
                  <SelectItem value="التدقيق اللغوي">التدقيق اللغوي</SelectItem>
                  <SelectItem value="الإعلام المرئي">الإعلام المرئي</SelectItem>
                  <SelectItem value="الدعم الفني">الدعم الفني</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">إرسال الدعوة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <DeleteDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        name={removeTarget ? removeTarget.name : "العضو"}
        description={
          removeTarget
            ? `هل أنت متأكد من إزالة "${removeTarget.name}" من هيئة التحرير؟`
            : undefined
        }
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
