import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigiCashOn - We Made Selling Simpler",
  description: "Sell your old devices instantly. Get the best market price with doorstep pickup. Phones, tablets, laptops, and smartwatches - we buy them all.",
  keywords: "sell phone, sell laptop, sell tablet, sell watch, device buyback, instant payment, doorstep pickup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
