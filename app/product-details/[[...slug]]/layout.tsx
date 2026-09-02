import React from "react";
import { Header, Footer } from "@/components";
import { montserrat } from "@/types/fonts";

export default function ProductPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${montserrat.className} bg-ma-background min-h-screen text-ma-on-background selection:bg-ma-primary selection:text-ma-on-primary`}>
            <Header />
            <main className="relative z-10 pt-36 pb-20 lg:py-24 mt-10">
                <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
