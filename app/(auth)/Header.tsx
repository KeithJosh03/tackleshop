import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function AuthHeader() {
    return (
        <header className="absolute top-0 right-0 w-full p-6 flex justify-end items-center gap-6 z-50">
            <Link href="/cart" className="text-[#a28d7e] hover:text-[#ffc49a] transition-colors">
                <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link href="/login" className="text-[#a28d7e] hover:text-[#ffc49a] transition-colors">
                <User className="w-5 h-5" />
            </Link>
            <Link
                href="/register"
                className="px-6 py-2 rounded-md bg-[#ffc49a] text-[#4f2500] font-bold text-sm tracking-wider hover:bg-[#ff9d4d] transition-colors shadow-lg shadow-[#ffc49a]/10"
            >
                Sign Up
            </Link>
        </header>
    );
}
