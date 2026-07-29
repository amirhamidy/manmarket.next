"use client";

import MainHeader from "@/base/mainHeader";
import Navbar from "@/base/navbar";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function BlogListPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = useMemo(() => {
    const unique = {};
    blogs.forEach((blog) => {
      if (blog.category) {
        unique[blog.category.id] = blog.category;
      }
    });
    return Object.values(unique);
  }, [blogs]);

  useEffect(() => {
    fetch("https://api.manmarket.ir/blog/v1/post/")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".blog-card")) {
        setActiveCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      let updated;

      if (prev.includes(categoryId)) {
        updated = prev.filter((id) => id !== categoryId);
      } else {
        updated = [...prev, categoryId];
      }

      if (updated.length === categories.length) {
        return [];
      }

      return updated;
    });
  };

  const filteredBlogs = useMemo(() => {
    if (selectedCategories.length === 0) {
      return blogs;
    }

    return blogs.filter(
      (blog) => blog.category && selectedCategories.includes(blog.category.id),
    );
  }, [blogs, selectedCategories]);

  return (
    <section
      className={`flex flex-col justify-center items-center pb-24 min-h-screen ${
        isDark ? "bg-[#000] text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="w-full max-w-[556px] min-h-screen mx-auto px-4">
        <MainHeader />

        {!loading && categories.length > 0 && (
          <div className="w-full mt-4 mb-6 overflow-hidden">
            <Swiper
              modules={[Mousewheel, FreeMode]}
              spaceBetween={8}
              slidesPerView="auto"
              freeMode={true}
              mousewheel={{ forceToAxis: true }}
              className="!overflow-visible"
              dir="rtl"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);

                return (
                  <SwiperSlide key={cat.id} className="!w-auto">
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap min-w-[70px] justify-center ${
                        isSelected
                          ? "bg-[#ff7643] text-white"
                          : isDark
                            ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                            : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}

                      <span>{cat.name}</span>
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`relative h-[220px] w-full rounded-3xl overflow-hidden animate-pulse ${
                  isDark ? "bg-white/5" : "bg-gray-200"
                }`}
              />
            ))
          ) : filteredBlogs.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-sm opacity-40 font-medium">
              مطلبی یافت نشد
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="blog-card relative w-full h-[220px] rounded-3xl overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();

                  setActiveCard(activeCard === blog.id ? null : blog.id);
                }}
              >
                <img
                  src={blog.image}
                  alt=""
                  className={`w-full h-full object-cover transition duration-300 ${
                    activeCard === blog.id ? "brightness-125" : ""
                  }`}
                />

                <div
                  className={`absolute inset-0 flex justify-center items-center text-center transition-opacity duration-300 ${
                    activeCard === blog.id
                      ? isDark
                        ? "bg-white/90 opacity-100"
                        : "bg-white/90 opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <span
                    className={`font-bold text-[14px] px-2 ${
                      isDark ? "text-gray-800" : "text-gray-800"
                    }`}
                  >
                    {blog.title}
                  </span>
                </div>

                {activeCard === blog.id && (
                  <Link
                    href={`/blog/${blog.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-0 right-0 w-11 h-11 rounded-tl-3xl flex justify-center items-center transition-opacity duration-300 opacity-100 ${
                      isDark ? "bg-[#ededed]" : "bg-[#ededed]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDark ? "#a3a3a3" : "gray"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Navbar />
    </section>
  );
}
