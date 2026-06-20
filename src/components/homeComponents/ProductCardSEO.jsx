import Link from "next/link";
import ProductCardSEOClientWrapper from "./ProductCardSEOClientWrapper";

export default function ProductCardHorizontal({ product }) {
    if (!product) return null;

    return (
        <Link href={`/product/item/${product.slug}`} className="block w-full">
            <ProductCardSEOClientWrapper product={product} />
        </Link>
    );
}
