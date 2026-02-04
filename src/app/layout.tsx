import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSS Gradient Generator | Beautiful Gradients",
  description: "Create beautiful CSS gradients with live preview. Linear, radial, and conic gradients with custom colors and positions.",
  keywords: ["CSS gradient", "gradient generator", "linear gradient", "radial gradient", "web design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
