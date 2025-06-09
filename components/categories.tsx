"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Laptop, Smartphone, Monitor, Headphones, Layers, ShoppingCart } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const categories = [
  {
    name: "Laptops",
    icon: Laptop,
    href: "/products?category=laptop",
    description: "Powerful machines for work and play",
    bgGradient: "from-blue-500/5 via-blue-600/5 to-cyan-500/5",
    decorGradient: "from-blue-400 to-cyan-500",
    iconGradient: "from-blue-500 to-cyan-500",
    textGradient: "from-blue-600 to-cyan-600",
    borderColor: "border-blue-400/20",
    shadowColor: "shadow-blue-500/10",
    buttonColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    name: "Smartphones",
    icon: Smartphone,
    href: "/products?category=iphone",
    description: "Cutting-edge mobile technology",
    bgGradient: "from-amber-500/5 via-amber-600/5 to-orange-500/5",
    decorGradient: "from-amber-400 to-orange-500",
    iconGradient: "from-amber-500 to-orange-500",
    textGradient: "from-amber-600 to-orange-600",
    borderColor: "border-amber-400/20",
    shadowColor: "shadow-amber-500/10",
    buttonColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  {
    name: "Desktops",
    icon: Monitor,
    href: "/products?category=desktop",
    description: "High-performance computing",
    bgGradient: "from-purple-500/5 via-purple-600/5 to-indigo-500/5",
    decorGradient: "from-purple-400 to-indigo-500",
    iconGradient: "from-purple-500 to-indigo-500",
    textGradient: "from-purple-600 to-indigo-600",
    borderColor: "border-purple-400/20",
    shadowColor: "shadow-purple-500/10",
    buttonColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    name: "Accessories",
    icon: Headphones,
    href: "/products?category=accessories",
    description: "Enhance your experience",
    bgGradient: "from-emerald-500/5 via-emerald-600/5 to-teal-500/5",
    decorGradient: "from-emerald-400 to-teal-500",
    iconGradient: "from-emerald-500 to-teal-500",
    textGradient: "from-emerald-600 to-teal-600",
    borderColor: "border-emerald-400/20",
    shadowColor: "shadow-emerald-500/10",
    buttonColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
]

export function Categories() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const [tiltValues, setTiltValues] = useState<{x: number, y: number}[]>([]);
  
  // Initialize tilt values for each card
  useEffect(() => {
    setTiltValues(categories.map(() => ({ x: 0, y: 0 })));
  }, [])
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!cardRefs.current[index]) return;
    
    const card = cardRefs.current[index];
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    const newTiltValues = [...tiltValues];
    newTiltValues[index] = { x: tiltX, y: tiltY };
    setTiltValues(newTiltValues);
  }
  
  // Reset tilt when mouse leaves
  const handleMouseLeave = (index: number) => {
    setHoveredCard(null);
    const newTiltValues = [...tiltValues];
    newTiltValues[index] = { x: 0, y: 0 };
    setTiltValues(newTiltValues);
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Enhanced animated background with pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-5" 
             style={{
               backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
               backgroundSize: '20px 20px'
             }}>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full animate-float-medium" />
          <div className="absolute top-40 left-1/3 w-64 h-64 bg-amber-300/20 rounded-full animate-float-fast" />
          <div className="absolute bottom-40 right-1/4 w-48 h-48 bg-emerald-300/20 rounded-full animate-float-slow" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Simplified section header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100">
              <Layers className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
            Explore Our Categories
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Discover the perfect tech for your needs across our curated collections
          </p>
        </div>

        {/* Enhanced categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="relative"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <Link href={category.href} className="block h-full group">
                <Card 
                  className={`
                    overflow-hidden border ${category.borderColor} ${category.shadowColor} 
                    hover:shadow-xl transition-all duration-500 cursor-pointer h-full 
                    relative rounded-2xl backdrop-blur-sm bg-white/70 
                    ${hoveredCard === index ? 'transform scale-[1.03]' : ''}
                  `}
                  style={{
                    transform: hoveredCard === index ? 
                      `scale(1.03) rotateX(${tiltValues[index]?.x}deg) rotateY(${tiltValues[index]?.y}deg)` : 
                      'none',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} transition-opacity duration-500 ${hoveredCard === index ? 'opacity-100' : 'opacity-50'}`} />
                  
                  {/* Dynamic decorative elements */}
                  <div 
                    className={`absolute top-5 right-5 w-32 h-32 bg-gradient-to-br ${category.decorGradient} rounded-full blur-xl transition-all duration-700 ${hoveredCard === index ? 'opacity-40 scale-110' : 'opacity-20 scale-100'}`} 
                  />
                  <div 
                    className={`absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br ${category.decorGradient} rounded-full blur-xl transition-all duration-700 ${hoveredCard === index ? 'opacity-30 scale-110' : 'opacity-15 scale-100'}`} 
                  />
                  
                  <CardContent className="p-6 relative z-10 flex flex-col items-center h-full">
                    <div className={`rounded-2xl p-4 mb-6 bg-white group-hover:shadow-lg transition-all duration-300 ${hoveredCard === index ? 'scale-110' : 'scale-100'}`}>
                      {/* Using direct color for better icon display */}
                      <category.icon 
                        className={`h-8 w-8 ${hoveredCard === index ? 'scale-110' : 'scale-100'} transition-transform duration-300`} 
                        style={{
                          color: category.iconGradient.includes('blue') ? '#3b82f6' : 
                                 category.iconGradient.includes('amber') ? '#f59e0b' : 
                                 category.iconGradient.includes('purple') ? '#8b5cf6' : 
                                 category.iconGradient.includes('emerald') ? '#10b981' : 
                                 '#6366f1'
                        }}
                      />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${category.textGradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 text-center mb-6 text-sm group-hover:text-gray-800 transition-colors">
                      {category.description}
                    </p>
                    
                    <div className="mt-auto w-full">
                      <div 
                        className={`
                          ${category.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium 
                          w-full flex items-center justify-center group-hover:shadow-md transition-all 
                          ${hoveredCard === index ? 'translate-y-0' : 'translate-y-2'} 
                          opacity-0 group-hover:opacity-100 relative overflow-hidden
                        `}
                      >
                        {/* Animated shine effect */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                        />
                        <span>Shop Now</span>
                        <ShoppingCart className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}