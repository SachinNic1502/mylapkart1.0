import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://mylapkart.in"),
  title: {
    default: "MyLapKart - Your Ultimate Laptop Store | New & Refurbished Laptops, iPhones, Desktops",
    template: "%s | MyLapKart",
  },
  description:
    "Find the best laptops, iPhones, desktops and accessories at competitive prices. New, refurbished and second-hand devices with warranty. Free shipping on orders over ₹25,000.",
  keywords: [
    "laptops",
    "iphones",
    "desktops",
    "accessories",
    "refurbished laptops",
    "second hand phones",
    "computer accessories",
    "Dell",
    "HP",
    "Lenovo",
    "ASUS",
    "Apple",
    "gaming laptops",
    "office computers",
    "MyLapKart",
  ],
  authors: [{ name: "MyLapKart" }],
  creator: "MyLapKart",
  publisher: "MyLapKart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mylapkart.in",
    siteName: "MyLapKart",
    title: "MyLapKart - Your Ultimate Laptop Store",
    description:
      "Find the best laptops, iPhones, desktops and accessories at competitive prices. New, refurbished and second-hand devices with warranty.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyLapKart - Your Ultimate Laptop Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLapKart - Your Ultimate Laptop Store",
    description: "Find the best laptops, iPhones, desktops and accessories at competitive prices.",
    images: ["/og-image.jpg"],
    creator: "@MyLapKart",
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
    canonical: "https://mylapkart.in",
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}
