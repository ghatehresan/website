# مالکیت داده و قرارداد همگام‌سازی — فقط طرح، اتصال موجود نیست

[کد مدیریت](https://github.com/ghatehresan/ghatehresan-management-system/blob/75b1a462f0e71cde42967f9aa28cbb603b6b8669/ghatehresan-management-system.zip) مسیر صفحه‌های `?p=...` دارد، نه API احراز هویت‌شده یا webhook؛ ZIP شامل دیتابیس بدون محصول و سفارش است. اتصال مستقیم SQLite، scrape کردن صفحهٔ PHP یا کپی کل منطق ERP در وردپرس **راهکار نیست**. جدول زیر فقط زمانی فعال می‌شود که منبع کالا و مسئول عملیات تایید شده و سامانه سخت‌سازی شده باشد؛ تا آن زمان **هیچ sync اجرا نمی‌شود**. معماری پایه: [architecture.md](architecture.md).

## ماتریس تصمیم و قرارداد پیشنهادی

| Entity | مالک موقت پس از دادهٔ معتبر | مسیر در صورت تصویب ERP | تناوب/قانون تعارض |
|---|---|---|---|
| محصول/SKU/OEM | WooCommerce در launch محدود | ERP master → Woo projection | delta پس از تغییر + reconciliation روزانه؛ external ID یکتا، انتشار فقط بعد از QA |
| دسته | Woo `product_cat` | master مصوب ↔ mapping یک‌طرفه به term Woo | تغییر دستیِ slug بی‌redirect ممنوع؛ term ناموجود quarantine |
| برند تولیدکننده | Woo `product_brand` | برند مصوب → term با external ID | نام/لوگو از مرجع تایید، نه `brand` متن آزاد خودکار |
| Fitment خودرو | تیم کالای سایت با evidence | ERP فقط اگر مدل نسخه‌دار/سال/موتور معتبر ساخت | conflict→نیازمند بررسی، نه override خودکارِ fitment تاییدشده |
| قیمت فروش | Woo تا اثبات feed ERP | ERP → Woo در صورت انتقال مالکیت | event یا polling سبک؛ اعتبار قیمت/updated_at؛ stale→سیاست منع فروش/بررسی |
| موجودی | Woo on-hand خود وب؛ تأمینِ سفارش‌محور جدا | ERP ledger → availability projection | رزرو/کسر اتمیک و واگذاریِ یک مالک؛ دادهٔ کهنه «موجود» نشود |
| سفارش/پرداخت/refund آنلاین | **WooCommerce** | Woo → ERP ledger/fulfillment | بعد از تغییر وضعیت پایدار؛ کلید یکتای `source+woo_order_id+event_version` |
| مشتری/هویت | WordPress/Woo | پیش‌فرض **بدون sync هویت/SSO** | در صورت نیاز B2B قرارداد حداقلی با رضایت و RBAC مجزا |
| تأمین‌کننده/بهای خرید | سامانهٔ داخلی ایزوله پس از استقرار امن | ERP داخلی؛ Woo فقط وضعیت فروش قابل نمایش | اطلاعات داخلی هرگز به Store API/HTML منتقل نشود |
| کارکنان | خارج از حوزه | HRM آینده | هیچ کاربر مشترک/سازوکار امضای ورود فرض نشود |

اگر دیتابیس عملیاتی مدیریت برخلاف ZIP بررسی‌شده پر از داده باشد، **قبل از launch این ماتریس باز شود**: مالک Product/Price/Stock از روی کیفیت داده، تیم نویسنده و SLA تعیین می‌شود؛ «محصول را در دو جا نگه می‌داریم و بعداً حل می‌کنیم» مجاز نیست. نگاشت سفارش‌های تلفنی/آفلاین و online در ledger باید کانال و شناسهٔ جدا داشته باشد.

## حداقل قرارداد API آینده

- نسخهٔ مشخص (`v1`)، HTTPS/شبکهٔ محدود، auth سرویس-به-سرویس با دسترسی حداقلی و rotation، request validation، rate limits؛ secret در تنظیمات امن server و نه Git یا JS. مستندات OpenAPI/contract tests، endpoint سلامت بدون PII.
- محصول: `external_id` ثابت، `sku`، OEMها/aliases با منبع، brand/category IDs، fitment با evidence و state، قیمت تومان به‌صورت integer و `price_valid_until`، stock نوع on_hand/reservable/available_to_order، `updated_at` UTC و revision. دادهٔ شخصی و بهای خرید در response عمومی نباشد.
- Pagination/cursor، incremental changes با deletion/tombstone و replay، امضای پیام در webhooks در صورت نیاز؛ mapping IDs در plugin با unique index. اگر زمان سیستمی دو طرف اختلاف داشت، revision/source version مرجع باشد نه timestampِ تنها.
- سفارش: `idempotency_key` منحصر به Woo order + نوع رویداد/نسخه، Woo order_id/channel، اقلام/تعداد و snapshot قیمت، وضعیت پرداخت/حمل/مرجوعی؛ تأیید دریافت با `remote_id` و امکان lookup؛ PII صرفاً برای fulfillment لازم، encryption/retention مصوب. وضعیت سفارش از ERP هرگز paid در Woo را بی‌قاعده بازنویسی نکند.

## پردازش خطا، مشاهده‌پذیری و خاموشی

1. رویداد بعد از commit وضعیت Woo به outbox یا Action Scheduler سپرده شود؛ HTTP timeout کوتاه، retry نمایی با jitter و سقف تلاش؛ پس از سقف → dead-letter + اخطار مدیر. تا تایید دریافت، state محلی و کلید یکتا نگه‌داری شود.
2. پاسخ تکراری/رویداد out-of-order رد یا ایمن بازپخش شود؛ `upsert` keyed بر source+external ID، نه create کور. در خطای validation ردیف quarantine، هیچ نصف محصول منتشر نشود.
3. reconciliation روزانهٔ counts، revision، سفارش/موجودی/قیمت و گزارش اختلاف؛ log با correlation ID، نه تلفن/آدرس/توکن. متریک queue age، retry، خطای price/stock و duplicate؛ alert با مسئول مشخص.
4. kill switch: قطع sync، حفظ سفارش Woo و منعِ عرضهٔ قیمت/موجودی کهنه طبق سیاست؛ restore از backup و replay idempotent پس از رفع خطا.

## آزمونِ پیش از هر انتقال به Production

فید ناقص، SKU تکراری، صفر آغازین OEM، حذف محصول، تغییر برند/ترم، قطع شبکه و timeout بعد از دریافت موفق، webhook تکراری و خارج از ترتیب، برگشت وجه جزئی/کامل، ویرایش سفارش، فروش همزمان آخرین موجودی، تفاوت ریال/تومان، اختلاف time zone و DB restore. نتیجهٔ هیچ‌یک هنوز pass نیست. مایلستون اجرای این قرارداد منوط به رفع P0 امنیت مدیریت در [security.md](security.md) است.
