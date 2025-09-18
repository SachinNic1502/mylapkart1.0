import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data"
import PWARegister from "@/components/pwa-register"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mylapkart.in/"),
  title: {
    default: "Laptop House - Your Ultimate Laptop Store | New & Business  Laptops, iPhones, Desktops",
    template: "%s | Laptop House",
  },
  description: "Shop new & business laptops, iPhones, desktops at Laptop House. Competitive prices with warranty. Free shipping on orders over ₹25,000. Best deals on Dell, HP, Lenovo, Apple.",
  keywords: [
    "laptops",
    "business laptops",
    "new laptops",
    "iphones",
    "desktops",
    "computer accessories",
    "Dell laptops",
    "HP laptops",
    "Lenovo laptops",
    "Apple Macbook",
    "gaming laptops",
    "Laptop House",
    "laptop store",
    "computer store",
  ],
  authors: [{ name: "Laptop House" }],
  creator: "Laptop House",
  publisher: "Laptop House",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.mylapkart.in/",
    siteName: "Laptop House",
    title: "Laptop House - Your Ultimate Laptop Store",
    description:
      "Find the best laptops, iPhones, desktops and accessories at competitive prices. New, business series and second-hand devices with warranty.",
    images: [
      {
        url: "/icons/mylapkart1.png",
        width: 1200,
        height: 630,
        alt: "Laptop House - Your Ultimate Laptop Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laptop House - Your Ultimate Laptop Store",
    description: "Find the best laptops, iPhones, desktops and accessories at competitive prices.",
    images: ["/icons/mylapkart1.png"],
    creator: "@Laptop House",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://www.mylapkart.in/"
  },
  category: "technology",
  icons: {
    icon: "/icons/mylapkart1.png",
    apple: "/icons/mylapkart1.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Laptop House",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Laptop House",
    "application-name": "Laptop House",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#000000",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="facebook-domain-verification" content="a5wo3cyj9vm6616vddphh5byzx83rf" />
        <OrganizationSchema />
        <WebsiteSchema />
        
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <PWARegister />
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}
