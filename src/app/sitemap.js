export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://manmarket.ir";
const API_URL = "https://api.manmarket.ir/product/v1/product/";

async function fetchPage(page) {
  const url = `${API_URL}?page=${page}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Page ${page} failed: ${res.status} - ${text.slice(0, 300)}`,
    );
  }

  const data = await res.json();

  console.log(`Fetched page ${page}`);
  console.log(`Page ${page} total_pages:`, data?.total_pages);
  console.log(
    `Page ${page} results count:`,
    Array.isArray(data?.results) ? data.results.length : 0,
  );

  return data;
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const firstData = await fetchPage(1);

    const totalPages = Number(firstData?.total_pages || 1);
    const allProducts = Array.isArray(firstData?.results)
      ? [...firstData.results]
      : [];

    console.log("SITEMAP totalPages:", totalPages);
    console.log("SITEMAP first page products:", allProducts.length);

    for (let page = 2; page <= totalPages; page++) {
      try {
        const pageData = await fetchPage(page);
        const pageProducts = Array.isArray(pageData?.results)
          ? pageData.results
          : [];

        allProducts.push(...pageProducts);

        console.log(
          `SITEMAP accumulated after page ${page}:`,
          allProducts.length,
        );
      } catch (pageError) {
        console.error(`SITEMAP skipped page ${page}:`, pageError);
      }
    }

    const productEntries = allProducts
      .filter((product) => product?.slug)
      .map((product) => ({
        url: `${SITE_URL}/product/${encodeURIComponent(product.slug)}`,
        lastModified: product?.updated_date
          ? new Date(product.updated_date)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    console.log("SITEMAP final product count:", productEntries.length);

    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error("SITEMAP fatal error:", error);
    return staticEntries;
  }
}
