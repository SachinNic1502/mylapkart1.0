"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function CancelOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [order, setOrder] = useState<any>(null)

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

        // Check if order can be cancelled
        if (!["placed", "processing"].includes(data.status)) {
          toast({
            title: "Cannot cancel order",
            description: "This order cannot be cancelled at this stage.",
            variant: "destructive",
          })
          router.push(`/orders/${params.id}`)
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    }
  }

  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/orders/${params.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully.",
        })
        router.push(`/orders/${params.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cancel Order</h1>

          <Card>
            <CardHeader>
              <CardTitle>Cancel Order #{order._id.slice(-8)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Order cancellation is only available for orders that haven't been shipped</li>
                  <li>• Refunds will be processed within 5-7 business days</li>
                  <li>• You will receive an email confirmation once the cancellation is processed</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Cancellation *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this order..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => router.back()} className="flex-1">
                  Go Back
                </Button>
                <Button onClick={handleCancelOrder} disabled={loading} variant="destructive" className="flex-1">
                  {loading ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
