"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Truck, Package, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  orderItems: OrderItem[]
  shippingAddress: {
    fullName: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  finalAmount: number
  status: string
  createdAt: string
  isPaid: boolean
  paidAt?: string
}

export default function OrderConfirmationPage() {
  const { user } = useAuth()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: 'include'
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setOrder(data)
        } else {
          throw new Error(data.message || 'Failed to fetch order details')
        }
      } catch (err: any) {
        console.error('Error fetching order:', err)
        setError(err.message || 'An error occurred while fetching order details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderId, user])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading order details...</h2>
        </div>
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "We couldn't find the order you're looking for."}</p>
            <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold">Order Confirmed!</h1>
                <p className="opacity-90">Thank you for your purchase</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <div>
                <p className="opacity-80">Order ID</p>
                <p className="font-medium">{order._id}</p>
              </div>
              <div>
                <p className="opacity-80">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="opacity-80">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center py-4 border-b last:border-0">
                <div className="h-20 w-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={80} 
                      height={80} 
                      className="object-contain h-full w-full"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{item.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{order.shippingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{order.taxPrice.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-red-600">₹{order.finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Info */}
          <div className="p-6 border-t">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">Shipping Information</h3>
                <p className="text-gray-600 mt-1">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6 border-t flex justify-between">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <Link href="/orders" className="inline-flex items-center text-red-600 hover:text-red-700">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
