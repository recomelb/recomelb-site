import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

export const metadata = {
  title: 'RECOMELB — Melbourne Property Intelligence',
  description: 'Live suburb data, auction clearance rates and market intelligence for Melbourne residential and commercial property. Updated daily.',
  openGraph: {
    title: 'RECOMELB — Melbourne Property Intelligence',
    description: 'Live suburb data, auction clearance rates and market intelligence for Melbourne residential and commercial property. Updated daily.',
    type: 'website',
    siteName: 'RECOMELB',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
