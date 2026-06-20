"use client";

import Navbar from "@/base/navbar";
import { NotificationsHeader, NotificationsList } from "@/components/ProfileComponents/notifications";


export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            status: "new",
            type: "alert",
            title: "موجودی جدید!",
            date: "۲۵ دی ۱۴۰۳",
            description:
                "محصولات جدیدی به انبار اضافه شده و برخی کالاها دوباره موجود شده‌اند.",
            action: "شروع خرید",
        },
        {
            id: 2,
            status: "new",
            type: "order",
            title: "تحویل شد",
            date: "۲۲ دی ۱۴۰۳",
            description:
                "سفارش شماره ۲۳۲ تحویل داده شد. از خریدت لذت ببر و یادت نره نظر بدی.",
            action: "مشاهده سفارش‌ها",
        },
        {
            id: 3,
            status: "viewed",
            type: "alert",
            title: "امتیاز بده",
            date: "۱۵ دی ۱۴۰۳",
            description:
                "لطفاً کالاهای خریداری‌شده رو امتیازدهی کن. ممنون از همراهی‌ت ❤️",
            action: "مشاهده سفارش‌ها",
        },
        {
            id: 4,
            status: "new",
            type: "alert",
            title: "موجودی جدید!",
            date: "۲۵ دی ۱۴۰۳",
            description:
                "محصولات جدیدی به انبار اضافه شده و برخی کالاها دوباره موجود شده‌اند.",
            action: "شروع خرید",
        },
        {
            id: 5,
            status: "new",
            type: "order",
            title: "تحویل شد",
            date: "۲۲ دی ۱۴۰۳",
            description:
                "سفارش شماره ۲۳۲ تحویل داده شد. از خریدت لذت ببر و یادت نره نظر بدی.",
            action: "مشاهده سفارش‌ها",
        },
        {
            id: 6,
            status: "viewed",
            type: "alert",
            title: "امتیاز بده",
            date: "۱۵ دی ۱۴۰۳",
            description:
                "لطفاً کالاهای خریداری‌شده رو امتیازدهی کن. ممنون از همراهی‌ت ❤️",
            action: "مشاهده سفارش‌ها",
        },
        {
            id: 7,
            status: "new",
            type: "alert",
            title: "موجودی جدید!",
            date: "۲۵ دی ۱۴۰۳",
            description:
                "محصولات جدیدی به انبار اضافه شده و برخی کالاها دوباره موجود شده‌اند.",
            action: "شروع خرید",
        },
        {
            id: 8,
            status: "new",
            type: "order",
            title: "تحویل شد",
            date: "۲۲ دی ۱۴۰۳",
            description:
                "سفارش شماره ۲۳۲ تحویل داده شد. از خریدت لذت ببر و یادت نره نظر بدی.",
            action: "مشاهده سفارش‌ها",
        },
        {
            id: 9,
            status: "viewed",
            type: "alert",
            title: "امتیاز بده",
            date: "۱۵ دی ۱۴۰۳",
            description:
                "لطفاً کالاهای خریداری‌شده رو امتیازدهی کن. ممنون از همراهی‌ت ❤️",
            action: "مشاهده سفارش‌ها",
        },
    ];

    return (
        <div className="flex justify-center items-center ">
            <div className="min-h-screen max-w-[556px] w-full bg-white">
                <NotificationsHeader />
                <NotificationsList items={notifications} />
            </div>
            <Navbar />
        </div>
    );
}
