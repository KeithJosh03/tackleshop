import type { Metadata } from "next";
import './globals.css';

import { worksans } from "@/types/fonts";
import { FloatingMessageButton } from "@/components/ui";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Smooth Casting",
  description: "Tackles Shop Quality and Branded Products",
  icons: {
    icon: "/logo.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"/> */}
      <body className={`relative ${worksans.className}`}>
        <Providers>
          {children}
          <FloatingMessageButton />
        </Providers>
      </body>
    </html>
  );
}