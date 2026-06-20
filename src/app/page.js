import HomePageClientWrapper from "../components/homeComponents/HomePageClientWrapper";

export const metadata = {
  title: "Man Market - فروشگاه آنلاین موبایل و گجت",
  description:
    "Man Market فروشگاه آنلاین موبایل، تبلت، لپ‌تاپ، مانیتور، کنسول بازی و لوازم جانبی با بهترین کیفیت و ارسال سریع.",
  openGraph: {
    title: "Man Market - فروشگاه آنلاین",
    description:
      "خرید آنلاین موبایل، لپ‌تاپ، تبلت و گجت‌ها با بهترین قیمت در Man Market",
    images: ["/assets/img/og-image.png"],
  },
};

export async function getCategories() {
  const lightCategories = [
    { name: "موبایل", img: "/assets/img/mobile.svg", slug: "phone" },
    { name: "تبلت", img: "/assets/img/tablet.svg", slug: "tablet" },
    { name: "لپ تاپ", img: "/assets/img/laptop.svg", slug: "laptop" },
    { name: "مانیتور", img: "/assets/img/monitor.svg", slug: "monitor" },
    { name: "کنسول بازی", img: "/assets/img/game.svg", slug: "game" },
    { name: "اسپیکر", img: "/assets/img/speaker.svg", slug: "speaker" },
    { name: "هدفون", img: "/assets/img/headphone.svg", slug: "headphone" },
    { name: "ساعت هوشمند", img: "/assets/img/applewatch.svg", slug: "smartwatch" },
    { name: "گجت خانگی", img: "/assets/img/gajet.svg", slug: "home-gadget" },
    { name: "پاور بانک", img: "/assets/img/powerbank.svg", slug: "powerbank" },
    { name: "هارد و فلش", img: "/assets/img/memory.svg", slug: "memory" },
    { name: "موس و کیبورد", img: "/assets/img/mouse.svg", slug: "mouse-keyboard" },
    { name: "شارژر و مبدل", img: "/assets/img/charger.svg", slug: "charger" },
    { name: "قاب و گلس", img: "/assets/img/framer.svg", slug: "frame-glass" },
    { name: "کامپیوتر", img: "/assets/img/PCAll.svg", slug: "computer" },
  ];

  const darkCategories = lightCategories.map((cat) => ({
    ...cat,
    img: cat.img.replace("/assets/img/", "/assets/img/dark-category/"),
  }));

  return { lightCategories, darkCategories };
}

const PRODUCT_LIST_API = "https://api.manmarket.ir/product/v1/product/";
const BLOG_API = "https://api.manmarket.ir/blog/v1/post/";

export async function fetchProductDetail(absoluteUrl) {
  if (!absoluteUrl) return null;

  try {
    const res = await fetch(absoluteUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.brief_title || "";
  } catch (e) {
    return "";
  }
}

export async function enrichProductsWithBriefTitle(arr) {
  if (!Array.isArray(arr)) return [];

  const enriched = await Promise.all(
    arr
      .filter((p) => p && typeof p === "object")
      .map(async (p) => {
        const { absolute_url, ...rest } = p;
        const briefTitle = await fetchProductDetail(absolute_url);
        return { ...rest, englishName: briefTitle };
      })
  );

  return enriched;
}

async function fetchProductsPage(page = 1) {
  const url = page === 1 ? PRODUCT_LIST_API : `${PRODUCT_LIST_API}?page=${page}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch products page=${page}`);
  return res.json();
}

async function fetchBlogs() {
  try {
    const res = await fetch(BLOG_API, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.results) ? data.results.slice(0, 5) : [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const categories =
    (await getCategories()) ?? { lightCategories: [], darkCategories: [] };

  const safeCategories = {
    lightCategories: Array.isArray(categories.lightCategories) ? categories.lightCategories : [],
    darkCategories: Array.isArray(categories.darkCategories) ? categories.darkCategories : [],
  };

  const need = 14;
  const N = 3;
  const pages = Array.from({ length: N }, (_, i) => i + 1);

  const [pageData, blogs] = await Promise.all([
    Promise.all(
      pages.map((p) =>
        fetchProductsPage(p).catch(() => ({ results: [], total_pages: 1 }))
      )
    ),
    fetchBlogs(),
  ]);

  const allResults = pageData
    .flatMap((d) => (Array.isArray(d?.results) ? d.results : []))
    .slice(0, need);

  const newProducts = await enrichProductsWithBriefTitle(allResults.slice(0, 5));
  const seoProducts = await enrichProductsWithBriefTitle(allResults.slice(5, 9));
  const seoProductsV3 = await enrichProductsWithBriefTitle(allResults.slice(9, 14));

  return (
    <HomePageClientWrapper
      categories={safeCategories}
      newProducts={Array.isArray(newProducts) ? newProducts : []}
      seoProducts={Array.isArray(seoProducts) ? seoProducts : []}
      seoProductsV3={Array.isArray(seoProductsV3) ? seoProductsV3 : []}
      blogs={blogs}
    />
  );
}
