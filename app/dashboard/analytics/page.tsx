"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react"

interface AnalyticsData {
  summary: {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    lowStockProducts: number
    avgOrderValue: number
  }
  salesData: Array<{
    _id: { year: number; month: number; day: number }
    totalSales: number
    orderCount: number
    avgOrderValue: number
  }>
  productPerformance: Array<{
    _id: string
    totalSold: number
    totalRevenue: number
    orderCount: number
    product: {
      name: string
      images: string[]
    }
  }>
  categoryPerformance: Array<{
    _id: string
    totalSold: number
    totalRevenue: number
    orderCount: number
  }>
  customerAnalytics?: Array<{
    _id: { year: number; month: number; day: number }
    newCustomers: number
  }>
  period: number
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    if (user && (user.role === "seller" || user.role === "admin")) {
      fetchAnalytics()
    }
  }, [user, period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
            ))}
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">₹{analytics.summary.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{analytics.summary.totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold">
                        ₹{Math.round(analytics.summary.avgOrderValue).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{analytics.summary.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock</p>
                      <p className="text-2xl font-bold text-red-600">{analytics.summary.lowStockProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.productPerformance.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div>
                          <h3 className="font-semibold">{product.product.name}</h3>
                          <p className="text-sm text-gray-600">{product.totalSold} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{product.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{product.orderCount} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.categoryPerformance.map((category) => (
                    <div key={category._id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold capitalize mb-2">{category._id}</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Revenue: ₹{category.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm">Units Sold: {category.totalSold}</p>
                        <p className="text-sm">Orders: {category.orderCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend (Last {period} days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.salesData.slice(-7).map((day, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <span className="text-sm">
                        {day._id.day}/{day._id.month}/{day._id.year}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold">₹{day.totalSales.toLocaleString()}</span>
                        <span className="text-sm text-gray-600 ml-2">({day.orderCount} orders)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No analytics data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
