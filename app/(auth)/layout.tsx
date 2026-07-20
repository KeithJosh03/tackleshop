import { Footer } from "@/components";
import AuthHeader from "./Header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col font-montserrat bg-[#101415]">
            {/* Main Section with Background Image */}
            <main className="relative flex-1 flex flex-col items-center justify-center py-20 px-4">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/shopbg.jpg')" }}
                >
                    <div className="absolute inset-0 bg-[#0b0f10]/75 backdrop-blur-[2px]"></div>
                </div>

                {/* Minimal Auth Header */}
                <div className="absolute top-0 right-0 z-20 w-full">
                    <AuthHeader />
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 w-full flex justify-center">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
