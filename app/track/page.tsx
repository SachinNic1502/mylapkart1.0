"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Package, Truck, MapPin, Clock } from "lucide-react"

interface TrackingEvent {
  status: string
  description: string
  location: string
  timestamp: string
  updatedBy: string
}

interface Shipment {
  _id: string
  trackingNumber: string
  carrier: string
  status: string
  estimatedDelivery: string
  actualDelivery?: string
  trackingEvents: TrackingEvent[]
  order: {
    _id: string
    orderItems: Array<{
      name: string
      quantity: number
    }>
  }
}

export default function TrackPage() {
  const { toast } = useToast()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a tracking number.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/shipping/track?trackingNumber=${trackingNumber}`)
      if (response.ok) {
        const data = await response.json()
        setShipment(data)
      } else {
        toast({
          title: "Shipment not found",
          description: "No shipment found with this tracking number.",
          variant: "destructive",
        })
        setShipment(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track shipment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "created":
      case "picked_up":
        return <Package className="h-5 w-5" />
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <MapPin className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800"
      case "picked_up":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
            <p className="text-xl text-gray-600">
              Enter your tracking number to get real-time updates on your shipment.
            </p>
          </div>

          {/* Tracking Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number (e.g., MLK1234567890)"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleTrack} disabled={loading}>
                    {loading ? "Tracking..." : "Track"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {shipment && (
            <div className="space-y-6">
              {/* Shipment Info */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Shipment Details</CardTitle>
                      <p className="text-gray-600">Tracking Number: {shipment.trackingNumber}</p>
                    </div>
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold">Carrier</h4>
                      <p className="text-gray-600 capitalize">{shipment.carrier}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Estimated Delivery</h4>
                      <p className="text-gray-600">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                    {shipment.actualDelivery && (
                      <div>
                        <h4 className="font-semibold">Delivered On</h4>
                        <p className="text-gray-600">{new Date(shipment.actualDelivery).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    {shipment.order.orderItems.map((item, index) => (
                      <p key={index} className="text-gray-600">
                        • {item.name} (Qty: {item.quantity})
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shipment.trackingEvents
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold capitalize">{event.status.replace("_", " ")}</h4>
                                <p className="text-gray-600">{event.description}</p>
                                {event.location && <p className="text-sm text-gray-500">📍 {event.location}</p>}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {new Date(event.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
