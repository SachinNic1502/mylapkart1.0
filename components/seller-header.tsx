"use client"

import Link from "next/link"
import { useAuth } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Package, ShoppingCart, BarChart3, Settings, LogOut, Home } from "lucide-react"

export function SellerHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/seller/dashboard" className="text-2xl font-bold text-blue-600">
              MyLapKart
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/seller/dashboard" className="flex items-center space-x-2 hover:text-blue-600">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/seller/products" className="flex items-center space-x-2 hover:text-blue-600">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link href="/seller/orders" className="flex items-center space-x-2 hover:text-blue-600">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Customer View
              </Link>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/seller/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
