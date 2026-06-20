import SingleProduct from "@/components/SingleProduct";
import { notFound } from "next/navigation";

async function getProduct(productslug) {
    const res = await fetch(`https://api.manmarket.ir/product/v1/product/${productslug}/`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function SingleProductPage({ params }) {
    const resolvedParams = await params; 
    const productslug = resolvedParams.productslug;

    const product = await getProduct(productslug);
    if (!product) return notFound();

    return (
        <>
            <SingleProduct product={product} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        name: product.title,
                        image: [product.image, ...(product.product_images?.map(img => img.file) || [])],
                        description: product.brief_title || product.description,
                        sku: product.slug.toString(),
                        brand: {
                            "@type": "Brand",
                            name: product.brand?.title || "",
                        },
                        category: product.category?.title || "",
                        offers: product.color_inventories?.map(color => ({
                            "@type": "Offer",
                            url: `https://api.manmarket.ir/product/item/${product.slug}/`,
                            priceCurrency: "IRR",
                            price: color.price,
                            availability: color.stock > 0
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            validFrom: product.created_date,
                            itemCondition: "https://schema.org/NewCondition",
                            seller: {
                                "@type": "Organization",
                                name: "ManMarket",
                            },
                        })),
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: product.avg_rate || 0,
                            reviewCount: product.reviews?.length || 0,
                        },
                    }),
                }}
            />
        </>
    );
}
