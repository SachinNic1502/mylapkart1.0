"use client"

import type React from "react"

import Link from "next/link"
import { useAuth, useCart } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search, ShoppingCart, User, Coins, Gift, Store, Laptop,
  Smartphone, Monitor, Headphones, Menu, X, Heart, Package
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [userCoins, setUserCoins] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserCoins()
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchUserCoins = async () => {
    try {
      const response = await fetch("/api/coins")
      if (response.ok) {
        const data = await response.json()
        setUserCoins(data.stats.currentBalance)
      }
    } catch (error) {
      console.error("Failed to fetch user coins:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const categories = [
    {
      name: "Laptops",
      icon: Laptop,
      href: "/products?category=laptop",
    },
    {
      name: "iPhones",
      icon: Smartphone,
      href: "/products?category=iphone",
    },
    {
      name: "Desktops",
      icon: Monitor,
      href: "/products?category=desktop",
    },
    {
      name: "Accessories",
      icon: Headphones,
      href: "/products?category=accessories",
    },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled
        ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
        : "bg-white border-b border-gray-100"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons/mylapkart1.png"
                alt="Laptop House"
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-800 bg-clip-text text-transparent text-lg">
                Laptop House
              </span>

            </div>
          </Link>


          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 justify-between">
            <div className="w-48"></div> {/* Spacer */}

            {/* Search Form - Centered */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
              <div className="relative w-full group">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-full border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  variant="default"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {/* <Link 
                href="/products" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                All Products
              </Link> */}

              <Link
                href="/wishlist"
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 text-white">
                    {items.length}
                  </Badge>
                )}
              </Link>

              {user ? (
                <>
                  {/* Coins Display */}
                  <Link
                    href="/coins"
                    className="flex items-center space-x-1 text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    <Coins className="h-5 w-5 text-yellow-600" />
                    <span>{userCoins.toLocaleString()}</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-lg border border-gray-100">
                      <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                        <Link href="/profile" className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                        <Link href="/orders" className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-gray-500" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                        <Link href="/coins" className="flex items-center">
                          <Coins className="h-4 w-4 mr-2 text-yellow-600" />
                          Coin Wallet ({userCoins.toLocaleString()})
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                        <Link href="/referrals" className="flex items-center">
                          <Gift className="h-4 w-4 mr-2 text-green-600" />
                          Referrals
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                        <Link href="/wishlist" className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-red-500" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>

                      {/* Seller Dashboard Access */}
                      {user.role === "seller" && (
                        <>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                            <Link href="/seller/dashboard" className="flex items-center">
                              <Store className="h-4 w-4 mr-2 text-blue-600" />
                              Seller Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Admin Dashboard Access */}
                      {user.role === "admin" && (
                        <>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                            <Link href="/dashboard" className="flex items-center">
                              <Store className="h-4 w-4 mr-2 text-purple-600" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem
                        onClick={logout}
                        className="rounded-md hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-full border-gray-200"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-blue-600 text-white"
                  variant="default"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Mobile Categories */}
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <category.icon className="h-4 w-4 mr-2 text-blue-600" />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className="block p-2 rounded-md hover:bg-gray-50 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  href="/wishlist"
                  className="block p-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Wishlist
                </Link>
                {user && (
                  <>
                    <Link
                      href="/orders"
                      className="block p-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      My Orders
                    </Link>
                    <Link
                      href="/coins"
                      className="block p-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Coins className="h-4 w-4 mr-2 text-yellow-600" />
                      Coin Wallet ({userCoins.toLocaleString()})
                    </Link>

                  </>
                )}
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            {!user ? (
              <div className="mt-4 flex space-x-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-blue-600 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="mt-4 w-full border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Categories Bottom Navbar */}
      <div className="hidden lg:block bg-gray-100 border-b border-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center py-1 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <category.icon className="h-4 w-4 mr-2 text-blue-600" />
                {category.name}
              </Link>
            ))}

          </div>
        </div>
      </div>
    </header>
  )
}
