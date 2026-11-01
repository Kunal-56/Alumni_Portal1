import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tolani Alumni Portal | Connect. Collaborate. Grow Together.",
  description: "The official alumni community of Tolani Foundation. Connect, collaborate and grow together with 1000+ alumni worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#9B2335] selection:text-white">
        {children}
      </body>
    </html>
  );
}
