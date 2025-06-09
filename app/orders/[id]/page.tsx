"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Order {
  _id: string
  orderItems: Array<{
    product: string
    name: string
    quantity: number
    price: number
    image: string
  }>
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentResult: {
    id: string
    status: string
  }
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt: string
  isDelivered: boolean
  deliveredAt: string
  status: string
  statusHistory: Array<{
    status: string
    timestamp: string
    note: string
  }>
  trackingNumber: string
  createdAt: string
}

export default function OrderDetailPage() {
  // Review state per product
  const [showReviewForm, setShowReviewForm] = useState<{ [productId: string]: boolean }>({});
  const [reviewText, setReviewText] = useState<{ [productId: string]: string }>({});
  const [reviewRating, setReviewRating] = useState<{ [productId: string]: number }>({});
  const [reviewSubmitted, setReviewSubmitted] = useState<{ [productId: string]: boolean }>({});
  const [reviewLoading, setReviewLoading] = useState<{ [productId: string]: boolean }>({});
  const [reviewError, setReviewError] = useState<{ [productId: string]: string | null }>({});
  const [reviewSuccess, setReviewSuccess] = useState<{ [productId: string]: string | null }>({});
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id && user) {
      fetchOrder()
    }
  }, [params.id, user])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 rounded w-1/3"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <Button asChild>
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Order {order.orderId || order._id.slice(-8)}</h1>
          <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => {
                    // Always extract productId as string
                    const productId =
                      typeof item.product === "string"
                        ? item.product
                        : (item.product && typeof item.product._id === "string"
                          ? item.product._id
                          : "");
                    return (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.image || "/placeholder.svg?height=80&width=80"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-lg font-bold text-blue-600">₹{item.price.toLocaleString()}</p>
                          </div>
                          <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        {/* Review Button & Form (only if delivered) */}
                        {order.isDelivered && (
                          <div className="mt-2">
                            {reviewSubmitted[productId] ? (
                              <div className="text-green-700 font-medium mt-2">
                                {reviewSuccess[productId] || "Thank you for your review!"}
                              </div>
                            ) : (
                              showReviewForm[productId] ? (
                                <form
                                  onSubmit={async e => {
                                    e.preventDefault();
                                    setReviewLoading(v => ({ ...v, [productId]: true }));
                                    setReviewError(v => ({ ...v, [productId]: null }));
                                    try {
                                      const res = await fetch(`/api/products/${productId}/reviews`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        credentials: 'include',
                                        body: JSON.stringify({
                                          rating: reviewRating[productId] || 5,
                                          comment: reviewText[productId] || "",
                                        }),
                                      });
                                      const data = await res.json();
                                      if (res.ok) {
                                        setReviewSubmitted(v => ({ ...v, [productId]: true }));
                                        setReviewSuccess(v => ({ ...v, [productId]: data.coinsEarned ? `Review added! You earned ${data.coinsEarned} coins.` : "Review added successfully!" }));
                                      } else {
                                        setReviewError(v => ({ ...v, [productId]: data.message || "Review failed" }));
                                      }
                                    } catch (err) {
                                      setReviewError(v => ({ ...v, [productId]: "Network error" }));
                                    } finally {
                                      setReviewLoading(v => ({ ...v, [productId]: false }));
                                    }
                                  }}
                                  className="space-y-2"
                                >
                                  <div className="mb-4">
                                    <label className="block font-semibold mb-2 text-gray-700">Rating</label>
                                    <div className="flex items-center space-x-2">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                          type="button"
                                          key={star}
                                          className={`focus:outline-none ${star <= (reviewRating[productId] ?? 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                                          onClick={() => setReviewRating(prev => ({ ...prev, [productId]: star }))}
                                          disabled={reviewLoading[productId]}
                                          aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                          {/* Lucide Star icon if available, fallback to Unicode */}
                                          {typeof Star === 'function' ? (
                                            <Star className={`w-7 h-7 ${star <= (reviewRating[productId] ?? 5) ? 'fill-yellow-400' : 'fill-none'}`} />
                                          ) : (
                                            <span className="text-2xl">★</span>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mb-2">
                                    <label className="block font-semibold mb-2 text-gray-700">Comment</label>
                                    <textarea
                                      className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-base"
                                      rows={3}
                                      placeholder="Write your review..."
                                      value={reviewText[productId] ?? ""}
                                      onChange={e => setReviewText(prev => ({ ...prev, [productId]: e.target.value }))}
                                      required
                                      disabled={reviewLoading[productId]}
                                    />
                                  </div>
                                  {reviewError[productId] && (
                                    <div className="text-red-600 text-sm">{reviewError[productId]}</div>
                                  )}
                                  <div className="flex gap-2">
                                    <Button type="submit" disabled={reviewLoading[productId]}>
                                      {reviewLoading[productId] ? "Submitting..." : "Submit Review"}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setShowReviewForm(v => ({ ...v, [productId]: false }))}
                                      disabled={reviewLoading[productId]}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              ) : (
                                <Button onClick={() => setShowReviewForm(prev => ({ ...prev, [productId]: true }))}>
                                  Write a Review
                                </Button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}



                </div>
              </CardContent>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(status.status)}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{status.status.replace("_", " ")}</p>
                        <p className="text-sm text-gray-600">{status.note}</p>
                        <p className="text-xs text-gray-500">{new Date(status.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxPrice.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="pt-4">
                  <Badge className={order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Method:</span> {order.paymentMethod}
                  </p>
                  {order.trackingNumber && (
                    <p>
                      <span className="font-medium">Tracking:</span> {order.trackingNumber}
                    </p>
                  )}
                  {order.paymentResult?.id && (
                    <p>
                      <span className="font-medium">Transaction ID:</span> {order.paymentResult.id}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
