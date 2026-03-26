import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeProvider from './components/ThemeProvider'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
    title: "Baillies Career Portal",
    description: "Find your next opportunity at Baillies",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.className} flex flex-col min-h-screen`}>
                <ThemeProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
