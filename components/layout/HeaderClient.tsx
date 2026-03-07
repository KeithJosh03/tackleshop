'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

import CustomButton from '@/components/CustomButton';
import SearchBar from './SearchBar';

import { BrandHeaderProps } from '@/lib/api/brandService';
import { CategoryProps } from '@/lib/api/categoryService';

import { imagesAsset } from '@/types/image';

type Props = {
  brands: BrandHeaderProps[];
  categories: CategoryProps[];
};

export default function HeaderClient({ brands, categories }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-[999] transition-all duration-300 ${scrolled
        ? 'bg-blackgroundColor/85 backdrop-blur-md shadow-lg border-b border-greyColor/50 text-primaryColor'
        : 'bg-blackgroundColor border-b border-greyColor text-primaryColor'
        }`}
    >
      <nav className='px-4 md:px-14 relative'>
        {/* Top bar */}
        <div className={`grid grid-cols-3 items-center transition-all duration-300 ${scrolled ? 'py-2 mt-1' : 'py-3 mt-1'}`}>
          {/* Burger (mobile only) */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-primaryColor hover:bg-primaryColor/10 transition-colors"
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Search (left on xl, full row below on mobile when home) */}
          <div className="hidden md:block w-full max-w-sm">
            {isHome ? <SearchBar /> : null}
          </div>

          {/* Logo center */}
          <div className="flex flex-col items-center text-center justify-center">
            <Link href="/" className="relative block group">
              <div className={`relative transition-all duration-300 ease-in-out ${scrolled ? 'w-36 h-16 md:w-56 md:h-24' : 'w-40 h-20 md:w-72 md:h-36'}`}>
                <Image
                  src={imagesAsset.logo}
                  fill={true}
                  alt="Logo"
                  className="object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Message button right */}
          <div className="flex justify-end items-center">
            <CustomButton
              text='MESSAGE US'
              onClick={() => console.log('Message US')}
            />
          </div>
        </div>

        {/* Search full-width below top bar on mobile and when not home on desktop */}
        <div className="md:hidden pb-3">
          {isHome ? <SearchBar /> : null}
        </div>

        {/* Desktop Nav */}
        {isHome && (
          <div className="hidden md:flex items-center justify-center gap-8 text-[15px] font-extrabold w-full pb-4 pt-1 uppercase tracking-wide">
            <div className="relative group">
              <Link href="/newarrival" className="flex items-center gap-1 text-primaryColor hover:text-[#FFB86C] transition-colors py-2">
                NEW ARRIVALS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primaryColor group-hover:w-full transition-all duration-300 rounded-full leading-none"></span>
              </Link>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('brands')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-primaryColor hover:text-[#FFB86C] transition-colors py-2 outline-none uppercase font-extrabold cursor-pointer">
                BRANDS
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'brands' ? 'rotate-180 text-white' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primaryColor transition-all duration-300 rounded-full ${activeDropdown === 'brands' ? 'w-full' : 'w-0'}`}></span>
              </button>

              <AnimatePresence>
                {activeDropdown === 'brands' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-blackgroundColor/95 backdrop-blur-xl border border-greyColor/40 shadow-2xl rounded-2xl overflow-hidden py-3 z-50 pointer-events-auto"
                  >
                    <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar px-2 gap-1 font-bold">
                      {brands?.map(({ brandName, brandId }) => (
                        <li key={brandId}>
                          <Link
                            href={`/brand/${slugify(brandName).toLowerCase()}`}
                            className="block px-4 py-2.5 text-sm text-primaryColor/80 hover:text-primaryColor hover:bg-primaryColor/15 rounded-xl transition-all"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {brandName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-primaryColor hover:text-[#FFB86C] transition-colors py-2 outline-none uppercase font-extrabold cursor-pointer">
                CATEGORIES
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'categories' ? 'rotate-180 text-white' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primaryColor transition-all duration-300 rounded-full ${activeDropdown === 'categories' ? 'w-full' : 'w-0'}`}></span>
              </button>

              <AnimatePresence>
                {activeDropdown === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-blackgroundColor/95 backdrop-blur-xl border border-greyColor/40 shadow-2xl rounded-2xl overflow-hidden py-3 z-50 pointer-events-auto"
                  >
                    <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar px-2 gap-1 font-bold">
                      {categories.map(({ categoryName, categoryId }) => (
                        <li key={categoryId}>
                          <Link
                            href={`/category/${slugify(categoryName).toLowerCase()}`}
                            className="block px-4 py-2.5 text-sm text-primaryColor/80 hover:text-primaryColor hover:bg-primaryColor/15 rounded-xl transition-all"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {categoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <Link href="/category/apparel" className="flex items-center gap-1 text-primaryColor hover:text-[#FFB86C] transition-colors py-2">
                APPAREL
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primaryColor group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Drawer Backdrop */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] md:hidden"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Drawer Content */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-[100dvh] w-[85vw] max-w-sm bg-blackgroundColor border-r border-greyColor/30 shadow-2xl shadow-black text-primaryColor flex flex-col z-[1001] md:hidden overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="px-6 py-5 border-b border-greyColor/20 flex items-center justify-between shrink-0">
                <Link href="/" onClick={() => setMenuOpen(false)} className="relative w-32 h-10">
                  <Image
                    src={imagesAsset.logo}
                    fill={true}
                    alt="Logo"
                    className="object-contain"
                  />
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-primaryColor/70 hover:text-primaryColor hover:bg-primaryColor/10 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-8">
                <nav className="flex flex-col gap-6 font-extrabold text-lg tracking-wide">
                  <Link
                    href="/newarrival"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-xl hover:bg-primaryColor/10 transition-colors"
                  >
                    NEW ARRIVALS
                  </Link>

                  <div className="space-y-3">
                    <div className="px-4 text-sm text-primaryColor/50 uppercase tracking-wider font-bold">Brands</div>
                    <ul className="grid grid-cols-1 gap-1 px-2">
                      {brands?.map(({ brandName, brandId }) => (
                        <li key={brandId}>
                          <Link
                            href={`/brand/${slugify(brandName).toLowerCase()}`}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl hover:bg-primaryColor/10 text-primaryColor/90 hover:text-primaryColor text-base font-semibold transition-colors"
                          >
                            {brandName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="px-4 text-sm text-primaryColor/50 uppercase tracking-wider font-bold">Categories</div>
                    <ul className="grid grid-cols-1 gap-1 px-2">
                      {categories.map(({ categoryName, categoryId }) => (
                        <li key={categoryId}>
                          <Link
                            href={`/category/${slugify(categoryName).toLowerCase()}`}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl hover:bg-primaryColor/10 text-primaryColor/90 hover:text-primaryColor text-base font-semibold transition-colors"
                          >
                            {categoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/category/apparel"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-xl hover:bg-primaryColor/10 transition-colors"
                  >
                    APPAREL
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
