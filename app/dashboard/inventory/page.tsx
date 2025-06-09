"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Package, CheckCircle, X } from "lucide-react"
import Image from "next/image"

interface InventoryAlert {
  _id: string
  product: {
    _id: string
    name: string
    images: string[]
    stock: number
  }
  alertType: string
  currentStock: number
  message: string
  isRead: boolean
  isResolved: boolean
  createdAt: string
}

export default function InventoryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && (user.role === "seller" || user.role === "admin")) {
      fetchAlerts()
    }
  }, [user])

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/inventory/alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAlert = async (alertId: string, updates: { isRead?: boolean; isResolved?: boolean }) => {
    try {
      const response = await fetch(`/api/inventory/alerts/${alertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setAlerts(alerts.map((alert) => (alert._id === alertId ? { ...alert, ...updates } : alert)))
        toast({
          title: "Alert updated",
          description: "Alert status has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert.",
        variant: "destructive",
      })
    }
  }

  const generateAlerts = async () => {
    try {
      const response = await fetch("/api/inventory/alerts", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Alerts generated",
          description: data.message,
        })
        fetchAlerts()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate alerts.",
        variant: "destructive",
      })
    }
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "out_of_stock":
        return <X className="h-5 w-5 text-red-500" />
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Package className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case "out_of_stock":
        return "bg-red-100 text-red-800 border-red-200"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          {user.role === "admin" && <Button onClick={generateAlerts}>Generate New Alerts</Button>}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold">{alerts.filter((a) => !a.isRead).length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold">{alerts.filter((a) => a.alertType === "out_of_stock").length}</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">{alerts.filter((a) => a.isResolved).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse h-20 rounded"></div>
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inventory alerts at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert._id}
                    className={`border rounded-lg p-4 ${
                      alert.isRead ? "bg-gray-50" : "bg-white"
                    } ${alert.isResolved ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={alert.product.images[0] || "/placeholder.svg?height=60&width=60"}
                          alt={alert.product.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getAlertIcon(alert.alertType)}
                            <Badge className={getAlertColor(alert.alertType)}>
                              {alert.alertType.replace("_", " ").toUpperCase()}
                            </Badge>
                            {!alert.isRead && <Badge variant="destructive">New</Badge>}
                            {alert.isResolved && <Badge variant="secondary">Resolved</Badge>}
                          </div>
                          <h3 className="font-semibold text-lg">{alert.product.name}</h3>
                          <p className="text-gray-600">{alert.message}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Current Stock: {alert.currentStock} | Alert created:{" "}
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!alert.isRead && (
                          <Button size="sm" variant="outline" onClick={() => updateAlert(alert._id, { isRead: true })}>
                            Mark Read
                          </Button>
                        )}
                        {!alert.isResolved && (
                          <Button size="sm" onClick={() => updateAlert(alert._id, { isResolved: true })}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
