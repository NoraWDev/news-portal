// ---------------------------------------------------------------------------
// Fake data for the OrbynAdmin admin template. All figures are illustrative.
// ---------------------------------------------------------------------------

export const revenueByMonth = [
  { month: "Jan", revenue: 18600, orders: 240, profit: 6200 },
  { month: "Feb", revenue: 22050, orders: 298, profit: 7400 },
  { month: "Mar", revenue: 19700, orders: 271, profit: 6800 },
  { month: "Apr", revenue: 27340, orders: 342, profit: 9100 },
  { month: "May", revenue: 31200, orders: 389, profit: 10800 },
  { month: "Jun", revenue: 28900, orders: 361, profit: 9600 },
  { month: "Jul", revenue: 34800, orders: 421, profit: 12200 },
  { month: "Aug", revenue: 38100, orders: 458, profit: 13400 },
  { month: "Sep", revenue: 35600, orders: 432, profit: 12600 },
  { month: "Oct", revenue: 42300, orders: 501, profit: 15100 },
  { month: "Nov", revenue: 46800, orders: 548, profit: 16800 },
  { month: "Dec", revenue: 52400, orders: 612, profit: 19200 },
];

export const visitorsByDay = [
  { date: "Mon", desktop: 1240, mobile: 980 },
  { date: "Tue", desktop: 1480, mobile: 1120 },
  { date: "Wed", desktop: 1360, mobile: 1240 },
  { date: "Thu", desktop: 1720, mobile: 1380 },
  { date: "Fri", desktop: 1920, mobile: 1560 },
  { date: "Sat", desktop: 1120, mobile: 1720 },
  { date: "Sun", desktop: 980, mobile: 1480 },
];

export const trafficSources = [
  { source: "Organic", value: 4820, fill: "var(--chart-1)" },
  { source: "Direct", value: 3210, fill: "var(--chart-2)" },
  { source: "Referral", value: 2140, fill: "var(--chart-3)" },
  { source: "Social", value: 1680, fill: "var(--chart-4)" },
  { source: "Email", value: 940, fill: "var(--chart-5)" },
];

export const salesByCategory = [
  { category: "Electronics", value: 38 },
  { category: "Apparel", value: 24 },
  { category: "Home", value: 18 },
  { category: "Beauty", value: 12 },
  { category: "Other", value: 8 },
];

export const viewsAndVisitsLast30Days = [
  { date: "1 سبتمبر", views: 14200, visits: 8100 },
  { date: "4 سبتمبر", views: 16800, visits: 9400 },
  { date: "7 سبتمبر", views: 15400, visits: 8900 },
  { date: "10 سبتمبر", views: 19200, visits: 11300 },
  { date: "13 سبتمبر", views: 22400, visits: 13100 },
  { date: "16 سبتمبر", views: 20100, visits: 11800 },
  { date: "19 سبتمبر", views: 24600, visits: 14200 },
  { date: "22 سبتمبر", views: 27800, visits: 16500 },
  { date: "25 سبتمبر", views: 25900, visits: 15100 },
  { date: "28 سبتمبر", views: 31200, visits: 18400 },
  { date: "30 سبتمبر", views: 34500, visits: 20200 },
];

export const newsByCategory = [
  { category: "سياسة", value: 840, fill: "var(--chart-1)" },
  { category: "محلي", value: 620, fill: "var(--chart-2)" },
  { category: "اقتصاد", value: 450, fill: "var(--chart-3)" },
  { category: "رياضة", value: 310, fill: "var(--chart-4)" },
  { category: "مجتمع", value: 190, fill: "var(--chart-5)" },
];

export type StatCard = {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  hint: string;
};

export const overviewStats: StatCard[] = [
  { label: "إجمالي الأخبار", value: "2,845", change: 12.5, trend: "up", hint: "مقارنة بالشهر السابق" },
  { label: "الأخبار المنشورة", value: "2,410", change: 8.2, trend: "up", hint: "مقارنة بالشهر السابق" },
  { label: "إجمالي المشاهدات", value: "482,900", change: 15.3, trend: "up", hint: "مقارنة بالشهر السابق" },
  { label: "الأخبار العاجلة", value: "38", change: 4.1, trend: "down", hint: "مقارنة بالأسبوع السابق" },
];

export type LatestNewsItem = {
  id: number;
  title: string;
  category: string;
  author: string;
  views: number;
  date: string;
  status: "منشور" | "مسودة" | "عاجل";
};

