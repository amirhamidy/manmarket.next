"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckoutSectionCard from "@/components/shoppingComponent/CheckoutSectionCard";

export default function CheckoutShippingSection({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 1, label: "ارسال با پست عادی" },
    { id: 2, label: "ارسال با ماهکس" },
    { id: 3, label: "ارسال با تیپاکس" },
    { id: 4, label: "مراجعه حضوری" },
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option.id);
  };

  return (
    <>
      <CheckoutSectionCard
        title={selected ? `نوع ارسال: ${selected.label}` : "نوع ارسال"}
        actionLabel={selected ? "تغییر" : "انتخاب نوع ارسال"}
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
              className="w-full max-w-[556px] bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[13px] font-bold mb-4 text-[#757575]">
                انتخاب نوع ارسال
              </h3>

              <div className="space-y-3">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-right rounded-2xl border p-4 transition ${
                      selected?.id === opt.id
                        ? "border-[#ff7643] bg-[#ff7643]/10"
                        : "border-gray-200 hover:border-[#ff7643]"
                    }`}
                  >
                    <p className="text-[#ff7643] font-bold text-[13px]">
                      {opt.label}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
