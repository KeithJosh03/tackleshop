"use client";

import { montserrat } from "@/types/fonts";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { shopbg } from '@/public';

export default function Hero() {
  return (
    <section className="relative flex min-h-[86vh] w-full items-center justify-center overflow-hidden bg-ma-background px-4 sm:px-6">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src={shopbg}
          alt="Smooth Casting Tackle Shop Interior"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div className="relative z-20 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center text-center sm:mt-10">


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className={`${montserrat.className} mt-0 flex max-w-5xl flex-col gap-0.5`}
        >
          <h1 className="text-balance px-1 text-[2.55rem] font-extrabold uppercase leading-[0.95] tracking-tight text-ma-on-surface drop-shadow-2xl sm:text-[3.55rem] md:text-[4.35rem] lg:text-[5.3rem]">
            <span className="block bg-gradient-to-r from-ma-primary via-[#ffb370] to-ma-primary bg-clip-text pb-2 text-transparent">
              Branded & Affordable
            </span>
            <span className="block mt-0.5 text-ma-on-surface/95">Fishing Gears</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className={`${montserrat.className} mt-5 max-w-3xl text-balance px-1 text-[0.72rem] font-semibold uppercase leading-relaxed tracking-[0.03em] text-ma-on-surface/70 drop-shadow-md sm:text-[0.8rem] md:text-[0.92rem]`}
        >
          Smooth Casting tackles shop offers a wide selection of affordable, branded, and
          premium-quality fishing gear for every angler.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-7 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <Link href="/#brands" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-transparent px-6 py-3.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/5 hover:border-ma-primary">
            <span className="relative flex items-center gap-2">
              Explore Brands
              <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <Link href="/#services" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-transparent px-6 py-3.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/5 hover:border-ma-primary">
            <span className="relative flex items-center gap-2">
              Explore Services
              <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <Link href="/#collections" className="group inline-flex items-center justify-center rounded border border-ma-outline bg-transparent px-6 py-3.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-ma-primary/5 hover:border-ma-primary">
            <span className="relative flex items-center gap-2">
              Explore Collections
              <ArrowRight className="h-3.5 w-3.5 text-white/85 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </div>

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
