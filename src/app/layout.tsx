import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KNTWS Sovereign Client | Kai-Nova Web3",
  description: "The sovereign Farcaster client powered by $KNTWS. Social meets DeFi on Base.",
  other: {
    "base:app_id": "6999320926c8104af5f08480",
    "fc:frame": "vNext",
    "fc:frame:image": "https://www.kainova.xyz/og.png",
  },
  openGraph: {
    title: "KNTWS Sovereign Client",
    description: "Social meets DeFi — powered by $KNTWS on Base.",
    type: "website",
    url: "https://www.kainova.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="base:app_id" content="6999320926c8104af5f08480" />
        <link rel="manifest" href="/farcaster-manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-obsidian text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
