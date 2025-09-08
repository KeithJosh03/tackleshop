"use client";

import { worksans } from "@/types/fonts";
import { CategoryCollectionProps } from "@/types/dataprops";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function CollectionComponentLayout({
  category,
  children,
}: {
  children: React.ReactNode;
  category: CategoryCollectionProps;
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
        {`${category.category_name} Collection`}
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-10">
        {children}
      </div>

      <Link
        href={`/category/${category.category_name.replace(/ /g, "_").toLowerCase()}`}
      >
        <button className="button-view text-md font-extrabold mt-8">
          View All
        </button>
      </Link>
    </div>
  );
}
