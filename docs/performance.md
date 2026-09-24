# عملکرد و Core Web Vitals — برنامهٔ اندازه‌گیری

**نتیجهٔ فعلی ممیزی:** هنوز هیچ اندازهٔ معتبر LCP/INP/CLS، TTFB، requests یا page weight ثبت نشده و به HTML خام/هدرهای cache/CDN دسترسی نداشتیم. [صفحهٔ خانه در REST](https://ghatehresan.ir/wp-json/wp/v2/pages/14?_fields=id,slug,content.rendered) نشانهٔ اسلایدر Elementor/WoodMart و حداقل ارتفاع 460px دارد؛ [محصول نمونه](https://ghatehresan.ir/product/canon-i-sensys-lbp722cdw/) دارای گالری حجیم و تصاویر دمویی است. **این نشانه‌ها علت اثبات‌شدهٔ کندی نیستند.** فروشندهٔ [WoodMart](https://www.rtl-theme.com/woodmart/) ادعای سرعت دارد، اما benchmark نصب قطعه‌رسان محسوب نمی‌شود.

## Baseline قبل از هر optimization

| URL نمونهٔ واقعی پس از import | دستگاه/شبکه | تاریخ/نسخه | LCP lab | INP field | CLS | TTFB | وزن/requests | وضعیت |
|---|---|---|---|---|---|---|---|---|
| home / category / product simple / variable / cart / checkout (sandbox) | موبایل 4G شبیه‌سازی‌شده و Desktop | — | — | — | — | — | — | منتظر Staging/داده |

- برای Lighthouse هر صفحه حداقل ۳ اجرای هم‌شرایط (cold/warm cache جدا)، میانه و گزارش waterfall/trace؛ checkout و account بدون cache عمومی. INP از Lighthouse سنتی قابل نتیجه‌گیری مستقیم نیست؛ اگر CrUX/GSC/RUM با حجم کافی وجود دارد field p75 را ثبت کنید و از TBT تنها به‌عنوان proxy آزمایشگاهی نام ببرید.
- هدف پیشنهادی تجربهٔ خوب در field p75: **LCP ≤2.5s، INP ≤200ms، CLS ≤0.1**؛ baseline و گزارش قبل/بعدِ یک شرایط لازم است، نه ادعای رسیدن به این اهداف اکنون. برای کاربران ایران، شبکهٔ واقعی و دستگاه متوسط را هم لحاظ کنید.
- version و وضعیت Elementor/Plus، cache plugin/CDN/Redis/PHP OPcache، محل عکس و فونت، تداخل API/JS، دسترسی log/DB slow query را از مدیر/هاست بگیرید؛ هیچ‌کدام از public API قابل نتیجه‌گیری نیستند.

## ترتیب آزمایش کم‌ریسک

1. **محتوا/تصویر:** بنرهای demo و ویجت‌های بلااستفاده بعد از بکاپ و بازطراحی حذف؛ برای hero LCP مسیر foreground/image مناسب و preload *تنها در صورت اثبات LCP بودن*؛ تصویر متناسب با viewport، width/height/aspect-ratio و فشرده‌سازی WebP/AVIF با fallback. اولین تصویر محصول و hero را کورکورانه lazy-load نکنید؛ تصاویر زیر fold را lazy-load کنید.
2. **فونت/لوگو:** Vazirmatn self-host از دارایی مجاز، فقط وزن‌های لازم، preload یک/دو فایل حیاتی با تست، `font-display` بدون CLS محسوس؛ SVG لوگو متکی به `@import` Google Font است، نسخهٔ outline/بدون import بسازید و تایید برند بگیرید. فونت‌های WoodMart/Elementor موازی را پس از شناسایی حذف، نه با `!important` کور.
3. **CSS/JS:** اندازه‌گیری اسلایدر 460px، third-party scripts و widgets WoodMart/Elementor؛ defer/delay فقط برای اسکریپت غیرحیاتی و پس از تست جست‌وجو/منو/variant/cart/checkout، critical CSS در صورت سود اثبات‌شده. تداخل combine/minify و AJAX را در چند مرورگر آزمایش کنید.
4. **Server/Cache:** page cache برای صفحات عمومی با invalidation قیمت/موجودی، **عدم cache خصوصی** cart/checkout/account/API شخصی؛ object cache فقط بعد از آزمون پایداری و invalidation، CDN با header/cookie صحیح و حفاظت تصویر؛ DB indexes بر پایهٔ query واقعی و backup قبل از تغییر.
5. **دوباره‌اندازه‌گیری:** همان URL/محتوا/بریک‌پوینت/شبکه، ثبت tradeoff و rollback اگر CLS/خطای پرداخت/جست‌وجو بدتر شد. عدد اقتصادی مثل کاهش request هم بدون قبل/بعد در گزارش نوشته نشود.

## آزمون رگرسیون ویژهٔ فروشگاه

جست‌وجوی فارسی/OEM و autocomplete، انتخاب خودرو و فیلتر، gallery/zoom، تغییر variant و قیمت، sticky add-to-cart موبایل، counter سبد و mini cart، coupon، session ورود، shipping calculator، callback gateway sandbox، email و admin product update. cache نباید قیمت/موجودیِ مشتری دیگر یا اطلاعات شخصی را نشان دهد؛ product feed و schema با قیمت UI همخوان بمانند.
