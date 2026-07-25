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

const lightCategories = [
  { name: "موبایل", img: "/assets/img/mobile.svg", slug: "phone" },
  { name: "تبلت", img: "/assets/img/tablet.svg", slug: "tablet" },
  { name: "لپ تاپ", img: "/assets/img/laptop.svg", slug: "laptop" },
  { name: "مانیتور", img: "/assets/img/monitor.svg", slug: "monitor" },
  { name: "کنسول بازی", img: "/assets/img/game.svg", slug: "game-console" },
  { name: "اسپیکر", img: "/assets/img/speaker.svg", slug: "speaker" },
  {
    name: "هدفون",
    img: "/assets/img/headphone.svg",
    slug: "headset-headphones",
  },
  {
    name: "ساعت هوشمند",
    img: "/assets/img/applewatch.svg",
    slug: "smartwatch",
  },
];

const darkCategories = lightCategories.map((c) => ({
  ...c,
  img: c.img.replace("/assets/img/", "/assets/img/dark-category/"),
}));

const categoryBrandMapping = {
  phone: [
    "apple",
    "samsung",
    "xiaomi",
    "huawei",
    "honor",
    "nokia",
    "realme",
    "tecno",
    "nothing-phone",
    "htc",
    "lg",
    "motorola",
    "blackview",
    "doogee",
  ],
  tablet: ["apple", "samsung", "xiaomi", "huawei", "lenovo"],
  laptop: [
    "apple",
    "asus",
    "acer",
    "lenovo",
    "hp",
    "msi",
    "dell",
    "xiaomi",
    "huawei",
  ],
  monitor: ["asus", "acer", "lenovo", "msi", "hp", "dell"],
  "game-console": ["sony", "microsoft"],
  speaker: ["jbl", "sony", "anker", "harman-kardon", "lg"],
  "headset-headphones": ["jbl", "sony", "anker", "apple", "beats", "qcy"],
  smartwatch: ["apple", "samsung", "xiaomi", "huawei", "mibro", "haylou"],
};

const BASE_URL = "https://api.manmarket.ir/product/v1";

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

