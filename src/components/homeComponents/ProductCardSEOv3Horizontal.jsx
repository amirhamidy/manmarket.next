import ProductCardSEOv3ClientWrapper from "./ProductCardSEOv3ClientWrapper";

export default function ProductCardSEOv3Horizontal({ product }) {
    if (!product) return null;

    return <ProductCardSEOv3ClientWrapper product={product} />;
}
