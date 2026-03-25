import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import ThemeProvider from './components/ThemeProvider'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Baillies Career Portal",
    description: "Find your next opportunity at Baillies",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <ThemeProvider>
                    <Navbar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
