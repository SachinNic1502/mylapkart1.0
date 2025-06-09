"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  price?: number
  currency?: string
  availability?: "in_stock" | "out_of_stock"
  brand?: string
  category?: string
  noindex?: boolean
}

export function SEOHead({
  title = "MyLapKart - Your Ultimate Laptop Store",
  description = "Find the best laptops, iPhones, desktops and accessories at competitive prices. New, refurbished and second-hand devices with warranty.",
  keywords = "laptops, iphones, desktops, accessories, refurbished laptops, second hand phones, computer accessories",
  image = "/og-image.jpg",
  url,
  type = "website",
  price,
  currency = "INR",
  availability,
  brand,
  category,
  noindex = false,
}: SEOProps) {
  const router = useRouter()
  const currentUrl = url || `https://mylapkart.in${router.asPath}`
  const fullTitle = title.includes("MyLapKart") ? title : `${title} | MyLapKart`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="MyLapKart" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={currentUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="MyLapKart" />
      <meta property="og:locale" content="en_IN" />

      {/* Product specific Open Graph */}
      {type === "product" && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          {availability && <meta property="product:availability" content={availability} />}
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@MyLapKart" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  )
}
