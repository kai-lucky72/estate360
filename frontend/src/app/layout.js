import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/layout/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Estate360 | Premium Real Estate Platform",
  description: "Find your dream property with Estate360. Browse, book, and manage premium real estate seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ToastProvider>
          <Navbar />
          <main className="fade-in">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
