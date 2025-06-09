"use client"

import React, { useState, useEffect, useRef } from "react"
import { useCart, useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ShippingAddressSection } from "./components/ShippingAddressSection"
import { PaymentMethodSection } from "./components/PaymentMethodSection"
import { CoinDiscountSection } from "./components/CoinDiscountSection"
import { OrderSummarySection } from "./components/OrderSummarySection"
import { RewardsInfo } from "./components/RewardsInfo"
import { Gift } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

type Address = {
  _id: string
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const paymentVerifiedOrderRef = useRef<any>(null)

  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [userCoins, setUserCoins] = useState(0)
  const [useCoins, setUseCoins] = useState(false)
  const [coinDiscount, setCoinDiscount] = useState(0)
  const [coinsToUse, setCoinsToUse] = useState(0)
  const [maxDiscount, setMaxDiscount] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<Address>({
    _id: '',
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)

  const taxAmount = Math.round((total - coinDiscount) * 0.18)
  const subtotalAfterDiscount = total - coinDiscount
  const finalTotal = subtotalAfterDiscount + taxAmount

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({ ...prev, fullName: user.name }))
      fetchUserCoins()
      fetchSavedAddresses()
    }
  }, [user])

  const fetchSavedAddresses = async () => {
    try {
      setAddressLoading(true)
      const res = await fetch('/api/addresses', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSavedAddresses(data.addresses || [])
        if (data.addresses?.length && !selectedAddressId) {
          setSelectedAddressId(data.addresses[0]._id)
          setShippingAddress(data.addresses[0])
        } else if (selectedAddressId) {
          const selected = data.addresses.find((a: any) => a._id === selectedAddressId)
          if (selected) setShippingAddress(selected)
        }
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err)
    } finally {
      setAddressLoading(false)
    }
  }

  const handleAddOrEditAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddressLoading(true)
    try {
      const method = editingAddress ? 'PUT' : 'POST'
      const url = editingAddress ? `/api/addresses/${editingAddress._id}` : '/api/addresses'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingAddress),
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to save address')
      toast({ title: editingAddress ? 'Address updated!' : 'Address added!', variant: 'default' })
      setShowAddressForm(false)
      setEditingAddress(null)
      fetchSavedAddresses()
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr)
    setShippingAddress(addr)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return
    setAddressLoading(true)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to delete address')
      toast({ title: 'Address deleted!', variant: 'default' })
      if (selectedAddressId === id) {
        setSelectedAddressId("")
        setShippingAddress({ _id: '', fullName: user?.name || '', address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' })
      }
      fetchSavedAddresses()
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setAddressLoading(false)
    }
  }

  const fetchUserCoins = async () => {
    try {
      const response = await fetch("/api/coins", { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setUserCoins(data.stats.currentBalance || 0)
        setMaxDiscount(Math.floor(data.stats.currentBalance / 100000) * 1000)
      }
    } catch (error) {
      console.error("Failed to fetch user coins:", error)
    }
  }

  const handleCoinToggle = (checked: boolean) => {
    setUseCoins(checked)
    if (!checked) {
      setCoinDiscount(0)
      setCoinsToUse(0)
    } else {
      const defaultDiscount = Math.min(maxDiscount, total)
      setCoinDiscount(defaultDiscount)
      setCoinsToUse(Math.ceil(defaultDiscount / 1000) * 100000)
    }
  }

  const handleDiscountChange = (value: number[]) => {
    const discount = value[0]
    setCoinDiscount(discount)
    setCoinsToUse(Math.ceil(discount / 1000) * 100000)
  }

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePostPaymentSuccess = (orderData: any) => {
    clearCart();
    if (orderData.giftCoupon) {
      toast({
        title: "Order placed successfully with gift!",
        description: "Check your gift in order details. You will receive a confirmation email shortly.",
      });
    } else {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
    }
    router.push(`/orders`);
  }

  useEffect(() => {
    if (document.getElementById('razorpay-checkout-js')) return
    const script = document.createElement('script')
    script.id = 'razorpay-checkout-js'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => {
      toast({ title: "Razorpay Error", description: "Failed to load Razorpay script.", variant: "destructive" })
    }
    document.body.appendChild(script)
    return () => {
      document.getElementById('razorpay-checkout-js')?.remove()
    }
  }, [toast])

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first.",
        variant: "destructive",
      })
      return
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping details.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          orderItems: items,
          shippingAddress,
          paymentMethod,
          itemsPrice: total,
          taxPrice: taxAmount,
          totalPrice: finalTotal,
          coinDiscount: useCoins ? coinDiscount : 0,
          coinsUsed: useCoins ? coinsToUse : 0,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      const order = await orderResponse.json()

      if (paymentMethod === "razorpay") {
        if (!razorpayLoaded || !window.Razorpay) {
          toast({
            title: "Razorpay Not Ready",
            description: "Razorpay SDK not loaded. Please wait and try again.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        const razorpayKeyId = process.env.RAZORPAY_KEY_ID
        if (!razorpayKeyId) {
          toast({
            title: "Configuration Error",
            description: "Razorpay Key ID is not configured.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        const options = {
          key: razorpayKeyId,
          amount: order.totalPrice * 100,
          currency: "INR",
          name: "MyLapkart",
          description: `Order ID: ${order._id}`,
          order_id: order.razorpayOrderId,
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch("/api/orders/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderId: order._id,
                }),
              })

              if (!verifyRes.ok) {
                const errorData = await verifyRes.json()
                throw new Error(errorData.message || "Payment verification failed")
              }

              const verificationData = await verifyRes.json()
              paymentVerifiedOrderRef.current = verificationData.order
              handlePostPaymentSuccess(verificationData.order)
              setLoading(false)
            } catch (err) {
              toast({
                title: "Payment Error",
                description: (err as Error).message,
                variant: "destructive",
              })
              router.push(`/orders/${order._id}?payment_status=failed`)
              setLoading(false)
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: user?.email,
            contact: shippingAddress.phone,
          },
          theme: { color: "#4f46e5" },
          modal: {
            ondismiss: () => {
              if (!paymentVerifiedOrderRef.current) {
                setLoading(false)
              }
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.on("payment.failed", (response: any) => {
          toast({
            title: "Payment Failed",
            description: response.error.description,
            variant: "destructive",
          })
          setLoading(false)
          router.push(`/orders/${order._id}?payment_status=failed`)
        })
        rzp.open()
      } else {
        handlePostPaymentSuccess(order)
        setLoading(false)
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ShippingAddressSection
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              shippingAddress={shippingAddress}
              showAddressForm={showAddressForm}
              editingAddress={editingAddress}
              addressLoading={addressLoading}
              handleEditAddress={handleEditAddress}
              handleDeleteAddress={handleDeleteAddress}
              handleAddressChange={handleAddressChange}
              handleAddOrEditAddress={handleAddOrEditAddress}
              setShowAddressForm={setShowAddressForm}
              setEditingAddress={setEditingAddress}
              setShippingAddress={setShippingAddress}
              setSelectedAddressId={setSelectedAddressId}
              userName={user?.name || ""}
            />
            <PaymentMethodSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            <CoinDiscountSection
              userCoins={userCoins}
              useCoins={useCoins}
              coinDiscount={coinDiscount}
              coinsToUse={coinsToUse}
              maxDiscount={maxDiscount}
              handleCoinToggle={handleCoinToggle}
            />
          </div>
          <div>
            <OrderSummarySection
              items={items}
              total={total}
              useCoins={useCoins}
              coinDiscount={coinDiscount}
              taxAmount={taxAmount}
              finalTotal={finalTotal}
              loading={loading}
              razorpayLoaded={razorpayLoaded}
              paymentMethod={paymentMethod}
              handlePlaceOrder={handlePlaceOrder}
            />
            <RewardsInfo finalTotal={finalTotal} />
          </div>
        </div>
      </div>
    </div>
  )
}