export const latestNews: LatestNewsItem[] = [
  { id: 1, title: "مجلس الوزراء يعتمد الميزانية العامة للدولة للعام المالي الجديد", category: "سياسة", author: "أحمد الشمري", views: 12480, date: "2026-10-03", status: "منشور" },
  { id: 2, title: "افتتاح أكبر مشروع للطاقة الشمسية في منطقة الخليج", category: "اقتصاد", author: "سارة العتيبي", views: 8920, date: "2026-10-03", status: "عاجل" },
  { id: 3, title: "المنتخب الوطني يتأهل إلى نهائيات كأس العالم بعد فوز تاريخي", category: "رياضة", author: "خالد المالكي", views: 34200, date: "2026-10-02", status: "منشور" },
  { id: 4, title: "إطلاق منصة وطنية جديدة لدعم ريادة الأعمال والمشاريع الصغيرة", category: "اقتصاد", author: "نورة القحطاني", views: 5640, date: "2026-10-02", status: "منشور" },
  { id: 5, title: "تحذيرات من موجة حرارة شديدة تضرب عدة مناطق خلال الأيام القادمة", category: "محلي", author: "فهد الدوسري", views: 18350, date: "2026-10-01", status: "عاجل" },
  { id: 6, title: "دراسة محلية تكشف عن ارتفاع معدلات القراءة الرقمية بنسبة 40%", category: "مجتمع", author: "ريم الحربي", views: 3120, date: "2026-10-01", status: "مسودة" },
  { id: 7, title: "توقيع اتفاقية تعاون ثقافي بين المملكة وثلاث دول أوروبية", category: "سياسة", author: "عبدالله السبيعي", views: 7890, date: "2026-09-30", status: "منشور" },
  { id: 8, title: "انطلاق فعاليات المعرض الدولي للتقنية والابتكار في الرياض", category: "محلي", author: "منى الزهراني", views: 4510, date: "2026-09-30", status: "مسودة" },
];

export type LatestCommentItem = {
  id: number;
  author: string;
  avatar: string;
  comment: string;
  newsTitle: string;
  date: string;
  status: "موافق عليه" | "معلّق" | "مرفوض";
};

export const latestComments: LatestCommentItem[] = [
  {
    id: 1,
    author: "محمد الزهراني",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=mz",
    comment: "خطوة ممتازة نحو تعزيز الاقتصاد الوطني وتحقيق الاستدامة المالية.",
    newsTitle: "مجلس الوزراء يعتمد الميزانية العامة للدولة للعام المالي الجديد",
    date: "منذ 15 دقيقة",
    status: "موافق عليه",
  },
  {
    id: 2,
    author: "هند الغامدي",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=hg",
    comment: "نتمنى التوفيق للمنتخب في المراحل القادمة وتقديم أداء مشرف.",
    newsTitle: "المنتخب الوطني يتأهل إلى نهائيات كأس العالم بعد فوز تاريخي",
    date: "منذ ساعة",
    status: "موافق عليه",
  },
  {
    id: 3,
    author: "سلطان العتيبي",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=so",
    comment: "يرجى توضيح المناطق التي ستشهد درجات حرارة قياسية بالتحديد.",
    newsTitle: "تحذيرات من موجة حرارة شديدة تضرب عدة مناطق خلال الأيام القادمة",
    date: "منذ ساعتين",
    status: "معلّق",
  },
  {
    id: 4,
    author: "ياسر الشريف",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ys",
    comment: "مشروع عملاق سيغير خريطة الطاقة المتجددة في المنطقة بالكامل.",
    newsTitle: "افتتاح أكبر مشروع للطاقة الشمسية في منطقة الخليج",
    date: "منذ 4 ساعات",
    status: "موافق عليه",
  },
  {
    id: 5,
    author: "خالد بن ناصر",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=kn",
    comment: "تعليق غير لائق يحتوي على روابط دعائية ومخالف لسياسة النشر.",
    newsTitle: "إطلاق منصة وطنية جديدة لدعم ريادة الأعمال والمشاريع الصغيرة",
    date: "منذ يوم",
    status: "مرفوض",
  },
];

export type ActiveAdItem = {
  id: number;
  name: string;
  placement: string;
  status: "نشط" | "متوقف" | "منتهي";
  endDate: string;
};

export const activeAds: ActiveAdItem[] = [
  { id: 1, name: "إعلان بنك الرياض — حملة التمويل", placement: "الرئيسية (أعلى)", status: "نشط", endDate: "2026-10-15" },
  { id: 2, name: "إعلان طيران ناس — رحلات الشتاء", placement: "المقال (شريط جانبي)", status: "نشط", endDate: "2026-10-20" },
  { id: 3, name: "إعلان شركة الاتصالات — باقات 5G", placement: "أسفل الأخبار", status: "متوقف", endDate: "2026-10-10" },
  { id: 4, name: "إعلان سيارات هيونداي — عروض نهاية العام", placement: "نافذة منبثقة", status: "منتهي", endDate: "2026-09-30" },
  { id: 5, name: "إعلان مؤتمر التقنية الدولي", placement: "شريط عاجل", status: "نشط", endDate: "2026-10-25" },
];

