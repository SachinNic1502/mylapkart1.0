"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface OrderItem {
  product: string
  name: string
  quantity: number
  price: number
  image: string
}

interface Order {
  _id: string
  orderItems: OrderItem[]
  totalPrice: number
  isDelivered: boolean
  deliveredAt: string
  createdAt: string
}

export default function ReturnOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [returnData, setReturnData] = useState({
    returnReason: "",
    returnType: "refund",
    customerNotes: "",
  })

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

        // Check if order is eligible for return
        if (!data.isDelivered) {
          toast({
            title: "Order not eligible",
            description: "Only delivered orders can be returned.",
            variant: "destructive",
          })
          router.push(`/orders/${params.id}`)
          return
        }

        const daysSinceDelivery = Math.floor(
          (Date.now() - new Date(data.deliveredAt).getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysSinceDelivery > 30) {
          toast({
            title: "Return period expired",
            description: "Returns are only allowed within 30 days of delivery.",
            variant: "destructive",
          })
          router.push(`/orders/${params.id}`)
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    }
  }

  const handleItemSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, productId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== productId))
    }
  }

  const handleSubmitReturn = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to return.",
        variant: "destructive",
      })
      return
    }

    if (!returnData.returnReason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for the return.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const returnItems = order!.orderItems
        .filter((item) => selectedItems.includes(item.product))
        .map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          reason: returnData.returnReason,
          condition: "opened", // Default condition
        }))

      const response = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: params.id,
          returnItems,
          returnReason: returnData.returnReason,
          returnType: returnData.returnType,
          customerNotes: returnData.customerNotes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Return request submitted",
          description: "Your return request has been submitted successfully.",
        })
        router.push("/returns")
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Return Items</h1>

          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()} • Total: ₹
                  {order.totalPrice.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Select Items */}
            <Card>
              <CardHeader>
                <CardTitle>Select Items to Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.product} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Checkbox
                        checked={selectedItems.includes(item.product)}
                        onCheckedChange={(checked) => handleItemSelection(item.product, checked as boolean)}
                      />
                      <Image
                        src={item.image || "/placeholder.svg?height=60&width=60"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-bold">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Return Details */}
            <Card>
              <CardHeader>
                <CardTitle>Return Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="returnReason">Reason for Return *</Label>
                  <Select
                    value={returnData.returnReason}
                    onValueChange={(value) => setReturnData({ ...returnData, returnReason: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defective">Product is defective</SelectItem>
                      <SelectItem value="wrong_item">Wrong item received</SelectItem>
                      <SelectItem value="not_as_described">Not as described</SelectItem>
                      <SelectItem value="damaged">Damaged during shipping</SelectItem>
                      <SelectItem value="changed_mind">Changed my mind</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="returnType">Return Type</Label>
                  <Select
                    value={returnData.returnType}
                    onValueChange={(value) => setReturnData({ ...returnData, returnType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customerNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="customerNotes"
                    value={returnData.customerNotes}
                    onChange={(e) => setReturnData({ ...returnData, customerNotes: e.target.value })}
                    placeholder="Any additional information about the return..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitReturn} disabled={loading} className="flex-1">
                {loading ? "Submitting..." : "Submit Return Request"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
