"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "@/components/homeComponents/ProductCard";
import Navbar from "@/base/navbar";
import { useTheme } from "@/context/ThemeContext";

const BASE_URL = "https://api.manmarket.ir/product/v1";
const MEDIA_URL = "https://api.manmarket.ir";
const MEGA_MENU_URL = "https://api.manmarket.ir/product/v1/mega-menu/";
const PAGE_SIZE = 20;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};

const getImageUrl = (path) => {
  if (!path || path === "") return null;
  if (path.startsWith("http")) return path;
  return `${MEDIA_URL}${path}`;
};

const getSortParam = (option) => {
  switch (option) {
    case "most_expensive": return "-min_price";
    case "cheapest": return "min_price";
    case "most_popular": return "-avg_rate";
    default: return null;
  }
};

export default function CategoryBrandPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname?.split("/") ?? [];
  const categorySlug = segments[2] || "phone";
  const brandSlug = segments[3] || null;

  const [megaMenu, setMegaMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showUnavailable, setShowUnavailable] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);

  const fetchIdRef = useRef(0);

  const sortOptions = [
    { value: "default", label: "پیش فرض" },
    { value: "most_expensive", label: "گران‌ترین" },
    { value: "cheapest", label: "ارزان‌ترین" },
    { value: "most_popular", label: "محبوب‌ترین" },
  ];

  const getProductPrice = useCallback(
    (product) =>
      Number(product?.min_discounted_price ?? product?.min_price ?? 0) || 0,
    []
  );

  const isProductUnavailable = useCallback(
    (product) => getProductPrice(product) === 0,
    [getProductPrice]
  );

  const categories = useMemo(() => {
    const seen = new Set();
    return megaMenu
      .map((item) => item.category)
      .filter((cat) => {
        if (seen.has(cat.slug)) return false;
        seen.add(cat.slug);
        return true;
      });
  }, [megaMenu]);

  const filteredBrands = useMemo(() => {
    if (!selectedCategory) return [];
    return megaMenu
      .filter(
        (item) =>
          item.category.slug === selectedCategory.slug &&
          item.brand.image !== null &&
          item.brand.image !== ""
      )
      .map((item) => item.brand);
  }, [megaMenu, selectedCategory]);

  useEffect(() => {
    AOS.init({ duration: 400, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(MEGA_MENU_URL);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setMegaMenu(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMegaMenu([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    const found = categories.find((c) => c.slug === categorySlug);
    setSelectedCategory(found ?? categories[0]);
  }, [categories, categorySlug]);

  useEffect(() => {
    if (!selectedCategory) return;
    if (brandSlug && filteredBrands.length > 0) {
      const found = filteredBrands.find((b) => b.slug === brandSlug);
      setSelectedBrand(found ?? null);
      if (!found) router.push(`/category/${selectedCategory.slug}`);
    } else {
      setSelectedBrand(null);
    }
  }, [filteredBrands, brandSlug, selectedCategory, router]);

  const fetchPage = useCallback(async (page, catSlug, brSlug, sortOpt) => {
    if (!catSlug) return;
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    try {
      let url = `${BASE_URL}/product/?category=${catSlug}&page=${page}&page_size=${PAGE_SIZE}`;
      if (brSlug) url += `&brand=${brSlug}`;
      const sortParam = getSortParam(sortOpt);
      if (sortParam) url += `&ordering=${sortParam}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (fetchId !== fetchIdRef.current) return;

      const results = Array.isArray(data) ? data : (data?.results ?? []);
      const pages = typeof data?.total_pages === "number" ? data.total_pages : 0;
      const count = data?.total_objects ?? data?.count ?? results.length;

      setProducts(results);
      setTotalCount(count);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch {
      if (fetchId === fetchIdRef.current) {
        setProducts([]);
        setTotalCount(0);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
        setCategoryLoading(false);
        setBrandLoading(false);
        setSortLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    setProducts([]);
    setTotalCount(0);
    setTotalPages(0);
    setCurrentPage(1);
    fetchPage(1, selectedCategory.slug, selectedBrand?.slug ?? null, sortOption);
  }, [selectedCategory?.slug, selectedBrand?.slug, sortOption, fetchPage]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    const available = [];
    const unavailable = [];
    products.forEach((product) => {
      const price = getProductPrice(product);
      if (price > 0) {
        available.push(product);
      } else {
        unavailable.push(product);
      }
    });
    const result = showUnavailable ? [...available, ...unavailable] : available;
    const seen = new Set();
    return result.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products, showUnavailable, getProductPrice]);

  const handlePageChange = (page) => {
    if (page === currentPage || loading || !selectedCategory) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPage(page, selectedCategory.slug, selectedBrand?.slug ?? null, sortOption);
  };

  const handleCategorySelect = (cat) => {
    if (cat.slug === selectedCategory?.slug) { closeModal(); return; }
    setCategoryLoading(true);
    setSelectedCategory(cat);
    setSelectedBrand(null);
    closeModal();
    router.push(`/category/${cat.slug}`);
  };

  const handleBrandSelect = (brand) => {
    if (brand?.slug === selectedBrand?.slug) { closeModal(); return; }
    setBrandLoading(true);
    setSelectedBrand(brand);
    closeModal();
    if (brand) router.push(`/category/${selectedCategory?.slug}/${brand.slug}`);
  };

  const handleClearBrand = () => {
    setBrandLoading(true);
    setSelectedBrand(null);
    closeModal();
    router.push(`/category/${selectedCategory?.slug}`);
  };

  const handleSortSelect = (option) => {
    if (option === sortOption) { closeModal(); return; }
    setSortLoading(true);
    setSortOption(option);
    closeModal();
  };

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setModalType(null); };

  const isDark = theme === "dark";
  const isAnyFilterLoading = categoryLoading || brandLoading || sortLoading || loading;

  const paginationPages = useMemo(() => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const getModalContent = () => {
    switch (modalType) {
      case "category":
        return (
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => {
              const imgUrl = getImageUrl(cat.image);
              return (
                <motion.button
                  key={cat.slug}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${
                    selectedCategory?.slug === cat.slug ? "opacity-100" : "opacity-45 hover:opacity-60"
                  }`}
                >
                  {imgUrl ? (
                    <img src={imgUrl} className="w-20 h-20 object-contain" alt="" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  )}
                  <span className="text-[10px]">{cat.title}</span>
                </motion.button>
              );
            })}
          </div>
        );

      case "brand":
        return (
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClearBrand}
              className={`flex items-center justify-center py-3 px-2 rounded-2xl text-[11px] font-medium transition-opacity duration-200 ${
                !selectedBrand ? "opacity-100" : "opacity-35 hover:opacity-60"
              }`}
            >
              همه برندها
            </motion.button>
            {filteredBrands.map((brand) => {
              const imgUrl = getImageUrl(brand.image);
              return (
                <motion.button
                  key={brand.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBrandSelect(brand)}
                  className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${
                    brand.slug === selectedBrand?.slug ? "opacity-100" : "opacity-40 hover:opacity-60"
                  }`}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      className={`w-9 h-9 object-contain ${isDark ? "brightness-0 invert" : ""}`}
                      alt=""
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                  )}
                  <span className="text-[10px] font-medium">{brand.title}</span>
                </motion.button>
              );
            })}
          </div>
        );

      case "sort":
        return (
          <div className="flex flex-col gap-1.5">
            {sortOptions.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSortSelect(option.value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  sortOption === option.value
                    ? `${isDark ? "bg-white/10" : "bg-black/5"} text-[#ff7643]`
                    : `${isDark ? "text-white/70 hover:bg-white/5" : "text-gray-700 hover:bg-black/[0.03]"}`
                }`}
              >
                <span>{option.label}</span>
                {sortOption === option.value && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff7643" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main
      dir="rtl"
      className={`w-full min-h-screen flex flex-col pb-24 items-center transition-colors duration-500 ${
        isDark ? "bg-[#0a0a0a] text-white/90" : "bg-[#fafafa] text-gray-900"
      }`}
    >
      <div className="w-full max-w-[556px] px-4 mt-8 sticky top-4 z-40">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("category")}
            className="px-3 py-2.5 rounded-xl text-[11px] font-medium flex items-center gap-1 whitespace-nowrap min-w-[70px] justify-center bg-[#ff7643] text-white"
          >
            {categoryLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>دسته‌بندی</span>:
                <span>{selectedCategory?.title ?? ""}</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("brand")}
            className={`px-3 py-2.5 rounded-xl text-[11px] font-medium flex items-center gap-2 whitespace-nowrap min-w-[70px] justify-center ${
              selectedBrand
                ? "bg-[#ff7643] text-white"
                : isDark
                ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
            }`}
          >
            {brandLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4L20 4" /><path d="M8 8L16 8" /><path d="M4 12L20 12" /><path d="M8 16L16 16" /><path d="M4 20L20 20" />
                </svg>
                <span>برند</span>
                {selectedBrand && <span className="text-[9px]">{selectedBrand.title}</span>}
              </>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && modalType && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
              className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30"
            />
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[480px] max-h-[65vh] overflow-y-auto hide-scrollbar rounded-3xl p-6 ${
                isDark ? "bg-[#141414]" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold">
                  {modalType === "category" && "انتخاب دسته‌بندی"}
                  {modalType === "brand" && "انتخاب برند"}
                  {modalType === "sort" && "مرتب‌سازی بر اساس"}
                </span>
                <button onClick={closeModal} className="opacity-50 text-lg">✕</button>
              </div>
              {getModalContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[556px] grid grid-cols-2 gap-3 mt-6 px-4">
        {!isAnyFilterLoading && filteredProducts.length === 0 && (
          <div className="col-span-2 text-center py-16 text-sm opacity-40 font-medium">
            محصولی یافت نشد
          </div>
        )}

        {!isAnyFilterLoading &&
          filteredProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              data-aos="fade-up"
              data-aos-delay={Math.min((index % 6) * 50, 250)}
            >
              <ProductCard
                product={product}
                theme={theme}
                isUnavailable={isProductUnavailable(product)}
              />
            </div>
          ))}

        {isAnyFilterLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-40 rounded-2xl animate-pulse ${
                isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"
              }`}
            />
          ))}
      </div>

      <AnimatePresence mode="wait">
        {!isAnyFilterLoading && totalPages > 1 && (
          <motion.div
            key={`pagination-${selectedCategory?.slug}-${selectedBrand?.slug ?? "all"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[556px] px-4 mt-8 mb-2"
          >
            <div className="flex items-center justify-center gap-1.5" dir="ltr">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  currentPage === 1
                    ? "opacity-20 cursor-not-allowed"
                    : isDark
                    ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/80"
                    : "bg-black/[0.04] hover:bg-black/[0.08] text-gray-700"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              {paginationPages.map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className={`w-9 h-9 flex items-center justify-center text-xs select-none ${
                      isDark ? "text-white/25" : "text-gray-400"
                    }`}
                  >
                    ···
                  </span>
                ) : (
                  <motion.button
                    key={`page-${page}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-200 ${
                      page === currentPage
                        ? "bg-[#ff7643] text-white shadow-[0_2px_14px_rgba(255,118,67,0.4)]"
                        : isDark
                        ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/60"
                        : "bg-black/[0.04] hover:bg-black/[0.08] text-gray-600"
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  currentPage === totalPages
                    ? "opacity-20 cursor-not-allowed"
                    : isDark
                    ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/80"
                    : "bg-black/[0.04] hover:bg-black/[0.08] text-gray-700"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>

            <p className={`text-center text-[11px] mt-3 ${isDark ? "text-white/20" : "text-gray-400"}`}>
              صفحه {currentPage} از {totalPages} — {totalCount.toLocaleString()} محصول
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
    </main>
  );
}
