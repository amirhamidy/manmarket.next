"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import FloatingField from "../FloatingField";
import { Formik, Form } from "formik";
import { useState } from "react";

export default function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) {
  const { theme } = useTheme();
  const { accessToken, api } = useAuth();
  const [useMyInfo, setUseMyInfo] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [toast, setToast] = useState("");

  const bgColor = theme === "dark" ? "#23262B" : "#ffffff";
  const closeColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  const fetchProfile = async (setFieldValue) => {
    setLoadingProfile(true);
    try {
      const { data } = await api.get(
        "https://api.manmarket.ir/accounts/v1/profile/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setFieldValue("name", `${data.first_name} ${data.last_name}`);
      setFieldValue("phone_number", data.phone_number);
    } catch {
      alert("خطا در دریافت اطلاعات پروفایل");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSubmit = async (values) => {
    if (
      !values.address ||
      !values.state ||
      !values.city ||
      values.zip_code.length !== 10
    )
      return;
    try {
      let payload = { ...values };
      if (useMyInfo) {
        const { data } = await api.get(
          "https://api.manmarket.ir/accounts/v1/profile/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        payload.name = `${data.first_name} ${data.last_name}`;
        payload.phone_number = data.phone_number;
      } else {
        if (!payload.name || !payload.phone_number) return;
        const { data } = await api.get(
          "https://api.manmarket.ir/accounts/v1/profile/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const fullName = `${data.first_name} ${data.last_name}`;
        if (
          payload.name === fullName &&
          payload.phone_number === data.phone_number
        ) {
          setToast(
            "اگر تحویل گیرنده خودتان هستید دکمه تحویل گیرنده خودم هستم را بزنید",
          );
          setTimeout(() => setToast(""), 4000);
          return;
        }
      }
      const url = initialData?.id
        ? `https://api.manmarket.ir/dashboard/v1/user/address/${initialData.id}/`
        : "https://api.manmarket.ir/dashboard/v1/user/address/";
      const request = initialData?.id ? api.patch : api.post;
      await request(url, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onSuccess();
      onClose();
    } catch {
      alert("خطا در ثبت آدرس");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90%] max-w-[480px] rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: bgColor }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={closeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="text-[16px] font-bold text-right">
              {initialData ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </h2>

            <Formik
              enableReinitialize
              initialValues={{
                name: initialData?.name || "",
                address: initialData?.address || "",
                state: initialData?.state || "",
                city: initialData?.city || "",
                zip_code: initialData?.zip_code || "",
                phone_number: initialData?.phone_number || "",
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex flex-col gap-3 relative">
                  <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useMyInfo}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        setUseMyInfo(checked);
                        if (checked) {
                          await fetchProfile(setFieldValue);
                        } else {
                          setFieldValue("name", "");
                          setFieldValue("phone_number", "");
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-[14px] text-gray-700 dark:text-gray-300">
                      تحویل گیرنده خودم هستم
                    </span>
                  </label>

                  <FloatingField
                    label="استان"
                    value={values.state}
                    onChange={(e) => setFieldValue("state", e.target.value)}
                  />
                  <FloatingField
                    label="شهر"
                    value={values.city}
                    onChange={(e) => setFieldValue("city", e.target.value)}
                  />
                  <FloatingField
                    label="آدرس"
                    value={values.address}
                    onChange={(e) => setFieldValue("address", e.target.value)}
                  />
                  <FloatingField
                    label="کد پستی"
                    type="tel"
                    inputMode="numeric"
                    value={values.zip_code}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFieldValue("zip_code", value);
                    }}
                  />

                  {!useMyInfo && (
                    <>
                      <FloatingField
                        label="نام و نام خانوادگی تحویل گیرنده"
                        value={values.name}
                        onChange={(e) => setFieldValue("name", e.target.value)}
                      />
                      <FloatingField
                        label="شماره همراه تحویل گیرنده"
                        type="tel"
                        inputMode="numeric"
                        value={values.phone_number}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFieldValue("phone_number", value);
                        }}
                      />
                    </>
                  )}

                  <button
                    type="submit"
                    className="mt-2 h-12 rounded-full bg-[#ff7643] text-white text-[14px] font-medium"
                  >
                    ذخیره
                  </button>

                  <AnimatePresence>
                    {toast && (
                      <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 26,
                        }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999999] w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${theme === "dark" ? "bg-[#1e1f22] text-white border border-[#ff7643]/30" : "bg-[#ff7643] text-white"}`}
                      >
                        {toast}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
