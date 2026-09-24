# ارزیابی امنیت و حفاظت داده — موارد مشاهده‌شده و آزمون‌های معوق

**دامنهٔ آزمایش:** فقط خواندن مخازن و صفحات/API عمومی؛ نه اسکن آسیب‌پذیری، نه آزمون نفوذ، نه دسترسی ادمین، نه تغییر Production. ریسک‌های کد سامانهٔ مدیریت، بدون شاهدِ استقرار عمومی آن، **مشروط** هستند. این سند عمداً رمز، اطلاعات شخصی، مسیر اجرایی بهره‌برداری یا نمونهٔ توکن منتشر نمی‌کند.

## اولویت واقعی

| اولویت | مشاهده | اقدام لازم |
|---|---|---|
| P0 عملیاتی (پس از اقدام مالک) | [فروشگاه عمومی](https://ghatehresan.ir/shop/) دیگر کالا نشان نمی‌دهد؛ **اما** [صفحه تماس](https://ghatehresan.ir/our-contacts/) و [سیاست ارسال](https://ghatehresan.ir/delivery-return-2/) اطلاعات/قول‌های demo نشان می‌دهند و خانه همچنان تبلیغ الکترونیک دارد | وضعیت سفارش‌های قبل از پاک‌سازی را با مالک بررسی، پس از بکاپ ادعاهای اثبات‌نشده را اصلاح/موقتاً پنهان و اگر مشتری متأثر است اطلاع‌رسانی کنید؛ ما Production را تغییر ندادیم |
| P0 **اگر سامانهٔ مدیریت شبکه‌ای است** | بستهٔ [مدیریت](https://github.com/ghatehresan/ghatehresan-management-system/blob/75b1a462f0e71cde42967f9aa28cbb603b6b8669/ghatehresan-management-system.zip)، `public/index.php` و صفحه‌ها، auth/role/authorization ندارند؛ CSRF برای POST وجود دارد ولی permission نیست؛ فایل export/backup و عملیات حذف کلی وجود دارد | فقط محیط محلی محدود/ایزوله؛ پیش از اتصال، auth/MFA یا شبکهٔ خصوصی، RBAC/permission روی *تمام* read/write/export/backup، audit log، محافظت storage و تست restore |
| P1 داده | SQLite حتی با ۰ مشتری/سفارش داخل ZIP عمومی commit شده؛ `.gitignore` درون ZIP برای فایل داخل آرشیو کار نمی‌کند | DB و backup هرگز در artifact عمومی/Git؛ سیاست خروجی anonymized، پاک‌سازی و بازبینی releaseهای آینده. دادهٔ عملیاتیِ نسخه‌های دیگر را در chat/repo نفرستید |
| P1 یکپارچگی | نبود FK/unique رابطهٔ کالا/خودرو و سفارش در مدیریت، تغییر/حذف سفارش بدون reconciliation موجودی؛ `demo_clear` به‌جای «نمونه» همهٔ operational rows را پاک می‌کند | محافظت destructive action با تفکیک demo در دیتابیس توسعه، تراکنش، unique/idempotency و گزارش اختلاف؛ این موارد blocker sync هستند |
| نامعلوم | وضعیت core/Plugin/Child، backup، XML-RPC، REST permissions، upload SVG و HTTPS headers در سایت | ممیزی read-only با WP-CLI/Admin، بررسی CVE نسخه‌ها و آزمون مجوز در staging، نه ادعای آسیب‌پذیری بدون شاهد |

## کنترل‌های مورد نیاز WordPress/Woo

- inventory نسخهٔ core/theme/child و **همهٔ افزونه‌های فعال/غیرفعال** با update policy و لایسنس معتبر؛ Elementor/WoodMart Plus/WPForms/CF7/Jetpack و امکانات بدون استفاده ارزیابی و تنها پس از تست، کاهش سطح حمله. وجود namespace در REST اثبات exploit نیست.
- حساب‌های admin/editor/shop_manager با least privilege، MFA، rate-limit ورود/OTP، password reset، session و حذف حساب/دسترسی بلااستفاده؛ از نشانی نویسندهٔ عمومی نام کاربری را صرفاً مشاهده کردیم و هیچ تست enumeration انجام نشده. XML-RPC در صورت عدم استفاده با تأیید وابستگی‌ها محدود شود؛ REST عمومی لازمهٔ Woo است، خاموش‌کردن سراسری صحیح نیست. Endpoint سفارشی با `permission_callback`, nonce برای درخواست مرورگر و auth مجزا برای service-to-service.
- روی plugin آینده: `current_user_can` و nonce (هر دو)، sanitization ورودی و escaping خروجی، PDO/`$wpdb->prepare`، CSRF/XSS/SQLi، اعتبارسنجی فایل/اندازه/MIME و sanitization SVG؛ هیچ کد محرمانه/بهای خرید/اطلاعات تأمین در browser-facing API. CSV import از formula injection، دوباره‌کاری و فایل آلوده محافظت کند.
- config/secrets بیرون Git و webroot، کلیدهای قابل چرخش و دسترسی شبکهٔ حداقلی، HTTPS/HSTS پس از بررسی TLS، cookie secure/HttpOnly/SameSite با بررسی gateway، آپلود و لاگ محافظت‌شده، CSP مرحله‌ای پس از inventory اسکریپت‌های واقعی.
- backup رمزگذاری‌شدهٔ خارج از Git/webroot با retention و آزمون restore؛ نسخهٔ مدیریت از SQLite WAL استفاده می‌کند و خروجی raw-file بدون تست consistency کافی نیست. staging دارای auth و دادهٔ شخصی pseudonymized، و gateway sandbox/mail sink است.

## امنیت حقوقی/حریم خصوصی در رابط

بررسی قوانین مرجوعی/ضمانت، تماس واقعی، consent برای analytics و حداقل‌سازی PII؛ اطلاعات مشتری و خودرو (به‌ویژه شماره فنی/پلاک در صورت آینده) در URL/لاگ/analytics خام قرار نگیرد. Schema سازمان/Review/Offer نباید ویژگی امنیت/اعتمادِ بی‌پشتوانه بسازد. افزودن payment gateway/OTP/notification بدون sandbox و DPIA/سیاست نگهداری داده ممنوع.

## دروازهٔ ارزیابی

با مجوز مالک و فقط روی staging: نسخه/پچ، سطوح دسترسی به API/backup، CSRF، XSS و SQLi در کد اختصاصی، file upload، session/OTP، چندکاربری، سفارش تکراری و restore آزمایش شوند؛ نتایج با حداقل اطلاعات لازم و کانال امن گزارش شوند. هنوز هیچ تستی را «گذرانده» ثبت نکرده‌ایم.
