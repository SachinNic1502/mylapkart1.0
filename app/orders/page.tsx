"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ScratchCard } from "@/components/ui/scratch-card"
import { generateBillPdf } from "@/lib/generateBillPdf"

interface Order {
  _id: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
    image: string
    isGift?: boolean
    giftCouponCode?: string
    description?: string
    value?: number
  }>
  totalPrice: number
  status: string
  createdAt: string
  isPaid: boolean
}

export default function OrdersPage() {


  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "placed":
        return "Order Placed"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "out_for_delivery":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-md border-0 bg-white/90">
                <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base sm:text-lg">Order {order.orderId}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    <p className="text-base sm:text-lg font-bold mt-1">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-2 px-2 sm:px-4">
                  <div className="flex flex-col gap-4">
                    {order.orderItems.map((item, index) => (
  item.isGift ? (
    <div key={index} className="border border-yellow-300 rounded-lg bg-yellow-50 px-3 py-2 flex flex-col sm:flex-row items-center gap-3">
      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
        <span className="text-2xl">🎁</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-yellow-700 mb-1">Gift: {item.name.replace('Gift: ', '')}</h3>
        <ScratchCard 
          giftItem={{
            name: item.name.replace('Gift: ', ''),
            description: item.description || '',
            image: item.image,
            value: item.value || 0
          }} 
        />
      </div>
    </div>
  ) : (
    <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
      <Image
        src={item.image || "/placeholder.svg?height=60&width=60"}
        alt={item.name}
        width={60}
        height={60}
        className="rounded-md object-cover mb-2 sm:mb-0"
      />
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
        <p className="text-xs sm:text-sm text-gray-600">
          Quantity: {item.quantity} | Price: ₹{item.price.toLocaleString()}
        </p>
      </div>
    </div>
  )
))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-3 sm:gap-0">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <Badge variant={order.isPaid ? "default" : "secondary"}>
                        {order.isPaid ? "Paid" : "Pending Payment"}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href={`/orders/${order._id}`}>View Details</Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button
                          type="button"
                          variant="default"
                          className="w-full sm:w-auto"
                          onClick={() => generateBillPdf(order)}
                        >
                          Download Bill
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
