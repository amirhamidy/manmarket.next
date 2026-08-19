"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryItem from "@/components/category/CategoryItem";
import Navbar from "@/base/navbar";

const BASE_URL = "https://api.manmarket.ir";

export default function CategoryList() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [categoryMap, setCategoryMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchMegaMenu = async () => {
      try {
        const res = await fetch(`${BASE_URL}/product/v1/mega-menu/`);
        const data = await res.json();

        const map = {};
        data.forEach((item) => {
          const cat = item.category;
          const brand = item.brand;
          if (!map[cat.slug]) {
            map[cat.slug] = {
              slug: cat.slug,
              name: cat.title,
              image: cat.image ? `${BASE_URL}${cat.image}` : null,
              brands: [],
            };
          }
          if (brand.image) {
            map[cat.slug].brands.push({
              id: brand.id,
              name: brand.title,
              slug: brand.slug,
              image: `${BASE_URL}${brand.image}`,
            });
          }
        });

        setCategories(Object.values(map));
        setCategoryMap(map);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMegaMenu();
  }, []);

  return (
    <section className="w-full max-w-[556px] mx-auto pb-16 min-h-screen">
      <CategoryHeader />
      <section className="mt-3 space-y-2 px-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-full h-14 rounded-2xl animate-pulse ${
                  isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"
                }`}
              />
            ))
          : categories.map((cat) => {
              const visibleBrands = cat.brands.slice(0, 3);
              return (
                <div key={cat.slug}>
                  <CategoryItem
                    name={cat.name}
                    img={cat.image}
                    onClick={() =>
                      setActiveCategory((p) =>
                        p === cat.slug ? null : cat.slug,
                      )
                    }
                  />
                  <AnimatePresence initial={false}>
                    {activeCategory === cat.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-4 gap-3 mt-3 mb-4">
                          {visibleBrands.map((brand) => (
                            <BrandCard
                              key={brand.id}
                              img={brand.image}
                              title={brand.name}
                              theme={theme}
                              onClick={() =>
                                router.push(
                                  `/category/${cat.slug}/${brand.slug}`,
                                )
                              }
                            />
                          ))}
                          <BrandCard
                            title="همه"
                            theme={theme}
                            isAll
                            onClick={() => router.push(`/category/${cat.slug}`)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
      </section>
      <Navbar />
    </section>
  );
}

function BrandCard({ title, img, onClick, theme, isAll }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl py-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-sm ${
        isDark ? "bg-[#141414] text-white/90" : "bg-white text-gray-900"
      }`}
    >
      {img ? (
        <img
          src={img}
          className={`w-9 h-9 object-contain ${isDark ? "brightness-0 invert" : ""}`}
          alt={title}
        />
      ) : isAll ? (
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ff7643]/10">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff7643"
            strokeWidth="2.5">
            <path d="M4 12h16m-8-8v16" />
          </svg>
        </div>
      ) : null}
      <span
        className={`text-[10px] font-bold text-center leading-tight ${isAll ? "text-[#ff7643]" : ""}`}
      >
        {title}
      </span>
    </button>
  );
}
