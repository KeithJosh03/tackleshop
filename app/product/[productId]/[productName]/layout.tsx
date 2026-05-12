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
      <main className="relative z-10 mb-20 mt-36">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-28 mt-60">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}


