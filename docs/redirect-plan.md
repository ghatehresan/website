# نقشهٔ محافظت از URLها — قبل از هر حذف/تغییر permalink

**وضعیت:** inventory زیر از API عمومی در ۲۴ سپتامبر ۲۰۲۶ استخراج و در این سند *ثبت* شده است؛ **crawl کامل، تحلیل ورودی/بک‌لینک، نگاشت مقصد و ریدایرکت اجرا نشده‌اند.** نشانی‌های فعلی محصولات/مقالات الکترونیکی demo هستند؛ هر 301 باید به محتوای **معادل واقعی** باشد، نه به قطعات خودرو/خانه به‌زور.

## موجودی عمومیِ محصولات منتشرشده (۱۸ عدد)

منبع: [REST محصولات](https://ghatehresan.ir/wp-json/wp/v2/product?per_page=100&_fields=id,slug,title,product_brand,product_cat). Base فعلی `/product/{slug}/`؛ ثبت slugهای منتشرشده برای جلوگیری از حذف نابینا:

```text
1567 ailink-aluminium-connector
1529 amd-ryzen-5-7600x
1524 amd-ryzen-5-5600x
1519 amd-radeon-pro-w5500
1451 acer-sa100-sataiii
1408 alogic-ultra-mini-usb
1397 canon-i-sensys-lbp722cdw
1375 aoc-u32u1
1369 aoc-q24p2q
1364 aoc-cu34g2x-bk
1359 aoc-agon-ag493ucx
1312 acer-prodesigner-pe320qk
 977 apple-ipad-mini-6-wi-fi
 955 asus-tuf-gaming
 949 hp-victus-16-e0174nw
 939 microsoft-surface-laptop-studio
 920 apple-macbook-pro-13-m2
 835 apple-macbook-pro-16%e2%80%b3-m1-pro
```

**احتیاط:** متن عنوان و slug محصول demo حتی با هم ناسازگارند؛ URLِ منبع را از export و crawl نهایی عیناً بگیرید، نه از تبدیل دلخواهِ این جدول. [REST دسته‌ها](https://ghatehresan.ir/wp-json/wp/v2/product_cat?per_page=100&_fields=id,slug,name,parent,count) ده‌ها مسیر `megaelectronic_*` از جمله والد/فرزند و دستهٔ خالی دارد؛ این سند همهٔ archive/pagination/صفحه‌های query آنها را پوشش نمی‌دهد.

## سایر URLهای مهم برای export

- [نوشته‌های منتشرشده](https://ghatehresan.ir/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,link,categories): `/best-gaming-laptop-models/`, `/how-to-choose-a-hi-fi-stereo-system/`, `/logitech-pop-keys/`, `/cameras-for-street-photography/`, `/3-minimalist-desk-setups/`؛ دسته‌های بلاگ demo نیز export شوند.
- [۱۹ برگهٔ منتشرشده](https://ghatehresan.ir/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,link,parent,template): `/`, `/shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/blog/`, `/wishlist/`, `/compare/`, `/our-contacts/`, `/delivery-return-2/`, `/apple-shopping-event/`, `/alameda-store/`, `/emeryville-store/`, `/valencia-store/`, `/broadway-store/`, `/outlet/`, `/stores/`, `/promotions/`, برگهٔ نمونهٔ فارسی. این فهرست فقط public pages است؛ private/drafts/attachments/old redirects ثبت نشده‌اند.
- دامنه با/بی `www` و پروتکل HTTP/HTTPS، trailing slash، feeds، media attachment، pagination و URLهای Woo query/فیلتر نیز با crawler read-only و خروجی Server/GSC بررسی شوند؛ از `add-to-cart` GET برای crawl استفاده **نکنید** چون side effect دارد.

## روش انجام در staging

1. بکاپ DB و فایل + تست restore؛ export محصولات/ترم‌ها/برگه‌ها با ID، post status و permalink، sitemap و Search Console/analytics/بک‌لینک، server logs (بدون PII در Git).
2. crawl کنترل‌شدهٔ URLهای indexable و لینک‌دار با user agent مشخص؛ ثبت HTTP status، canonical، meta robots، links و redirect فعلی؛ inventory را با API عمومی بالا تطبیق دهید. robots و cache را در تحلیل لحاظ کنید.
3. برای هر URL تصمیم مستند: **keep** (همان محتوا)، **301** فقط به جایگزین معنایی واقعی، **410/404** برای demo بدون معادل پس از ارزیابی ترافیک/لینک، یا **hold** وقتی اطلاعات کافی نیست. برای حذف فهرست محصولات demo، سفارش‌های قبلی و لینک‌های مشتری باید پیش از تصمیم بررسی شوند.
4. ماتریس بازبینی: `old_url, post_id, type, traffic_90d, backlinks, intended_status, new_url_if_equivalent, rationale, approved_by, staging_http_test, production_http_test`. مقادیر واقعی یا PII را در مخزن عمومی commit نکنید؛ نسخهٔ امن/خلاصه در PR کافی است.
5. پیاده‌سازی ریدایرکت در یک لایهٔ قابل نگهداری، بدون chain/loop، تست URL رمزگذاری‌شدهٔ فارسی/لاتین و query stripping؛ پس از انتشار crawl مجدد، پایش 404/GSC و rollback.

**هیچ 301/410 در مرحلهٔ اول اجرا نشده است.** هر تغییری در `/product/`, `/product-category/`, پایهٔ برند یا single blog قبل از پایان این plan ممنوع است.
