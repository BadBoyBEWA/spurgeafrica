import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Spurge Africa | Luxury African Fashion",
  description:
    "Shop ready-to-wear African luxury fashion and order bespoke Agbada, Senator Wear, Kaftan, and wedding tailoring from Spurge Africa."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Header />
          <CartDrawer />
          {children}
          <Footer />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
