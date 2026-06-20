"use client";

import { useState, useMemo } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductColors from "./ProductColors";
import ProductTabs from "./ProductTabs";
import ProductActions from "./ProductActions";
import { useTheme } from "@/context/ThemeContext";
import MainHeader from "@/base/mainHeader";
import ProductGalleryModal from "./ProductGalleryModal";

export default function SingleProduct({ product }) {
    const [liked, setLiked] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const [reviews, setReviews] = useState(product.reviews || []);
    const { theme } = useTheme();
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);

    const colors = product.color_inventories || [];
    const activeColorId = colors[selectedColor]?.color?.id;

    const productImages = useMemo(() => {
        if (!activeColorId)
            return product.product_images?.map(i => i.file) || [];

        const filtered = product.product_images
            ?.filter(img => img.color === activeColorId)
            .map(img => img.file);

        return filtered.length
            ? filtered
            : product.product_images?.map(i => i.file) || [];
    }, [activeColorId, product.product_images]);

    return (
        <div className="max-w-[556px] mx-auto relative flex justify-center flex-col bg-white"
            style={{ backgroundColor: theme === "dark" ? "#23262B" : "white", color: theme === "dark" ? "white" : "" }}
        >
                <MainHeader />

            <div className="sticky top-0 z-10 relative">
                <ProductGallery
                    images={productImages}
                    index={galleryIndex}
                    onChangeIndex={setGalleryIndex}
                    onOpen={() => setGalleryOpen(true)}
                    stats={{
                        sales: product.sales_count,
                        views: product.product_view,
                        rate: product.avg_rate,
                    }}
                />
            </div>

            <div className="relative z-20 bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.08)] mt-10 w-[99%] mx-auto rounded-t-4xl p-4"
                style={{ backgroundColor: theme === "dark" ? "#17181A" : "white", color: theme === "dark" ? "white" : "" }}
            >
                <ProductInfo
                    title={product.title}
                    avgRate={product.avg_rate}
                    dimensions={product.dimensions}
                />

                <ProductColors
                    colors={colors}
                    selectedColor={selectedColor}
                    onSelect={setSelectedColor}
                />

                <ProductTabs
                    description={product.description}
                    specifications={product.specifications}
                    reviews={reviews}
                    warranty={product.warranty}

                />
            </div>

            <ProductActions
                liked={liked}
                onLike={() => setLiked(!liked)}
                onAddToCart={(data) => console.log("Added to cart:", data)}
                selectedPrice={colors[selectedColor]?.price}
                onAddReview={(text) =>
                    setReviews(prev => [...prev, { description: text }])
                }
                productslug={product.id}
                colorInventoryId={colors[selectedColor]?.id}
                colorId={colors[selectedColor]?.color?.id}
            />

            <ProductGalleryModal
                open={galleryOpen}
                images={productImages}
                initialIndex={galleryIndex}
                onClose={() => setGalleryOpen(false)}
                maxWidth={556}
            />
        </div>
    );
}