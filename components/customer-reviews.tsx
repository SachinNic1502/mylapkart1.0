  
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  customerName: string
  avatar: string
  rating: number
  date: string
  productName: string
  reviewText: string
  verified: boolean
}

export function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: '1',
      customerName: 'Rahul Sharma',
      avatar: '/images/avatars/avatar-1.jpg',
      rating: 5,
      date: '2023-05-15',
      productName: 'MacBook Pro 16"',
      reviewText: 'Absolutely amazing laptop! The performance is unmatched for my development work, and the battery life is incredible. The display is stunning for photo editing and the keyboard is comfortable for long coding sessions.',
      verified: true
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      avatar: '/images/avatars/avatar-2.jpg',
      rating: 4,
      date: '2023-06-02',
      productName: 'Dell XPS 15',
      reviewText: 'Great laptop for both work and entertainment. The screen quality is excellent and the sound is surprisingly good. My only complaint is that it can get a bit hot during intensive tasks.',
      verified: true
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      avatar: '/images/avatars/avatar-3.jpg',
      rating: 5,
      date: '2023-04-28',
      productName: 'ASUS ROG Zephyrus',
      reviewText: 'Perfect gaming laptop! Handles all the latest games without any lag. The RGB keyboard is a nice touch and the cooling system works efficiently even during marathon gaming sessions.',
      verified: true
    },
    {
      id: '4',
      customerName: 'Sneha Gupta',
      avatar: '/images/avatars/avatar-4.jpg',
      rating: 4,
      date: '2023-05-20',
      productName: 'Lenovo ThinkPad X1',
      reviewText: 'Excellent business laptop. Very lightweight and portable, yet powerful enough for all my work needs. The keyboard is the best I\'ve used on any laptop. Battery life could be better though.',
      verified: true
    },
    {
      id: '5',
      customerName: 'Vikram Singh',
      avatar: '/images/avatars/avatar-5.jpg',
      rating: 5,
      date: '2023-06-10',
      productName: 'HP Spectre x360',
      reviewText: 'The versatility of this 2-in-1 laptop is amazing! I can use it as a regular laptop for work and then flip it to tablet mode for watching movies or drawing. The build quality is premium and performance is top-notch.',
      verified: true
    }
  ]

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchReviews = async () => {
    //   try {
    //     const response = await fetch('/api/reviews?featured=true')
    //     if (response.ok) {
    //       const data = await response.json()
    //       setReviews(data.reviews)
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch reviews:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    
    // For now, use mock data
    setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 800)
  }, [])

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length)
  }

  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  // Calculate visible reviews for desktop (show 3 at a time)
  const getVisibleReviews = () => {
    if (reviews.length <= 3) return reviews
    
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length
      result.push(reviews[index])
    }
    return result
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg mr-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Reviews
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white animate-pulse rounded-xl h-64 shadow-sm"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg mr-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Customer Reviews
          </h2>
        </div>
        
        {/* Mobile view - single review carousel */}
        <div className="md:hidden relative">
          {reviews.length > 0 && (
            <div className="relative">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    {reviews[currentIndex].avatar ? (
                      <Image
                        src={reviews[currentIndex].avatar}
                        alt={reviews[currentIndex].customerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-xl">
                        {reviews[currentIndex].customerName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{reviews[currentIndex].customerName}</h3>
                      {reviews[currentIndex].verified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
                      )}
                    </div>
                    <div className="flex mt-1">
                      {renderStars(reviews[currentIndex].rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{reviews[currentIndex].reviewText}</p>
                
                <div className="text-sm text-gray-500 flex justify-between items-center mt-4">
                  <span>Product: {reviews[currentIndex].productName}</span>
                  <span>{new Date(reviews[currentIndex].date).toLocaleDateString()}</span>
                </div>
              </motion.div>
              
              {reviews.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button 
                    onClick={prevReview}
                    className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-5 w-5 text-purple-600" />
                  </button>
                  <button 
                    onClick={nextReview}
                    className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="h-5 w-5 text-purple-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Desktop view - multiple reviews */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getVisibleReviews().map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt={review.customerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-xl">
                        {review.customerName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{review.customerName}</h3>
                      {review.verified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
                      )}
                    </div>
                    <div className="flex mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-4">{review.reviewText}</p>
                
                <div className="text-sm text-gray-500 flex justify-between items-center mt-4">
                  <span>Product: {review.productName}</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {reviews.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={prevReview}
                className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-5 w-5 text-purple-600" />
              </button>
              <button 
                onClick={nextReview}
                className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-5 w-5 text-purple-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
