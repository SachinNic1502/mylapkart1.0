import React from 'react'
import { Wifi, RefreshCw, Home, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 leading-relaxed">
            It looks like you've lost your internet connection. Don't worry, you can still browse some of our cached content.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What you can do offline:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Browse previously viewed products</li>
              <li>• View your cart (cached items)</li>
              <li>• Read our about page</li>
              <li>• Access your account information</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Limited offline features:</h3>
            <ul className="text-sm text-amber-800 space-y-1 text-left">
              <li>• Search functionality</li>
              <li>• New product updates</li>
              <li>• Checkout process</li>
              <li>• Real-time pricing</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <Link href="/cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Laptop House - Your Ultimate Laptop Store
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Offline - Laptop House',
  description: 'You are currently offline. Some features may be limited.',
  robots: {
    index: false,
    follow: false,
  },
}
