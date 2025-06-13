import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mylapkart.in"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]

  // Category pages
  const categories = [
    { category: "laptop", subcategories: ["new", "business series"] },
    { category: "iphone", subcategories: ["second", "business series", "open_box"] },
    { category: "desktop", subcategories: ["gaming", "office", "workstation", "all_in_one"] },
    { category: "accessories", subcategories: ["mouse", "keyboard", "headphones", "monitor"] },
  ]

  const categoryPages = categories.flatMap(({ category, subcategories }) => [
    {
      url: `${baseUrl}/products?category=${category}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...subcategories.map((subcategory) => ({
      url: `${baseUrl}/products?category=${category}&subcategory=${subcategory}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ])

  return [...staticPages, ...categoryPages]
}
