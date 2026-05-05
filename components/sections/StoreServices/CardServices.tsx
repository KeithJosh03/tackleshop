"use client";

import { motion } from "framer-motion";
import { worksans, inter } from "@/types/fonts";

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
}

/* ─── CardServices Component ─────────────────────────────────────────────── */
export default function CardServices({ svc }: { svc: Service }) {
    return (
        <motion.div
            key={svc.id}
            variants={cardVariant}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex flex-col rounded-2xl overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(17,26,45,0.95) 0%, rgba(13,20,33,0.98) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
        >
            {/* Hover glow overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,147,71,0.08) 0%, transparent 70%)",
                    border: "1px solid rgba(232,147,71,0.18)",
                }}
            />
            {/* Top accent line */}
            <div
                className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(90deg, transparent, #E89347, transparent)",
                }}
            />

            {/* Card body */}
            <div className="relative flex flex-col gap-y-5 p-7 flex-1">

                {/* Badge */}
                <div className="flex items-start justify-between">
                    {/* Icon container */}
                    <div
                        className="flex items-center justify-center w-16 h-16 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                            background: "rgba(232,147,71,0.08)",
                            border: "1px solid rgba(232,147,71,0.2)",
                        }}
                    >
                        {svc.icon}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <p
                        className={`${inter.className} text-[10px] font-bold uppercase tracking-[0.2em] mb-1`}
                        style={{ color: "#E89347" }}
                    >
                        {svc.subtitle}
                    </p>
                    <h3
                        className={`${worksans.className} font-extrabold text-2xl text-tertiaryColor uppercase tracking-tight`}
                    >
                        {svc.title}
                    </h3>
                </div>

                {/* Divider */}
                <div
                    className="h-px w-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                />

                {/* Description */}
                <p
                    className={`${inter.className} text-tertiaryColor/65 text-sm leading-relaxed font-medium flex-1`}
                >
                    {svc.description}
                </p>

                {/* Highlight */}
                <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                    style={{
                        background: "rgba(232,147,71,0.06)",
                        border: "1px solid rgba(232,147,71,0.15)",
                    }}
                >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#E89347" }} />
                    <p
                        className={`${inter.className} text-xs font-bold italic`}
                        style={{ color: "#E89347" }}
                    >
                        {svc.highlight}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
