import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/shared/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WasteWise AI - Smart Inventory Management",
  description: "AI-powered sustainability platform for Walmart stores. Reduce waste, save resources, and make data-driven decisions.",
  keywords: "inventory management, sustainability, AI, waste reduction, retail, Walmart",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
