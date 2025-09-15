'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflineActions() {
  return (
    <div className="space-y-3">
      <Button
        onClick={() => typeof window !== 'undefined' && window.location.reload()}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  )
}
