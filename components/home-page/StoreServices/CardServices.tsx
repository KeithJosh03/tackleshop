"use client";

import { motion } from "framer-motion";
import { montserrat } from "@/types/fonts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Card animation variant ────────────────────────────────────────────── */
export const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface Service {
    id: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    highlight: string;
    badge: string;
    badgeColor: string;
    badgeBorder: string;
    badgeText: string;
    cta?: { label: string; href: string };
}

/* ─── CardServices Component ─────────────────────────────────────────────── */
export default function CardServices({ svc }: { svc: Service }) {
    return (
        <motion.div
            key={svc.id}
            variants={cardVariant}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`${montserrat.className} group relative flex flex-col rounded-2xl overflow-hidden bg-ma-surface-container/60 backdrop-blur-md border border-ma-outline hover:border-ma-primary/50 transition-all duration-300 shadow-xl h-full`}
        >
            {/* Hover glow overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 50% 0%, rgba(232,147,71,0.1) 0%, transparent 70%)",
                }}
            />

            {/* Card body */}
            <div className="relative flex flex-col gap-y-4 sm:gap-y-5 p-5 sm:p-6 flex-1 z-10">

                {/* Icon container */}
                <div
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 bg-ma-primary/10 border border-ma-primary/20 text-ma-primary"
                >
                    {svc.icon}
                </div>

                {/* Title */}
                <div>
                    <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-ma-primary"
                    >
                        {svc.subtitle}
                    </p>
                    <h3
                        className="font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight"
                    >
                        {svc.title}
                    </h3>
                </div>

                {/* Description */}
                <p
                    className="text-white/70 text-xs sm:text-sm leading-relaxed font-medium flex-1"
                >
                    {svc.description}
                </p>

                {/* Highlight */}
                <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-ma-primary/5 border border-ma-primary/10"
                >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-ma-primary" />
                    <p
                        className="text-xs font-bold text-ma-primary/90"
                    >
                        {svc.highlight}
                    </p>
                </div>

                {/* CTA Link */}
                {svc.cta && (
                    <div className="pt-2 border-t border-white/5 mt-1">
                        <Link
                            href={svc.cta.href}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ma-primary hover:text-white transition-colors duration-300 group/cta"
                        >
                            {svc.cta.label}
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}