export const ecommerceStats: StatCard[] = [
  { label: "Gross Sales", value: "$52,420", change: 14.2, trend: "up", hint: "this month" },
  { label: "Orders", value: "612", change: 9.7, trend: "up", hint: "this month" },
  { label: "Avg. Order Value", value: "$85.65", change: 2.3, trend: "up", hint: "this month" },
  { label: "Refunds", value: "$1,240", change: 1.1, trend: "down", hint: "this month" },
];

const firstNames = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "Lucas", "Mia", "Aiden", "Harper", "James", "Ella", "Benjamin", "Amelia", "Elijah", "Chloe", "Daniel"];
const lastNames = ["Carter", "Reyes", "Nguyen", "Patel", "Kim", "Brooks", "Silva", "Novak", "Haddad", "Rossi", "Weber", "Costa", "Fischer", "Muller", "Ivanov", "Sato", "Cohen", "Bauer", "Lopez", "Dubois"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  status: "Active" | "Inactive" | "Pending";
  plan: "Free" | "Pro" | "Enterprise";
  spent: number;
  location: string;
  joined: string;
};

const companies = ["Vertex Labs", "Northwind", "Lumen Co", "Aperture", "Blue Harbor", "Sunroot", "Kite Digital", "Foundry", "Meridian", "Ironclad", "Wavelength", "Silverpeak"];
const locations = ["San Francisco, US", "London, UK", "Berlin, DE", "Toronto, CA", "Sydney, AU", "Tokyo, JP", "Paris, FR", "Austin, US", "Amsterdam, NL", "Singapore, SG"];
const plans: Customer["plan"][] = ["Free", "Pro", "Enterprise"];
const statuses: Customer["status"][] = ["Active", "Inactive", "Pending"];

export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => {
  const first = pick(firstNames, i * 3);
  const last = pick(lastNames, i * 5 + 2);
  const name = `${first} ${last}`;
  return {
    id: `CUS-${(1042 + i).toString()}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(companies, i).toLowerCase().replace(/\s/g, "")}.com`,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${(i % 70) + 1}`,
    company: pick(companies, i),
    status: pick(statuses, i + (i % 4)),
    plan: pick(plans, i + (i % 3)),
    spent: 480 + ((i * 137) % 9200),
    location: pick(locations, i * 2),
    joined: new Date(2024, i % 12, ((i * 7) % 27) + 1).toISOString().slice(0, 10),
  };
});

export type Order = {
  id: string;
  customer: string;
  avatar: string;
  product: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Refunded" | "Failed";
  method: string;
};

const products = ["Aurora Headphones", "Nimbus Keyboard", "Pulse Watch", "Vega Monitor", "Orbit Mouse", "Lumina Lamp", "Echo Speaker", "Zephyr Drone", "Cobalt Charger", "Terra Backpack"];
const methods = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Amex"];
const orderStatuses: Order["status"][] = ["Paid", "Pending", "Refunded", "Failed"];

export const orders: Order[] = Array.from({ length: 40 }, (_, i) => {
  const first = pick(firstNames, i * 2 + 1);
  const last = pick(lastNames, i * 3);
  return {
    id: `#ORD-${7100 + i}`,
    customer: `${first} ${last}`,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${((i + 12) % 70) + 1}`,
    product: pick(products, i),
    date: new Date(2026, 6, ((i * 3) % 27) + 1).toISOString().slice(0, 10),
    amount: 29 + ((i * 53) % 940),
    status: pick(orderStatuses, i + (i % 5)),
    method: pick(methods, i),
  };
});

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
};

// Each product name maps to a sensible category so labels read realistically
// (a keyboard is Electronics, not Apparel). Category filters/charts stay varied.
const categoryByProduct: Record<string, string> = {
  "Aurora Headphones": "Electronics",
  "Nimbus Keyboard": "Electronics",
  "Pulse Watch": "Sports",
  "Vega Monitor": "Electronics",
  "Orbit Mouse": "Electronics",
  "Lumina Lamp": "Home",
  "Echo Speaker": "Home",
  "Zephyr Drone": "Sports",
  "Cobalt Charger": "Electronics",
  "Terra Backpack": "Sports",
};

export const productList: Product[] = Array.from({ length: 24 }, (_, i) => {
  const stock = (i * 17) % 140;
  const name = pick(products, i);
  return {
    id: `PRD-${200 + i}`,
    name,
    category: categoryByProduct[name] ?? "Electronics",
    price: 19 + ((i * 41) % 480),
    stock,
    sold: 40 + ((i * 89) % 1200),
    status: stock === 0 ? "Out of Stock" : stock < 20 ? "Low Stock" : "In Stock",
    image: `https://api.dicebear.com/9.x/shapes/svg?seed=prd${i}`,
  };
});

// Top sellers: dedupe by name (keep the best-selling variant) so the showcase
// list never repeats a product.
export const topProducts = (() => {
  const seen = new Set<string>();
  return productList
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .filter((p) => (seen.has(p.name) ? false : seen.add(p.name)))
    .slice(0, 5);
})();

