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
      className={`${worksans.className} w-full mx-auto flex flex-col items-center justify-center
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
      `}
    >
      <h1 className="text-primaryColor font-bold text-4xl mb-4">
        {`${categoryName} Collection`}
      </h1>

      <div className="relative w-full">
        <div
          className={`
          sm:grid sm:grid-cols-2 sm:gap-2
          lg:grid-cols-4 lg:gap-2
          xl:grid-cols-4
          `}
        >
          {children}
        </div>
      </div>

      <Link href={`/category/${slugify(categoryName).toLowerCase()}`}>
        <button className="button-view text-md px-6 py-3 font-extrabold mt-8">
          {`View ${categoryName}`}
        </button>
      </Link>
    </div>
  );
}
