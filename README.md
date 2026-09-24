# وب‌سایت قطعه‌رسان — GhatehResan

این مخزن در حال حاضر **فقط مستندات مرحلهٔ ۱ (Audit/Architecture)** را نگه می‌دارد. در commit اولیه تنها همین README وجود داشت؛ کد WordPress، WoodMart، child theme، plugin، دیتابیس و محتوای تولیدی در این مخزن موجود نیستند. تغییرات این مخزن **روی سایت زنده نصب نشده‌اند**.

## گزارش اصلی

**[گزارش مرحلهٔ اول: ممیزی A–T، شواهد، ریسک‌ها، مالکیت داده و نقشهٔ راه](docs/phase-1-audit.md)**

| حوزه | سند |
|---|---|
| مرز سیستم‌ها و تصمیم‌های توسعه | [architecture.md](docs/architecture.md) |
| توکن‌ها، فونت، RTL، موبایل و دسترس‌پذیری | [design-system.md](docs/design-system.md) |
| دسته‌بندی محصول و Import | [taxonomy.md](docs/taxonomy.md) |
| خودرو و Fitment | [vehicles.md](docs/vehicles.md) |
| برند سازندهٔ قطعه | [brands.md](docs/brands.md) |
| WooCommerce و آزمون‌های خرید | [woo-commerce.md](docs/woo-commerce.md) |
| معماری SEO | [seo.md](docs/seo.md) |
| موجودی اولیهٔ URL و شرط ریدایرکت | [redirect-plan.md](docs/redirect-plan.md) |
| قرارداد احتمالی اتصال مدیریت | [integrations.md](docs/integrations.md) |
| Performance و Core Web Vitals | [performance.md](docs/performance.md) |
| Security و حفاظت داده | [security.md](docs/security.md) |
| Staging، backup و rollback | [deployment.md](docs/deployment.md) |
| تاریخچهٔ این مرحله | [changelog.md](docs/changelog.md) |

**منابع رسمی بررسی‌شده:** [سایت عمومی](https://ghatehresan.ir/)، [WoodMart راست‌چین](https://www.rtl-theme.com/woodmart/)، [بستهٔ برند](https://github.com/ghatehresan/brand-ghatehresan)، [بستهٔ سامانهٔ مدیریت](https://github.com/ghatehresan/ghatehresan-management-system). commit/روش/محدودیت شواهد در گزارش آمده است.

> پیش از هر توسعهٔ Production: بکاپِ آزمایش‌شده + staging امن + کاتالوگ/قیمت/سازگاری واقعی + تصمیم مالک داده و اعتبار ادعاهای تماس/ارسال/ضمانت. فایل‌های demo سایت و داده‌های seed نمونهٔ این دو بسته، اطلاعات واقعی کالا نیستند. رمز، کلید API، بکاپ و اطلاعات مشتری در این repo یا گفتگو قرار نگیرند.
