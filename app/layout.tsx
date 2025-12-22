import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apex Intelligence | Ultra-Futuristic SEO Dashboard",
  description: "God-mode competitive intelligence and SEO analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
