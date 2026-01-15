import type { Metadata } from "next";
import './globals.css';

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
      <body className="relative">
        {children}
      </body>
    </html>
  );
}