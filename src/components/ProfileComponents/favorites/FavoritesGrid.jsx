"use client";

import ProductCard from "@/components/homeComponents/ProductCard";

export default function FavoritesGrid({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-3 px-4 pb-24 mt-5">
            {products.map((product, index) => (
                <ProductCard key={product.id ?? `product-${index}`} product={product} />
            ))}
        </div>
    );
}