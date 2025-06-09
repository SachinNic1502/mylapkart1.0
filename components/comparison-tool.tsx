"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, Plus, X, ArrowRight, Check, Cpu, HardDrive, Battery, Monitor } from 'lucide-react'
import { MemoryStick } from 'lucide-react' // Using MemoryStick instead of Memory which doesn't exist
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  price: number
  image: string
  slug: string
  specs: {
    processor: string
    ram: string
    storage: string
    display: string
    battery: string
    graphics: string
    weight: string
  }
}

export function ComparisonTool() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock products data
  const mockProducts: Product[] = [
    {
      _id: '1',
      name: 'MacBook Pro 16"',
      price: 239900,
      image: '/images/products/macbook-pro.jpg',
      slug: 'macbook-pro-16',
      specs: {
        processor: 'Apple M2 Pro 12-core',
        ram: '32GB Unified Memory',
        storage: '1TB SSD',
        display: '16" Liquid Retina XDR (3456 x 2234)',
        battery: 'Up to 22 hours',
        graphics: 'Apple 19-core GPU',
        weight: '2.15 kg'
      }
    },
    {
      _id: '2',
      name: 'Dell XPS 15',
      price: 189999,
      image: '/images/products/dell-xps.jpg',
      slug: 'dell-xps-15',
      specs: {
        processor: 'Intel Core i9-13900H',
        ram: '32GB DDR5',
        storage: '1TB NVMe SSD',
        display: '15.6" OLED 4K (3840 x 2400)',
        battery: 'Up to 12 hours',
        graphics: 'NVIDIA RTX 4070 8GB',
        weight: '1.96 kg'
      }
    },
    {
      _id: '3',
      name: 'ASUS ROG Zephyrus G14',
      price: 159999,
      image: '/images/products/asus-rog.jpg',
      slug: 'asus-rog-zephyrus-g14',
      specs: {
        processor: 'AMD Ryzen 9 7940HS',
        ram: '16GB DDR5',
        storage: '1TB NVMe SSD',
        display: '14" QHD 165Hz (2560 x 1440)',
        battery: 'Up to 10 hours',
        graphics: 'NVIDIA RTX 4060 8GB',
        weight: '1.65 kg'
      }
    },
    {
      _id: '4',
      name: 'Lenovo ThinkPad X1 Carbon',
      price: 149999,
      image: '/images/products/thinkpad-x1.jpg',
      slug: 'lenovo-thinkpad-x1-carbon',
      specs: {
        processor: 'Intel Core i7-1370P',
        ram: '16GB LPDDR5',
        storage: '512GB NVMe SSD',
        display: '14" WUXGA (1920 x 1200)',
        battery: 'Up to 15 hours',
        graphics: 'Intel Iris Xe Graphics',
        weight: '1.12 kg'
      }
    },
    {
      _id: '5',
      name: 'HP Spectre x360',
      price: 134999,
      image: '/images/products/hp-spectre.jpg',
      slug: 'hp-spectre-x360',
      specs: {
        processor: 'Intel Core i7-1355U',
        ram: '16GB LPDDR4X',
        storage: '1TB NVMe SSD',
        display: '13.5" OLED (3000 x 2000)',
        battery: 'Up to 16 hours',
        graphics: 'Intel Iris Xe Graphics',
        weight: '1.36 kg'
      }
    }
  ]

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchProducts = async () => {
    //   try {
    //     const response = await fetch('/api/products?limit=10')
    //     if (response.ok) {
    //       const data = await response.json()
    //       setProducts(data.products)
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch products:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    
    // For now, use mock data
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 800)
  }, [])

  const addToComparison = (product: Product) => {
    if (selectedProducts.length < 3 && !selectedProducts.some(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product])
    }
    setIsDropdownOpen(false)
  }

  const removeFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId))
  }

  const renderSpecIcon = (specType: string) => {
    switch (specType) {
      case 'processor':
        return <Cpu className="h-5 w-5 text-blue-500" />
      case 'ram':
        return <MemoryStick className="h-5 w-5 text-green-500" />
      case 'storage':
        return <HardDrive className="h-5 w-5 text-purple-500" />
      case 'display':
        return <Monitor className="h-5 w-5 text-amber-500" />
      case 'battery':
        return <Battery className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg mr-4">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Compare Laptops
            </h2>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 animate-pulse">
            <div className="h-80 w-full"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg mr-4">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Compare Laptops
          </h2>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
          {selectedProducts.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Compare Laptops Side by Side</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Add up to 3 laptops to compare their specifications and find the perfect one for your needs.
              </p>
              <button
                onClick={() => setIsDropdownOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center mx-auto transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Laptop to Compare
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Comparison</h3>
                <button
                  onClick={() => setIsDropdownOpen(true)}
                  className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 ${
                    selectedProducts.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={selectedProducts.length >= 3}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Laptop
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product columns */}
                {selectedProducts.map((product) => (
                  <div key={product._id} className="relative">
                    <button
                      onClick={() => removeFromComparison(product._id)}
                      className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 transition-colors"
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                      <div className="relative h-40 bg-gray-100 rounded-md mb-4">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                      <p className="text-blue-600 font-bold mb-4">₹{product.price.toLocaleString()}</p>
                      
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-start">
                          {renderSpecIcon('processor')}
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Processor</p>
                            <p className="text-sm">{product.specs.processor}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          {renderSpecIcon('ram')}
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Memory</p>
                            <p className="text-sm">{product.specs.ram}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          {renderSpecIcon('storage')}
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Storage</p>
                            <p className="text-sm">{product.specs.storage}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          {renderSpecIcon('display')}
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Display</p>
                            <p className="text-sm">{product.specs.display}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          {renderSpecIcon('battery')}
                          <div className="ml-2">
                            <p className="text-xs text-gray-500">Battery</p>
                            <p className="text-sm">{product.specs.battery}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-4 py-2 rounded-lg text-center font-medium flex items-center justify-center"
                      >
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: 3 - selectedProducts.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-8">
                    <button
                      onClick={() => setIsDropdownOpen(true)}
                      className="text-gray-500 hover:text-gray-700 flex flex-col items-center transition-colors"
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span>Add laptop to compare</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product selection dropdown */}
      {isDropdownOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Select Laptops to Compare</h3>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => {
                  const isSelected = selectedProducts.some(p => p._id === product._id)
                  
                  return (
                    <div
                      key={product._id}
                      className={`border rounded-lg p-3 flex items-center ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <div className="relative h-16 w-16 bg-gray-100 rounded mr-3 flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-blue-600 text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                      </div>
                      
                      <button
                        onClick={() => isSelected ? removeFromComparison(product._id) : addToComparison(product)}
                        disabled={isSelected || (!isSelected && selectedProducts.length >= 3)}
                        className={`ml-2 p-2 rounded-full ${
                          isSelected
                            ? 'bg-blue-100 text-blue-600'
                            : selectedProducts.length >= 3 && !isSelected
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Plus className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
