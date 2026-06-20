"use client";
import React from "react";

export default function OrderItem({ title, size, color, quantity, price, imageSrc }) {
    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md mb-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200">
                <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-gray-700 font-medium">{title}</h3>
                <p className="text-gray-400 text-xs">Size: {size}</p>
                <p className="text-gray-400 text-xs">Color: {color}</p>
                <p className="text-gray-400 text-xs">Quantity: {quantity}</p>
            </div>

            <div className="text-orange-500 font-semibold">{price}</div>
        </div>
    );
}
