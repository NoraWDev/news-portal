import {
  IconLayoutDashboard,
  IconNews,
  IconCirclePlus,
  IconCategory,
  IconVideo,
  IconMessageCircle,
  IconSpeakerphone,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconSparkles,
  IconPencil,
  IconUserCircle,
  type Icon,
} from "@tabler/icons-react";

export type Workspace = {
  name: string;
  plan: string;
  icon: Icon;
};

export const workspaces: Workspace[] = [
  { name: "أجراس اليمن الإخبارية", plan: "لوحة الإدارة الإخبارية", icon: IconSparkles },
];

export type NavChild = { title: string; url: string };

export type NavItem = {
  title: string;
  url?: string;
  icon?: Icon;
  badge?: string;
  items?: NavChild[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "القائمة الرئيسية",
    items: [
      { title: "الرئيسية", url: "/admin", icon: IconLayoutDashboard },
      { title: "الأخبار", url: "/admin/blog", icon: IconNews },
      { title: "إضافة خبر", url: "/admin/blog/new", icon: IconCirclePlus },
      { title: "الأقسام", url: "/admin/categories", icon: IconCategory },
      { title: "الفيديوهات", url: "/admin/videos", icon: IconVideo },
      { title: "التعليقات", url: "/admin/reviews", icon: IconMessageCircle },
      { title: "الإعلانات", url: "/admin/discounts", icon: IconSpeakerphone },
      { title: "المستخدمون", url: "/admin/team", icon: IconUsers },
      { title: "الإحصائيات", url: "/admin/reports", icon: IconChartBar },
      { title: "الإعدادات", url: "/admin/settings", icon: IconSettings },
    ],
  },
  {
    label: "مقالات الرأي والكتّاب",
    items: [
      {
        title: "الكتّاب",
        icon: IconUserCircle,
        items: [
          { title: "قائمة الكتّاب", url: "/admin/authors" },
          { title: "إضافة كاتب", url: "/admin/authors/new" },
        ],
      },
      {
        title: "المقالات",
        icon: IconPencil,
        items: [
          { title: "قائمة المقالات", url: "/admin/opinions" },
          { title: "إضافة مقال", url: "/admin/opinions/new" },
        ],
      },
    ],
  },
];
