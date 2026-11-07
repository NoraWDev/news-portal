/**
 * Database Seed Script - Official Categories for "أجراس اليمن الإخبارية"
 * 
 * Safe execution: Uses ON CONFLICT (slug) DO NOTHING.
 * If a category already exists, it is left untouched (name, description, status unchanged).
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 1. Read DATABASE_URL from .env safely without logging contents
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
if (!match) {
  console.error('Error: DATABASE_URL not found in .env.');
  process.exit(1);
}

const connectionString = match[1];

// 2. The 13 Official Categories with clear, unique English slugs
const OFFICIAL_CATEGORIES = [
  // الرئيسية في الهيدر (7 أقسام)
  { name: 'سياسة', slug: 'politics', description: 'تغطيات ومتابعات سياسية محلية وإقليمية ودولية' },
  { name: 'محليات', slug: 'local', description: 'أخبار وتطورات الأحداث والفعاليات داخل اليمن' },
  { name: 'اقتصاد', slug: 'economy', description: 'أسواق المال، أسعار الصرف، والتجارة والاستثمار' },
  { name: 'دولي', slug: 'world', description: 'متابعة الشؤون الدولية والأحداث الإقليمية والعالمية' },
  { name: 'ثقافة', slug: 'culture', description: 'الأدب، التراث، الفنون، والفعاليات الفكرية والثقافية' },
  { name: 'قضايا', slug: 'issues', description: 'ملفات الرأي العام، التحليلات، والقضايا الحقوقية والإنسانية' },
  { name: 'التقارير', slug: 'reports', description: 'تقارير معمقة وتغطيات إخبارية متكاملة' },
  
  // قائمة "المزيد" (6 أقسام)
  { name: 'الصحة', slug: 'health', description: 'مستجدات القطاع الصحي، التوعية والطب' },
  { name: 'المجتمع', slug: 'society', description: 'قضايا المجتمع والحياة اليومية والمبادرات الإنسانية' },
  { name: 'الرياضة', slug: 'sports', description: 'أخبار الرياضة والبطولات المحلية والعالمية' },
  { name: 'تكنولوجيا', slug: 'technology', description: 'أحدث أخبار التقنية، الاتصالات والذكاء الاصطناعي' },
  { name: 'محافظات', slug: 'governorates', description: 'تغطيات خاصة لأخبار المحافظات والمناطق اليمنية' },
  { name: 'تحقيقات', slug: 'investigations', description: 'تحقيقات استقصائية وملفات خاصة' }
];

async function seedCategories() {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 15000,
  });

  let client = null;
  let hasError = false;

  try {
    client = await pool.connect();
    console.log('--- بدء فحص وتغذية الأقسام الرسمية ---');

    let insertedCount = 0;
    let existingCount = 0;

    for (const cat of OFFICIAL_CATEGORIES) {
      try {
        // إدراج القسم، وإذا كان الـ slug موجوداً مسبقاً يتم تخطيه بالكامل دون أي تعديل (DO NOTHING)
        const query = `
          INSERT INTO categories (name, slug, description, is_active, created_at)
          VALUES ($1, $2, $3, true, NOW())
          ON CONFLICT (slug) DO NOTHING
          RETURNING id;
        `;
        const res = await client.query(query, [cat.name, cat.slug, cat.description]);

        if (res.rowCount > 0) {
          insertedCount++;
          console.log(`[+] تم إنشاء القسم: ${cat.name} (${cat.slug})`);
        } else {
          existingCount++;
          console.log(`[=] القسم موجود مسبقاً (تم الإبقاء عليه دون تعديل): ${cat.name} (${cat.slug})`);
        }
      } catch (catErr) {
        hasError = true;
        // طباعة رمز الخطأ والرسالة فقط دون كشف أي أسرار
        console.error(`[-] فشل في معالجة القسم: ${cat.name} (${cat.slug}) | رمز الخطأ: ${catErr.code || 'UNKNOWN'} | التفاصيل: ${catErr.message || 'خطأ غير معروف'}`);
        break;
      }
    }

    if (!hasError) {
      console.log('\n--- النتيجة النهائية ---');
      console.log(`إجمالي الأقسام الجديدة المُنشأة: ${insertedCount}`);
      console.log(`إجمالي الأقسام الموجودة مسبقاً دون تعديل: ${existingCount}`);
      console.log(`المجموع الكلي: ${insertedCount + existingCount} قسم رسمي.`);
    }
  } catch (error) {
    hasError = true;
    console.error(`خطأ أثناء الاتصال بقاعدة البيانات: رمز الخطأ ${error.code || 'UNKNOWN'} | ${error.message || 'فشل الاتصال'}`);
  } finally {
    // 1. تحرير الاتصال دائمًا داخل finally
    if (client) {
      try {
        client.release();
      } catch (relErr) {
        console.error('تحذير أثناء تحرير الاتصال:', relErr.message);
      }
    }
    // 2. إغلاق Pool دائمًا في كل الحالات
    try {
      await pool.end();
    } catch (poolErr) {
      console.error('تحذير أثناء إغلاق Pool:', poolErr.message);
    }
  }

  // 4. خروج برمز فشل مناسب عند حدوث أي خطأ
  if (hasError) {
    process.exit(1);
  }
}

// تنفيذ إذا استُدعي مباشرة من Terminal
if (require.main === module) {
  seedCategories();
}

module.exports = { seedCategories, OFFICIAL_CATEGORIES };
