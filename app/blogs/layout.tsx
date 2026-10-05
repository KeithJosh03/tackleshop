import React from "react";
import { Header, Footer } from "@/components";
import { montserrat } from "@/types/fonts";

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${montserrat.className} bg-ma-background min-h-screen text-ma-on-background selection:bg-ma-primary selection:text-ma-on-primary`}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}
