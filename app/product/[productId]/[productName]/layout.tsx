import React from "react";
import { Header, Footer } from "@/components";

export default function ProductPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Header />
      <main className="flex flex-col items-center relative z-10 gap-y-2 mb-20 mt-36">
        <div className="relative w-full 2xl:px-52 lg:px-20 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {children}
          </div>
        </div>
      </main>
    <Footer />
    </>
  );
}


