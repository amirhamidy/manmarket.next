"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from "@/base/mainHeader";

const categories = [
  { id: "login-register", label: "ورود و ثبت نام" },
  { id: "shipping", label: "شیوه ارسال" },
  { id: "order-process", label: "ثبت سفارش" },
  { id: "order-tracking", label: "پیگیری سفارش" },
  { id: "returns", label: "ضمانت برگشت" },
  { id: "general-faqs", label: "سوالات عمومی" },
  { id: "other", label: "سایر موارد" },
];

const faqs = [
  {
    id: "login-register",
    title: "ورود و ثبت نام",
    items: [
      {
        q: "چطور ثبت نام کنم؟",
        a: "از صفحه اصلی روی «ثبت نام» کلیک کنید، شماره موبایل را وارد کنید و کد تأیید را دریافت کنید.",
      },
      {
        q: "رمز عبورم را فراموش کرده‌ام؟",
        a: "از گزینه «فراموشی رمز» استفاده کنید. کد تأیید به شماره موبایل ثبت‌شده ارسال می‌شود.",
      },
      {
        q: "چطور اطلاعات حسابم را ویرایش کنم؟",
        a: "وارد پروفایل شوید و از بخش «ویرایش اطلاعات» اقدام کنید.",
      },
      {
        q: "آیا امکان ثبت سفارش حقوقی وجود دارد؟",
        a: "بله، با تیم پشتیبانی تماس بگیرید تا فرآیند ثبت سفارش حقوقی برایتان توضیح داده شود.",
      },
    ],
  },
  {
    id: "shipping",
    title: "شیوه‌ها و هزینه ارسال",
    items: [
      {
        q: "هزینه ارسال چقدر است؟",
        a: "ارسال عادی داخل تهران رایگان است. برای شهرستان‌ها بر اساس وزن و مقصد محاسبه می‌شود.",
      },
      {
        q: "ارسال سریع دارید؟",
        a: "بله، ارسال سریع در تهران ظرف ۴ ساعت انجام می‌شود.",
      },
      {
        q: "ارسال با ماهکس چطور است؟",
        a: "کالا را روز بعد تحویل می‌گیرید. امکان پیگیری آنلاین وجود دارد.",
      },
      {
        q: "کالای سنگین چطور ارسال می‌شود؟",
        a: "کالاهای سنگین از طریق باربری یا تیپاکس با هماهنگی قبلی ارسال می‌شوند.",
      },
    ],
  },
  {
    id: "order-process",
    title: "فرایند ثبت سفارش",
    items: [
      {
        q: "چطور سفارش بدهم؟",
        a: "محصول را انتخاب کنید، به سبد خرید اضافه کنید و مراحل پرداخت را طی کنید.",
      },
      {
        q: "آیا می‌توانم سفارشم را لغو کنم؟",
        a: "تا قبل از تأیید ارسال، از پنل کاربری می‌توانید سفارش را لغو کنید.",
      },
      {
        q: "فاکتور چطور دریافت می‌شود؟",
        a: "فاکتور رسمی بلافاصله بعد از تأیید پرداخت به ایمیل شما ارسال می‌شود.",
      },
      {
        q: "آیا امکان ادغام سفارش‌ها وجود دارد؟",
        a: "در صورت عدم پردازش، با پشتیبانی تماس بگیرید تا سفارش‌ها ادغام شوند.",
      },
    ],
  },
  {
    id: "order-tracking",
    title: "پیگیری سفارش",
    items: [
      {
        q: "چطور سفارشم را پیگیری کنم؟",
        a: "از بخش «سفارش‌های من» در پروفایل کدرهگیری را مشاهده کنید.",
      },
      {
        q: "سفارشم در فروشگاه مانده، چه کار کنم؟",
        a: "با پشتیبانی تماس بگیرید. معمولاً طی ۲۴ ساعت بررسی می‌شود.",
      },
      {
        q: "تأخیر در تأمین کالا دارم، چه کار کنم؟",
        a: "در صورت تأخیر، تیم ما با شما تماس می‌گیرد یا از طریق پروفایل وضعیت را بررسی کنید.",
      },
    ],
  },
  {
    id: "returns",
    title: "ضمانت هفت روزه برگشت وجه",
    items: [
      {
        q: "شرایط مرجوعی چیست؟",
        a: "کالا باید در بسته‌بندی اصلی و بدون استفاده باشد. ظرف ۷ روز از تحویل امکان مرجوع وجود دارد.",
      },
      {
        q: "چطور کالا را مرجوع کنم؟",
        a: "از پنل کاربری درخواست مرجوعی ثبت کنید. روش ارسال برایتان مشخص می‌شود.",
      },
      {
        q: "در شهرستان چطور مرجوع کنم؟",
        a: "از طریق پست پیشتاز ارسال کنید. هزینه ارسال پس از تأیید مرجوعی جبران می‌شود.",
      },
      {
        q: "گارانتی کالاها چگونه است؟",
        a: "تمام کالاها دارای گارانتی معتبر هستند. کارت گارانتی همراه کالا ارسال می‌شود.",
      },
    ],
  },
  {
    id: "general-faqs",
    title: "سوالات متداول عمومی",
    items: [
      {
        q: "آیا خرید اقساطی دارید؟",
        a: "بله، از طریق درگاه‌های خرید اقساطی شریک امکان‌پذیر است.",
      },
      {
        q: "آیا بیمه‌نامه دارید؟",
        a: "کالاهای انتخاب‌شده دارای بیمه حمل هستند. جزئیات در صفحه محصول قید شده است.",
      },
      {
        q: "آیا می‌توانم کارت بانکی ذخیره کنم؟",
        a: "بله، در بخش کیف پول پروفایل می‌توانید کارت اضافه کنید.",
      },
    ],
  },
  {
    id: "other",
    title: "سایر موارد",
    items: [
      {
        q: "چطور با پشتیبانی تماس بگیرم؟",
        a: "از طریق چت آنلاین، ایمیل یا شماره تماس در صفحه «ارتباط با ما» اقدام کنید.",
      },
      {
        q: "ساعات پاسخگویی چه زمانی است؟",
        a: "شنبه تا چهارشنبه ۸ تا ۲۰، پنجشنبه‌ها ۸ تا ۱۴.",
      },
    ],
  },
];



