import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://crescitechmd.com'),
  title: {
    default: 'CrescitechMD - Converta Documentos para Markdown',
    template: '%s | CrescitechMD',
  },
  description:
    'Transforme PDF, DOCX, PPTX e mais em Markdown com apenas alguns cliques. Simples, rápido e profissional.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'CrescitechMD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
