'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import GlobalTrailer from './GlobalTrailer'
import { useIsNotFound } from '@/hooks/useIsNotFound'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isNotFound = useIsNotFound()
  
  // Pages that should not have header/footer
  const noLayoutPages = ['/login']
  const isLoginPage = pathname === '/login' || pathname?.endsWith('/login')
  const shouldHideLayout = isLoginPage || isNotFound

  if (shouldHideLayout) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <GlobalTrailer />
    </>
  )
}
