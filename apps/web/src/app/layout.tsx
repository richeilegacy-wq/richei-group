import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://richeigroup.com"),
  title: {
    default:
      "Richei Group | Tokenized Real Estate, Property Development & Land Surveying in Nigeria",
    template: "%s | Richei Group",
  },
  description:
    "Richei Group is a Nigerian real estate company providing tokenized property investments, land surveying, construction, facility management and financing with transparent project tracking.",
  keywords: [
    "Richei Group",
    "RicHei Group",
    "tokenized real estate",
    "real estate investment Nigeria",
    "land surveying Enugu",
    "property development Nigeria",
    "construction services",
    "facility management",
    "real estate financing",
  ],
  openGraph: {
    title:
      "Richei Group | Tokenized Real Estate, Property Development & Land Surveying in Nigeria",
    description:
      "Invest in verified Nigerian properties through tokenized real estate, with clear project milestones, survey plans and secure investor dashboards.",
    url: "https://richeigroup.com",
    siteName: "Richei Group",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Richei Group logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Richei Group | Tokenized Real Estate, Property Development & Land Surveying in Nigeria",
    description:
      "Richei Group helps you co-invest in Nigerian real estate projects with transparent dashboards, document vault and project tracking.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
