'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ───────────────────────────── SVG Icons ───────────────────────────── */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="white"
    />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ──────────────── Fishing-themed floating elements ─────────────────── */

const FishSilhouette = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M95 30c0-14-18-26-42-26C34 4 22 10 14 18c-4 4-7 8-8 12 1 4 4 8 8 12 8 8 20 14 39 14 24 0 42-12 42-26z"
      fill="currentColor"
    />
    <path d="M110 30l-18-14v28l18-14z" fill="currentColor" />
    <circle cx="24" cy="26" r="3" fill="#0c1420" opacity="0.6" />
  </svg>
);

const FishHook = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 0v40c0 11-9 20-20 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M0 60c0-8 6-14 14-14s14 6 14 14c0 5-3 9-7 11"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="20" cy="6" r="3" fill="currentColor" opacity="0.5" />
  </svg>
);

const WaveRipple = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M0 20c16.7-10 33.3-10 50 0s33.3 10 50 0 33.3-10 50 0 33.3 10 50 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const Bobber = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="12" y1="0" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="12" cy="30" rx="10" ry="14" fill="currentColor" opacity="0.3" />
    <ellipse cx="12" cy="24" rx="10" ry="8" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="4" r="2.5" fill="currentColor" opacity="0.4" />
  </svg>
);

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large fish swimming right */}
    <FishSilhouette className="absolute top-[12%] left-[5%] w-28 text-[#E89347]/[0.12] animate-float-slow" />

    {/* Smaller fish swimming left */}
    <FishSilhouette className="absolute bottom-[22%] right-[8%] w-20 text-[#835d32]/[0.15] -scale-x-100 animate-float-medium" />

    {/* Tiny school of fish */}
    <FishSilhouette className="absolute top-[55%] left-[60%] w-10 text-[#E89347]/[0.08] animate-float-fast" />
    <FishSilhouette className="absolute top-[50%] left-[55%] w-8 text-[#E89347]/[0.06] animate-float-medium" />

    {/* Fishing hook */}
    <FishHook className="absolute top-[8%] right-[20%] w-8 text-[#E89347]/[0.18] animate-float-medium" />

    {/* Wave ripples */}
    <WaveRipple className="absolute bottom-[15%] left-0 w-60 text-[#835d32]/[0.12] animate-float-slow" />
    <WaveRipple className="absolute top-[75%] right-0 w-44 text-[#E89347]/[0.08] animate-float-medium" />

    {/* Bobber */}
    <Bobber className="absolute top-[20%] right-[35%] w-5 text-[#E89347]/[0.20] animate-float-fast" />

    {/* Casting line arc */}
    <svg className="absolute top-[5%] left-[15%] w-72 h-48 text-[#E89347]/[0.06] animate-float-slow" viewBox="0 0 300 200" fill="none">
      <path d="M10 190 Q 80 10, 290 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>

    {/* Ambient glow orbs */}
    <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-[#E89347]/[0.06] blur-3xl animate-float-slow" />
    <div className="absolute bottom-16 right-12 w-56 h-56 rounded-full bg-[#835d32]/[0.07] blur-2xl animate-float-medium" />
  </div>
);

