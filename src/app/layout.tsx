import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Source_Serif_4 } from "next/font/google";
import { PwaRegistration } from "@/components/PwaRegistration";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "L'Art du Français",
  description: "Learn French through structured reading and linguistics.",
  applicationName: "L'Art du Français",
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "32x32" },
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml" },
    ],
    apple: [{ url: `${basePath}/apple-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#003e7a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${sourceSerif.variable} antialiased h-full`}>
      <body className="font-ui bg-background text-on-surface h-full flex flex-col">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
