import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieConsent from '@/components/CookieConsent'
import StorageInitializer from '@/components/StorageInitializer'
import StorageErrorBoundary from '@/components/StorageErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FarmCalc România - Calculator Costuri Agricole',
  description: 'Calculează costurile per hectar pentru culturile tale. Aplicație pentru fermierii din România.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <StorageErrorBoundary>
          <StorageInitializer />
          <div className="min-h-screen bg-[#f8f7f4]">
            {children}
          </div>
          <CookieConsent />
        </StorageErrorBoundary>
      </body>
    </html>
  )
}
