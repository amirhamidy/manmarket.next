"use client";

import MainHeader from "@/base/mainHeader";
import Navbar from "@/base/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogListPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        fetch("https://api.manmarket.ir/blog/v1/post/")
            .then((res) => res.json())
            .then((data) => {
                setBlogs(data.results);
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
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <section className="flex justify-center items-center pb-12">
            <div className=" max-w-[556px] mx-auto">
                
                    <MainHeader />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="relative h-[220px] w-[157px] rounded-3xl overflow-hidden bg-gray-200 animate-pulse"
                            />
                        ))
                        : blogs.map((blog) => (
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
                                    className={`w-full h-full object-cover transition duration-300 ${activeCard === blog.id ? "brightness-125" : ""
                                        }`}
                                />

                                {/* overlay title */}
                                <div
                                    className={`absolute inset-0 flex justify-center items-center text-center transition-opacity duration-300 ${activeCard === blog.id
                                        ? "bg-white/90 opacity-100"
                                        : "opacity-0"
                                        }`}
                                >
                                    <span className="text-gray-800 font-bold text-[14px] px-2">
                                        {blog.title}
                                    </span>
                                </div>

                                {/* icon with link */}
                                {activeCard === blog.id && (
                                    <Link
                                        href={`/blog/${blog.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute bottom-0 right-0 w-11 h-11 rounded-tl-3xl flex justify-center items-center bg-[#ededed] transition-opacity duration-300 opacity-100"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="gray"
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
                        ))}
                </div>
            </div>
            <Navbar />
        </section>
    );
}
