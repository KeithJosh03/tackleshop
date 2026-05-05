"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { worksans, inter } from "@/types/fonts";
import CardServices from "./CardServices";

/* ─── Service data ──────────────────────────────────────────────────────── */
const services = [
    {
        id: "reel-cleaning",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10" stroke="#E89347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Reel body */}
                <circle cx="32" cy="32" r="20" />
                <circle cx="32" cy="32" r="10" />
                <circle cx="32" cy="32" r="3" fill="#E89347" stroke="none" />
                {/* Reel handle */}
                <line x1="52" y1="32" x2="58" y2="32" />
                <circle cx="58" cy="32" r="3" />
                {/* Cleaning sparkles */}
                <path d="M10 10 L13 13M10 13 L13 10" strokeWidth="2.5" />
                <path d="M51 10 L54 13M51 13 L54 10" strokeWidth="2.5" />
                <path d="M8 38 L11 41M8 41 L11 38" strokeWidth="2" />
                {/* Spool lines */}
                <path d="M22 32 Q27 26 32 32 Q37 38 42 32" />
            </svg>
        ),
        title: "Reel Cleaning",
        subtitle: "Service",
        description:
            "Expert disassembly, deep-clean, re-lubrication and reassembly for all reel types. We track demand trends so you always know when to book before the season rush.",
        highlight: "Keep your reels running like new",
        badge: "Most Requested",
        badgeColor: "rgba(232,147,71,0.18)",
        badgeBorder: "rgba(232,147,71,0.35)",
        badgeText: "#E89347",
    },
    {
        id: "rod-repair",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10" stroke="#E89347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Rod blank diagonal */}
                <line x1="8" y1="56" x2="56" y2="8" strokeWidth="4" />
                {/* Guides */}
                <ellipse cx="20" cy="44" rx="4" ry="2" transform="rotate(-45 20 44)" />
                <ellipse cx="34" cy="30" rx="3" ry="1.5" transform="rotate(-45 34 30)" />
                <ellipse cx="46" cy="18" rx="2" ry="1" transform="rotate(-45 46 18)" />
                {/* Crack / repair mark */}
                <path d="M30 26 L34 34" stroke="#f87171" strokeWidth="2.5" />
                {/* Wrapping thread */}
                <path d="M28 28 Q30 25 32 28 Q34 31 36 28" strokeWidth="1.5" />
                {/* Wrench repair icon small */}
                <path d="M50 44 Q56 44 56 50 L50 56 Q44 56 44 50 L50 44Z" strokeWidth="1.5" />
                <line x1="50" y1="50" x2="54" y2="54" />
            </svg>
        ),
        title: "Rod Repair",
        subtitle: "Service",
        description:
            "From broken tips to damaged guides and cracked blanks — we restore your rods to full fishing spec. We monitor repair volume to stay stocked with the right materials.",
        highlight: "Every rod repaired with precision",
        badge: "Fast Turnaround",
        badgeColor: "rgba(99,210,144,0.12)",
        badgeBorder: "rgba(99,210,144,0.3)",
        badgeText: "#63d290",
    },
    {
        id: "rod-customization",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10" stroke="#E89347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Custom rod */}
                <line x1="8" y1="56" x2="56" y2="8" strokeWidth="3" />
                {/* Decorative wraps */}
                <path d="M18 46 Q20 43 22 46" strokeWidth="2.5" />
                <path d="M24 40 Q26 37 28 40" strokeWidth="2.5" />
                <path d="M30 34 Q32 31 34 34" strokeWidth="2.5" />
                {/* Star sparkle customization */}
                <path d="M48 12 L49.5 15 L53 16 L50 18.5 L50.5 22 L48 20 L45.5 22 L46 18.5 L43 16 L46.5 15 Z" fill="#E89347" stroke="none" />
                {/* Pencil/design tool */}
                <path d="M4 60 L10 54 L14 58 L8 64 Z" />
                <path d="M10 54 L56 8" />
            </svg>
        ),
        title: "Rod Customization",
        subtitle: "Service",
        description:
            "Design your dream rod — choose blank, guides, handle and custom thread wraps. Our demand graphs help us understand what anglers love most and continuously improve.",
        highlight: "Your rod, your identity",
        badge: "Premium Build",
        badgeColor: "rgba(139,92,246,0.12)",
        badgeBorder: "rgba(139,92,246,0.3)",
        badgeText: "#a78bfa",
    },
];

/* ─── Stagger animation variants ────────────────────────────────────────── */
const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.18 },
    },
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function StoreServices() {
    return (
        <section className="relative w-full overflow-hidden bg-mainBackgroundColor" id="services">

            {/* ── Background image ── */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/servicesbg.jpg"
                    alt="Smooth Casting Tackle Shop Services"
                    fill
                    className="object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-mainBackgroundColor/80 via-mainBackgroundColor/30 to-mainBackgroundColor z-10" />
                {/* subtle radial amber glow */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(232,147,71,0.07) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* ── Content ── */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2
                        className={`${worksans.className} font-extrabold text-4xl sm:text-5xl md:text-6xl text-tertiaryColor uppercase tracking-tight drop-shadow-2xl mt-4`}
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primaryColor via-[#ffb370] to-primaryColor pb-2">
                            Services Fishing Gear
                        </span>
                    </h2>
                    <p
                        className={`${inter.className} text-tertiaryColor/70 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-medium`}
                    >
                        FROM REEL MAINTENANCE TO FULLY CUSTOM RODS — OUR SKILLED TECHNICIANS
                        KEEP YOUR GEAR IN PEAK CONDITION SO YOU NEVER MISS A CAST.
                    </p>
                </motion.div>

                {/* ── Service cards ── */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {services.map((svc) => (
                        <CardServices key={svc.id} svc={svc} />
                    ))}
                </motion.div>
            </div>
            {/* ── Bottom fade into next section ── */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-mainBackgroundColor to-transparent z-10 pointer-events-none" />
        </section>
    );
}