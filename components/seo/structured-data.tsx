import Script from "next/script"

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

export function OrganizationSchema({
  name = "MyLapKart",
  url = "https://mylapkart.in",
  logo = "https://mylapkart.in/logo.png",
  description = "Your ultimate destination for laptops, iPhones, desktops and accessories",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: ["https://facebook.com/mylapkart", "https://twitter.com/mylapkart", "https://instagram.com/mylapkart"],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  product: {
    name: string
    description: string
    price: number
    currency?: string
    brand: string
    model: string
    condition: string
    category: string
    images: string[]
    rating?: number
    reviewCount?: number
    availability: "in_stock" | "out_of_stock"
    sku?: string
    seller?: string
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    model: product.model,
    category: product.category,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "INR",
      availability: `https://schema.org/${product.availability === "in_stock" ? "InStock" : "OutOfStock"}`,
      seller: {
        "@type": "Organization",
        name: product.seller || "MyLapKart",
      },
      itemCondition: `https://schema.org/${getConditionSchema(product.condition)}`,
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.sku && { sku: product.sku }),
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function getConditionSchema(condition: string): string {
  switch (condition) {
    case "new":
      return "NewCondition"
    case "like_new":
      return "NewCondition"
    case "good":
      return "UsedCondition"
    case "fair":
      return "UsedCondition"
    case "refurbished":
      return "RefurbishedCondition"
    default:
      return "UsedCondition"
  }
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
  description?: string
}

export function WebsiteSchema({
  name = "MyLapKart",
  url = "https://mylapkart.in",
  description = "Your ultimate destination for laptops, iPhones, desktops and accessories",
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
