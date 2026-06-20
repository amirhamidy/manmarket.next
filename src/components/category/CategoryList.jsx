"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import CategoryItem from "./CategoryItem";
import ProductCard from "@/components/product/ProductCard";

export default function CategoryList({ products }) {
    const [activeCategory, setActiveCategory] = useState(null);

    return (
        <section className="w-full max-w-[556px] mx-auto">
            {categories.map((cat, index) => (
                <div key={index}>
                    <CategoryItem
                        name={cat.name}
                        img={cat.img}
                        onClick={() =>
                            setActiveCategory(prev =>
                                prev === cat.name ? null : cat.name
                            )
                        }
                    />
                    <div
                        className={`
              overflow-hidden transition-all duration-300
              ${activeCategory === cat.name ? "max-h-[1000px] mt-3" : "max-h-0"}
            `}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {activeCategory === cat.name &&
                                products
                                    .filter(p => p.category === cat.name)
                                    .map(product => (
                                        <ProductCard key={product.slug} product={product} />
                                    ))}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
