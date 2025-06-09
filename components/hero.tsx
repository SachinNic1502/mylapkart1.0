"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingBag, Gamepad2 } from "lucide-react"

// Gift promotion items - moved to a separate constant to avoid recreation on each render
const GIFT_ITEMS = [
  {
    name: "Laptop Cleaner",
    description: "Screen cleaning solution with microfiber cloth",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/5e3eac55-cb66-4a70-b6e4-ed8caf8cdc87.__CR0,0,500,500_PT0_SX300_V1___.png",
    value: 349,
    highlight: "Best Seller",
  },
  {
    name: "RGB Gaming Mouse Pad",
    description: "Extra-large pad with RGB lighting effects",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5zYVaZLCoB5fy-izivy7EuiICmX-V7Rdyrw&s",
    value: 699,
    highlight: "Gamer's Choice",
  },
  {
    name: "Ergonomic Wired Mouse",
    description: "Precision mouse with adjustable DPI settings",
    image: "https://images.meesho.com/images/products/363778692/vvdzt_512.webp",
    value: 499,
    highlight: "Limited Stock",
  },
  {
    name: "iPhone Tempered Glass",
    description: "Ultra-clear screen protection for iPhone",
    image: "https://img-prd-pim.poorvika.com/product/3D-tempered-glass-screen-protector-for-iphone-12-12-pro-black-Front-View.png",
    value: 599,
    highlight: "New Arrival",
  },
  {
    name:"Iphone Back Cover",
    description:"Best Iphone back covor",
    image:"https://aprozone.in/cdn/shop/products/image_900x_e9128ed5-3c9b-4f75-970c-c20004925388.jpg?v=1629045679&width=1080",
    value:299,
    highlight:"Best for IPhone"

  }
]

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup auto-rotation and cleanup on unmount
  useEffect(() => {
    setMounted(true)
    
    // Start auto-rotation
    startAutoRotation()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Function to start/restart auto-rotation
  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % GIFT_ITEMS.length)
    }, 4000) // Slightly longer interval for better readability
  }

  // Navigation functions
  const goToSlide = (index: number) => {
    setActiveIndex(index)
    startAutoRotation() // Reset timer when manually navigating
  }
  
  const nextSlide = () => goToSlide((activeIndex + 1) % GIFT_ITEMS.length)
  const prevSlide = () => goToSlide((activeIndex - 1 + GIFT_ITEMS.length) % GIFT_ITEMS.length)

  // Only render slider on client-side to avoid hydration issues
  // Gradient and text color map based on highlight
const bgMap: Record<string, {slider: string; text: string; hero: string}> = {
  'best seller': { slider: 'from-yellow-200 via-yellow-100 to-orange-200', text: 'text-yellow-900', hero: 'from-yellow-50 via-orange-50 to-yellow-100' },
  'gamer': { slider: 'from-indigo-200 via-blue-100 to-blue-300', text: 'text-indigo-900', hero: 'from-blue-100 via-indigo-100 to-blue-200' },
  'limited': { slider: 'from-orange-200 via-pink-100 to-red-100', text: 'text-orange-900', hero: 'from-orange-50 via-pink-50 to-red-100' },
  'new': { slider: 'from-green-100 via-blue-100 to-green-200', text: 'text-green-900', hero: 'from-green-50 via-blue-50 to-green-100' },
  'exclusive': { slider: 'from-purple-200 via-pink-100 to-pink-200', text: 'text-purple-900', hero: 'from-purple-50 via-pink-50 to-pink-100' },
  'free': { slider: 'from-yellow-100 via-green-100 to-green-200', text: 'text-green-900', hero: 'from-yellow-50 via-green-50 to-green-100' },
  'iphone': { slider: 'from-gray-100 via-blue-100 to-gray-200', text: 'text-blue-900', hero: 'from-blue-50 via-gray-50 to-blue-100' },
  'default': { slider: 'from-indigo-200 via-pink-100 via-yellow-100 to-yellow-200', text: 'text-gray-900', hero: 'from-blue-100 via-purple-100 to-indigo-200' },
};

// Determine current highlight style
const curHighlight = GIFT_ITEMS[activeIndex].highlight.toLowerCase();
const bgKey = Object.keys(bgMap).find(key => curHighlight.includes(key)) || 'default';
const sliderBg = `bg-gradient-to-br ${bgMap[bgKey].slider} bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-yellow-300 hover:border-yellow-400 transition-all duration-300 ${bgMap[bgKey].text}`;
const heroBg = `relative bg-gradient-to-br ${bgMap[bgKey].hero} text-gray-800 py-12 md:py-16 overflow-hidden`;

