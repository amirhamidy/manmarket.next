import SingleProduct from "@/components/SingleProduct";
import { notFound } from "next/navigation";

const SITE_URL = "https://manmarket.ir";

async function getProduct(productslug) {
  const res = await fetch(
    `https://api.manmarket.ir/product/v1/product/${productslug}/`,
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { productslug } = await params;
  const product = await getProduct(productslug);

  if (!product) return { title: "محصول یافت نشد" };

  const encodedUrl = `${SITE_URL}/product/${encodeURIComponent(product.slug)}`;

  return {
    title: `${product.title} | قیمت و خرید در من مارکت`,
    description: product.brief_title || product.description?.slice(0, 160),
    alternates: {
      canonical: encodedUrl,
    },
    openGraph: {
      title: product.title,
      description: product.brief_title || product.description?.slice(0, 160),
      url: encodedUrl,
      images: [
        {
          url: product.image,
          alt: product.title,
        },
      ],
      type: "website",
      siteName: "من مارکت",
      locale: "fa_IR",
    },
  };
}

export default async function SingleProductPage({ params }) {
  const { productslug } = await params;
  const product = await getProduct(productslug);

  if (!product) return notFound();

  const minPrice =
    product.color_inventories?.length > 0
      ? Math.min(...product.color_inventories.map((c) => c.price))
      : 0;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: [
      product.image,
      ...(product.product_images?.map((img) => img.file) || []),
    ],
    description: product.brief_title || product.description,
    sku: product.slug.toString(),
    brand: {
      "@type": "Brand",
      name: product.brand?.title || "ManMarket",
    },
    category: product.category?.title || "",
    offers: product.color_inventories?.map((color) => ({
      "@type": "Offer",
      url: `${SITE_URL}/product/${encodeURIComponent(product.slug)}`,
      priceCurrency: "IRR",
      price: color.price,
      availability:
        color.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      validFrom: product.created_date,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "من مارکت",
      },
    })),
    aggregateRating: product.avg_rate
      ? {
          "@type": "AggregateRating",
          ratingValue: product.avg_rate,
          reviewCount: product.reviews?.length || 1,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SingleProduct product={product} />
    </>
  );
}
