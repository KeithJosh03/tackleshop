'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ShoppingCart, User, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import {
  SearchBar,
} from '@/components/ui';

// Types
import { BrandProps } from '@/types/brandType';
import { CategoryProps } from '@/types/categoryType';

import { imagesAsset } from '@/types/image';
import { montserrat } from '@/types/fonts';
import { data } from 'framer-motion/client';

type Props = {
  brands: BrandProps[];
  categories: CategoryProps[];
};

export default function HeaderClient({ brands, categories }: Props) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';
  const shouldShowSearch = isHome || pathname.startsWith('/brand') || pathname.startsWith('/category') || pathname.startsWith('/product');

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


  /* ── Navigation Items ── */
  const navItems = [
    { label: 'NEW ARRIVALS', href: '/newarrival', isActive: pathname === '/newarrival' },
    { label: 'BRANDS', href: '#', isActive: pathname.startsWith('/brand'), hasDropdown: 'brands' as const },
    { label: 'CATEGORIES', href: '#', isActive: pathname.startsWith('/category'), hasDropdown: 'categories' as const },
    { label: 'APPAREL', href: '/category/apparel', isActive: pathname === '/category/apparel' },
  ];

  return (
    <header
      className={`${montserrat.className} fixed top-0 w-full z-[999] transition-all duration-300 ${scrolled
        ? 'bg-ma-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)]'
        : 'bg-ma-surface'
        }`}
    >
      {/* ── Thin accent line at the very top ── */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-ma-primary/30 to-transparent" />

      <nav className='px-4 md:px-8 lg:px-14'>
        {/* ── ROW 1: Search | Logo | Cart + User ── */}
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14 md:h-16' : 'h-18 md:h-20'}`}>

          {/* LEFT: Burger (mobile) / Search (desktop) */}
          <div className="flex items-center flex-1 h-full">
            {/* Burger (mobile only) */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 rounded-lg text-ma-primary/80 hover:text-ma-primary transition-colors flex items-center justify-center"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Search icon (desktop) */}
            <div className="hidden md:flex items-center">
              {shouldShowSearch ? <SearchBar /> : (
                <Link href="/" className="p-1.5 text-ma-primary/70 hover:text-ma-primary transition-colors flex items-center justify-center" aria-label="Search">
                  <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </Link>
              )}
            </div>
          </div>

          {/* CENTER: Logo */}
          <div className="flex items-center justify-center shrink-0 px-4 h-full">
            <Link href="/" className="relative flex items-center justify-center">
              <div className={`relative transition-all duration-300 ease-out ${scrolled
                ? 'w-36 h-12 md:w-44 md:h-14'
                : 'w-44 h-14 md:w-60 md:h-18'
                }`}>
                <Image
                  src={imagesAsset.logo}
                  fill={true}
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, 180px"
                  alt="Smooth Casting Tackle Shop"
                  className="object-contain drop-shadow-[0_0_12px_rgba(232,147,71,0.2)]"
                  priority
                />
              </div>
            </Link>
          </div>


          {/* RIGHT: Cart + Profile icons */}
          <div className="flex items-center justify-end gap-x-2 md:gap-x-4 flex-1 h-full">
            {/* Mobile search */}
            <div className="md:hidden flex items-center">
              {shouldShowSearch ? <SearchBar /> : null}
            </div>

            <Link
              href="#"
              className="p-1.5 text-ma-primary/70 hover:text-ma-primary transition-colors flex items-center justify-center"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.8} />
            </Link>

            <div className="relative flex items-center justify-center"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >

              {status === 'loading' ? (
                <div className="p-1.5">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-ma-primary/20 animate-pulse" />
                </div>
              ) : session?.user ? (
                <>
                  <button
                    className="p-1.5 text-ma-primary/70 hover:text-ma-primary transition-colors flex items-center justify-center outline-none cursor-pointer"
                    aria-label="User profile menu"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    {session.user.image ? (
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden relative border border-ma-primary/30">
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={30}
                          height={30}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-ma-primary/10 flex items-center justify-center border border-ma-primary/30">
                        <User className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.8} />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-1 w-48 bg-[ma-surface]/98 backdrop-blur-xl border border-ma-primary/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-ma-primary/10 mb-1">
                          <p className="text-[13px] font-semibold text-ma-primary truncate">{session.user.name || 'User'}</p>
                          <p className="text-[11px] text-ma-primary/60 truncate">{session.user.email}</p>
                        </div>
                        <ul className="flex flex-col px-1.5 gap-0.5">
                          <li>
                            <Link
                              href="/profile"
                              className="flex items-center gap-x-2 px-3 py-2 text-[13px] font-semibold text-ma-primary/70 hover:text-ma-primary hover:bg-ma-primary/8 rounded-lg transition-all"
                              onClick={() => setProfileDropdownOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="w-full flex items-center gap-x-2 px-3 py-2 text-[13px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className="p-1.5 text-ma-primary/70 hover:text-ma-primary transition-colors flex items-center justify-center"
                  aria-label="User login"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.8} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 2: Centered Nav Links (desktop only) ── */}
        <div className={`hidden md:flex items-center justify-center gap-x-8 lg:gap-x-10 transition-all duration-300 ${scrolled ? 'pb-2' : 'pb-3'}`}>
          {navItems.map((item) => {
            if (item.hasDropdown) {
              const dropdownKey = item.hasDropdown;
              const dropdownItems = dropdownKey === 'brands'
                ? brands?.map(({ brandName, brandId }) => ({
                  id: brandId,
                  name: brandName,
                  href: `/brand/${slugify(brandName).toLowerCase()}`,
                }))
                : categories.map(({ categoryName, categoryId }) => ({
                  id: categoryId,
                  name: categoryName,
                  href: `/category/${slugify(categoryName).toLowerCase()}`,
                }));

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(dropdownKey)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`group flex items-center gap-x-1 transition-colors outline-none cursor-pointer py-1
                      text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.1em] leading-none
                      ${item.isActive || activeDropdown === dropdownKey
                        ? 'text-ma-primary'
                        : 'text-ma-primary/60 hover:text-ma-primary'
                      }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === dropdownKey ? 'rotate-180' : ''
                        }`}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-ma-primary rounded-full transition-all duration-300
                      ${item.isActive ? 'w-full' : activeDropdown === dropdownKey ? 'w-full' : 'w-0'}`}
                  />

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === dropdownKey && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-[ma-surface]/98 backdrop-blur-xl border border-ma-primary/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden py-2 z-50"
                      >
                        <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar px-1.5 gap-0.5">
                          {dropdownItems?.map(({ id, name, href }) => (
                            <li key={id}>
                              <Link
                                href={href}
                                className="block px-3 py-2 text-[13px] font-semibold text-ma-primary/60 hover:text-ma-primary hover:bg-ma-primary/8 rounded-lg transition-all"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`block transition-colors py-1 text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.1em] leading-none
                    ${item.isActive
                      ? 'text-ma-primary'
                      : 'text-ma-primary/60 hover:text-ma-primary'
                    }`}
                >
                  {item.label}
                </Link>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-ma-primary rounded-full transition-all duration-300
                    ${item.isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </div>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom border ── */}
      <div className="h-[1px] w-full border-b border-[#ffb77c]" />

      {/* ── Mobile Drawer Backdrop ── */}
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

      {/* ── Mobile Drawer Content ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-[100dvh] w-[85vw] max-w-sm bg-[ma-surface] border-r border-ma-primary/10 shadow-2xl shadow-black text-ma-primary flex flex-col z-[1001] md:hidden overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer header */}
            <div className="px-5 py-4 border-b border-ma-primary/10 flex items-center justify-between shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative w-28 h-9">
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
                className="p-1.5 -mr-1 rounded-lg text-ma-primary/50 hover:text-ma-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Drawer nav */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-5 px-3">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/newarrival"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-[14px] font-bold uppercase tracking-wide transition-colors
                    ${pathname === '/newarrival'
                      ? 'text-ma-primary bg-ma-primary/10'
                      : 'text-ma-primary/70 hover:text-ma-primary hover:bg-ma-primary/5'
                    }`}
                >
                  NEW ARRIVALS
                </Link>

                {/* Brands section */}
                <div className="mt-4 mb-1">
                  <div className="px-4 mb-2 text-[10px] text-ma-primary/30 uppercase tracking-[0.15em] font-bold">Brands</div>
                  <ul className="flex flex-col gap-0.5">
                    {brands?.map(({ brandName, brandId }) => (
                      <li key={brandId}>
                        <Link
                          href={`/brand/${slugify(brandName).toLowerCase()}`}
                          onClick={() => setMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors
                            ${pathname === `/brand/${slugify(brandName).toLowerCase()}`
                              ? 'text-ma-primary bg-ma-primary/10'
                              : 'text-ma-primary/60 hover:text-ma-primary hover:bg-ma-primary/5'
                            }`}
                        >
                          {brandName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Categories section */}
                <div className="mt-4 mb-1">
                  <div className="px-4 mb-2 text-[10px] text-ma-primary/30 uppercase tracking-[0.15em] font-bold">Categories</div>
                  <ul className="flex flex-col gap-0.5">
                    {categories.map(({ categoryName, categoryId }) => (
                      <li key={categoryId}>
                        <Link
                          href={`/category/${slugify(categoryName).toLowerCase()}`}
                          onClick={() => setMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors
                            ${pathname === `/category/${slugify(categoryName).toLowerCase()}`
                              ? 'text-ma-primary bg-ma-primary/10'
                              : 'text-ma-primary/60 hover:text-ma-primary hover:bg-ma-primary/5'
                            }`}
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
                  className={`mt-4 px-4 py-3 rounded-lg text-[14px] font-bold uppercase tracking-wide transition-colors
                    ${pathname === '/category/apparel'
                      ? 'text-ma-primary bg-ma-primary/10'
                      : 'text-ma-primary/70 hover:text-ma-primary hover:bg-ma-primary/5'
                    }`}
                >
                  APPAREL
                </Link>
              </nav>
            </div>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-ma-primary/10 flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-3 w-full">
                <Link
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-ma-primary/10 text-ma-primary text-[12px] font-bold uppercase tracking-wider hover:bg-ma-primary/15 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
                  Cart
                </Link>
                <Link
                  href={session?.user ? "/profile" : "/login"}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-ma-primary/10 text-ma-primary text-[12px] font-bold uppercase tracking-wider hover:bg-ma-primary/15 transition-colors"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 rounded-full bg-ma-primary/20 animate-pulse" />
                  ) : session?.user?.image ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden relative border border-ma-primary/30">
                      <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                    </div>
                  ) : (
                    <User className="w-5 h-5" strokeWidth={1.8} />
                  )}
                  {session?.user ? 'Profile' : 'Account'}
                </Link>
              </div>

              {session?.user && (
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/20 text-red-400 text-[12px] font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.8} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
