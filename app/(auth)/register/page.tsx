"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/api/registerService";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function Register() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [terms, setTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!terms) {
            setError("You must accept the Terms & Conditions.");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser({ name, email, password });
            if (data.token) {
                // You can store the token here if using a global state or localStorage
                // localStorage.setItem('token', data.token);
                router.push('/login?registered=true');
            }
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full max-w-[460px] flex flex-col items-center relative mt-8 mb-12">
            {/* Main Card */}
            <div className="w-full bg-ma-surface/70 backdrop-blur-xl border border-ma-surface-bright rounded-[1rem] p-8 sm:p-10 shadow-2xl flex flex-col items-center relative z-10">

                {/* Logo */}
                <div className="mb-6 w-32 h-12 relative">
                    <Image src="/logo.png" alt="Smooth Casting Tackle Shop" fill className="object-contain" />
                </div>

                {/* Headings */}
                <h1 className="text-[32px] font-[700] text-ma-on-surface mb-2 tracking-tight uppercase leading-[1.3] text-center">Create Account</h1>
                <p className="text-[16px] text-ma-outline mb-8 text-center leading-[1.6]">Join the elite angling community</p>

                {/* Social Buttons */}
                <div className="w-full flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="flex-1 bg-ma-surface-container/60 border border-ma-surface-bright rounded-[0.5rem] py-3 flex items-center justify-center gap-2 font-[700] text-[14px] text-ma-on-surface hover:bg-ma-surface-container-high hover:border-ma-outline transition-colors uppercase tracking-wider"
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
                        onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
                        className="flex-1 bg-ma-surface-container/60 border border-ma-surface-bright rounded-[0.5rem] py-3 flex items-center justify-center gap-2 font-[700] text-[14px] text-ma-on-surface hover:bg-ma-surface-container-high hover:border-ma-outline transition-colors uppercase tracking-wider"
                    >
                        <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </button>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3 w-full mb-6 opacity-80">
                    <div className="flex-1 h-px bg-ma-surface-bright"></div>
                    <span className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">OR REGISTER WITH EMAIL</span>
                    <div className="flex-1 h-px bg-ma-surface-bright"></div>
                </div>

                {/* Form */}
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="w-full bg-red-500/10 border border-red-500 text-red-500 rounded-[0.5rem] p-3 text-[14px]">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Email Address</label>
                        <input
                            type="email"
                            placeholder="angler@smoothcasting.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-[700] text-ma-outline uppercase tracking-[0.05em]">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="........"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full bg-ma-surface-container/80 border border-ma-surface-bright rounded-[0.5rem] px-4 py-3 text-[16px] text-ma-on-surface placeholder:text-ma-outline-variant focus:outline-none focus:border-ma-primary transition-colors"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ma-outline hover:text-ma-on-surface transition-colors">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 mt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded-[0.25rem] border-ma-surface-bright bg-ma-surface-container text-ma-primary focus:ring-ma-primary focus:ring-offset-ma-surface cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-[14px] text-ma-outline leading-[1.6] cursor-pointer">
                            I accept the <Link href="/terms" className="text-ma-primary hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-ma-primary hover:underline">Privacy Policy</Link> of Smooth Casting Tackle Shop.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ma-primary text-ma-on-primary rounded-[0.5rem] py-3.5 flex items-center justify-center font-[700] text-[16px] tracking-wider uppercase hover:bg-ma-primary-container transition-colors shadow-lg shadow-ma-primary/10 mt-4 disabled:opacity-50"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {/* Footer Text */}
                <p className="mt-8 text-[16px] text-ma-outline">
                    Already have an account? <Link href="/login" className="text-ma-primary font-[700] hover:underline">Log In</Link>
                </p>

            </div>
        </div>
    );
}
