"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBell,
  IconSearch,
  IconLogout,
  IconUserCircle,
  IconSettings,
  IconCreditCard,
} from "@tabler/icons-react";

import { navGroups } from "@/config/nav";
import { currentUser, recentActivity } from "@/data";
import { logout } from "@/app/admin/login/actions";
import { toast } from "sonner";
import { useIsMac } from "@/hooks/use-platform";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomizerButton } from "@/components/theme-customizer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Acronyms and Arabic labels for URL segments.
const CRUMB_LABELS: Record<string, string> = {
  admin: "لوحة التحكم",
  dashboard: "الرئيسية",
  blog: "الأخبار",
  new: "إضافة خبر",
  categories: "الأقسام",
  videos: "الفيديوهات",
  reviews: "التعليقات",
  discounts: "الإعلانات",
  team: "المستخدمون",
  reports: "الإحصائيات",
  settings: "الإعدادات",
  profile: "الملف الشخصي",
  notifications: "الإشعارات",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map(
    (s) =>
      CRUMB_LABELS[s] ??
      s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function AppHeader() {
  const crumbs = useBreadcrumb();
  const router = useRouter();
  const isMac = useIsMac();
  const [open, setOpen] = React.useState(false);

  const go = React.useCallback(
    (url: string) => {
      setOpen(false);
      router.push(url);
    },
    [router]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ms-1" />
      <div className="me-1 h-5 w-px shrink-0 self-center bg-border" />
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    i < crumbs.length - 1 ? "text-muted-foreground" : ""
                  }
                >
                  {c}
                </BreadcrumbPage>
              </BreadcrumbItem>
              {i < crumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ms-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          className="hidden h-9 w-56 justify-start gap-2 px-3 text-muted-foreground md:flex"
          onClick={() => setOpen(true)}
        >
          <IconSearch className="size-4" />
          <span className="text-sm">بحث…</span>
          <KbdGroup className="ms-auto">
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <span className="text-[11px] font-medium text-muted-foreground">+</span>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => setOpen(true)}
        >
          <IconSearch className="size-5" />
        </Button>

        <NotificationsMenu />
        <ThemeToggle />
        <CustomizerButton />
        <div className="mx-1 h-6 w-px shrink-0 self-center bg-border" />
        <UserMenu />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="اكتب أمرًا أو ابحث…" />
        <CommandList>
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          {navGroups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.flatMap((item) => {
                if (item.items?.length) {
                  return item.items.map((sub) => (
                    <CommandItem
                      key={sub.title}
                      value={`${item.title} ${sub.title}`}
                      onSelect={() => go(sub.url)}
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="min-w-0 flex-1 truncate">{sub.title}</span>
                    </CommandItem>
                  ));
                }
                return (
                  <CommandItem
                    key={item.title}
                    value={item.title}
                    onSelect={() => go(item.url ?? "#")}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-lg hover:bg-muted"
          aria-label="الإشعارات"
        >
          <IconBell className="size-5" />
          <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[calc(100vw-1rem)] sm:w-80 rounded-xl">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 font-medium text-sm">الإشعارات</DropdownMenuLabel>
          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">3 جديدة</Badge>
        </div>
        <DropdownMenuSeparator />
        {recentActivity.slice(0, 4).map((a) => (
          <DropdownMenuItem key={a.id} className="items-start gap-3 py-2.5">
            <Avatar className="size-8">
              <AvatarImage src={a.avatar} alt={a.user} />
              <AvatarFallback>{a.user.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 gap-0.5">
              <p className="line-clamp-2 whitespace-normal text-sm leading-snug">
                <span className="font-medium">{a.user}</span> {a.action}{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-sm font-medium">
          <Link href="/admin/notifications">عرض كل الإشعارات</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-1.5 rounded-lg hover:bg-muted">
          <Avatar className="size-7.5 ring-1 ring-border/50">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              أج
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium lg:inline">
            {currentUser.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl">
        <DropdownMenuLabel className="flex items-center gap-2 p-2">
          <Avatar className="size-9 shrink-0 ring-1 ring-border/50">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              أج
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 leading-tight">
            <span className="truncate text-sm font-semibold">{currentUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin/profile">
              <IconUserCircle className="size-4" /> الملف الشخصي
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <IconSettings className="size-4" /> الإعدادات
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <IconCreditCard className="size-4" /> الاشتراكات
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            toast.success("تم تسجيل الخروج بنجاح");
            await logout();
          }}
          className="text-destructive focus:text-destructive"
        >
          <IconLogout className="size-4" /> تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
