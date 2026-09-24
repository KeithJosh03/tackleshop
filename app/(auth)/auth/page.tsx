"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/registerService";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    
    // Shared State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Register-specific state
    const [name, setName] = useState("");
    const [terms, setTerms] = useState(false);

    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isLogin && !terms) {
            setError("You must accept the Terms & Conditions.");
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                // Handle Login
                const res = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (res?.error) {
                    setError("Invalid email or password");
                } else {
                    router.push('/admin/dashboard'); 
                }
            } else {
                // Handle Registration
                const data = await registerUser({ name, email, password });
                if (data.token) {
                    // Registration success! Automatically log them in now.
                    const res = await signIn('credentials', {
                        email,
                        password,
                        redirect: false,
                    });
                    
                    if (res?.error) {
                         // Fallback just in case
                         setIsLogin(true);
                         setError("Account created! Please sign in.");
                    } else {
                         router.push('/admin/dashboard'); 
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] flex flex-col items-center relative mt-12 mb-12">
            {/* Main Card */}
            <div className="w-full bg-ma-surface/70 backdrop-blur-xl border border-ma-surface-bright rounded-[1rem] p-8 sm:p-10 shadow-2xl flex flex-col items-center relative z-10 transition-all duration-300">

                {/* Logo */}
                <div className="mb-6 w-40 h-14 relative">
                    <Image src="/logo.png" alt="Smooth Casting Tackle Shop" fill className="object-contain" />
                </div>

                {/* Headings */}
                <h1 className="text-[32px] font-[700] text-ma-on-surface mb-2 tracking-tight leading-[1.3] text-center">
                    {isLogin ? "Welcome back" : "Create Account"}
                </h1>
                <p className="text-[16px] text-ma-outline mb-8 text-center leading-[1.6]">
                    {isLogin ? "Sign in to access your account." : "Join the elite angling community."}
                </p>

                {/* Form */}
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Full Name (Only for Register) */}
                    {!isLogin && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                placeholder="John Doe"
                                className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={!isLogin ? 8 : 1}
                                placeholder="........"
                                className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ma-outline hover:text-ma-on-surface transition-colors">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox (Only for Register) */}
                    {!isLogin && (
                        <div className="flex items-start gap-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded-[0.25rem] border-ma-surface-bright bg-ma-surface-container text-ma-primary focus:ring-ma-primary focus:ring-offset-ma-surface cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-[13px] text-ma-outline leading-[1.6] cursor-pointer">
                                I accept the <Link href="/terms" className="text-ma-primary hover:underline">Terms</Link> & <Link href="/privacy" className="text-ma-primary hover:underline">Privacy Policy</Link>.
                            </label>
                        </div>
                    )}

                    {/* Forgot Password (Only for Login) */}
                    {isLogin && (
                        <div className="flex justify-end w-full -mt-2 animate-in fade-in duration-300">
                            <Link href="/forgot-password" className="text-[14px] font-[700] text-ma-primary hover:text-ma-primary-container transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-ma-primary text-ma-on-primary rounded-[0.5rem] py-3 flex
                        items-center justify-center gap-3 font-[700] text-[15px] hover:bg-ma-primary/90
                        transition-colors mt-2 disabled:opacity-70 hover:cursor-pointer uppercase tracking-wider shadow-lg shadow-ma-primary/10"
                    >
                        {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3 w-full my-3 opacity-80">
                        <div className="flex-1 h-px bg-ma-surface-bright"></div>
                        <span className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">OR</span>
                        <div className="flex-1 h-px bg-ma-surface-bright"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="w-full flex gap-4">
                        <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="flex-1 bg-ma-surface-container/60 border border-ma-surface-bright
                            rounded-[0.5rem] py-3 flex items-center justify-center gap-2 font-[700] text-[14px]
                            text-ma-on-surface hover:bg-ma-surface-container-high hover:border-ma-outline 
                            transition-colors uppercase tracking-wider hover:cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={() => signIn('facebook', { callbackUrl: '/' })}
                            className="flex-1 bg-ma-surface-container/60 border border-ma-surface-bright rounded-[0.5rem]
                            py-3 flex items-center justify-center gap-2 font-[700] text-[14px] text-ma-on-surface 
                            hover:bg-ma-surface-container-high hover:border-ma-outline transition-colors uppercase tracking-wider hover:cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>
                </form>

                {/* Footer Text (Toggle) */}
                <p className="mt-8 text-[15px] text-ma-outline">
                    {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }} 
                        className="text-ma-primary font-[700] hover:underline"
                    >
                        {isLogin ? "Sign up" : "Log In"}
                    </button>
                </p>

            </div>

            {/* Pill Badges */}
            <div className="absolute -bottom-5 z-20 flex gap-4 w-full justify-center">
                <div className="bg-[#ffc49a] text-ma-on-primary-fixed px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-[800] shadow-lg shadow-black/40 tracking-wider uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> SECURE LOGIN
                </div>
                <div className="bg-ma-surface-container/90 backdrop-blur-md text-ma-on-surface border border-ma-surface-bright px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-[700] shadow-lg shadow-black/40 tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-ma-primary-fixed-dim" /> Trusted by Anglers
                </div>
            </div>
        </div>
    );
}
