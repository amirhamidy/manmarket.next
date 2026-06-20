"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckoutSectionCard from "@/components/shoppingComponent/CheckoutSectionCard";

export default function CheckoutCouponSection({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  const handleApply = () => {
    if (!coupon.trim()) {
      alert("لطفا کد تخفیف را وارد کنید.");
      return;
    }
    onSelect?.(coupon.trim());
    setOpen(false);
  };

  return (
    <>
      <CheckoutSectionCard
        title="کد تخفیف"
        actionLabel={coupon ? coupon : "افزودن کد تخفیف"}
        onAction={() => setOpen(true)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-[556px] bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[13px] font-bold mb-4 text-[#757575]">
                وارد کردن کد تخفیف
              </h3>

              <input
                type="text"
                placeholder="کد تخفیف خود را وارد کنید"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-[13px] p-3 text-right focus:outline-none focus:ring-2 focus:ring-[#ff7643]/50 transition"
              />

              <button
                onClick={handleApply}
                className="w-full mt-4 bg-[#ff7643] text-[13px] text-white py-3 rounded-xl hover:bg-[#ff7643]/90 transition"
              >
                اعمال کد
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
