import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'RECOMELB — Residential · Commercial · Melbourne',
  description: 'Real-time suburb data, auction results and market intelligence for Melbourne\'s inner ring. Updated every Monday.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
