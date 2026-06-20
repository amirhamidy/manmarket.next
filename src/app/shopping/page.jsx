"use client";

import { useEffect, useState } from "react";
import CheckoutCartList from "@/components/shoppingComponent/CheckoutCartList";
import CheckoutSummary from "@/components/shoppingComponent/CheckoutSummary";
import ConfirmPayButton from "@/components/shoppingComponent/ConfirmPayButton";
import CheckoutAddressSection from "@/components/shoppingComponent/CheckoutAddressSection";
import CheckoutShippingSection from "@/components/shoppingComponent/CheckoutShippingSection";
import CheckoutCouponSection from "@/components/shoppingComponent/CheckoutCouponSection";
import SoftToast from "@/components/SoftToast";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/base/mainHeader";

function SkeletonItem() {
  return (
    <div className="w-full h-28 rounded-3xl animate-pulse bg-gray-200 mb-3" />
  );
}

export default function CheckoutPage() {
  const { api } = useAuth();

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingType, setShippingType] = useState(null);
  const [coupon, setCoupon] = useState("");

  const [toast, setToast] = useState({ show: false, message: "" });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart/v1/cart/");
        if (res.status >= 200 && res.status < 300) {
          const cartData = res.data;
          setCartItems(cartData.cart_items || []);
        }
      } catch (err) {
        console.error(err);
        showToast("خطا در بارگذاری سبد خرید");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [api]);

  const handleConfirmPay = async () => {
    if (!selectedAddressId) return showToast("لطفاً آدرس ارسال را انتخاب کنید");
    if (!shippingType) return showToast("لطفاً روش ارسال را انتخاب کنید");

    const payload = {
      address_id: selectedAddressId,
      tracking_type: shippingType,
      ...(coupon ? { coupon } : {}),
    };

    try {
      const res = await api.post("/order/v1/checkout/", payload);

      const paymentUrl = res.data?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl; // یا window.open(paymentUrl, "_blank")
        return;
      }

      showToast("سفارش ثبت شد ولی لینک پرداخت دریافت نشد");
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data?.detail || "خطا در ثبت سفارش";
      showToast(msg);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="flex justify-center w-full">
      <main
        dir="rtl"
        className="max-w-[556px] w-full flex flex-col items-center gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">سبد خرید شما خالی است</div>
        ) : (
          <>
            <div className="w-full flex justify-end items-end">
              <MainHeader />
            </div>

            <CheckoutCartList items={cartItems} />

            <CheckoutSummary total={totalPrice} />

            <CheckoutAddressSection onSelect={setSelectedAddressId} />

            <CheckoutShippingSection onSelect={setShippingType} />

            <CheckoutCouponSection onSelect={setCoupon} />

            <ConfirmPayButton onClick={handleConfirmPay} />
          </>
        )}
      </main>

      {/* Toast */}
      <SoftToast show={toast.show} message={toast.message} />
    </div>
  );
}
