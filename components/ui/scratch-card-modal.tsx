"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import Image from "next/image"

interface ScratchCardModalProps {
  isOpen: boolean
  onClose: () => void
  giftCoupon: {
    code: string
    giftItem: {
      name: string
      description: string
      image: string
      value: number
    }
    validUntil: string
  }
  orderId: string
}

export function ScratchCardModal({ isOpen, onClose, giftCoupon }: ScratchCardModalProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Handle client-side mounting for the portal
  useEffect(() => {
    setMounted(true)
    // console.log("ScratchCardModal mounted, isOpen:", isOpen)
    
    // Force a re-render after mounting to ensure the portal is created
    const forceUpdateTimer = setTimeout(() => {
      // console.log("ScratchCardModal force update after mount")
      setMounted(state => state)
    }, 100)
    
    return () => {
      clearTimeout(forceUpdateTimer)
      setMounted(false)
    }
  }, [])
  
  // Log when props change
  useEffect(() => {
    // console.log("ScratchCardModal: isOpen changed to", isOpen)
    // console.log("ScratchCardModal: current props", { isOpen, giftCoupon: !!giftCoupon })
    
    if (isOpen) {
      // console.log("ScratchCardModal: Should be showing with giftCoupon:", giftCoupon)
      // Reset revealed state when opening a new coupon
      setIsRevealed(false)
      
      // Prevent body scrolling when modal is open
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden'
      }
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, giftCoupon])

  const handleClose = () => {
    // // console.log("ScratchCardModal: handleClose called")
    onClose()
  }

  // If not mounted yet or not open, or missing giftCoupon data, don't render anything
  if (!mounted || !isOpen || !giftCoupon) {
    // console.log("ScratchCardModal not rendering due to:", { mounted, isOpen, hasGiftCoupon: !!giftCoupon })
    return null
  }
  
  // console.log("ScratchCardModal RENDERING NOW with data:", giftCoupon)
  
  // Create a portal for the modal dialog
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" 
         onClick={isRevealed ? () => handleClose() : undefined}>
      <div 
        className="bg-white p-6 rounded-lg max-w-md w-full space-y-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold">Your Gift Reward!</h3>
        </div>
        
        {!isRevealed ? (
          <div 
            onClick={() => {
              // console.log("ScratchCardModal: Revealing gift");
              setIsRevealed(true);
            }}
            className="bg-gradient-to-r from-gray-200 to-gray-300 p-8 rounded-lg cursor-pointer text-center"
          >
            <p className="text-gray-600 font-medium">Click to reveal your gift!</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={giftCoupon.giftItem.image}
                alt={giftCoupon.giftItem.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-bold text-xl">{giftCoupon.giftItem.name}</h3>
            <p className="text-gray-600">{giftCoupon.giftItem.description}</p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-semibold text-green-800">Value: ₹{giftCoupon.giftItem.value}</p>
              <p className="text-sm text-green-600 mt-1">Coupon Code: {giftCoupon.code}</p>
            </div>
            <p className="text-sm text-gray-500">
              Valid until: {new Date(giftCoupon.validUntil).toLocaleDateString()}
            </p>
            <Button onClick={handleClose} className="w-full">
              View Order Details
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
