"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "customer" | "seller" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadCart()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setCartItems([])
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const loadCart = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart")
      if (saved) {
        try {
          setCartItems(JSON.parse(saved))
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
          localStorage.removeItem("cart")
          setCartItems([])
        }
      }
    }
  }

  const saveCart = (items: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
    }
    setCartItems(items)
  }

  const addItem = (item: CartItem) => {
    const existing = cartItems.find((i) => i.id === item.id)
    if (existing) {
      updateQuantity(item.id, existing.quantity + item.quantity)
    } else {
      saveCart([...cartItems, item])
    }
  }

  const removeItem = (id: string) => {
    saveCart(cartItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    saveCart(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    localStorage.removeItem("cart")
    setCartItems([])
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      <CartContext.Provider
        value={{
          items: cartItems,
          addItem,
          removeItem,
          updateQuantity,
          clearCart,
          total,
        }}
      >
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}
