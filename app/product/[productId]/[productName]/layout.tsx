import React from "react";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full 2xl:px-48 lg:px-20 px-6 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {children}
      </div>
    </div>
  );
}
