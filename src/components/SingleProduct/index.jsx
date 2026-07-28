"use client";

import { useState, useMemo, useEffect } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductColors from "./ProductColors";
import ProductTabs from "./ProductTabs";
import ProductActions from "./ProductActions";
import { useTheme } from "@/context/ThemeContext";
import MainHeader from "@/base/mainHeader";
import ProductGalleryModal from "./ProductGalleryModal";
import { useAuth } from "@/context/AuthContext";

export default function SingleProduct({ product }) {
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [reviews, setReviews] = useState(product.reviews || []);
  const { theme } = useTheme();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { api, accessToken } = useAuth();

  const colors = product.color_inventories || [];

  const [cartState, setCartState] = useState({
    stage: "preview",
    quantity: 1,
    cartItemId: null,
    loading: false,
    error: null,
  });

  // انتخاب رنگ با کمترین قیمت (به جز 0)
  useEffect(() => {
    if (colors.length > 0) {
      let minPriceIndex = 0;
      let minPrice = Infinity;
      colors.forEach((color, index) => {
        const price = color.price;
        if (price > 0 && price < minPrice) {
          minPrice = price;
          minPriceIndex = index;
        }
      });
      setSelectedColor(minPriceIndex);
    }
  }, [colors]);

  const activeColorId = colors[selectedColor]?.color?.id;
  const selectedColorInventory = colors[selectedColor];
  const stock = selectedColorInventory?.stock || 0;
  const selectedPrice = colors[selectedColor]?.price;

  // ریست کردن cartState وقتی رنگ عوض میشه
  useEffect(() => {
    setCartState({
      stage: "preview",
      quantity: 1,
      cartItemId: null,
      loading: false,
      error: null,
    });
  }, [selectedColor]);

  // چک کردن سبد خرید برای رنگ انتخاب‌شده
  useEffect(() => {
    const checkCart = async () => {
      if (
        !accessToken ||
        !product.id ||
        !activeColorId ||
        !selectedColorInventory?.id
      )
        return;

      try {
        const res = await api.get("/cart/v1/cart/");
        if (res.status >= 200 && res.status < 300) {
          const existingItem = res.data.cart_items.find(
            (item) =>
              item.product === Number(product.id) &&
              item.color_inventory === Number(selectedColorInventory.id),
          );
          if (existingItem) {
            setCartState({
              stage: "added",
              quantity: existingItem.quantity,
              cartItemId: existingItem.id,
              loading: false,
              error: null,
            });
          } else {
            setCartState((prev) => ({
              ...prev,
              stage: "preview",
              cartItemId: null,
            }));
          }
        }
      } catch (err) {
        console.error("Error checking cart", err);
      }
    };

    checkCart();
  }, [api, accessToken, product.id, activeColorId, selectedColorInventory]);

  const productImages = useMemo(() => {
    if (!activeColorId) return product.product_images?.map((i) => i.file) || [];

    const filtered = product.product_images
      ?.filter((img) => img.color === activeColorId)
      .map((img) => img.file);

    return filtered.length
      ? filtered
      : product.product_images?.map((i) => i.file) || [];
  }, [activeColorId, product.product_images]);

  const handleAddToCart = async () => {
    if (!accessToken) {
      setCartState((prev) => ({
        ...prev,
        error: "برای افزودن به سبد خرید باید ورود / ثبت نام کنید",
      }));
      return;
    }

    if (!product.id || !activeColorId || !selectedColorInventory?.id) {
      setCartState((prev) => ({
        ...prev,
        error: "لطفاً رنگ محصول را انتخاب کنید",
      }));
      return;
    }

    setCartState((prev) => ({ ...prev, loading: true, error: null }));

    const payload = {
      product: Number(product.id),
      color: Number(activeColorId),
      color_inventory: Number(selectedColorInventory.id),
      quantity: cartState.quantity,
    };

    try {
      const res = await api.post("/cart/v1/cart/add-product/", payload);
      if (res.status >= 200 && res.status < 300) {
        setCartState({
          stage: "added",
          quantity: cartState.quantity,
          cartItemId: res.data.id,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("CART ERROR:", error);
      setCartState((prev) => ({
        ...prev,
        loading: false,
        error: "خطا در افزودن به سبد خرید",
      }));
    }
  };

  const handleIncrease = async () => {
    if (cartState.quantity >= stock) return;

    const newQuantity = cartState.quantity + 1;
    setCartState((prev) => ({ ...prev, loading: true }));

    if (cartState.stage === "added" && cartState.cartItemId) {
      try {
        await api.patch(
          `/cart/v1/cart/update-product/${cartState.cartItemId}/`,
          {
            quantity: newQuantity,
          },
        );
        setCartState((prev) => ({
          ...prev,
          quantity: newQuantity,
          loading: false,
        }));
      } catch (error) {
        console.error("Error updating quantity:", error);
        setCartState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setCartState((prev) => ({
        ...prev,
        quantity: newQuantity,
        loading: false,
      }));
    }
  };

  const handleDecrease = async () => {
    if (cartState.quantity <= 1) return;

    const newQuantity = cartState.quantity - 1;
    setCartState((prev) => ({ ...prev, loading: true }));

    if (cartState.stage === "added" && cartState.cartItemId) {
      try {
        await api.patch(
          `/cart/v1/cart/update-product/${cartState.cartItemId}/`,
          {
            quantity: newQuantity,
          },
        );
        setCartState((prev) => ({
          ...prev,
          quantity: newQuantity,
          loading: false,
        }));
      } catch (error) {
        console.error("Error updating quantity:", error);
        setCartState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setCartState((prev) => ({
        ...prev,
        quantity: newQuantity,
        loading: false,
      }));
    }
  };

  const handleDelete = async () => {
    setCartState((prev) => ({ ...prev, loading: true }));

    if (cartState.stage === "added" && cartState.cartItemId) {
      try {
        await api.delete(
          `/cart/v1/cart/delete-product/${cartState.cartItemId}/`,
        );
        setCartState({
          stage: "preview",
          quantity: 1,
          cartItemId: null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        setCartState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setCartState({
        stage: "preview",
        quantity: 1,
        cartItemId: null,
        loading: false,
        error: null,
      });
    }
  };

  return (
    <div
      className="max-w-[556px] mx-auto relative flex justify-center flex-col"
      style={{
        backgroundColor: theme === "dark" ? "#23262B" : "white",
        color: theme === "dark" ? "white" : "",
      }}
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

      <div
        className="relative z-20 shadow-[0_-1px_3px_0_rgba(0,0,0,0.08)] mt-10 w-[99%] mx-auto rounded-t-4xl p-4"
        style={{
          backgroundColor: theme === "dark" ? "#17181A" : "white",
          color: theme === "dark" ? "white" : "",
        }}
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
        selectedPrice={selectedPrice}
        onAddReview={(text) =>
          setReviews((prev) => [...prev, { description: text }])
        }
        productslug={product.id}
        colorInventoryId={selectedColorInventory?.id}
        colorId={activeColorId}
        cartState={cartState}
        onAddToCart={handleAddToCart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onDelete={handleDelete}
        stock={stock}
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
