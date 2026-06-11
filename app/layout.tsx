import './globals.css'

import {  Playfair_Display, Italianno, Inter, Great_Vibes } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

const italianno = Italianno({
  subsets: ['latin'],
  weight: '400',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
})

const inter = Inter({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${italianno.className} ${inter.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}