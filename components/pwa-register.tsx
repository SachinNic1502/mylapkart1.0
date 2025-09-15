'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    // Handle app installation prompt
    let deferredPrompt: any

    const showInstallPromotion = () => {
      // Create and show install banner
      const installBanner = document.createElement('div')
      installBanner.id = 'pwa-install-banner'
      installBanner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: #000;
          color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">Install Laptop House</div>
            <div style="font-size: 14px; opacity: 0.9;">Get the full app experience</div>
          </div>
          <div>
            <button id="pwa-install-btn" style="
              background: white;
              color: black;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              font-weight: 600;
              cursor: pointer;
              margin-right: 8px;
            ">Install</button>
            <button id="pwa-dismiss-btn" style="
              background: transparent;
              color: white;
              border: 1px solid rgba(255,255,255,0.3);
              padding: 8px 12px;
              border-radius: 4px;
              cursor: pointer;
            ">×</button>
          </div>
        </div>
      `
      
      document.body.appendChild(installBanner)
      
      // Handle install button click
      const installBtn = document.getElementById('pwa-install-btn')
      const dismissBtn = document.getElementById('pwa-dismiss-btn')
      
      installBtn?.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`User response to the install prompt: ${outcome}`)
          deferredPrompt = null
          hideInstallPromotion()
        }
      })
      
      dismissBtn?.addEventListener('click', () => {
        hideInstallPromotion()
      })
    }

    const hideInstallPromotion = () => {
      const banner = document.getElementById('pwa-install-banner')
      if (banner) {
        banner.remove()
      }
    }

    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox
      
      // Add event listeners to handle PWA lifecycle
      wb.addEventListener('installed', (event: any) => {
        console.log('Service Worker installed:', event)
      })

      wb.addEventListener('waiting', (event: any) => {
        console.log('Service Worker waiting:', event)
        // Show update available notification
        if (confirm('A new version is available! Click OK to update.')) {
          wb.messageSkipWaiting()
        }
      })

      wb.addEventListener('controlling', (event: any) => {
        console.log('Service Worker controlling:', event)
        window.location.reload()
      })

      wb.register()
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Fallback registration for custom service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New update available
                    if (confirm('A new version is available! Click OK to update.')) {
                      newWorker.postMessage({ action: 'skipWaiting' })
                    }
                  }
                })
              }
            })
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      
      // Show install button or banner
      console.log('PWA install prompt available')
      
      // You can show a custom install button here
      showInstallPromotion()
    }

    const handleAppInstalled = () => {
      console.log('PWA was installed')
      // Hide install promotion
      hideInstallPromotion()
      deferredPrompt = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return null
}

// Extend window type for TypeScript
declare global {
  interface Window {
    workbox: any
  }
}
