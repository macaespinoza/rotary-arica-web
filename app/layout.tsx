import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata: Metadata = {
  title: 'Rotary Club Arica',
  description: 'Gente de acción creando cambios duraderos en nuestra comunidad y el mundo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Bootstrap 5 CSS */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" />
        {/* Bootstrap Icons */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Open+Sans+Condensed:wght@300;700&display=swap" rel="stylesheet" />
        {/* Custom CSS */}
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        {children}
        <Analytics />
        {/* Bootstrap 5 JS Bundle */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        {/* Custom JS */}
        <Script src="/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
