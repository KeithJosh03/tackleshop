"use client";

import Link from "next/link";
import { MessageCircle, X, Facebook, Instagram } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingMessageButton() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        // Handle click outside to close
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) return null;

    const firstSegment = pathname.split('/')[1] || '';
    const isVisibleRoute =
        pathname === "/" ||
        ["brand", "category", "newarrival", "product", "setups"].includes(firstSegment);

    if (!isVisibleRoute) return null;

    return (
        <div ref={menuRef} className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10 flex flex-col items-end gap-3 animate-fade-in-up">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2 mb-2"
                    >
                        {/* Facebook Button */}
                        <Link
                            href="https://m.me/WankOfficial?text=Hi%20I%20want%20to%20ask%20about%20your%20product"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="group relative flex items-center gap-3 px-5 py-3 font-bold text-mainBackgroundColor transition-all duration-300 bg-[#1877F2] rounded-xl hover:bg-[#1877F2]/90 hover:scale-105 focus:outline-none shadow-lg overflow-hidden backdrop-blur-md"
                        >
                            <span className="absolute inset-0 w-full h-full rounded-lg opacity-20 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                            <Facebook className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Facebook</span>
                        </Link>

                        {/* Instagram Button */}
                        <Link
                            href="https://ig.me/m/smoothcasting_tackle/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="group relative flex items-center gap-3 px-5 py-3 font-bold text-white transition-all duration-300 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] rounded-xl hover:scale-105 focus:outline-none shadow-lg overflow-hidden backdrop-blur-md"
                        >
                            <span className="absolute inset-0 w-full h-full rounded-lg opacity-20 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                            <Instagram className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Instagram</span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative inline-flex items-center justify-center px-5 py-3 md:px-8 md:py-4 font-bold text-mainBackgroundColor transition-all duration-300 bg-primaryColor rounded-xl hover:bg-[#f0a661] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor focus:ring-offset-mainBackgroundColor overflow-hidden ${isOpen
                    ? 'shadow-[0_0_30px_rgba(232,147,71,0.8)] scale-105'
                    : 'shadow-[0_0_20px_rgba(232,147,71,0.6)] hover:shadow-[0_0_30px_rgba(232,147,71,0.8)]'
                    }`}
            >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                <span className="relative flex items-center gap-2">
                    {isOpen ? (
                        <X className="w-6 h-6 md:w-5 md:h-5 transition-transform duration-300 rotate-90 scale-110" />
                    ) : (
                        <MessageCircle className="w-6 h-6 md:w-5 md:h-5 transition-transform duration-300" />
                    )}
                    <span className="hidden sm:inline-block">
                        {isOpen ? "Close" : "Message Us"}
                    </span>
                </span>
            </button>
        </div>
    );
}
