import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieConsent from '@/components/CookieConsent'

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
        <div className="min-h-screen bg-gradient-to-br from-farm-green-50 to-farm-earth-50">
          {children}
        </div>
        <CookieConsent />
      </body>
    </html>
  )
}
