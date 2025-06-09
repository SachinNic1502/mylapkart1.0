"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, Share2, Users, Coins, TrendingUp, Gift } from "lucide-react"
import Link from "next/link"

interface ReferralData {
  referralCode: string
  referralLink: string
  stats: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    totalEarnings: number
    currentCoins: number
  }
  referrals: Array<{
    _id: string
    referred: {
      name: string
      email: string
      createdAt: string
    }
    status: string
    totalRewards: number
    firstOrderCompleted: boolean
    createdAt: string
  }>
}

export default function ReferralsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ReferralData | null>(null)

  useEffect(() => {
    if (user) {
      fetchReferralData()
    }
  }, [user])

  const fetchReferralData = async () => {
    try {
      const response = await fetch("/api/referrals")
      if (response.ok) {
        const referralData = await response.json()
        setData(referralData)
      }
    } catch (error) {
      console.error("Failed to fetch referral data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
    }
  }

  const shareReferralLink = async () => {
    if (data?.referralLink && navigator.share) {
      try {
        await navigator.share({
          title: "Join MyLapKart",
          text: "Get amazing laptops at great prices! Use my referral link to sign up.",
          url: data.referralLink,
        })
      } catch (error) {
        copyReferralLink()
      }
    } else {
      copyReferralLink()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600">You need to be logged in to view your referrals.</p>
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
            <p className="mt-4 text-gray-600">Loading referral data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
            <p className="text-gray-600">
              Invite friends and earn coins! Get 10,000 coins for each signup and 5,000 coins for their first order.
            </p>
          </div>

          {/* Referral Link Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={data?.referralLink || ""} readOnly className="flex-1" />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={shareReferralLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your Referral Code:</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {data?.referralCode}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                    <p className="text-2xl font-bold">{data?.stats.totalReferrals || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Successful</p>
                    <p className="text-2xl font-bold">{data?.stats.completedReferrals || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Coins className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold">{data?.stats.totalEarnings?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Coins</p>
                    <p className="text-2xl font-bold">{data?.stats.currentCoins?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                  <p className="text-sm text-gray-600">Share your unique referral link with friends and family</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. They Sign Up</h3>
                  <p className="text-sm text-gray-600">When someone signs up using your link, you earn 10,000 coins</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Earn More</h3>
                  <p className="text-sm text-gray-600">Get 5,000 bonus coins when they make their first purchase</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Coin Value:</strong> 100,000 coins = ₹1,000 discount on any product!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.referrals && data.referrals.length > 0 ? (
                <div className="space-y-4">
                  {data.referrals.map((referral) => (
                    <div key={referral._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{referral.referred.name}</h4>
                        <p className="text-sm text-gray-600">{referral.referred.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(referral.referred.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={referral.status === "completed" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">{referral.totalRewards.toLocaleString()} coins</p>
                        {referral.firstOrderCompleted && (
                          <p className="text-xs text-green-600">First order completed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your referral link to earn coins!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <Link href="/coins">
              <Button variant="outline" className="mr-4">
                <Coins className="h-4 w-4 mr-2" />
                View Coin Wallet
              </Button>
            </Link>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
