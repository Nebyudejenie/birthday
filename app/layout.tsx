import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins, Great_Vibes } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-greatvibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Happy Birthday, ${site.recipient} — ${site.queenLine}`,
  description: site.subtitle,
  robots: { index: false, follow: false }, // a private gift, kept off search engines
  openGraph: {
    title: `Happy Birthday, ${site.recipient} ❤️`,
    description: site.subtitle,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${greatVibes.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
