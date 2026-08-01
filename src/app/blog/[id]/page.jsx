"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainHeader from "@/base/mainHeader";
import Navbar from "@/base/navbar";
import Link from "next/link";
import clsx from "clsx";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);

    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem("theme");
      if (updatedTheme) setTheme(updatedTheme);
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.manmarket.ir/blog/v1/post/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        className={clsx(
          "max-w-[900px] mx-auto px-4 py-8 space-y-4 transition-colors duration-300",
          theme === "dark" ? "bg-[#17181A]" : "bg-white",
        )}
      >
        <div className="h-6 w-3/4 rounded animate-pulse bg-[#ededed]" />
        <div className="h-4 w-full rounded animate-pulse bg-[#ededed]" />
        <div className="h-4 w-full rounded animate-pulse bg-[#ededed]" />
        <div className="h-96 rounded animate-pulse bg-[#ededed]" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        className={clsx(
          "max-w-[556px] mx-auto px-4 py-8 text-center transition-colors duration-300",
          theme === "dark"
            ? "bg-[#17181A] text-[#bdbdbd]"
            : "bg-white text-gray-500",
        )}
      >
        بلاگ پیدا نشد.
      </div>
    );
  }

  let fixedContent = blog.content || "";

  fixedContent = fixedContent.replace(
    /src="\/media/g,
    'src="https://api.manmarket.ir/media',
  );

  fixedContent = fixedContent.replace(
    /style="[^"]*font-size:\s*(\d+)px;?[^"]*"/g,
    'style="font-size:15px;"',
  );

  return (
    <section
      className={clsx(
        "flex justify-center items-center pb-12 transition-colors duration-300",
        theme === "dark" ? "bg-[#17181A]" : "bg-white",
      )}
    >
      <div className="max-w-[556px] w-full px-4">
        <MainHeader />

        <h1
          className={clsx(
            "text-[15px] font-extrabold mb-6 transition-colors duration-300",
            theme === "dark" ? "text-[#bdbdbd]" : "text-[#757575]",
          )}
        >
          {blog.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {blog.category?.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={clsx(
                "text-[15px] font-bold px-2 py-1 rounded transition-colors duration-300",
                theme === "dark"
                  ? "text-[#bdbdbd] bg-[#232427]"
                  : "text-[#757575] bg-[#f5f5f5]",
              )}
            >
              {cat.name}
            </Link>
          ))}
          {blog.tags?.map((tag, i) => (
            <span
              key={i}
              className={clsx(
                "text-[15px] font-bold px-2 py-1 rounded transition-colors duration-300",
                theme === "dark"
                  ? "text-[#bdbdbd] bg-[#232427]"
                  : "text-[#757575] bg-[#f0f0f0]",
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {blog.image && (
          <div className="mb-6">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        )}

        <div
          className={clsx(
            "text-[13px] font-normal leading-7 mb-12 blog-content space-y-4 transition-colors duration-300",
            theme === "dark" ? "text-[#bdbdbd]" : "text-[#333333]",
          )}
          dangerouslySetInnerHTML={{ __html: fixedContent }}
        />

        {blog.specifications && blog.specifications.length > 0 && (
          <dl
            className={clsx(
              "grid grid-cols-2 gap-4 text-[13px] font-normal transition-colors duration-300",
              theme === "dark" ? "text-[#bdbdbd]" : "text-[#757575]",
            )}
          >
            {blog.specifications
              .filter((s) => s.status)
              .map((spec, i) => (
                <div
                  key={i}
                  className={clsx(
                    "col-span-2 flex justify-between py-2 border-b transition-colors duration-300",
                    theme === "dark" ? "border-[#2b2c2f]" : "border-[#f0f0f0]",
                  )}
                >
                  <dt className="font-medium">{spec.name}:</dt>
                  <dd className="text-left">{spec.value}</dd>
                </div>
              ))}
          </dl>
        )}
      </div>
      <Navbar />
    </section>
  );
}
