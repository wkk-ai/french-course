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

export const metadata: Metadata = {
  title: "L'Art du Français",
  description: "Learn French through structured reading and linguistics.",
};

export const viewport: Viewport = {
  themeColor: "#f9f9f9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunitoSans.variable} ${sourceSerif.variable} antialiased h-full`}>
      <body className="font-ui bg-background text-on-surface h-full flex flex-col">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