const renderSlider = mounted ? (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-6 relative group">
      <div className={sliderBg}>
        {/* Title section */}
        <div className="text-center mb-5">
          <div className="inline-block bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold px-4 py-1 rounded-full text-sm shadow-md animate-pulse">
            🎁 FREE GIFT WITH PURCHASE
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mt-3 ${bgMap[bgKey].text}`}>
            Buy Now and Win These Prizes!
          </h2>
          <p className={`${bgMap[bgKey].text} mt-1 text-base md:text-lg`}>
            Laptops, iPhones & desktops come with a free gift
          </p>
        </div>

        {/* Slider section */}
        <div 
          className="relative h-[180px] md:h-[200px] w-full overflow-hidden rounded-lg" 
          aria-roledescription="carousel"
          aria-label="Gift prizes carousel"
        >
          {/* Navigation buttons - always visible on mobile, visible on hover for desktop */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-500/70 hover:bg-blue-600/90 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500/70 hover:bg-blue-600/90 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slides with animation */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
  key={activeIndex}
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ type: "spring", damping: 25, stiffness: 200 }}
  className="absolute inset-0 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10 p-4 md:p-8"
  role="group"
  aria-roledescription="slide"
  aria-label={`Slide ${activeIndex + 1} of ${GIFT_ITEMS.length}: ${GIFT_ITEMS[activeIndex].name}`}
>
  {/* Image side - floating, glassy, tilt on hover */}
  <div className="relative flex-shrink-0 mx-auto md:mx-0 w-[130px] h-[130px] md:w-[160px] md:h-[160px] bg-white/60 rounded-2xl border-2 border-blue-200 shadow-2xl backdrop-blur-lg overflow-hidden group-hover:rotate-3 transition-transform duration-300">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={GIFT_ITEMS[activeIndex].image}
      alt={GIFT_ITEMS[activeIndex].name}
      className="object-contain w-full h-full p-3 drop-shadow-lg"
      loading="lazy"
    />
  </div>

  {/* Content side - glass card */}
  <div className="flex-1 flex flex-col justify-center bg-white/60 rounded-2xl shadow-lg border border-blue-100 p-6 backdrop-blur-md">
    {/* Prominent highlight badge */}
    <div className="mb-2 flex items-center gap-2">
      {(() => {
        const highlight = GIFT_ITEMS[activeIndex].highlight;
        let gradient = "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
        if (/hot/i.test(highlight)) gradient = "bg-gradient-to-r from-pink-500 to-yellow-400 text-white";
        else if (/new/i.test(highlight)) gradient = "bg-gradient-to-r from-green-400 to-blue-500 text-white";
        else if (/exclusive/i.test(highlight)) gradient = "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
        else if (/limited/i.test(highlight)) gradient = "bg-gradient-to-r from-orange-400 to-red-500 text-white";
        else if (/free/i.test(highlight)) gradient = "bg-gradient-to-r from-yellow-400 to-green-400 text-white";
        else if (/gamer/i.test(highlight)) gradient = "bg-gradient-to-r from-indigo-500 to-blue-400 text-white";
        return (
          <span className={`${gradient} text-sm md:text-base font-bold px-3 py-1 rounded-full shadow-md border-2 border-white/40 uppercase tracking-wide animate-pulse`}>{highlight}</span>
        );
      })()}
    </div>
    <h3 className="font-bold text-xl md:text-2xl mb-2 text-blue-900 drop-shadow-sm">{GIFT_ITEMS[activeIndex].name}</h3>
    <p className="text-gray-700 text-base md:text-lg mb-4">{GIFT_ITEMS[activeIndex].description}</p>
    <div className="flex items-center gap-3 mt-auto">
      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-4 py-1 rounded-lg shadow-md text-sm md:text-base">
        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V7c0-2.21 3.59-4 8-4s8 1.79 8 4v7c0 2.21-3.59 4-8 4z' /></svg>
        Free Gift
      </span>
     <span className="inline-flex items-center gap-1 font-semibold line-through text-red-500 text-sm md:text-base border border-red-300 bg-white/80 rounded-lg px-2 py-1 shadow-sm">
  <span className="bg-red-100 text-red-700 px-1 py-0.5 rounded mr-1 text-xs font-bold uppercase shadow-sm">Old</span>
  ₹{Math.round(GIFT_ITEMS[activeIndex].value * 1.2)}
</span>
    </div>
  </div>
</motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center mt-4 gap-2" role="tablist">
          {GIFT_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${index === activeIndex ? 'bg-blue-500 w-5' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeIndex}
              role="tab"
            />
          ))}
        </div>
      </div>
    </div>
  ) : null

  return (
    <section className={heroBg}>
      {/* Simple background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Heading - with simpler animations */}
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 leading-tight ${bgMap[bgKey].text}`}>
          <span>
            Find Your Perfect Laptop
          </span>
        </h1>
        
        <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${bgMap[bgKey].text}`}>
          Discover the latest technology from top brands with
          <span className={`${bgMap[bgKey].text} font-medium`}> exclusive deals</span> and
          <span className={`${bgMap[bgKey].text} font-medium`}> free gifts</span>
        </p>

        {/* Gift Slider */}
        {renderSlider}
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors">
            <Link href="/products" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Brand badges */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          {['Dell', 'Apple', 'HP', 'Asus', 'Lenovo', 'Acer'].map((brand) => (
            <div
              key={brand}
              className="bg-white/70 px-4 py-2 rounded-md border border-blue-100 shadow-sm"
            >
              <span className="font-medium text-gray-700">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
