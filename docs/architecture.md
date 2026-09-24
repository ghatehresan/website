# معماری هدف و مرز سیستم‌ها — طرح مرحلهٔ ۱

**وضعیت:** مخزن `website` در commit آغازین فقط README داشت؛ هیچ WordPress/child/plugin در Git این پروژه وجود نداشت. این سند قرارداد پیشنهادی است، نه شرح یک استقرار انجام‌شده. مرجع تصمیم: [گزارش A–T](phase-1-audit.md)، [بستهٔ مدیریت](https://github.com/ghatehresan/ghatehresan-management-system/blob/75b1a462f0e71cde42967f9aa28cbb603b6b8669/ghatehresan-management-system.zip) و [بستهٔ برند](https://github.com/ghatehresan/brand-ghatehresan/blob/fe9d144e33ce2416db0b7a1469644a085d637a20/brand-ghatehresan.zip).

## واقعیت در برابر هدف

```text
اکنون (طبق نسخه‌های قابل بررسی):
Brand repo: SVG/راهنما/استراتژی + اکسل نمونه
Management: اپ PHP آفلاین بدون API؛ SQLite همراه ZIP فاقد کالای واقعی
Production WP: WoodMart + Elementor + WooCommerce با کالای demo الکترونیکی
Website Git: فاقد نصب/داده/استقرار وردپرس

پس از دادهٔ واقعی، بکاپ و staging:
Brand repository ──design contract──▶ woodmart-child (presentation)
                                      │
Verified source of products ────────▶ ghatehresan-core (business data/fitment)
                                      │
                                  WooCommerce (public catalogue/checkout/orders)
                                      │
              management integration فقط پس از API امن، مالکیت داده و SLA
```

### مرزهای مسئولیت

- **WooCommerce:** کالا و variation، قیمت/موجودیِ قابل فروش در فاز نخستِ مشروط، سبد، checkout، پرداخت، حساب مشتری و سفارش آنلاین. قیمت خرید و جزئیات تأمین‌کننده در خروجی عمومی/متای نمایشی قرار نگیرد.
- **`ghatehresan-core`** (هنوز ساخته نشده): قواعد محصول/fitment، جست‌وجوی شماره فنی، دادهٔ برند موجود، admin UX، importer، event/آمار و integration adapter در آینده. مستقل از Theme، با API نسخه‌دار و تست، فعال‌سازی در staging. تا پیش از دادهٔ واقعی، plugin صرفاً طراحی است.
- **`woodmart-child`** (هنوز ساخته نشده): template/layout/header/footer/RTL و توکن‌ها، دسترس‌پذیری، asset presentation و override محدود Woo؛ هیچ قاعدهٔ مالکیت موجودی/قیمت/سازگاری در Theme نوشته نشود. فایل‌های والد WoodMart هرگز تغییر نکنند.
- **سیستم مدیریت:** تأمین‌کننده، بهای خرید، کاردکس/گزارش و دادهٔ فروش آفلاین فقط در محیط ایزوله؛ هم‌اکنون API/auth ندارد. نباید با شبیه‌سازی API یا خواندن مستقیم SQLite تولید در WordPress دور زده شود. اگر نسخهٔ عملیاتی ERP با دادهٔ واقعی ارائه شد، مالکیت کالا/قیمت/موجودی **دوباره تصمیم‌گیری** می‌شود.
- **Brand repo:** رنگ/قلم/لوگو/لحن، نه سفارش، شماره تماس واقعی، مجوز یا کاتالوگ فروش.

## ساختار استقرار پیشنهادی (ساخته نشده)

```text
wp-content/
  themes/woodmart/                    vendor؛ خارج از توسعهٔ سفارشی
  themes/woodmart-child/              نمایش و style در Git سایت
  plugins/ghatehresan-core/           دادهٔ دامنه/هوک/ادمین/adapter در Git سایت
  uploads/                            بیرون Git، قابل پشتیبان‌گیری
```

بستهٔ خریداری‌شدهٔ vendor، لایسنس، `wp-config.php`، کلید API، فایل backup و دیتابیس در Git سایت قرار نگیرند. نحوهٔ جداسازی artifactهای کد از runtime WordPress باید با تیم هاستینگ روی staging تثبیت شود؛ این مخزن نباید شامل dump کاربران یا ZIP حاوی SQLite شود.

## مدل داده و سازگاری

- Woo `product_cat` و `product_brand` موجود را دوباره نسازید؛ مهاجرت demo نیازمند mapping/redirect است.
- خودرو: یک taxonomy کم‌عمق برای make/model (اگر در سایت موجود نبود) و رابطهٔ جداگانهٔ قابل اعتبارسنجی به‌ازای هر محصول×مدل×موتور/تیپ/سال؛ design در [vehicles.md](vehicles.md). از `products.year_engine` متن آزاد مدیریت نمی‌توان تطابق تضمینی استخراج کرد.
- شناسه‌ها: Woo ID فقط شناسهٔ داخلی است. `external_id` پایدار + سیستم صادرکننده + نقشهٔ جداگانه برای import/sync؛ SKU داخلی با OEM یکی نیست. version/last_verified برای fitment و availability؛ هیچ published product بدون source و قیمت/تأمین قابل اتکا.
- سرچ/فیلتر: موتور سادهٔ Woo + index روی کد و alias برای کاتالوگ واقعی کوچک؛ ارتقا به سرویس search فقط پس از آزمایش حجم، دقت و latency. ایندکس جست‌وجو **projection** داده است و مالک Product نیست.

## تصمیم مالکیت و شرایط تغییر

1. **امروز:** هیچ سورس واقعی محصول از منابع موجود تأیید نشد؛ Woo demo و seed مدیریت هر دو غیرقابل انتشار تخصصی‌اند.
2. **راه‌اندازی محدود:** اگر تیم عملیات تأیید کند منبع عملیاتی دیگری موجود نیست، یک فید دستی/معتبر و قابل ردیابی وارد Woo شود؛ ووکامرس تنها مرجعِ قابل ویرایشِ قیمت فروش/موجودی وب و سفارش آنلاین باشد. اگر ERP واقعی وجود دارد، این مرحله متوقف و mapping بازنگری می‌شود.
3. **ادغام احتمالی:** بعد از auth/API/revisioned records و آزمایش فشار/خطا، مالکیت فیلد مشخص به ERP منتقل می‌شود؛ تا پایان مهاجرت، برای همان فیلد **دو نویسنده مجاز نیستند**. سفارش آنلاین همچنان در Woo ایجاد می‌شود و ledger قابل تکرار به مدیریت ارسال می‌گردد.
4. **هویت:** در فاز فعلی SSO و کاربر مشترک فرض نمی‌شود. اتصال HRM/تلگرام/AI بعداً با قراردادهای جداگانه و بدون PII غیرضروری.

## قابلیت اطمینان و مرز امنیت

- ارتباط آینده فقط service-to-service از آدرس خصوصی/HTTPS با credential چرخشی/دامنهٔ محدود؛ هیچ مرورگر عمومی مستقیم به ERP یا `localhost` وصل نشود؛ client secret در frontend/گیت نیست.
- outbox/queue با idempotency، log بدون PII، retry محدود و dead-letter؛ سفارش دوباره ساخته نشود؛ در خطای قیمت/موجودی کهنه خرید به‌جای دروغ‌گویی محدود شود. [integrations.md](integrations.md).
- همهٔ تغییرات permalink/product/theme نیازمند بکاپ، crawl و rollback؛ CI بررسی PHP lint/WordPress standards و آزمون تغییر migration را پیش از deploy اجرا کند. **مقدار هدف معیارهای performance هنوز baseline ندارد.**

## خروجی مورد نیاز برای تصویب این معماری

نسخهٔ عملیاتی محصولات/قیمت/انبار یا تأیید نبود آن، وضعیت کاربران/سفارش‌های WordPress، نقش مسئول تأمین، تصمیم SKU/شناسهٔ پایدار، سیاست اعتبار قیمت و برنامهٔ بکاپ/استیج. بدون این شواهد، مستندسازی ادامه می‌یابد اما sync، import و تغییرات تولیدی شروع نمی‌شوند.
