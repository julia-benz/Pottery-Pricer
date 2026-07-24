import './globals.css'
import { Analytics } from '@vercel/analytics/next' // 1. Added this import statement

export const metadata = {
  title: 'Pottery Pricer — Know what your work is worth',
  description: 'Cost-based pricing, live Etsy comps, and AI listing copy — built for ceramic artists.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Ccircle cx='13' cy='13' r='12' fill='%23EDE3D3' stroke='%232B2420' stroke-width='1.4'/%3E%3Ccircle cx='13' cy='13' r='7.5' stroke='%23B5562D' stroke-width='1.4'/%3E%3Ccircle cx='13' cy='13' r='3' fill='%233D6B5C'/%3E%3C/svg%3E",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Karla:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
        <Analytics /> {/* 2. Added this component inside the body */}
      </body>
    </html>
  )
}
