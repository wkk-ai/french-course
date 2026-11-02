import type { Metadata, Viewport } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { PwaRegistration } from "@/components/PwaRegistration";
import { AuthGate } from "@/components/auth/AuthGate";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "L'Art du Français",
  description: "French for real conversation: daily life and work. Works offline on your phone.",
  applicationName: "L'Art du Français",
  appleWebApp: {
    capable: true,
    title: "Art du Français",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "32x32" },
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml" },
    ],
    apple: [{ url: `${basePath}/apple-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSerif.variable} antialiased h-full`}>
      <body className="font-ui bg-background text-on-surface min-h-full flex flex-col">
        <PwaRegistration />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
