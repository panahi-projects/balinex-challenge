import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balinex Challenge",
  description: "Balinex Challenge - by Saeed Panahi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.className} bg-background`}>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
