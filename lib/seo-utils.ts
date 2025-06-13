export function generateProductTitle(product: {
    name: string
    brand: string
    condition: string
    category: string
  }): string {
    const conditionText =
      product.condition === "new" ? "New" : product.condition === "business series" ? "business series" : "Used"
  
    return `${conditionText} ${product.brand} ${product.name} - ${product.category} | MyLapKart`
  }
  
  export function generateProductDescription(product: {
    name: string
    brand: string
    condition: string
    price: number
    category: string
    description?: string
  }): string {
    const conditionText =
      product.condition === "new" ? "brand new" : product.condition === "business series" ? "business series" : "pre-owned"
  
    const baseDescription = `Buy ${conditionText} ${product.brand} ${product.name} for ₹${product.price.toLocaleString()} at MyLapKart. ${product.description || ""}`
  
    return baseDescription.length > 160 ? baseDescription.substring(0, 157) + "..." : baseDescription
  }
  
  export function generateCategoryTitle(category: string, subcategory?: string): string {
    const categoryMap: Record<string, string> = {
      laptop: "Laptops",
      iphone: "iPhones",
      desktop: "Desktops",
      accessories: "Accessories",
    }
  
    const subcategoryMap: Record<string, string> = {
      new: "New",
      business_series: "business series",
      second: "Second Hand",
      gaming: "Gaming",
      office: "Office",
    }
  
    const categoryName = categoryMap[category] || category
    const subcategoryName = subcategory ? subcategoryMap[subcategory] || subcategory : ""
  
    return subcategoryName ? `${subcategoryName} ${categoryName} | MyLapKart` : `${categoryName} | MyLapKart`
  }
  
  export function generateCategoryDescription(category: string, subcategory?: string): string {
    const descriptions: Record<string, string> = {
      laptop: "Discover our wide range of laptops from top brands like Dell, HP, Lenovo, ASUS and more.",
      iphone: "Find the best deals on iPhones - new, business series and second-hand with warranty.",
      desktop: "Browse our collection of desktop computers for gaming, office work and professional use.",
      accessories: "Complete your setup with our range of computer accessories, peripherals and components.",
    }
  
    return descriptions[category] || "Find the best deals on quality tech products at MyLapKart."
  }
  
  export function generateKeywords(product: {
    name: string
    brand: string
    category: string
    condition: string
  }): string {
    const baseKeywords = [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category.toLowerCase(),
      product.condition.toLowerCase(),
      "mylapkart",
      "buy online",
      "best price",
    ]
  
    const categoryKeywords: Record<string, string[]> = {
      laptop: ["laptop", "notebook", "computer", "portable"],
      iphone: ["iphone", "apple", "smartphone", "mobile"],
      desktop: ["desktop", "pc", "computer", "tower"],
      accessories: ["accessories", "peripherals", "components"],
    }
  
    const additionalKeywords = categoryKeywords[product.category] || []
  
    return [...baseKeywords, ...additionalKeywords].join(", ")
  }
  