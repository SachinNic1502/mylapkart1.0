"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { SellerHeader } from "@/components/seller-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Package, Truck, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Order {
  _id: string
  orderId?: string // Added for new order ID format
  user: {
    name: string
    email: string
  }
  orderItems: Array<{
    product: {
      _id: string
      name: string
      images: Array<{ url: string }>
    }
    quantity: number
    price: number
  }>
  totalPrice: number
  status: string
  trackingNumber?: string
  externalTrackingId?: string
  carrier?: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    phone: string
  }
  createdAt: string
  estimatedDelivery?: string
  paymentMethod: string
}

export default function SellerOrdersPage() {

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  const { user } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingData, setTrackingData] = useState({
    carrier: "",
    externalTrackingId: "",
    estimatedDelivery: "",
    notes: "",
  })
  const [searchOrderId, setSearchOrderId] = useState("");

  useEffect(() => {
    if (user?.role === "seller") {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/seller/orders")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched orders:", data);
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Order updated",
          description: "Order status has been updated successfully.",
        })
        fetchOrders()
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    }
  }

  const addTrackingInfo = async (orderId: string) => {
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/tracking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingData),
      })

      if (response.ok) {
        toast({
          title: "Tracking added",
          description: `Tracking ID: ${trackingData.externalTrackingId}`,
        })
        fetchOrders()
        setSelectedOrder(null)
        setTrackingData({
          carrier: "",
          externalTrackingId: "",
          estimatedDelivery: "",
          notes: "",
        })
      } else {
        throw new Error("Failed to add tracking")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tracking information.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50">
        <SellerHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    let pass = true
    if (statusFilter !== "all" && order.status !== statusFilter) pass = false
    if (paymentMethodFilter !== "all" && order.paymentMethod !== paymentMethodFilter) pass = false
    if (dateFrom && new Date(order.createdAt) < new Date(dateFrom)) pass = false
    if (dateTo && new Date(order.createdAt) > new Date(dateTo)) pass = false
    if (
      searchOrderId &&
      ((order.orderId || order._id).slice(-6).toLowerCase() !== searchOrderId.toLowerCase())
    ) pass = false
    return pass
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <div className="text-sm text-gray-600">Total Orders: {orders.length}</div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="searchOrderId">Search Order ID (last 6 digits)</Label>
            <Input
              id="searchOrderId"
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              value={searchOrderId}
              onChange={e => setSearchOrderId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              className="w-40"
            />
          </div>
          <div>
            <Label htmlFor="statusFilter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentMethodFilter">Payment</Label>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateFrom">From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div>
            <Label htmlFor="dateTo">To</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-40"
            />
          </div>
          <Button variant="outline" onClick={() => {
            setStatusFilter("all");
            setPaymentMethodFilter("all");
            setDateFrom("");
            setDateTo("");
          }}>Reset</Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">No orders match your filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        Order {(order.orderId || order._id)}
                        <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.replace("_", " ").toUpperCase()}</span>
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user.name} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.externalTrackingId && (
                        <p className="text-sm text-blue-600 mt-1">
                          {order.carrier?.toUpperCase()} Tracking: {order.externalTrackingId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {(order.orderId || order._id)}</DialogTitle>
                          </DialogHeader> 
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Name:</strong> {order.user.name}
                                </p>
                                <p className="text-sm">
                                  <strong>Email:</strong> {order.user.email}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Payment Information</h4>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Payment Method:</strong> {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm">
                                  {order.shippingAddress.fullName}
                                  <br />
                                  {order.shippingAddress.address}
                                  <br />
                                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                  {order.shippingAddress.postalCode}
                                  <br />
                                  Phone: {order.shippingAddress.phone}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-10 h-10 bg-gray-200 rounded">
                                        <Image src={item.product.images[0].url} alt={item.product.name} width={50} height={50} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{item.product.name}</p>
                                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <span className="text-sm font-medium">
                                      ₹{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>₹{order.totalPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.orderItems.length} item(s) • ₹{order.totalPrice.toLocaleString()}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-sm text-green-600">
                          Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {order.status === "placed" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                          Accept Order
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "processing")} variant="outline">
                          Start Processing
                        </Button>
                      )}
                      {order.status === "processing" && !order.externalTrackingId && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Add Tracking
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add External Tracking Information</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="carrier">Delivery Partner</Label>
                                <Select
                                  value={trackingData.carrier}
                                  onValueChange={(value) => setTrackingData((prev) => ({ ...prev, carrier: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select delivery partner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bluedart">Blue Dart</SelectItem>
                                    <SelectItem value="delhivery">Delhivery</SelectItem>
                                    <SelectItem value="fedex">FedEx</SelectItem>
                                    <SelectItem value="dtdc">DTDC</SelectItem>
                                    <SelectItem value="indiapost">India Post</SelectItem>
                                    <SelectItem value="ecom">Ecom Express</SelectItem>
                                    <SelectItem value="xpressbees">XpressBees</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="externalTrackingId">Tracking ID</Label>
                                <Input
                                  id="externalTrackingId"
                                  value={trackingData.externalTrackingId}
                                  onChange={(e) =>
                                    setTrackingData((prev) => ({ ...prev, externalTrackingId: e.target.value }))
                                  }
                                  placeholder="Enter tracking ID from delivery partner"
                                />
                              </div>
                              <div>
                                <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                                <Input
                                  id="estimatedDelivery"
                                  type="date"
                                  value={trackingData.estimatedDelivery}
                                  onChange={(e) =>
                                    setTrackingData((prev) => ({ ...prev, estimatedDelivery: e.target.value }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  value={trackingData.notes}
                                  onChange={(e) => setTrackingData((prev) => ({ ...prev, notes: e.target.value }))}
                                  placeholder="Additional notes about the shipment"
                                />
                              </div>
                              <Button
                                onClick={() => addTrackingInfo(order._id)}
                                className="w-full"
                                disabled={!trackingData.carrier || !trackingData.externalTrackingId}
                              >
                                Add Tracking & Ship Order
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {order.status === "processing" && order.externalTrackingId && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, "shipped")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Mark as Shipped
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, "delivered")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Delivered
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
