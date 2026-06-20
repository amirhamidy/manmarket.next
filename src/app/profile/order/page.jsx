"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import MainHeader from "@/base/mainHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import Image from "next/image";

function OrderItemSkeleton() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#23262B" : "#ffffff";
  const pulse = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <div className="p-4 animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className={`h-4 rounded w-32 ${pulse}`} />
          <div className={`h-6 rounded-full w-20 ${pulse}`} />
        </div>
        <div className={`h-3 rounded w-24 ${pulse}`} />
        <div className={`h-20 rounded-2xl ${pulse}`} />
        <div className={`h-3 rounded w-full ${pulse}`} />
        <div className="flex justify-between items-center pt-2">
          <div className={`h-4 rounded w-28 ${pulse}`} />
          <div className={`h-8 rounded-full w-24 ${pulse}`} />
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "all", label: "همه" },
  { id: "pending-payment", label: "در انتظار پرداخت" },
  { id: "pending-confirm", label: "در انتظار تایید" },
  { id: "processing", label: "در حال پردازش" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل شده" },
  { id: "cancelled", label: "لغو شده" },
];

function OrdersTabs({ activeTab, onChange }) {
  const { theme } = useTheme();
  const activeBg = theme === "dark" ? "rgb(26, 26, 26)" : "#ededed";
  const activeText = theme === "dark" ? "text-white" : "text-[#757575]";
  const inactiveText = theme === "dark" ? "text-gray-400" : "text-[#c7c7c7]";

  return (
    <div dir="rtl" className="w-full mt-2 py-4">
      <Swiper
        slidesPerView="auto"
        spaceBetween={8}
        resistanceRatio={0}
        grabCursor
        className="px-4"
      >
        {tabs.map((tab) => (
          <SwiperSlide key={tab.id} className="!w-auto">
            <div
              onClick={() => onChange(tab.id)}
              className="relative flex justify-center items-center"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-tl-3xl rounded-tr-3xl"
                  style={{ backgroundColor: activeBg }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <button
                className={`relative z-10 px-4 py-2 text-[13px] font-medium whitespace-nowrap ${
                  activeTab === tab.id ? activeText : inactiveText
                }`}
              >
                {tab.label}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function OrderItem({ order }) {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#23262B" : "#ffffff";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const statusConfig = {
    1: { label: "در انتظار پرداخت", color: "bg-orange-500" },
    2: { label: "در انتظار تایید", color: "bg-blue-500" },
    3: { label: "در حال پردازش", color: "bg-yellow-500" },
    4: { label: "ارسال شده", color: "bg-purple-500" },
    5: { label: "تحویل شده", color: "bg-green-500" },
    6: { label: "لغو شده", color: "bg-red-500" },
  };

  const status = statusConfig[order.status] || statusConfig[1];

  return (
    <div
      className="w-full rounded-3xl overflow-hidden shadow-[0_8px_16px_rgba(0,11,36,0.04)] mb-3"
      style={{ backgroundColor: bg }}
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-[13px] font-medium ${textColor}`}>
            سفارش #{order.id}
          </span>
          <span
            className={`text-[11px] text-white px-3 py-1 rounded-full ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <div className={`text-[11px] ${subText}`}>
          {new Date(order.created_date).toLocaleDateString("fa-IR")}
        </div>

        {order.items && order.items.length > 0 && (
          <div className="space-y-2 py-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product_image || "/placeholder.png"}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[12px] font-medium truncate ${textColor}`}
                  >
                    {item.product_name}
                  </p>
                  <p className={`text-[10px] ${subText}`}>
                    تعداد: {item.quantity}
                  </p>
                </div>
                <div className={`text-[11px] font-bold ${textColor}`}>
                  {parseInt(item.price).toLocaleString("fa-IR")} تومان
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`text-[12px] ${subText}`}>
          <span className="font-medium">آدرس:</span> {order.address}
        </div>

        {order.tracking_code && (
          <div className={`text-[11px] ${subText}`}>
            کد رهگیری: {order.tracking_code}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-[13px] font-bold ${textColor}`}>
            {parseInt(order.total_price).toLocaleString("fa-IR")} تومان
          </span>
          <button className="bg-[#ff7643] hover:bg-[#ff5e2b] transition text-white px-4 py-1.5 rounded-full text-[11px]">
            جزئیات
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { theme } = useTheme();
  const { api } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/v1/user/order/");
        if (res.status >= 200 && res.status < 300) {
            console.log(res.data.results[0])
          setOrders(res.data.results || []);
          
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [api]);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          switch (activeTab) {
            case "pending-payment":
              return order.status === 1;
            case "pending-confirm":
              return order.status === 2;
            case "processing":
              return order.status === 3;
            case "shipped":
              return order.status === 4;
            case "delivered":
              return order.status === 5;
            case "cancelled":
              return order.status === 6;
            default:
              return true;
          }
        });

  return (
    <div className="flex justify-center">
      <div className="flex flex-col min-h-screen w-full max-w-[556px]">
        <MainHeader />

        <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />

        <main className="flex-1 w-full max-w-[556px] flex flex-col items-center py-5 px-4 mx-auto bg-[#ededed] dark:bg-[#1a1a1a]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <OrderItemSkeleton key={i} />
            ))
          ) : filteredOrders.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center text-center px-6 py-24 ${textColor}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="56"
                height="56"
                viewBox="0 0 16.001 15.994"
              >
                <g id="order" transform="translate(-2 -2.009)">
                  <path
                    id="Path_736"
                    data-name="Path 736"
                    d="M4.846,7.235l5.532,3.094,2.145-1.192L7.055,6.012ZM15.2,9.491v2.54l-1.6.8V10.386l-2.4,1.343,0,4.544,5.6-3.112V8.6ZM9.6,11.728,4,8.595V13.16l5.6,3.112Zm4.558-3.5,1.8-1L10.417,4.153l-1.723.953Z"
                    transform="translate(-0.4 -0.429)"
                    fill="none"
                  />
                  <path
                    id="Path_737"
                    data-name="Path 737"
                    d="M18,6.762a.768.768,0,0,0-.023-.171c-.006-.02-.017-.039-.024-.059a.838.838,0,0,0-.056-.132c-.013-.022-.03-.039-.046-.06a.792.792,0,0,0-.082-.1c-.018-.018-.042-.032-.062-.049a.813.813,0,0,0-.1-.075s-.007,0-.011,0l-.006,0L10.406,2.11a.8.8,0,0,0-.776,0L2.412,6.1a.044.044,0,0,1-.009.008l-.008,0a.862.862,0,0,0-.075.058.854.854,0,0,0-.085.066.792.792,0,0,0-.063.082.786.786,0,0,0-.063.083.761.761,0,0,0-.047.111.541.541,0,0,0-.033.08.78.78,0,0,0-.023.168C2,6.774,2,6.786,2,6.8H2v6.4a.8.8,0,0,0,.412.7L9.6,17.892h0l.016.009a.78.78,0,0,0,.108.043.654.654,0,0,0,.078.031A.81.81,0,0,0,10,18a.833.833,0,0,0,.2-.026.785.785,0,0,0,.078-.031.691.691,0,0,0,.108-.043l.016-.009h0l7.183-3.99a.8.8,0,0,0,.41-.7V6.8h0C18,6.787,18,6.776,18,6.762ZM9.978,9.9,4.447,6.806l2.21-1.223,5.468,3.124Zm.038-6.176L15.554,6.8l-1.8,1L8.294,4.677ZM3.6,8.166,9.2,11.3v4.544L3.6,12.732Zm7.2,7.677,0-4.544,2.4-1.343V12.4l1.6-.8V9.062l1.6-.9v4.564Z"
                    fill="#757575"
                  />
                </g>
              </svg>
              <h2 className="text-[18px] font-bold mt-6">سفارشی یافت نشد</h2>
              <p className="text-[13px] text-gray-500">
                در این بخش سفارشی وجود ندارد
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
