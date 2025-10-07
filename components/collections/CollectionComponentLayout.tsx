"use client";

import { worksans } from "@/types/fonts";
import Link from "next/link";
import slugify from "slugify";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function CollectionComponentLayout({
  categoryName,
  children,
}: {
  children: React.ReactNode;
  categoryName: string;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center 
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
      `}
    >
      <h1 className="text-primaryColor font-extrabold text-2xl md:text-4xl">
        {`${categoryName} Collection`}
      </h1>
      <div className="w-full grid grid-cols-1 2xl:px-24 xl:px-20 sm:px-20 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 mt-10">
        {children}
      </div>
      <Link
        href={`/category/${slugify(categoryName).toLowerCase()}`}
      >
        <button className="button-view text-md font-extrabold mt-8">
          View All
        </button>
      </Link>
    </div>
  );
}
