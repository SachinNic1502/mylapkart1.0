"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, TrendingDown, Gift, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CoinData {
  stats: {
    currentBalance: number
    totalEarned: number
    totalRedeemed: number
    conversionRate: number
    maxDiscount: number
  }
  transactions: Array<{
    _id: string
    type: "earned" | "redeemed" | "bonus" | "refund"
    amount: number
    source: string
    description: string
    balanceAfter: number
    createdAt: string
    metadata?: any
  }>
}

export default function CoinsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CoinData | null>(null)

  useEffect(() => {
    if (user) {
      fetchCoinData()
    }
  }, [user])

  const fetchCoinData = async () => {
    try {
      const response = await fetch("/api/coins")
      if (response.ok) {
        const coinData = await response.json()
        setData(coinData)
      }
    } catch (error) {
      console.error("Failed to fetch coin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "redeemed":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "bonus":
        return <Gift className="h-4 w-4 text-purple-600" />
      default:
        return <Coins className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
        return "text-green-600"
      case "redeemed":
        return "text-red-600"
      case "bonus":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600">You need to be logged in to view your coin wallet.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coin wallet...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Coin Wallet</h1>
            <p className="text-gray-600">
              Manage your coins and track your earnings. Use coins to get discounts on your purchases!
            </p>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <Coins className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h2 className="text-4xl font-bold mb-2">{data?.stats.currentBalance?.toLocaleString() || 0}</h2>
                <p className="text-xl opacity-90 mb-4">Available Coins</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-lg font-semibold">
                    Discount Value: ₹{data?.stats.maxDiscount?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm opacity-80">
                    {data?.stats.conversionRate?.toLocaleString()} coins = ₹1,000 discount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold text-green-600">
                      {data?.stats.totalEarned?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Redeemed</p>
                    <p className="text-2xl font-bold text-red-600">
                      {data?.stats.totalRedeemed?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to Earn */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How to Earn Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Make Purchases</h3>
                  <p className="text-sm text-gray-600">Earn 1% of order value as coins on every purchase</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Refer Friends</h3>
                  <p className="text-sm text-gray-600">Get 10,000 coins for each successful referral signup</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">First Orders</h3>
                  <p className="text-sm text-gray-600">
                    Earn 5,000 bonus coins when your referrals make their first purchase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.transactions && data.transactions.length > 0 ? (
                <div className="space-y-4">
                  {data.transactions.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <div className="ml-3">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString()} at{" "}
                            {new Date(transaction.createdAt).toLocaleTimeString()}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {transaction.source.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "earned" || transaction.type === "bonus" ? "+" : "-"}
                          {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Balance: {transaction.balanceAfter.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-600 mb-4">Start earning coins by making purchases or referring friends!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <Link href="/referrals">
              <Button variant="outline" className="mr-4">
                <Gift className="h-4 w-4 mr-2" />
                Refer Friends
              </Button>
            </Link>
            <Link href="/products">
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
