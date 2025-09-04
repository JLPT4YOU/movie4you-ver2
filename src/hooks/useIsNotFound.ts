'use client'

import { useEffect, useState } from 'react'

export function useIsNotFound() {
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    // Check if the current page is a 404 page by looking at document title or other indicators
    const checkNotFound = () => {
      // Next.js sets document title to "404: This page could not be found" for not-found pages
      const is404 = document.title.includes('404') || 
                   document.title.includes('This page could not be found') ||
                   window.location.pathname.includes('404')
      setIsNotFound(is404)
    }

    // Check immediately
    checkNotFound()

    // Also check after a short delay to ensure DOM is fully loaded
    const timer = setTimeout(checkNotFound, 100)

    return () => clearTimeout(timer)
  }, [])

  return isNotFound
}
