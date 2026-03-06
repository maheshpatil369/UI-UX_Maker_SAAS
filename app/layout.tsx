// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/toaster"

const appFont = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

/* ================= SEO METADATA ================= */
export const metadata: Metadata = {
  title: {
    default: "UI Studio – AI UI/UX Creator & Website Builder",
    template: "%s | UI Studio",
  },

  description:
    "UI Studio is an AI-powered UI/UX creator that generates modern website and mobile app designs instantly. Build UI mockups, dashboards, and interfaces faster.",

  keywords: [
    "UI UX creator",
    "UI UX maker",
    "AI UI generator",
    "UI design tool",
    "UX design tool",
    "AI website builder",
    "UI mockup generator",
    "frontend UI generator",
    "Tailwind UI generator",
    "design to code",
  ],

  authors: [{ name: "UI Studio Team" }],
  creator: "UI Studio",

  metadataBase: new URL("https://uixmaker.in"),

  icons: {
    icon: "/loogo.png",
    apple: "/loogo.png",
  },

  openGraph: {
    title: "UI Studio – AI UI/UX Creator",
    description:
      "Generate professional UI/UX designs for websites and mobile apps using AI. Fast, modern, and developer-friendly.",
    url: "https://uixmaker.in",
    siteName: "UI Studio",
    images: [
      {
        url: "/logowithname.png", 
        width: 1200,
        height: 630,
        alt: "UI Studio – AI UI UX Creator",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "UI Studio – AI UI/UX Creator",
    description:
      "Create modern UI/UX designs instantly using AI. Websites, dashboards, and mobile apps.",
    images: ["/loogo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={appFont.className}>
        <ClerkProvider>
          <Provider>{children}
             <Toaster />
             </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}