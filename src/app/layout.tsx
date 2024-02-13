import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Tech Wars",
   description: "Generated by create next app",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <Header />
            <div className="container min-[768px]:w-[800px] mx-auto px-[10px] sm:px-0"> {children}</div>
            <div id="portals"></div>
         </body>
      </html>
   );
}