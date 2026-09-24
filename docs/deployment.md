# استقرار، بکاپ و بازگشت — Runbook مرحله‌ای (هنوز اجرا نشده)

**این مخزن فعلاً وردپرس قابل استقرار ندارد.** نسخهٔ موجود فقط [اسناد ممیزی](phase-1-audit.md) است؛ Production به Git این مخزن متصل/تطبیق داده نشده و هیچ فایل vendor یا دیتابیس در آن نیست. نباید با push این branch فرض کرد سایت زنده تغییر کرده است.

## پیش‌نیازهای هر تغییر مؤثر

1. مالک عملیاتی و پنجرهٔ تغییر؛ ثبت نسخهٔ WordPress/Woo/WoodMart/child و لایسنس؛ پس از پاک‌سازی اعلام‌شدهٔ مالک، بررسی سفارش‌های تاریخی، اثر بر URL/کش و محتوای demo باقیمانده. مسیر دسترسی فقط از روش امن تیم هاست، نه paste کردن credential/API key در Git/گفتگو.
2. **بکاپ کامل** DB + `wp-content/uploads` + config/plugin/theme/runtime در فضای خارج از repo، نسخه‌گذاری و کنترل دسترسی؛ تست restore در محیط جدا. اگر سفارش واقعی/پرداخت وجود دارد، زمان قطع/ناسازگاری بکاپ و rollback تراکنش‌ها با مسئول مالی هماهنگ شود.
3. Staging محافظت‌شده با HTTP auth یا شبکهٔ محدود **به‌علاوه noindex**، داده‌های مشتری pseudonymized، درگاه sandbox، SMTP mail sink، عدم ارسال SMS واقعی و جداسازی webhook/cron از Production.
4. crawl کامل و snapshot URL/meta/schema/GSC، export کالاها/سفارش‌ها/menus/settings برای مقایسه؛ [طرح ریدایرکت](redirect-plan.md) قبل از تغییر permalink.
5. برای هر PR: فایل‌های plugin/child در Git، changelog، lint و تست واحد/ادغامی، screenshot بررسی RTL و mobile، نقشهٔ migration/restore؛ دو تأیید: فنی و مالک داده/کسب‌وکار.

## فهرست read-only پیشنهادی WP-CLI فقط با دسترسی مجاز روی Staging

```sh
wp core version
wp theme list --fields=name,status,version
wp plugin list --fields=name,status,version,update
wp option get timezone_string
wp option get woocommerce_currency
wp option get permalink_structure
```

همراه آن، Woo shipping zones/methods، gateway sandbox/production، tax، email templates، SEO plugin/sitemap، custom code/overrides، roles/backup/cache/CDN و وضعیت HPOS در Admin/گزارش امن بررسی شوند. این فرمان‌ها **اینجا اجرا نشده‌اند**. هیچ `wp db export` در root مخزن یا dump عمومی نگهداری نشود.

## ترتیب release پیشنهادی

1. مالک بخشی از پاک‌سازی demo را انجام داده؛ ابتدا وضعیت بکاپ/سفارش‌های سابق، کش و URLها بررسی شود. محتوای demoِ باقی‌مانده در خانه/تماس/ارسال و ترم‌ها فقط با بکاپ و تصمیم مالک، مرحله‌ای و قابل rollback اصلاح شود.
2. کد child/core در staging به WordPress موجود *متصل* شود؛ theme والد و plugins vendor دست‌نخورده، استقرار نسخه‌دار و DB migration idempotent/backward-compatible؛ تست بروزرسانی مجدد.
3. Import محدود کالا با dry-run/preview، validation/منبع و تایید قیمت/fitment؛ پس از آزمون sandbox محصول منتشر شود.
4. QA صفحه/SEO/کارکرد Woo/امنیت/عملکرد؛ انتشار کوچک در پنجرهٔ تغییر و مشاهدهٔ سفارش/404/error/log/CWV. اگر کارکرد cart/checkout/موجودی افت کرد، feature flag/kill switch و rollback کد با حفظ سفارش‌های ثبت‌شده (نه restore DB کور).
5. بعد از تثبیت: sitemap و GSC واقعی، 301/410های تصویب‌شده و snapshot دوباره، پایش queue/analytics با احترام به privacy.

## شرایط توقف و rollback

عدم وجود backup قابل restore، نبود محصول/فید تأییدشده، ERP ناامن در معرض شبکه، demo فروش‌پذیر بدون تصمیم، اطلاعات تماس/قوانین نادرست، خطای پرداخت sandbox، اختلاف موجودی/قیمت، افزایش 404 یا خراب‌شدن CLS/checkout. در خطای پس از deploy، فروش/واردسازی تازه را متوقف و کد/rewrite را برگردانید، **ولی سفارش‌های دریافت‌شده را با بازیابی کور DB پاک نکنید**؛ پاسخ به مشتری و reconciliation با مسئول فروش لازم است.

## Git workflow

فقط شاخهٔ ثابت این جلسه `arena/01a0d3b8-website`؛ commit مشخص، PR به `main` بعد از review؛ diff حاوی اسناد و فایل‌های سفارشی، بدون secret، فایل ZIP vendor، DB، بکاپ، فونت حجیمِ غیرلازم یا عکس نمونهٔ جعلی. Changelog در [changelog.md](changelog.md). سیستم مدیریت و مخزن برند در این جلسه خوانده شدند ولی خودِ آن مخازن تغییر نکردند.
