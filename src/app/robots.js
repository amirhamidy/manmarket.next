export default function robots() {
  const SITE_URL = "https://manmarket.ir";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/product/", // اجازه دسترسی کامل به صفحات محصول
          "/products", // اجازه دسترسی به آرشیو محصولات
          "/blog/", // اگر بلاگ داری
          "/categories/", // اگر دسته‌بندی داری
        ],
        disallow: [
          "/api/", // مسیرهای API داخلی (اگر داری)
          "/admin/", // پنل ادمین
          "/dashboard/", // پنل کاربری
          "/cart", // سبد خرید (ارزش سئو ندارد)
          "/checkout", // صفحه پرداخت
          "/login", // ورود
          "/register", // ثبت‌نام
          "/profile", // پروفایل کاربری
          "/search", // نتایج جستجو (معمولاً برای جلوگیری از صفحات تکراری مسدود می‌شود)
          "/*?*", // مسدود کردن تمام URLهایی که Query Parameter دارند (جلوگیری از محتوای تکراری فیلترها)
        ],
      },
      {
        userAgent: "GPTBot", // محدود کردن بات‌های هوش مصنوعی اگر نمی‌خواهی محتوات رو بردارند (اختیاری)
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