export default function CategoryBrandPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname?.split("/") ?? [];
  const categorySlug = segments[2] || "phone";
  const brandSlug = segments[3] || null;

  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      lightCategories.find((c) => c.slug === categorySlug) ??
      lightCategories[0],
  );
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [tempRange, setTempRange] = useState([0, 0]);
  const [priceInitialized, setPriceInitialized] = useState(false);
  const [priceDirty, setPriceDirty] = useState(false);

  const [showUnavailable, setShowUnavailable] = useState(true);

  const [sortOption, setSortOption] = useState("default");
  const sortOptions = [
    { value: "default", label: "پیش فرض" },
    { value: "most_expensive", label: "گران‌ترین" },
    { value: "cheapest", label: "ارزان‌ترین" },
    { value: "most_popular", label: "محبوب‌ترین" },
  ];

  const getSortParam = (option) => {
    switch (option) {
      case "most_expensive":
        return "-min_price";
      case "cheapest":
        return "min_price";
      case "most_popular":
        return "-avg_rate";
      default:
        return null;
    }
  };

  const sortProductsClient = useCallback((productsList, sortType) => {
    const sorted = [...productsList];
    switch (sortType) {
      case "most_expensive":
        return sorted.sort((a, b) => {
          const priceA = a?.min_discounted_price ?? a?.min_price ?? 0;
          const priceB = b?.min_discounted_price ?? b?.min_price ?? 0;
          return Number(priceB) - Number(priceA);
        });
      case "cheapest":
        return sorted.sort((a, b) => {
          const priceA = a?.min_discounted_price ?? a?.min_price ?? 0;
          const priceB = b?.min_discounted_price ?? b?.min_price ?? 0;
          return Number(priceA) - Number(priceB);
        });
      case "most_popular":
        return sorted.sort((a, b) => (b?.avg_rate || 0) - (a?.avg_rate || 0));
      default:
        return sorted;
    }
  }, []);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const fetchIdRef = useRef(0);
  const pageRef = useRef(1);

  const getProductPrice = useCallback((product) => {
    const value = product?.min_discounted_price ?? product?.min_price ?? 0;
    return Number(value) || 0;
  }, []);

  const isProductUnavailable = useCallback(
    (product) => {
      const price = getProductPrice(product);
      return price === 0;
    },
    [getProductPrice],
  );

  const getFilteredBrands = useCallback(() => {
    const allowedSlugs = categoryBrandMapping[selectedCategory.slug] || [];
    return allBrands.filter(
      (brand) =>
        allowedSlugs.includes(brand.slug) &&
        brand.image !== null &&
        brand.image !== "",
    );
  }, [allBrands, selectedCategory.slug]);

  const filteredBrands = getFilteredBrands();

  useEffect(() => {
    AOS.init({ duration: 400, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    const fetchAllBrands = async () => {
      try {
        const res = await fetch(`${BASE_URL}/brand/`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (cancelled) return;
        const filtered = Array.isArray(data)
          ? data.filter((b) => b?.image !== null && b?.image !== "")
          : [];
        setAllBrands(filtered);
      } catch {
        if (!cancelled) {
          setAllBrands([]);
        }
      }
    };
    fetchAllBrands();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (brandSlug && filteredBrands.length > 0) {
      const foundBrand = filteredBrands.find((b) => b.slug === brandSlug);
      setSelectedBrand(foundBrand ?? null);
      if (!foundBrand) {
        router.push(`/category/${selectedCategory.slug}`);
      }
    } else {
      setSelectedBrand(null);
    }
  }, [filteredBrands, brandSlug, selectedCategory.slug, router]);

  const fetchProducts = useCallback(
    async (catSlug, brSlug, nextPage, sortOpt = sortOption) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      try {
        let url = `${BASE_URL}/product/?category=${catSlug}&page=${nextPage}`;
        if (brSlug) url += `&brand=${brSlug}`;

        const sortParam = getSortParam(sortOpt);
        if (sortParam) {
          url += `&ordering=${sortParam}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (fetchId !== fetchIdRef.current) return;
        const results = Array.isArray(data) ? data : (data?.results ?? []);
        const nextLink = Array.isArray(data)
          ? null
          : (data?.links?.next ?? null);

        const sortedResults = sortProductsClient(results, sortOpt);

        setProducts((prev) =>
          nextPage === 1
            ? sortedResults
            : [
                ...prev,
                ...sortedResults.filter(
                  (p) => !prev.some((e) => e.id === p.id),
                ),
              ],
        );
        pageRef.current = nextPage;
        setHasMore(Boolean(nextLink));
      } catch {
        if (fetchId === fetchIdRef.current) setHasMore(false);
      } finally {
        if (fetchId === fetchIdRef.current) setLoading(false);
      }
    },
    [sortOption, sortProductsClient],
  );

  useEffect(() => {
    setProducts([]);
    pageRef.current = 1;
    setHasMore(false);
    setPriceRange([0, 0]);
    setTempRange([0, 0]);
    setPriceInitialized(false);
    setPriceDirty(false);
    fetchProducts(
      selectedCategory.slug,
      selectedBrand?.slug ?? null,
      1,
      sortOption,
    );
  }, [selectedCategory.slug, selectedBrand?.slug, sortOption, fetchProducts]);

  useEffect(() => {
    if (!loaderRef.current) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts(
            selectedCategory.slug,
            selectedBrand?.slug ?? null,
            pageRef.current + 1,
            sortOption,
          );
        }
      },
      { threshold: 0.5 },
    );
    observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [
    hasMore,
    loading,
    selectedCategory.slug,
    selectedBrand?.slug,
    sortOption,
    fetchProducts,
  ]);

  const dynamicMaxPrice = useMemo(() => {
    const validProducts = products.filter((p) => getProductPrice(p) > 0);
    if (!validProducts.length) return 0;
    return validProducts.reduce((max, product) => {
      const price = getProductPrice(product);
      return price > max ? price : max;
    }, 0);
  }, [products, getProductPrice]);

  useEffect(() => {
    if (!products.length || dynamicMaxPrice <= 0) return;
    if (!priceInitialized) {
      setPriceRange([0, dynamicMaxPrice]);
      setTempRange([0, dynamicMaxPrice]);
      setPriceInitialized(true);
      return;
    }
    if (!priceDirty) {
      setPriceRange([0, dynamicMaxPrice]);
      setTempRange([0, dynamicMaxPrice]);
    }
  }, [products.length, dynamicMaxPrice, priceInitialized, priceDirty]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    const available = [];
    const unavailable = [];

    products.forEach((product) => {
      const price = getProductPrice(product);
      if (price > 0) {
        if (price >= priceRange[0] && price <= priceRange[1]) {
          available.push(product);
        }
      } else {
        unavailable.push(product);
      }
    });

    let result = showUnavailable ? [...available, ...unavailable] : available;

    const uniqueProducts = [];
    const seenIds = new Set();

    result.forEach((product) => {
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id);
        uniqueProducts.push(product);
      }
    });

    return sortProductsClient(uniqueProducts, sortOption);
  }, [
    products,
    priceRange,
    showUnavailable,
    getProductPrice,
    sortOption,
    sortProductsClient,
  ]);

  const handleCategorySelect = (cat) => {
    if (cat.slug === selectedCategory.slug) {
      setIsModalOpen(false);
      setModalType(null);
      return;
    }
    setSelectedCategory(cat);
    setSelectedBrand(null);
    setIsModalOpen(false);
    setModalType(null);
    router.push(`/category/${cat.slug}`);
  };

  const handleBrandSelect = (brand) => {
    if (brand?.slug === selectedBrand?.slug) {
      setIsModalOpen(false);
      setModalType(null);
      return;
    }
    setSelectedBrand(brand);
    setIsModalOpen(false);
    setModalType(null);
    if (brand) {
      router.push(`/category/${selectedCategory.slug}/${brand.slug}`);
    }
  };

  const handleClearBrand = () => {
    setSelectedBrand(null);
    setIsModalOpen(false);
    setModalType(null);
    router.push(`/category/${selectedCategory.slug}`);
  };

  const handlePriceThumb = (index, val) => {
    const max = dynamicMaxPrice || 0;
    const next = [...tempRange];
    const value = Number(val);
    if (index === 0) {
      next[0] = Math.min(value, Math.max(0, next[1] - 1));
    } else {
      next[1] = Math.max(value, Math.min(max, next[0] + 1));
    }
    setTempRange(next);
  };

  const handleSortSelect = (option) => {
    if (option === sortOption) {
      setIsModalOpen(false);
      setModalType(null);
      return;
    }
    setSortOption(option);
    setIsModalOpen(false);
    setModalType(null);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const categories = theme === "dark" ? darkCategories : lightCategories;
  const isDark = theme === "dark";

  const getModalContent = () => {
    switch (modalType) {
      case "category":
        return (
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(cat)}
                className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${
                  selectedCategory.slug === cat.slug
                    ? "opacity-100"
                    : "opacity-45 hover:opacity-60"
                }`}
              >
                <img src={cat.img} className="w-20 h-20" alt="" />
                <span className="text-[10px]">{cat.name}</span>
              </motion.button>
            ))}
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
            {filteredBrands.map((brand) => (
              <motion.button
                key={brand.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBrandSelect(brand)}
                className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${
                  brand.slug === selectedBrand?.slug
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-60"
                }`}
              >
                <img
                  src={brand.image}
                  className={`w-9 h-9 object-contain ${isDark ? "brightness invert" : ""}`}
                  alt=""
                />
                <span className="text-[10px] font-medium">{brand.name}</span>
              </motion.button>
            ))}
          </div>
        );

      case "price":
        return (
          <div>
            <div className="relative w-full h-1.5 mb-10 flex items-center">
              <div
                className={`absolute w-full h-full rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`}
              />
              <div
                className="absolute h-full bg-[#ff7643] rounded-full"
                style={{
                  right:
                    dynamicMaxPrice > 0
                      ? `${(tempRange[0] / dynamicMaxPrice) * 100}%`
                      : "0%",
                  left:
                    dynamicMaxPrice > 0
                      ? `${100 - (tempRange[1] / dynamicMaxPrice) * 100}%`
                      : "0%",
                }}
              />
              <input
                type="range"
                min="0"
                max={dynamicMaxPrice || 0}
                value={tempRange[0]}
                onChange={(e) => handlePriceThumb(0, e.target.value)}
                className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ff7643]"
              />
              <input
                type="range"
                min="0"
                max={dynamicMaxPrice || 0}
                value={tempRange[1]}
                onChange={(e) => handlePriceThumb(1, e.target.value)}
                className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ff7643]"
              />
            </div>
            <div className="flex gap-4 mb-8">
              <div
                className={`flex-1 p-3 rounded-xl text-center ${isDark ? "bg-white/5" : "bg-black/5"}`}
              >
                <div className="text-[9px] opacity-40">از</div>
                <div className="text-xs font-bold">
                  {tempRange[0].toLocaleString()}
                </div>
              </div>
              <div
                className={`flex-1 p-3 rounded-xl text-center ${isDark ? "bg-white/5" : "bg-black/5"}`}
              >
                <div className="text-[9px] opacity-40">تا</div>
                <div className="text-xs font-bold">
                  {tempRange[1].toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setPriceRange(tempRange);
                setPriceDirty(true);
                closeModal();
              }}
              className="w-full h-12 bg-[#ff7643] text-white rounded-2xl text-xs font-bold"
            >
              اعمال فیلتر
            </button>
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
                    : `${isDark ? "text-white/70 hover:bg-white/5" : "text-gray-700 hover:bg-black/3"}`
                }`}
              >
                <span>{option.label}</span>
                {sortOption === option.value && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff7643"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
      <div className="w-full max-w-[556px] px-4 mt-8 sticky top-4 z-40 overflow-hidden">
        <Swiper
          modules={[Mousewheel, FreeMode]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          mousewheel={{
            forceToAxis: true,
          }}
          className="!overflow-visible"
          dir="rtl"
        >
          <SwiperSlide className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal("category")}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                true
                  ? "bg-[#ff7643] text-white "
                  : isDark
                    ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>دسته‌بندی</span>:
              <span className=" ">{selectedCategory.name}</span>
            </motion.button>
          </SwiperSlide>

          <SwiperSlide className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal("brand")}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                selectedBrand
                  ? "bg-[#ff7643] text-white "
                  : isDark
                    ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4L20 4" />
                <path d="M8 8L16 8" />
                <path d="M4 12L20 12" />
                <path d="M8 16L16 16" />
                <path d="M4 20L20 20" />
              </svg>
              <span>برند</span>
              <span className="text-[9px] ">
                {selectedBrand ? selectedBrand.name : ""}
              </span>
            </motion.button>
          </SwiperSlide>

          <SwiperSlide className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal("price")}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                priceDirty
                  ? "bg-[#ff7643] text-white "
                  : isDark
                    ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" />
                <line x1="10" y1="8" x2="14" y2="8" />
                <line x1="18" y1="16" x2="22" y2="16" />
              </svg>
              <span>قیمت</span>
              {priceDirty && (
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </motion.button>
          </SwiperSlide>

          <SwiperSlide className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal("sort")}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                sortOption !== "default"
                  ? "bg-[#ff7643] text-white "
                  : isDark
                    ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="3" x2="12" y2="21" />
                <polyline points="8 17 12 21 16 17" />
                <polyline points="6 7 10 3 14 3 18 7" />
              </svg>
              <span>مرتب‌سازی</span>:
              <span className="">
                {sortOptions.find((s) => s.value === sortOption)?.label}
              </span>
            </motion.button>
          </SwiperSlide>

          <SwiperSlide className="!w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUnavailable((prev) => !prev)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                !showUnavailable
                  ? "bg-[#ff7643] text-white"
                  : isDark
                    ? "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                {!showUnavailable && (
                  <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2.5" />
                )}
              </svg>
              <span>{showUnavailable ? "نمایش همه" : "فقط موجود"}</span>
            </motion.button>
          </SwiperSlide>
        </Swiper>
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
                  {modalType === "price" && "فیلتر قیمت"}
                  {modalType === "sort" && "مرتب‌سازی بر اساس"}
                </span>
                <button onClick={closeModal} className="opacity-50 text-lg">
                  ✕
                </button>
              </div>
              {getModalContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[556px] grid grid-cols-2 gap-3 mt-6 px-4">
        {!loading && filteredProducts.length === 0 && (
          <div className="col-span-2 text-center py-16 text-sm opacity-40 font-medium">
            محصولی یافت نشد
          </div>
        )}

        {filteredProducts.map((product, index) => (
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

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-40 rounded-2xl animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}
            />
          ))}

        <div ref={loaderRef} className="col-span-2 h-1" />
      </div>

      <Navbar />
    </main>
  );
}
