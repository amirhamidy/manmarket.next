"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
                    className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999999999999999] w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                    ${theme === "dark"
                        ? "bg-[#1e1f22] text-white border border-[#ff7643]/30"
                        : "bg-[#ff7643] text-white"
                    }`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default function ProductActions({
    productslug,
    colorId,
    colorInventoryId,
    onAddToCart,
    selectedPrice,
    onAddReview
}) {
    const { theme } = useTheme();
    const { api, accessToken } = useAuth();
    const { liked, loading: likeLoading, toggle } = useLike(productslug);

    const [loading, setLoading] = useState(true);
    const [priceLoading, setPriceLoading] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [openInstallment, setOpenInstallment] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const dropdownRef = useRef(null);
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        setPriceLoading(true);
        const t = setTimeout(() => setPriceLoading(false), 300);
        return () => clearTimeout(t);
    }, [productslug, colorId, colorInventoryId]);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenInstallment(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const checkInCart = async () => {
            if (!accessToken) return;
            try {
                const res = await api.get("/cart/v1/cart/");
                if (res.status >= 200 && res.status < 300) {
                    const productInCart = res.data.cart_items.some(
                        item => item.product === Number(productslug) && item.color_inventory === Number(colorInventoryId)
                    );
                    setInCart(productInCart);
                }
            } catch (err) {
                console.error("Error checking cart", err);
            }
        };
        checkInCart();
    }, [api, accessToken, productslug, colorInventoryId]);

    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAddToCart = async () => {
        if (!accessToken) {
            triggerToast("برای افزودن به سبد خرید باید ورود / ثبت نام کنید");
            return;
        }

        if (!productslug || !colorId || !colorInventoryId) {
            triggerToast("لطفاً رنگ محصول را انتخاب کنید");
            return;
        }

        setCartLoading(true);

        const payload = {
            product: Number(productslug),
            color: Number(colorId),
            color_inventory: Number(colorInventoryId),
            quantity: 1
        };

        try {
            const res = await api.post("/cart/v1/cart/add-product/", payload);

            if (res.status >= 200 && res.status < 300) {
                triggerToast("محصول با موفقیت به سبد خرید اضافه شد");
                setInCart(true);
                onAddToCart?.(payload);
            } else {
                triggerToast("خطا در افزودن به سبد خرید");
            }

        } catch (error) {
            console.error("❌ CART ERROR:", error);
            triggerToast("خطا در افزودن به سبد خرید");
        } finally {
            setCartLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!reviewText.trim()) return;
        if (!accessToken) {
            triggerToast("برای ارسال نظر باید ورود / ثبت نام کنید");
            return;
        }
        if (!productslug) {
            triggerToast("شناسه محصول معتبر نیست");
            return;
        }

        try {
            const body = {
                product: Number(productslug),
                description: reviewText.trim(),
                rate: 5
            };

            const res = await api.post("/review/v1review/", body);

            if (res.status >= 200 && res.status < 300) {
                onAddReview?.(reviewText);
                setReviewText("");
                setIsReviewOpen(false);
                triggerToast("نظر شما ثبت شد");
            } else {
                triggerToast("خطا در ثبت نظر");
            }
        } catch (error) {
            console.error(error);
            triggerToast("خطا در ثبت نظر، دوباره تلاش کنید");
        }
    };

    const handleLike = async () => {
        toggle();
    };

    return (
        <>
            {!loading && (
                <ReviewToast
                    message={toastMessage}
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    theme={theme}
                />
            )}

            <section
                dir="rtl"
                className="sticky bottom-0 z-[999999] p-3 flex gap-2 items-center"
                style={{ backgroundColor: theme === "dark" ? "#17181A" : "white" }}
            >
                {!loading && (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsReviewOpen(true)}
                            className="w-10 h-10 rounded-xl bg-[#ff7643] flex items-center justify-center"
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
                            className="w-10 h-10 rounded-xl bg-[#ff7643] flex items-center justify-center"
                        >
                            {likeLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : liked ? (
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

                        {/* <div className="relative flex-1" ref={dropdownRef}>
                            <motion.button
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setOpenInstallment((v) => !v)}
                                className="w-full h-12 rounded-full bg-[#ff7643] text-white flex justify-center items-center gap-2 text-[13px] font-semibold"
                            >
                                خرید اقساطی
                            </motion.button>

                            <AnimatePresence>
                                {openInstallment && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                                        className="absolute bottom-[110%] w-full bg-white dark:bg-[#23262b] rounded-xl shadow-md p-3 z-50"
                                    >
                                        <p className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                                            تیم ما در حال توسعه این بخش هست , از صبر و شکیبایی شما سپاسگزاریم
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div> */}

                        <motion.div whileTap={{ scale: 0.99 }} className="flex-1">
                            {cartLoading || priceLoading ? (
                                <button
                                    disabled
                                    className="w-full h-12 flex justify-center items-center rounded-full bg-[#ff7643] text-white text-[13px] font-semibold opacity-70 cursor-not-allowed"
                                >
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </button>
                            ) : inCart ? (
                                <a
                                    href="/profile/cart"
                                    className="w-full h-12 flex justify-center items-center rounded-full bg-[#ff7643] text-white text-[13px] font-semibold"
                                >
                                    مشاهده در سبد خرید
                                </a>
                            ) : Number(selectedPrice) <= 0 ? (
                                <button
                                    disabled
                                    className="w-full h-12 flex justify-center items-center rounded-full bg-[#ff7643] text-white text-[13px] font-semibold opacity-70 cursor-not-allowed"
                                >
                                    ناموجود
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full h-12 flex justify-center items-center rounded-full bg-[#ff7643] text-white text-[13px] font-semibold"
                                >
                                    <span className="flex items-center">
                                        {formatPrice(selectedPrice)}
                                        <span className="mx-1 flex items-center">
                                            <PriceIcon />
                                        </span>
                                    </span>
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </section>

            <AnimatePresence>
                {!loading && isReviewOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9999999999] flex items-center justify-center"
                        style={{ backgroundColor: theme === "dark" ? "rgba(23,24,26,0.95)" : "rgba(0,0,0,0.6)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsReviewOpen(false)}
                    >
                        <motion.div
                            className="w-[90%] max-w-md rounded-xl p-6"
                            style={{ backgroundColor: theme === "dark" ? "#17181A" : "white" }}
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 26 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className={`mb-4 text-[16px] ${theme === "dark" ? "text-white" : "text-black"}`}>
                                ثبت نظر شما
                            </h3>

                            <textarea
                                rows={4}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="نظر خود را بنویسید..."
                                className={`w-full p-3 rounded-lg resize-none outline-none border ${theme === "dark"
                                    ? "bg-[#17181A] border-gray-700 text-white placeholder:text-gray-400"
                                    : "bg-white border-gray-200 text-black placeholder:text-gray-500"
                                    }`}
                            />

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setIsReviewOpen(false)}
                                    className={`px-4 py-2 rounded-md text-[13px] ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
                                        }`}
                                >
                                    لغو
                                </button>
                                <button
                                    onClick={handleReviewSubmit}
                                    className="px-4 py-2 rounded-md bg-[#ff7643] text-white text-[13px]"
                                >
                                    ارسال
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}