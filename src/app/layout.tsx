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

const APP_URL = "https://www.kainova.xyz";
const APP_ID = "6999320926c8104af5f08480";

export const metadata: Metadata = {
  title: "KNTWS Sovereign Client | Kai-Nova Web3",
  description:
    "The sovereign Farcaster client powered by $KNTWS. Social meets DeFi on Base. Token-gated feeds, Clanker token forge, and sovereign casting.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "KNTWS Sovereign Client",
    description: "Social meets DeFi — powered by $KNTWS on Base.",
    type: "website",
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "KNTWS Sovereign Client",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KNTWS Sovereign Client",
    description: "Social meets DeFi — powered by $KNTWS on Base.",
    images: [`${APP_URL}/og.png`],
  },
  other: {
    // Farcaster Mini App / Frame v2 meta tags
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/og.png`,
      button: {
        title: "Enter the Kingdom",
        action: {
          type: "launch_miniapp",
          name: "KNTWS Sovereign Client",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#050505",
        },
      },
    }),
    // Legacy fc:frame support
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${APP_URL}/og.png`,
      button: {
        title: "Enter the Kingdom",
        action: {
          type: "launch_frame",
          name: "KNTWS Sovereign Client",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#050505",
        },
      },
    }),
    // Base Mini App ID
    "base:app_id": APP_ID,
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
        {/* Farcaster / Base Mini App discovery tags */}
        <meta name="base:app_id" content={APP_ID} />
        <link rel="manifest" href="/.well-known/farcaster.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-obsidian text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