export type Activity = {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
};

export const recentActivity: Activity[] = [
  { id: "a1", user: "أحمد الشمري", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ahmed", action: "قام بنشر خبر جديد في قسم", target: "السياسة", time: "منذ 5 دقائق" },
  { id: "a2", user: "سارة العتيبي", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sara", action: "قامت بتعديل خبر", target: "مشروع الطاقة الشمسية", time: "منذ 20 دقيقة" },
  { id: "a3", user: "فهد الدوسري", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=fahad", action: "أنشأ مسودة خبر جديد بعنوان", target: "موجة حرارة شديدة", time: "منذ ساعة" },
  { id: "a4", user: "نورة القحطاني", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=noura", action: "قامت باعتماد تعليق على خبر", target: "الميزانية العامة", time: "منذ ساعتين" },
  { id: "a5", user: "خالد المالكي", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=khaled", action: "قام برفض تعليق مخالف في قسم", target: "المجتمع", time: "منذ 4 ساعات" },
  { id: "a6", user: "عبدالله السبيعي", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=abdullah", action: "أضاف إعلانًا جديدًا في", target: "الرئيسية (أعلى الصفحة)", time: "منذ 6 ساعات" },
];

export const currentUser = {
  name: "أيوب التميمي",
  email: "admin@rassd.com",
  role: "رئيس التحرير",
  avatar: "",
};

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export type InvoiceItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  number: string;
  client: string;
  clientEmail: string;
  company: string;
  avatar: string;
  issued: string;
  due: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  amount: number;
};

const lineItemCatalog = [
  { description: "Enterprise plan — annual license", unitPrice: 1200 },
  { description: "Pro plan — monthly subscription", unitPrice: 49 },
  { description: "Additional team seats", unitPrice: 15 },
  { description: "Onboarding & implementation", unitPrice: 750 },
  { description: "Priority support (SLA)", unitPrice: 300 },
  { description: "Custom integration development", unitPrice: 480 },
  { description: "Analytics add-on", unitPrice: 120 },
  { description: "Extra storage (100 GB)", unitPrice: 25 },
];

const invoiceStatuses: Invoice["status"][] = ["Paid", "Pending", "Overdue", "Draft"];

export const invoices: Invoice[] = Array.from({ length: 14 }, (_, i) => {
  const cust = customers[(i * 3 + 1) % customers.length];
  const itemCount = (i % 3) + 1;
  const items: InvoiceItem[] = Array.from({ length: itemCount }, (_, j) => {
    const cat = lineItemCatalog[(i * 2 + j) % lineItemCatalog.length];
    return { description: cat.description, qty: ((i + j) % 4) + 1, unitPrice: cat.unitPrice };
  });
  const subtotal = items.reduce((a, b) => a + b.qty * b.unitPrice, 0);
  const tax = Math.round(subtotal * 0.08);
  return {
    id: `INV-${2043 + i}`,
    number: `INV-${2043 + i}`,
    client: cust.name,
    clientEmail: cust.email,
    company: cust.company,
    avatar: cust.avatar,
    issued: new Date(2026, 5 + (i % 2), ((i * 5) % 27) + 1).toISOString().slice(0, 10),
    due: new Date(2026, 6 + (i % 2), ((i * 5) % 27) + 1).toISOString().slice(0, 10),
    status: invoiceStatuses[i % invoiceStatuses.length],
    items,
    subtotal,
    tax,
    amount: subtotal + tax,
  };
});

// ---------------------------------------------------------------------------
// Lookup helpers (used by detail pages)
// ---------------------------------------------------------------------------

export const getCustomerById = (id: string) =>
  customers.find((c) => c.id === id);

export const getOrderById = (id: string) =>
  orders.find((o) => o.id === id || o.id === `#${id}` || o.id.replace("#", "") === id);

export const getProductById = (id: string) =>
  productList.find((p) => p.id === id);

export const getInvoiceById = (id: string) =>
  invoices.find((inv) => inv.id === id);

export const company = {
  name: "OrbynAdmin",
  email: "billing@orbynadmin.com",
  address: "2100 Market Street, Suite 400",
  city: "San Francisco, CA 94114",
  country: "United States",
  phone: "+1 (415) 555-0142",
  taxId: "US-482910573",
};

// ---------------------------------------------------------------------------
// Team members
// ---------------------------------------------------------------------------

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  status: "Active" | "Away" | "Offline";
  location: string;
};

export const team: TeamMember[] = [
  { id: "TM-01", name: "أيوب التميمي", role: "رئيس التحرير", department: "التحرير", email: "ayoub@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ayoub", status: "Active", location: "صنعاء" },
  { id: "TM-02", name: "أحمد الشمري", role: "مدير التحرير", department: "التحرير", email: "ahmed@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ahmed", status: "Active", location: "عدن" },
  { id: "TM-03", name: "سارة العتيبي", role: "مسؤولة الشؤون الاقتصادية", department: "التحرير", email: "sara@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sara", status: "Active", location: "المكلا" },
  { id: "TM-04", name: "فهد الدوسري", role: "محرر الأخبار الرياضية", department: "التحرير", email: "fahad@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=fahad", status: "Away", location: "تعز" },
  { id: "TM-05", name: "نورة القحطاني", role: "محررة الشؤون الثقافية والمنوعات", department: "التحرير", email: "noura@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=noura", status: "Active", location: "صنعاء" },
  { id: "TM-06", name: "طارق الزبيري", role: "مراسل ميداني", department: "المراسلون", email: "tariq@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=tariq", status: "Active", location: "مأرب" },
  { id: "TM-07", name: "مريم الأهدل", role: "مدققة لغوية", department: "التدقيق اللغوي", email: "maryam@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=maryam", status: "Active", location: "الحديدة" },
  { id: "TM-08", name: "عمر المهدي", role: "مسؤول الميديا والإنتاج المرئي", department: "الإعلام المرئي", email: "omar@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=omar", status: "Away", location: "صنعاء" },
  { id: "TM-09", name: "د. عبدالحكيم السقاف", role: "كاتب رأي ومستشار", department: "التحرير", email: "sakaf@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sakaf", status: "Offline", location: "سيئون" },
  { id: "TM-10", name: "خالد الحيمي", role: "مسؤول النظم والدعم الفني", department: "الدعم الفني", email: "khaled@ajras-al-yemen.net", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=khaled", status: "Active", location: "صنعاء" },
];

export const getTeamMember = (i: number) => team[i % team.length];

// ---------------------------------------------------------------------------
// Projects & tasks (project-management module)
// ---------------------------------------------------------------------------

export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed";
export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "In Review" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TeamMember;
  labels: string[];
  projectId: string;
  start: string;
  due: string;
  points: number;
  comments: number;
  subtasks: { total: number; done: number };
};

export type Milestone = { title: string; date: string; done: boolean };

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  color: string;
  category: string;
  lead: TeamMember;
  members: TeamMember[];
  start: string;
  due: string;
  budget: number;
  spent: number;
  taskCounts: { total: number; done: number };
  milestones: Milestone[];
};

const projectSeeds = [
  { name: "Mobile App Revamp", key: "MOB", category: "Product", color: "var(--chart-1)", status: "On Track" as ProjectStatus, progress: 68, desc: "Rebuild the iOS & Android apps on a shared design system with offline support." },
  { name: "Billing Platform v2", key: "BILL", category: "Engineering", color: "var(--chart-2)", status: "At Risk" as ProjectStatus, progress: 42, desc: "Migrate invoicing and subscriptions to the new metered billing engine." },
  { name: "Website Redesign", key: "WEB", category: "Marketing", color: "var(--chart-3)", status: "On Track" as ProjectStatus, progress: 81, desc: "Refresh orbynadmin.com with a new brand, CMS and localized landing pages." },
  { name: "Data Warehouse", key: "DATA", category: "Data", color: "var(--chart-4)", status: "Delayed" as ProjectStatus, progress: 34, desc: "Consolidate product analytics into a governed warehouse with dbt models." },
  { name: "Onboarding Overhaul", key: "ONB", category: "Product", color: "var(--chart-5)", status: "On Track" as ProjectStatus, progress: 55, desc: "Redesign activation flow to lift week-1 retention with checklists & tours." },
  { name: "SOC 2 Compliance", key: "SEC", category: "Security", color: "var(--chart-1)", status: "Completed" as ProjectStatus, progress: 100, desc: "Achieve SOC 2 Type II with audited controls, policies and monitoring." },
];

export const projects: Project[] = projectSeeds.map((p, i) => {
  const memberCount = 3 + (i % 4);
  const members = Array.from({ length: memberCount }, (_, j) => getTeamMember(i + j));
  const total = 18 + ((i * 7) % 22);
  const done = Math.round((total * p.progress) / 100);
  return {
    id: `PRJ-${101 + i}`,
    name: p.name,
    key: p.key,
    description: p.desc,
    status: p.status,
    progress: p.progress,
    color: p.color,
    category: p.category,
    lead: getTeamMember(i),
    members,
    start: new Date(2026, 3 + (i % 3), ((i * 4) % 20) + 1).toISOString().slice(0, 10),
    due: new Date(2026, 8 + (i % 3), ((i * 6) % 25) + 1).toISOString().slice(0, 10),
    budget: 40000 + i * 15000,
    spent: Math.round((40000 + i * 15000) * (p.progress / 100) * 0.9),
    taskCounts: { total, done },
    milestones: [
      { title: "Kickoff & discovery", date: "2026-04-12", done: true },
      { title: "Design sign-off", date: "2026-05-28", done: p.progress > 40 },
      { title: "Beta release", date: "2026-07-15", done: p.progress > 70 },
      { title: "General availability", date: "2026-09-30", done: p.progress === 100 },
    ],
  };
});

export const getProjectById = (id: string) => projects.find((p) => p.id === id);

const taskTitles = [
  "Design new onboarding checklist", "Fix flaky auth integration tests", "Implement metered usage events",
  "Migrate legacy invoice PDFs", "Add dark mode to marketing site", "Set up dbt staging models",
  "Write API rate-limit middleware", "Ship push notifications", "Redesign settings page",
  "Add SSO / SAML provisioning", "Instrument activation funnel", "Localize pricing page (DE/FR)",
  "Build billing webhooks retry", "Create component storybook", "Audit accessibility (WCAG AA)",
  "Optimize dashboard query latency", "Add CSV import for contacts", "Set up incident runbooks",
  "Refactor navigation sidebar", "Draft SOC 2 access policy", "Add empty states across app",
  "Wire up Slack notifications", "Improve search relevance", "Reduce cold-start bundle size",
];
const allTaskStatuses: TaskStatus[] = ["Backlog", "Todo", "In Progress", "In Review", "Done"];
const allPriorities: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];
const labelPool = ["frontend", "backend", "design", "bug", "feature", "infra", "docs", "research"];

export const projectTasks: Task[] = taskTitles.map((title, i) => {
  const project = projects[i % projects.length];
  const total = (i % 4) + 1;
  const statusIdx = i % allTaskStatuses.length;
  return {
    id: `TASK-${1200 + i}`,
    title,
    status: allTaskStatuses[statusIdx],
    priority: allPriorities[(i * 3) % allPriorities.length],
    assignee: getTeamMember(i + 2),
    labels: [labelPool[i % labelPool.length], labelPool[(i * 5 + 2) % labelPool.length]].filter((v, idx, a) => a.indexOf(v) === idx),
    projectId: project.id,
    start: new Date(2026, 6, ((i * 2) % 20) + 1).toISOString().slice(0, 10),
    due: new Date(2026, 6, ((i * 3) % 24) + 4).toISOString().slice(0, 10),
    points: [1, 2, 3, 5, 8][i % 5],
    comments: (i * 3) % 9,
    subtasks: { total, done: statusIdx === 4 ? total : i % (total + 1) },
  };
});

export const tasksForProject = (projectId: string) =>
  projectTasks.filter((t) => t.projectId === projectId);

// ---------------------------------------------------------------------------
// File manager
// ---------------------------------------------------------------------------

export type FileNode = {
  id: string;
  name: string;
  kind: "folder" | "image" | "document" | "video" | "audio" | "archive" | "code";
  size: string;
  modified: string;
  owner: TeamMember;
  items?: number;
  starred?: boolean;
};

export const files: FileNode[] = [
  { id: "F-01", name: "Brand Assets", kind: "folder", size: "—", items: 128, modified: "2026-07-10", owner: getTeamMember(3), starred: true },
  { id: "F-02", name: "Product Specs", kind: "folder", size: "—", items: 64, modified: "2026-07-12", owner: getTeamMember(0) },
  { id: "F-03", name: "Marketing", kind: "folder", size: "—", items: 42, modified: "2026-07-08", owner: getTeamMember(1) },
  { id: "F-04", name: "Engineering", kind: "folder", size: "—", items: 210, modified: "2026-07-14", owner: getTeamMember(2), starred: true },
  { id: "F-05", name: "Q3-roadmap.pdf", kind: "document", size: "2.4 MB", modified: "2026-07-15", owner: getTeamMember(0) },
  { id: "F-06", name: "hero-shot-final.png", kind: "image", size: "5.1 MB", modified: "2026-07-13", owner: getTeamMember(3) },
  { id: "F-07", name: "demo-walkthrough.mp4", kind: "video", size: "84 MB", modified: "2026-07-11", owner: getTeamMember(1) },
  { id: "F-08", name: "pricing-tiers.xlsx", kind: "document", size: "412 KB", modified: "2026-07-09", owner: getTeamMember(6) },
  { id: "F-09", name: "logo-pack.zip", kind: "archive", size: "18 MB", modified: "2026-07-07", owner: getTeamMember(3) },
  { id: "F-10", name: "api-reference.md", kind: "code", size: "96 KB", modified: "2026-07-14", owner: getTeamMember(2) },
  { id: "F-11", name: "onboarding-voiceover.mp3", kind: "audio", size: "12 MB", modified: "2026-07-06", owner: getTeamMember(9) },
  { id: "F-12", name: "customer-interviews.pdf", kind: "document", size: "3.8 MB", modified: "2026-07-05", owner: getTeamMember(5) },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

export type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  initial: string;
  color: string;
};

export const integrations: Integration[] = [
  { id: "IN-01", name: "Slack", category: "Communication", description: "Get alerts and updates in your channels.", connected: true, initial: "S", color: "oklch(0.62 0.19 25)" },
  { id: "IN-02", name: "GitHub", category: "Developer", description: "Link pull requests and deployments.", connected: true, initial: "G", color: "oklch(0.4 0 0)" },
  { id: "IN-03", name: "Stripe", category: "Payments", description: "Sync invoices, subscriptions and payouts.", connected: true, initial: "S", color: "oklch(0.55 0.2 285)" },
  { id: "IN-04", name: "Figma", category: "Design", description: "Embed designs and prototypes.", connected: false, initial: "F", color: "oklch(0.62 0.21 25)" },
  { id: "IN-05", name: "Notion", category: "Productivity", description: "Link docs and knowledge base.", connected: false, initial: "N", color: "oklch(0.3 0 0)" },
  { id: "IN-06", name: "Linear", category: "Developer", description: "Two-way sync issues and cycles.", connected: true, initial: "L", color: "oklch(0.55 0.22 275)" },
  { id: "IN-07", name: "Google Drive", category: "Storage", description: "Attach files from Drive.", connected: false, initial: "D", color: "oklch(0.7 0.17 145)" },
  { id: "IN-08", name: "Zoom", category: "Communication", description: "Start meetings from any record.", connected: false, initial: "Z", color: "oklch(0.6 0.2 255)" },
  { id: "IN-09", name: "HubSpot", category: "Marketing", description: "Sync contacts and campaigns.", connected: false, initial: "H", color: "oklch(0.65 0.2 35)" },
  { id: "IN-10", name: "Jira", category: "Developer", description: "Import epics and sprints.", connected: false, initial: "J", color: "oklch(0.58 0.2 260)" },
  { id: "IN-11", name: "Intercom", category: "Support", description: "See conversations inline.", connected: true, initial: "I", color: "oklch(0.6 0.18 245)" },
  { id: "IN-12", name: "Segment", category: "Data", description: "Stream events to your warehouse.", connected: false, initial: "S", color: "oklch(0.7 0.18 155)" },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationKind = "mention" | "comment" | "assign" | "system" | "billing" | "deploy";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  actor?: TeamMember;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "N-01", kind: "mention", title: "Priya Nair mentioned you", description: "“@alex can you review the new onboarding checklist?” in Mobile App Revamp", actor: getTeamMember(3), time: "2 min ago", read: false },
  { id: "N-02", kind: "assign", title: "New task assigned", description: "You were assigned “Implement metered usage events” in Billing Platform v2", actor: getTeamMember(2), time: "25 min ago", read: false },
  { id: "N-03", kind: "comment", title: "Marcus Chen commented", description: "Left a comment on “Add SSO / SAML provisioning”", actor: getTeamMember(2), time: "1 hour ago", read: false },
  { id: "N-04", kind: "deploy", title: "Deployment succeeded", description: "web-app v2.14.0 deployed to production in 3m 12s", time: "2 hours ago", read: true },
  { id: "N-05", kind: "billing", title: "Payment received", description: "Invoice INV-2043 was paid by Northwind — $1,296.00", time: "4 hours ago", read: true },
  { id: "N-06", kind: "system", title: "New sign-in detected", description: "A new sign-in from Chrome on macOS in San Francisco", time: "6 hours ago", read: true },
  { id: "N-07", kind: "comment", title: "Sofia Rossi commented", description: "“Looks great — shipping the localized pages next week.”", actor: getTeamMember(1), time: "Yesterday", read: true },
  { id: "N-08", kind: "mention", title: "Hannah Kim mentioned you", description: "“@alex a customer asked about the Q3 roadmap.”", actor: getTeamMember(5), time: "Yesterday", read: true },
  { id: "N-09", kind: "assign", title: "Milestone due soon", description: "“Beta release” for Mobile App Revamp is due in 3 days", time: "2 days ago", read: true },
  { id: "N-10", kind: "system", title: "Storage at 82%", description: "Your workspace is approaching its storage limit", time: "3 days ago", read: true },
];

// ---------------------------------------------------------------------------
// Crypto / Web3 dashboard. Token names and tickers are real; figures, balances
// and on-chain activity are illustrative. Coin icons are inline brand marks
// (see components/crypto-icon.tsx).
// ---------------------------------------------------------------------------

export type CryptoAsset = {
  symbol: string;
  name: string;
  chain: string;
  price: number;
  change24h: number; // percent, +/-
  holdings: number; // units held
  color: string; // brand-ish color for the monogram badge
  spark: number[]; // 7-day price trend for the sparkline
};

export const cryptoAssets: CryptoAsset[] = [
  { symbol: "BTC", name: "Bitcoin", chain: "Bitcoin", price: 68214.32, change24h: 2.4, holdings: 0.684, color: "#F7931A", spark: [64100, 63800, 65200, 66100, 65700, 67300, 68214] },
  { symbol: "ETH", name: "Ethereum", chain: "Ethereum", price: 3541.08, change24h: 3.8, holdings: 9.2, color: "#627EEA", spark: [3280, 3325, 3298, 3410, 3388, 3472, 3541] },
  { symbol: "SOL", name: "Solana", chain: "Solana", price: 168.24, change24h: 7.1, holdings: 120, color: "#14B8A6", spark: [141, 148, 152, 149, 158, 163, 168] },
  { symbol: "BNB", name: "BNB", chain: "BNB Chain", price: 592.4, change24h: -1.2, holdings: 14, color: "#D9A400", spark: [612, 604, 598, 601, 595, 599, 592] },
  { symbol: "USDC", name: "USD Coin", chain: "Ethereum", price: 1.0, change24h: 0.0, holdings: 12000, color: "#2775CA", spark: [1, 1, 1, 1, 1, 1, 1] },
  { symbol: "XRP", name: "XRP", chain: "XRP Ledger", price: 0.62, change24h: -2.8, holdings: 9000, color: "#475569", spark: [0.66, 0.65, 0.64, 0.63, 0.64, 0.63, 0.62] },
  { symbol: "ADA", name: "Cardano", chain: "Cardano", price: 0.46, change24h: 4.2, holdings: 6500, color: "#2B6BE4", spark: [0.42, 0.43, 0.44, 0.43, 0.45, 0.45, 0.46] },
  { symbol: "POL", name: "Polygon", chain: "Polygon", price: 0.72, change24h: -3.4, holdings: 700, color: "#7C3AED", spark: [0.78, 0.76, 0.75, 0.74, 0.73, 0.74, 0.72] },
];

// Portfolio value over several time ranges, generated deterministically at
// module load (never during render). Ends near the current portfolio total.
function genSeries(
  labels: string[],
  start: number,
  end: number,
  volatility: number,
  seed: number
): { t: string; value: number }[] {
  const n = labels.length;
  return labels.map((t, i) => {
    const p = n === 1 ? 1 : i / (n - 1);
    const trend = start + (end - start) * p;
    const wobble =
      Math.sin(i * 1.7 + seed) * volatility +
      Math.sin(i * 0.6 + seed * 2) * volatility * 0.5;
    return { t, value: Math.max(0, Math.round(trend + wobble)) };
  });
}

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const days30 = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthsYear = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const cryptoPortfolioRanges: Record<
  string,
  { t: string; value: number }[]
> = {
  "24H": genSeries(hours, 124600, 128420, 900, 1),
  "7D": genSeries(weekdays, 118200, 128420, 2200, 3),
  "30D": genSeries(days30, 96400, 128420, 3600, 5),
  "1Y": genSeries(monthsYear, 52800, 128420, 6400, 7),
};

export type CryptoTx = {
  id: string;
  type: "Buy" | "Sell" | "Swap" | "Send" | "Receive" | "Stake";
  asset: string; // symbol
  detail?: string; // e.g. swap pair or address
  amount: number; // units
  value: number; // usd
  time: string;
  status: "Completed" | "Pending" | "Failed";
};

export const cryptoTransactions: CryptoTx[] = [
  { id: "TX-9F2A", type: "Buy", asset: "ETH", amount: 1.5, value: 5311.62, time: "2 min ago", status: "Completed" },
  { id: "TX-7C4B", type: "Receive", asset: "USDC", detail: "from 0x8f…3a91", amount: 2500, value: 2500, time: "18 min ago", status: "Completed" },
  { id: "TX-5A18", type: "Swap", asset: "SOL", detail: "USDC → SOL", amount: 12.4, value: 2086.18, time: "1 hour ago", status: "Completed" },
  { id: "TX-2E90", type: "Stake", asset: "ETH", detail: "Lido", amount: 3.0, value: 10623.24, time: "3 hours ago", status: "Completed" },
  { id: "TX-1D77", type: "Sell", asset: "POL", amount: 1800, value: 1296, time: "5 hours ago", status: "Completed" },
  { id: "TX-8B03", type: "Send", asset: "BTC", detail: "to 0x1c…9d2f", amount: 0.05, value: 3410.72, time: "Yesterday", status: "Completed" },
  { id: "TX-6F55", type: "Buy", asset: "BTC", amount: 0.12, value: 8185.72, time: "Yesterday", status: "Completed" },
  { id: "TX-4A2C", type: "Swap", asset: "ADA", detail: "XRP → ADA", amount: 4200, value: 1932, time: "2 days ago", status: "Pending" },
  { id: "TX-3E81", type: "Receive", asset: "SOL", detail: "from 0x4b…7e10", amount: 40, value: 6729.6, time: "2 days ago", status: "Completed" },
  { id: "TX-0C6D", type: "Sell", asset: "BNB", amount: 6, value: 3554.4, time: "3 days ago", status: "Failed" },
];
