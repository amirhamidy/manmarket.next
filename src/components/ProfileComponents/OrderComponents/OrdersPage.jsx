"use client";
import React, { useState } from "react";
import OrdersTabs from "./OrdersTabs";
import OrderCard from "./OrderCard";
import "./orders.css";

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("ongoing");

    const orders = [
        {
            id: 1,
            title: "Khaki joggers",
            price: "$29.95",
            size: "M",
            color: "#5e5f3f",
            quantity: 1,
            imageSrc: "/next.svg",
        },
        {
            id: 2,
            title: "Black Carry-on Suitcase",
            price: "$22.00",
            size: "One Size",
            color: "#020202",
            quantity: 1,
            imageSrc: "/next.svg",
        },
    ];

    return (
        <div className="orders-page">
            {/* AppBar */}
            <div className="orders-appbar">
                <button className="back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#757575">
                        <path d="M18.586 10.121H5.912l4.6-4.6-1.229-1.229-6.7 6.7 6.7 6.7 1.229-1.229-4.6-4.6h12.674z" />
                    </svg>
                </button>
            </div>

            <h1 className="orders-title">My Orders</h1>

            <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="orders-list ">
                {orders.map(order => (
                    <OrderCard key={order.id} {...order} />
                ))}
            </div>
        </div>
    );
}
