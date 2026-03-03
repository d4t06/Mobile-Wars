import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./styles.scss";
import "./theme.css";
import CompareProvider from "@/stores/CompareContext";
import AuthProvider from "@/stores/AuthContext";
// import ThemeEffect from "@/layout/_components/ThemeEffect";
import defaultTheme from "tailwindcss/defaultTheme";

import { ThemeProvider } from "next-themes";

const _font = localFont({
  src: "./Comfortaa-VariableFont.ttf",
  weight: "500 700",
});

export const metadata: Metadata = {
  title: "Dspec",
  description:
    "Hi!, I'm Nguyen Huu Dat, a fresher software engineering and I'm seeking an job opportunity.",
  verification: {
    google: "Zr0gom2JXEgWZu3IFSKVXYDqC885w4kSH7cHdQZyaqA",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="transition-colors bg-white dark:bg-slate-800 dark:text-white"
        style={{
          fontFamily:
            _font.style.fontFamily + "," + defaultTheme.fontFamily.sans.join(","),
        }}
      >
        <ThemeProvider attribute="class">
          <AuthProvider>
            <CompareProvider>
              {children}
              <div id="portals"></div>
            </CompareProvider>
          </AuthProvider>

          {/*<ThemeEffect />*/}
        </ThemeProvider>
      </body>
    </html>
  );
}
