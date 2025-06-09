"use client"

import { useState } from 'react'
import { Mail, Send, Check, Loader2 } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    // Call real API endpoint
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to subscribe. Please try again.')
        return
      }
      setIsSubmitted(true)
      setEmail('')
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
      console.error('Newsletter subscription error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mr-4">
              <Mail className="h-7 w-7 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-blue-600">
              Stay Updated
            </h2>
          </div>
          
          <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive deals, tech news, and first access to our latest laptop releases. Get special discounts sent directly to your inbox!
          </p>
          
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-green-100 rounded-full p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You for Subscribing!</h3>
              <p className="text-gray-600 text-center">
                You're now on our list to receive the latest updates and exclusive offers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="absolute text-sm text-red-600 mt-1">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Subscribe <Send className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </div>
        </div>
      </div>
    </section>
  )
}
