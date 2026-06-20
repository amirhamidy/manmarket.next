"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/base/fooer";
import Header from "@/base/header";
import Navbar from "@/base/navbar";
import AdBanner from "@/components/homeComponents/AdBanner";
import BannerCard from "@/components/homeComponents/banner/BannerCard";
import BannerSwiper from "@/components/homeComponents/banner/BannerSwiper";
import CategoryCarousel from "@/components/homeComponents/category";
import ProductCard from "@/components/homeComponents/ProductCard";
import SearchInputBar from "@/components/homeComponents/search";
import RightIcon from "@/components/icons/rightIcon";
import { useTheme } from "@/context/ThemeContext";
import BlogCard from "../blog/BlogCard";
import Link from "next/link";
import BaseSwiper from "./BaseSwiper";

export default function HomePageClientWrapper({ categories, newProducts, seoProducts, seoProductsV3, blogs }) {
    const { theme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisitedWelcome");
        if (!hasVisited) router.replace("/welcome");
    }, []);

    return (
        <main className={`w-full min-h-screen pb-14 flex flex-col items-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="w-full max-w-[556px] flex flex-col">
                <Header />
            </div>

            <div className="w-full max-w-[556px] flex flex-col mt-2">
                <SearchInputBar />
                <div className="flex justify-center max-w-[556px] flex-col w-full">
                    <CategoryCarousel
                        lightCategories={categories.lightCategories}
                        darkCategories={categories.darkCategories}
                    />
                </div>
                <div className="w-full max-w-[556px] mx-auto mt-4">
                    <BannerSwiper>
                        <BannerCard src="/assets/img/swiper-slide-1.png" />
                        <BannerCard src="/assets/img/swiper-slide-2.png" />
                        <BannerCard src="/assets/img/swiper-slide-3.png" />
                    </BannerSwiper>
                </div>

                <div className="flex justify-between h-6 px-4 mt-5 text-[#ff7643] font-bold">
                    <div className="flex justify-center gap-1 items-center">
                        <span className="text-[13px]">جدید ترین محصولات</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <span className="text-[13px] mx-1">دیدن همه</span>
                        <span className="rotate-180"><RightIcon /></span>
                    </div>
                </div>

                <div className="w-full flex flex-wrap justify-center gap-3 mt-3">
                    <div className="w-[45%] flex justify-center">
                        <AdBanner />
                    </div>
                    {newProducts.map(product => product && (
                        <div className="w-[45%]" key={product.slug}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between my-3 h-6 px-4 mt-5 text-[#ff7643] font-bold">
                    <div className="flex justify-center gap-1 items-center">
                        <span className="text-[13px]">مقالات</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <Link href="/blog" className="text-[13px] mx-1">دیدن همه</Link>
                        <span className="rotate-180"><RightIcon /></span>
                    </div>
                </div>

                <div className="px-2">
                    <BlogCard blogs={blogs} />
                </div>

                <div className="flex justify-between h-6 px-4 mt-5 text-[#ff7643] font-bold">
                    <div className="flex justify-center gap-1 items-center">
                        <span className="text-[13px]">بیشترین تخفیف</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <span className="text-[13px] mx-1">دیدن همه</span>
                        <span className="rotate-180"><RightIcon /></span>
                    </div>
                </div>
                <div className="w-full mt-3">
                    <BaseSwiper items={seoProducts} type="v2" />
                </div>
                <div className="w-full mt-3">
                    <BaseSwiper items={seoProductsV3} type="v3" />
                </div>
                <Footer />
            </div>
            <div className="max-w-[556px] relative">
                <Navbar />
            </div>
        </main>
    );
}
