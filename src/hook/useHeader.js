"use client";

import { usePathname, useRouter } from "next/navigation";

const titleMap = {
  "/search": "لیست محصول",
  "/category": "دسته بندی",
  "/calculator":"ماشین حساب وام" ,
  "/filter": "فیلتر",
  "/moreitem/contactpage": "ارتباط با ما",
  "/moreitem/about": " درباره ما ",
  "/moreitem/rules": "قوانین و مقررات",
  "/moreitem/target": "اهداف و تهدات ما",
  "/moreitem/faq": "سوالات متداول",
  "/blog": "بلاگ ها",
  "/moreitem": "جزئیات",
  "/shopping": "فرآیند خرید",
  "/profile": "پروفایل من",
  "/profile/address": "آدرس",
  "/profile/chats": "گفتگو ها",
  "/profile/cart": "سبد خرید",
  "/profile/notifications": "اعلانات",
  "/profile/details": "مشخصات",
  "/profile/rating": "نظرات",
  "/profile/wallet": "کیف پول",
  "/profile/order": "سفارش ها",
  "/profile/favorites": "سبک من",
};

export function useHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const getTitle = () => {
    if (pathname.startsWith("/blog/")) {
      return "جزئیات بلاگ";
    }
    if (pathname.startsWith("/product/item/")) {
      return "جزئیات محصول";
    }
    if (titleMap[pathname]) return titleMap[pathname];

    if (pathname.startsWith("/orders/")) {
      return "جزئیات سفارش";
    }

    return "";
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return {
    title: getTitle(),
    onBack: handleBack,
  };
}
