"use client";

import { worksans, inter } from "@/types/fonts";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden bg-mainBackgroundColor">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/shopbg.jpg"
          alt="Smooth Casting Tackle Shop Interior"
          fill
          priority
          className="object-cover object-center scale-105 animate-slow-zoom"
        />
        {/* Dark Overlay for Text Readability - improved gradient for richer look */}
        <div className="absolute inset-0 bg-gradient-to-b from-mainBackgroundColor/80 via-blackgroundColor/70 to-mainBackgroundColor z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center justify-center gap-y-6 px-4 max-w-5xl mx-auto mt-16 sm:mt-0">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className={`${worksans.className} flex flex-col gap-2`}
        >
          <h1 className="font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-tertiaryColor tracking-tight drop-shadow-2xl uppercase">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primaryColor via-[#ffb370] to-primaryColor pb-2">
              Branded &
            </span>
            <span className="block mt-2">Affordable</span>
            <span className="block mt-2 text-tertiaryColor/90">Fishing Gears</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className={`${inter.className} text-tertiaryColor/80 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed mt-4`}
        >
          SMOOTH CASTING TACKLES SHOP OFFERS A WIDE SELECTION OF AFFORDABLE,
          BRANDED, AND PREMIUM-QUALITY FISHING GEAR FOR EVERY ANGLER.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
        >
          <Link href="/#brands" className="group inline-flex items-center justify-center px-8 py-4 font-bold text-tertiaryColor transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 focus:ring-offset-mainBackgroundColor w-full sm:w-auto">
            <span className="relative flex items-center gap-2">
              Explore Brands
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-primaryColor" />
            </span>
          </Link>
          <Link href="/#services" className="group inline-flex items-center justify-center px-8 py-4 font-bold text-tertiaryColor transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 focus:ring-offset-mainBackgroundColor w-full sm:w-auto">
            <span className="relative flex items-center gap-2">
              Explore Services
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-primaryColor" />
            </span>
          </Link>
          <Link href="/#collections" className="group inline-flex items-center justify-center px-8 py-4 font-bold text-tertiaryColor transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 focus:ring-offset-mainBackgroundColor w-full sm:w-auto">
            <span className="relative flex items-center gap-2">
              Explore Collections
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-primaryColor" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient (blends into next section) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-mainBackgroundColor to-transparent z-10 pointer-events-none" />
    </section>
  );
}
