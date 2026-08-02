"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import PriceIcon from "../icons/priceIcon";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useLike } from "@/hook/useLike";

function ReviewToast({ message, show, onClose, theme }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999999999999999] w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
            theme === "dark"
              ? "bg-[#1e1f22] text-white border border-[#ff7643]/30"
              : "bg-[#ff7643] text-white"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
  stock,
  loading,
}) {
  return (
    <div className="flex items-center justify-between bg-[#f0f0f0] dark:bg-[#2c2f35] rounded-full px-2 py-0.5 min-w-[90px] h-12 flex-shrink-0">
      <button
        onClick={onIncrease}
        disabled={quantity >= stock || loading}
        className="w-8 h-8 rounded-full bg-[#FF7643] flex items-center justify-center disabled:opacity-30"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path
              d="M12 5v14M5 12h14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <span className="text-[#FF7643] text-[13px] font-medium min-w-[24px] text-center">
        {quantity}
      </span>

      {quantity === 1 ? (
        <button
          onClick={onDelete}
          disabled={loading}
          className="w-8 h-8 rounded-full border border-[#EF5350] flex items-center justify-center disabled:opacity-30"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#EF5350] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                d="M6 7h12M9 7v12M15 7v12M8 4h8"
                stroke="#EF5350"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      ) : (
        <button
          onClick={onDecrease}
          disabled={quantity <= 1 || loading}
          className="w-8 h-8 rounded-full border border-[#FF7643] flex items-center justify-center disabled:opacity-30"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#FF7643] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                d="M5 12h14"
                stroke="#FF7643"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

function ViewCartButton({ price, discountPercent, quantity }) {
  const formatPrice = (p) =>
    p
      ? Math.round(p)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "0";

  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? price - (price * discountPercent) / 100
    : price;

  return (
    <a
      href="/profile/cart"
      className="flex-1 h-12 flex flex-col items-center justify-center rounded-full bg-[#ff7643] text-white font-semibold"
    >
      <span className="text-[13px]">مشاهده در سبد خرید</span>
      <span className="flex items-center gap-1 text-[11px] opacity-90">
        {formatPrice(discountedPrice * quantity)}
        <span className="flex items-center">
          <PriceIcon />
        </span>
      </span>
    </a>
  );
}

function AddToCartButton({ price, discountPercent, onClick, loading }) {
  const formatPrice = (p) =>
    p
      ? Math.round(p)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "0";

  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? price - (price * discountPercent) / 100
    : price;

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 h-12 flex flex-col justify-center items-center rounded-full bg-[#ff7643] text-white font-semibold disabled:opacity-70"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {hasDiscount && (
            <span className="flex items-center gap-0.5 text-[13px] opacity-75 line-through">
              {formatPrice(price)}
              <PriceIcon />
            </span>
          )}
          <span className="flex items-center gap-1 text-[13px]">
            {formatPrice(discountedPrice)}
            <span className="flex items-center">
              <PriceIcon />
            </span>
            {hasDiscount && (
              <span className="bg-white/20 text-white text-[13px] px-1.5 py-0.5 rounded-full font-bold">
                {discountPercent}٪
              </span>
            )}
          </span>
        </>
      )}
    </button>
  );
}

export default function ProductActions({
  productslug,
  onAddReview,
  cartState,
  onAddToCart,
  onIncrease,
  onDecrease,
  onDelete,
  selectedPrice,
  discountPercent,
  stock,
}) {
  const { theme } = useTheme();
  const { api, accessToken } = useAuth();
  const {
    liked: likedState,
    loading: likeLoading,
    toggle,
  } = useLike(productslug);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleReviewOpen = () => {
    if (!accessToken) {
      triggerToast("برای ارسال نظر باید ورود / ثبت‌ نام کنید");
      return;
    }
    setIsReviewOpen(true);
  };

  const handleLike = () => {
    if (!accessToken) {
      triggerToast("برای علاقه‌مندی باید ورود / ثبت‌نام کنید");
      return;
    }
    toggle();
  };

  const handleAddToCart = () => {
    if (!accessToken) {
      triggerToast("برای افزودن به سبد خرید باید ورود / ثبت‌نام کنید");
      return;
    }
    onAddToCart?.();
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    try {
      const res = await api.post("https://api.manmarket.ir/review/v1/review/", {
        product: Number(productslug),
        description: reviewText.trim(),
        rate: 5,
      });
      if (res.status >= 200 && res.status < 300) {
        onAddReview?.(reviewText);
        setReviewText("");
        setIsReviewOpen(false);
        triggerToast("نظر شما با موفقیت ثبت شد");
      } else {
        triggerToast("خطا در ثبت نظر");
      }
    } catch (error) {
      console.error("REVIEW ERROR:", error?.response?.data);
      triggerToast("خطا در ثبت نظر، دوباره تلاش کنید");
    }
  };

  const isInCart = cartState?.stage === "added";
  const isOutOfStock = !selectedPrice || selectedPrice <= 0 || stock === 0;
  const isLoading = cartState?.loading || false;

  return (
    <>
      <ReviewToast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        theme={theme}
      />

      <AnimatePresence>
        {isReviewOpen && (
          <motion.div
            className="fixed inset-0 z-[9999999999] flex items-center justify-center"
            style={{
              backgroundColor:
                theme === "dark" ? "rgba(23,24,26,0.95)" : "rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsReviewOpen(false)}
          >
            <motion.div
              className="w-[90%] max-w-md rounded-xl p-6"
              style={{
                backgroundColor: theme === "dark" ? "#17181A" : "white",
              }}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className={`mb-4 text-[16px] ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                ثبت نظر شما
              </h3>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="نظر خود را بنویسید..."
                className={`w-full p-3 rounded-lg resize-none outline-none border ${
                  theme === "dark"
                    ? "bg-[#17181A] border-gray-700 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-200 text-black placeholder:text-gray-500"
                }`}
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsReviewOpen(false)}
                  className={`px-4 py-2 rounded-md text-[13px] ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  لغو
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewText.trim()}
                  className="px-4 py-2 rounded-md bg-[#ff7643] text-white text-[13px] disabled:opacity-40"
                >
                  ارسال
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        dir="rtl"
        className="sticky bottom-0 z-[999999] p-3 flex gap-2 items-center"
        style={{ backgroundColor: theme === "dark" ? "#17181A" : "white" }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleReviewOpen}
          className="w-10 h-10 rounded-xl bg-[#ff7643] flex items-center justify-center flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill={theme === "dark" ? "#17181A" : "white"}
              fillRule="evenodd"
              d="M9.5 4c-3.268 0-6 2.419-6 5.5c0 1.222.435 2.347 1.162 3.255l-.644 2.363a.504.504 0 0 0 .674.593l2.8-1.166a.5.5 0 0 0-.385-.923l-1.856.773l.445-1.63a.5.5 0 0 0-.108-.463C4.903 11.528 4.5 10.555 4.5 9.5c0-2.441 2.193-4.5 5-4.5c2.31 0 4.21 1.398 4.805 3.253c-3.18.094-5.805 2.477-5.805 5.497c0 3.081 2.732 5.5 6 5.5a6.5 6.5 0 0 0 2.192-.378l2.616 1.09c.376.156.782-.2.674-.594l-.644-2.363A5.18 5.18 0 0 0 20.5 13.75c0-2.807-2.267-5.064-5.142-5.444C14.758 5.814 12.335 4 9.5 4"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLike}
          className="w-10 h-10 rounded-xl bg-[#ff7643] flex items-center justify-center flex-shrink-0"
        >
          {likeLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : likedState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157A4.773,4.773,0,0,0,3.444,11.2l6.583,6.583L16.611,11.2A4.729,4.729,0,0,0,16.609,4.444Z"
                transform="translate(1.973 1.164)"
                fill="#ff4400"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157A4.773,4.773,0,0,0,3.444,11.2l6.583,6.583L16.611,11.2A4.729,4.729,0,0,0,16.609,4.444Z"
                transform="translate(1.973 1.164)"
                fill={theme === "dark" ? "#17181A" : "white"}
              />
            </svg>
          )}
        </motion.button>

        <div className="flex-1 flex gap-2 items-center">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full h-12 flex justify-center items-center rounded-full bg-[#ff7643] text-white text-[13px] font-semibold opacity-70 cursor-not-allowed"
            >
              ناموجود
            </button>
          ) : isInCart ? (
            <>
              <QuantitySelector
                quantity={cartState.quantity}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onDelete={onDelete}
                stock={stock}
                loading={isLoading}
              />
              <ViewCartButton
                price={selectedPrice}
                discountPercent={discountPercent}
                quantity={cartState.quantity}
              />
            </>
          ) : (
            <AddToCartButton
              price={selectedPrice}
              discountPercent={discountPercent}
              onClick={handleAddToCart}
              loading={isLoading}
            />
          )}
        </div>
      </section>
    </>
  );
}
