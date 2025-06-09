"use client"

import { useState } from "react"
import { Card, CardContent } from "./card"
import Image from "next/image"

interface ScratchCardProps {
  giftItem: {
    name: string
    description: string
    image: string
    value: number
  }
}

export function ScratchCard({ giftItem }: ScratchCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        {!isRevealed ? (
          <div 
            onClick={() => setIsRevealed(true)}
            className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 cursor-pointer flex items-center justify-center"
          >
            <p className="text-gray-600 font-medium">Click to reveal your gift!</p>
          </div>
        ) : (
          <div className="text-center space-y-4 animate-reveal">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={giftItem.image}
                alt={giftItem.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-bold text-xl">{giftItem.name}</h3>
            <p className="text-gray-600">{giftItem.description}</p>
            <p className="font-semibold text-green-600">Value: ₹{giftItem.value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
