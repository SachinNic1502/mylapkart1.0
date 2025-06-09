"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { SellerHeader } from "@/components/seller-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, Users, TrendingUp, Plus, Clock, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [products, setProducts] = useState([])
  const [contactMessages, setContactMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingContact, setLoadingContact] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "seller") {
      router.push("/")
      return
    }
    fetchDashboardData()
  }, [user, router])

  useEffect(() => {
    if (!user || user.role !== "seller") return
    setLoadingContact(true)
    fetch("/api/seller/contact-messages")
      .then(res => res.json())
      .then(data => setContactMessages(Array.isArray(data) ? data : []))
      .catch(() => setContactMessages([]))
      .finally(() => setLoadingContact(false))
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch("/api/seller/stats"), 
        fetch("/api/seller/orders"),
        fetch("/api/seller/products")
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        // Handle both response formats: array directly or nested in products property
        setProducts(Array.isArray(productsData) ? productsData : productsData.products || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: "Product has been deleted successfully.",
        })
        fetchDashboardData()
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800"
      case "like_new":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "fair":
        return "bg-orange-100 text-orange-800"
      case "refurbished":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [activeTab, setActiveTab] = useState<"orders" | "products" | "contact">("orders")

  if (!user || user.role !== "seller") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <Button asChild>
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="contact">Contact Messages</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded h-16"></div>
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                      <div key={order.orderId || order._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order {order.orderId || order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <p className="font-bold">₹{order.totalPrice.toLocaleString()}</p>
                          <Badge>{order.status.replace("_", " ")}</Badge>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/seller/orders`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Products</CardTitle>
                  <Button asChild>
                    <Link href="/seller/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded h-16"></div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Products Yet</h3>
                    <p className="text-gray-500 mt-1">Add your first product to start selling</p>
                    <Button asChild className="mt-4">
                      <Link href="/seller/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product: any) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                                {product.images && product.images.length > 0 ? (
                                  <img 
                                    src={product.images[0].url} 
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                    <Package className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                                <p className="text-xs text-gray-500">ID: {product._id.slice(-6)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-blue-600">₹{product.price.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getConditionColor(product.condition || 'new')}>
                                {(product.condition || 'new').replace("_", " ").toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category || 'Uncategorized'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'} ({product.stock})
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/products/${product.slug || product._id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/seller/products/edit/${product._id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteProduct(product._id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {products.length > 10 && (
                      <div className="mt-4 flex justify-center">
                        <Button asChild variant="outline">
                          <Link href="/seller/products">
                            View All Products
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingContact ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded h-16"></div>
                    ))}
                  </div>
                ) : contactMessages.length === 0 ? (
                  <div className="text-center text-gray-600 py-8">No contact messages yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactMessages.map((msg, i) => (
                          <TableRow key={msg._id || i}>
                            <TableCell>{msg.name}</TableCell>
                            <TableCell>{msg.email}</TableCell>
                            <TableCell>{msg.subject}</TableCell>
                            <TableCell className="max-w-xs truncate" title={msg.message}>{msg.message}</TableCell>
                            <TableCell>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 py-8">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
