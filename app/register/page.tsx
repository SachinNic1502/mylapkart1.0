"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [referralValid, setReferralValid] = useState<boolean | null>(null)
  const [referrerInfo, setReferrerInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  })

  useEffect(() => {
    const refCode = searchParams.get("ref")
    if (refCode) {
      setReferralCode(refCode)
      validateReferralCode(refCode)
    }
  }, [searchParams])

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null)
      setReferrerInfo(null)
      return
    }

    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate", referralCode: code }),
      })

      const data = await response.json()
      setReferralValid(data.valid)
      setReferrerInfo(data.referrer || null)
    } catch (error) {
      setReferralValid(false)
      setReferrerInfo(null)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReferralCodeChange = (value: string) => {
    setReferralCode(value)
    validateReferralCode(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful!",
          description: data.referralBonus
            ? `Account created successfully! Your referrer earned ${data.referralBonus.toLocaleString()} coins.`
            : "Account created successfully! Please login to continue.",
        })
        router.push("/login")
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              {referralValid && referrerInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <Gift className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">You're invited by {referrerInfo.name}!</p>
                      <p className="text-xs text-green-600">They'll earn 10,000 coins when you sign up</p>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={(e) => handleReferralCodeChange(e.target.value)}
                    placeholder="Enter referral code"
                  />
                  {referralValid === true && (
                    <div className="flex items-center mt-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Valid referral code
                      </Badge>
                    </div>
                  )}
                  {referralValid === false && referralCode && (
                    <div className="flex items-center mt-2">
                      <Badge variant="destructive">Invalid referral code</Badge>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Referral Program Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Join Our Referral Program!</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Get your own referral code after signup</li>
                  <li>• Earn 10,000 coins for each friend who signs up</li>
                  <li>• Earn 5,000 bonus coins when they make their first purchase</li>
                  <li>• 100,000 coins = ₹1,000 discount on any product!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