/* ────────────────────────── Main Component ─────────────────────────── */

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);

  const handleSocialClick = (provider: 'google' | 'facebook') => {
    if (loadingProvider) return;
    setLoadingProvider(provider);
    // Simulate OAuth redirect delay, then reset
    setTimeout(() => setLoadingProvider(null), 3000);
  };

  const toggleMode = () => {
    if (loadingProvider) return;
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  const isLogin = mode === 'login';
  const isLoading = loadingProvider !== null;

  return (
    <div className="min-h-dvh flex bg-[#0c1420]">
      {/* ──────────── Left Panel (Desktop only) ──────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 30% 50%, rgba(232,147,71,0.15) 0%, transparent 60%),' +
              'radial-gradient(ellipse 60% 50% at 70% 80%, rgba(131,93,50,0.12) 0%, transparent 50%),' +
              'linear-gradient(160deg, #0e1825 0%, #131D29 40%, #111A2D 100%)',
          }}
        />

        <FloatingShapes />

        {/* Brand content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-12"
        >
          {/* Store logo */}
          <div className="mb-8 drop-shadow-[0_4px_24px_rgba(232,147,71,0.25)]">
            <Image
              src="/logo.png"
              alt="Smooth Casting Tackle Shop"
              width={280}
              height={140}
              priority
              className="object-contain"
            />
          </div>

          <p className="text-white/45 text-lg leading-relaxed max-w-sm">
            SMOOTH CASTING, tackleshop offers a wide selection of affordable, branded, and premium-quality fishing gear for every angler.
          </p>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center gap-6 text-white/30 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E89347]/70" />
              <span>Trusted by Anglers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ──────────── Right Panel ──────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle radial glow behind card on mobile */}
        <div className="absolute inset-0 lg:hidden" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(232,147,71,0.08) 0%, transparent 70%)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="login-glass w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Smooth Casting Tackle Shop"
              width={180}
              height={90}
              priority
              className="object-contain drop-shadow-[0_2px_12px_rgba(232,147,71,0.2)]"
            />
          </div>

          {/* Header with animated text swap */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-white/40 text-sm sm:text-base">
                  {isLogin
                    ? 'Sign in to access your account and orders.'
                    : 'Join the community of passionate anglers.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Social Buttons ─── */}
          <div className="space-y-3">
            {/* Google */}
            <motion.button
              id="google-login-button"
              whileHover={!isLoading ? { scale: 1.015, y: -1 } : {}}
              whileTap={!isLoading ? { scale: 0.985 } : {}}
              onClick={() => handleSocialClick('google')}
              disabled={isLoading && loadingProvider !== 'google'}
              className={`
                relative w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl
                bg-white text-gray-700 font-medium text-[15px]
                shadow-sm shadow-black/10
                transition-all duration-300 cursor-pointer
                ${isLoading && loadingProvider !== 'google'
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:shadow-md hover:shadow-black/20'}
              `}
            >
              <AnimatePresence mode="wait">
                {loadingProvider === 'google' ? (
                  <motion.span
                    key="google-spinner"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-[#E89347]"
                  >
                    <Spinner />
                  </motion.span>
                ) : (
                  <motion.span
                    key="google-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-white/25 text-xs font-medium uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Facebook */}
            <motion.button
              id="facebook-login-button"
              whileHover={!isLoading ? { scale: 1.015, y: -1 } : {}}
              whileTap={!isLoading ? { scale: 0.985 } : {}}
              onClick={() => handleSocialClick('facebook')}
              disabled={isLoading && loadingProvider !== 'facebook'}
              className={`
                relative w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl
                bg-[#1877F2] text-white font-medium text-[15px]
                shadow-sm shadow-[#1877F2]/30
                transition-all duration-300 cursor-pointer
                ${isLoading && loadingProvider !== 'facebook'
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[#166fe5] hover:shadow-md hover:shadow-[#1877F2]/40'}
              `}
            >
              <AnimatePresence mode="wait">
                {loadingProvider === 'facebook' ? (
                  <motion.span
                    key="fb-spinner"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-white"
                  >
                    <Spinner />
                  </motion.span>
                ) : (
                  <motion.span
                    key="fb-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <FacebookIcon />
                    Continue with Facebook
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* ─── Terms ─── */}
          <p className="mt-6 text-center text-white/25 text-xs leading-relaxed">
            By continuing, you agree to our{' '}
            <span className="text-white/40 hover:text-[#E89347] transition-colors cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="text-white/40 hover:text-[#E89347] transition-colors cursor-pointer">Privacy Policy</span>.
          </p>

          {/* ─── Mode Toggle ─── */}
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-white/35 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                id="login-mode-toggle"
                onClick={toggleMode}
                disabled={isLoading}
                className="text-[#E89347] font-semibold hover:text-[#f0a55e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
