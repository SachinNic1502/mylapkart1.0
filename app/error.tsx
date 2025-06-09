"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (error) {
      console.error("Error caught by boundary:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        digest: error.digest,
      });
    } else {
      console.error("Error caught by boundary, but error object was falsy.");
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">We apologize for the inconvenience.</p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
