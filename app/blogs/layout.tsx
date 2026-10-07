import React from "react";
import { Header, Footer } from "@/components";
import { montserrat } from "@/types/fonts";

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${montserrat.className} bg-[#0b0f10] min-h-screen text-[#e0e3e5] selection:bg-[#ffc49a] selection:text-[#4f2500]`}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}