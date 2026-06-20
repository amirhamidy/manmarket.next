"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import CheckoutSectionCard from "@/components/shoppingComponent/CheckoutSectionCard";
import AddressModal from "../ProfileComponents/address/AddressModal";

export default function CheckoutAddressSection({ onSelect }) {
  const { api, accessToken } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchAddresses = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await api.get(
        "https://api.manmarket.ir/dashboard/v1/user/address/",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setAddresses(res.data?.results || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken, api]);

  const handleSelect = (addr) => {
    setSelected(addr);
    setOpen(false);
    setShowAll(false);
    onSelect?.(addr.id);
  };

  const handleAddSuccess = () => {
    fetchAddresses();
  };

  const handleClose = () => {
    setOpen(false);
    setShowAll(false);
  };

  const displayedAddresses = showAll ? addresses : addresses.slice(0, 3);

  return (
    <>
      <CheckoutSectionCard
        title={
          selected
            ? `تحویل گیرنده: ${selected.name}`
            : "ارسال به آدرس انتخاب شده"
        }
        actionLabel={selected ? "تغییر آدرس" : "انتخاب آدرس"}
        onAction={() => setOpen(true)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-full max-w-[556px] bg-white rounded-t-3xl p-4"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] text-[#757575]">
                  انتخاب آدرس
                </h3>
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="text-[13px] text-[#ff7643] hover:underline"
                >
                  افزودن آدرس
                </button>
              </div>

              {loading ? (
                <div className="text-center py-10 text-[14px] text-gray-400">
                  در حال دریافت آدرس‌ها...
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10 text-[14px] text-gray-400">
                  آدرسی ثبت نشده
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {displayedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => handleSelect(addr)}
                        className="w-full text-right rounded-2xl border border-gray-200 p-4 hover:border-[#ff7643] transition"
                      >
                        <p className="text-[#ff7643] font-bold text-[14px]">
                          {addr.name}
                        </p>
                        <p className="text-[13px] text-gray-600">
                          {addr.state}، {addr.city}
                        </p>
                        <p className="text-[12px] text-gray-500 line-clamp-2">
                          {addr.address}
                        </p>
                      </button>
                    ))}
                  </div>

                  {addresses.length > 3 && !showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="mt-4 w-full py-3 rounded-xl text-[14px] text-[#ff7643] hover:bg-gray-100"
                    >
                      دیدن همه موارد
                    </button>
                  )}

                  {addresses.length > 3 && showAll && (
                    <button
                      onClick={() => setShowAll(false)}
                      className="mt-4 w-full py-3 rounded-xl text-[14px] text-[#ff7643] hover:bg-gray-100"
                    >
                      دیدن کمتر
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddressModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}
