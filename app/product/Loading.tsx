// app/component/product/Loading.tsx
import React from "react";

export default function Loading() {
  return (
    <>
    <div className="flex flex-row items-center justify-center gap-4 w-auto max-w-md">
      <div className="animate-pulse space-y-4 w-full">
        <div className="h-6 bg-secondary rounded w-3/4"></div>
        <div className="h-10 bg-secondary rounded w-full"></div>
        <div className="h-6 bg-secondary rounded w-5/6"></div>
        <div className="h-72 bg-secondary rounded"></div>
      </div>
    </div>
    <div className="animate-pulse w-full">
        <div className="h-60 bg-secondary rounded w-full">
        </div>
    </div>
    </>
  );
}