function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 w-full py-3 text-right"
      >
        <span className="text-sm text-gray-800 font-medium flex-1">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <svg
            className="w-4 h-4 text-[#ff7643]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-sm text-gray-500 pb-3 pr-1 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const tabRefs = useRef({});

  function handleTabClick(id) {
    setActiveTab(id);
    // اسکرول tab فعال به مرکز نوار
    tabRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    // اسکرول صفحه به section
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="w-full max-w-[556px] mx-auto flex flex-col min-h-screen">
      <MainHeader />

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div
          dir="rtl"
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              ref={(el) => (tabRefs.current[cat.id] = el)}
              onClick={() => handleTabClick(cat.id)}
              whileTap={{ scale: 0.93 }}
              className="relative shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: "#ff7643",
                color: activeTab === cat.id ? "#fff" : "#ff7643",
                backgroundColor:
                  activeTab === cat.id ? "#ff7643" : "transparent",
              }}
            >
              {activeTab === cat.id && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "#ff7643", zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div dir="rtl" className="flex flex-col gap-4 px-4 py-5">
        {faqs.map((section, i) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="bg-white rounded-2xl shadow-sm p-4"
          >
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span
                className="w-1 h-5 rounded-full inline-block"
                style={{ background: "#ff7643" }}
              />
              {section.title}
            </h2>
            <div>
              {section.items.map((item, j) => (
                <AccordionItem key={j} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
