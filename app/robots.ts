import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mylapkart.in"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/seller/",
          "/admin/",
          "/profile/",
          "/orders/",
          "/cart/",
          "/checkout/",
          "/wishlist/",
          "/coins/",
          "/referrals/",
          "/returns/",
          "/track/",
          "/reset-password/",
          "/forgot-password/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/seller/",
          "/admin/",
          "/profile/",
          "/orders/",
          "/cart/",
          "/checkout/",
          "/wishlist/",
          "/coins/",
          "/referrals/",
          "/returns/",
          "/track/",
          "/reset-password/",
          "/forgot-password/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
