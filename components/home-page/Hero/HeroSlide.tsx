"use client";

import { useState, useEffect } from "react";
import { montserrat } from "@/types/fonts";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Clock } from "lucide-react";
import { shopbg, event } from '@/public';

const slides = [
    {
        id: 1,
        image: shopbg,
        alt: "Smooth Casting Tackle Shop Interior",
        badge: "Featured Collection",
        titlePrimary: "Branded & Affordable",
        titleSecondary: "Fishing Gears",
        description: "Smooth Casting tackles shop offers a wide selection of affordable, branded, and premium-quality fishing gear for every angler.",
        showContent: true,
        isSale: false,
        objectFit: "object-cover",
    },
    {
        id: 2,
        image: event,
        alt: "Davao Open Invitation Shorecasting Tournament",
        badge: "Upcoming Event",
        titlePrimary: "",
        titleSecondary: "",
        description: "",
        showContent: false,
        isSale: false,
        objectFit: "object-contain bg-black/90",
    },
    {
        id: 3,
        image: shopbg,
        alt: "Christmas Sale Event",
        badge: "Holiday Special",
        titlePrimary: "Christmas Sale",
        titleSecondary: "Up to 10% Off All Product",
        description: "Celebrate the holidays with heavy discounts on top-tier rods, reels, and tackle. Grab your gear before the season ends!",
        showContent: true,
        isSale: true,
        objectFit: "object-cover",
    },
];

export default function HeroSlide() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Countdown Timer state for Christmas (Dec 25, 2026)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date("2026-12-25T00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[currentSlide];

    return (
        <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden bg-ma-background px-4 sm:px-6 py-12">

            {/* Background Slideshow with AnimatePresence */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0 h-full w-full"
                    >
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            priority
                            sizes="100vw"
                            className={`${slide.objectFit} object-center`}
                        />
                    </motion.div>
                </AnimatePresence>
                {slide.showContent && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
                )}
            </div>

            {/* Main Content Area */}
            {slide.showContent && (
                <div className="relative z-20 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center text-center sm:mt-10">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* Optional Holiday Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ma-primary/15 border border-ma-primary/30 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-ma-primary animate-pulse" />
                                <span className="text-ma-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    {slide.badge}
                                </span>
                            </div>

                            <div className={`${montserrat.className} mt-0 flex max-w-5xl flex-col gap-0.5 items-center`}>
                                <h1 className="text-balance px-1 text-[2.2rem] font-extrabold uppercase leading-[1.05] tracking-tight text-ma-on-surface drop-shadow-2xl sm:text-[3.55rem] md:text-[4.35rem] lg:text-[5.3rem]">
                                    <span className="block bg-gradient-to-r from-ma-primary via-[#ffb370] to-ma-primary bg-clip-text pb-1 sm:pb-2 text-transparent">
                                        {slide.titlePrimary}
                                    </span>
                                    <span className="block mt-1 text-ma-on-surface/95">{slide.titleSecondary}</span>
                                </h1>
                            </div>

                            <p className={`${montserrat.className} mt-4 sm:mt-5 max-w-2xl sm:max-w-3xl text-balance px-2 text-[0.78rem] sm:text-[0.8rem] md:text-[0.92rem] font-semibold uppercase leading-relaxed tracking-[0.03em] text-ma-on-surface/70 drop-shadow-md`}>
                                {slide.description}
                            </p>

                            {/* Live Countdown Timer Widget for Christmas Slide */}
                            {slide.isSale && (
                                <div className="mt-6 flex items-center gap-3 sm:gap-4 bg-black/60 border border-ma-outline px-5 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
                                    <Clock className="w-4 h-4 text-ma-primary animate-spin" style={{ animationDuration: "10s" }} />
                                    <div className="flex items-center gap-3 text-white font-black text-xs sm:text-sm tracking-wider uppercase">
                                        <div className="flex flex-col items-center">
                                            <span className="text-ma-primary text-base sm:text-lg">{timeLeft.days}</span>
                                            <span className="text-[9px] text-white/60">Days</span>
                                        </div>
                                        <span className="text-ma-primary pb-3">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-ma-primary text-base sm:text-lg">{timeLeft.hours}</span>
                                            <span className="text-[9px] text-white/60">Hours</span>
                                        </div>
                                        <span className="text-ma-primary pb-3">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-ma-primary text-base sm:text-lg">{timeLeft.minutes}</span>
                                            <span className="text-[9px] text-white/60">Mins</span>
                                        </div>
                                        <span className="text-ma-primary pb-3">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-ma-primary text-base sm:text-lg">{timeLeft.seconds}</span>
                                            <span className="text-[9px] text-white/60">Secs</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Responsive CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="mt-6 sm:mt-7 flex flex-col sm:grid w-full max-w-md sm:max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 z-20"
                    >
                        <Link href="/#brands" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-black/40 sm:bg-transparent px-6 py-3.5 text-[0.7rem] sm:text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/10 hover:border-ma-primary">
                            <span className="relative flex items-center gap-2">
                                Explore Brands
                                <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <Link href="/#services" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-black/40 sm:bg-transparent px-6 py-3.5 text-[0.7rem] sm:text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/10 hover:border-ma-primary">
                            <span className="relative flex items-center gap-2">
                                Explore Services
                                <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <Link href="/#collections" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-black/40 sm:bg-transparent px-6 py-3.5 text-[0.7rem] sm:text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/10 hover:border-ma-primary">
                            <span className="relative flex items-center gap-2">
                                Explore Collections
                                <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            )}

            {/* Bottom-Right Pagination Dots */}
            <div className="absolute bottom-8 right-8 z-30 hidden sm:flex items-center gap-2">
                {slides.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? "w-8 bg-ma-primary" : "w-2.5 bg-white/40 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Down Indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onClick={() => {
                    const hero = document.querySelector("section");
                    if (hero?.nextElementSibling) {
                        hero.nextElementSibling.scrollIntoView({ behavior: "smooth" });
                    }
                }}
                className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-0.5"
                aria-label="Scroll down"
            >
                <ChevronDown className="h-5 w-5 animate-hero-bounce text-ma-on-surface/60 transition-colors duration-300 group-hover:text-ma-primary" />
            </motion.button>

            <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-28 w-full bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}