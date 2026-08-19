export default function robots() {
  const SITE_URL = "https://manmarket.ir";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/product/", 
          "/products", 
          "/blog/", 
          "/categories/", 
        ],
        disallow: [
          "/api/", 
          "/admin/", 
          "/dashboard/",
          "/cart", 
          "/checkout", 
          "/login", 
          "/register", 
          "/profile", 
          "/search", 
          "/*?*", 
        ],
      },
      {
        userAgent: "GPTBot", 
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
