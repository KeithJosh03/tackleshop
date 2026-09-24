import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function AuthHeader() {
    return (
        <header className="absolute top-0 right-0 w-full p-6 flex justify-end items-center gap-6 z-50">
            <Link href="/cart" className="text-[#a28d7e] hover:text-[#ffc49a] transition-colors">
                <ShoppingCart className="w-5 h-5" />
            <Link href="/" className="text-[#a28d7e] hover:text-[#ffc49a] transition-colors font-bold text-sm uppercase tracking-wider">
                Back to Home
            </Link>
        </header>
    );
}
