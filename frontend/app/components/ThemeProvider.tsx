'use client'

import useThemeStore from '@/store/themeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore()

    return (
        <div className={theme === 'dark' ? 'dark' : ''} style={{ minHeight: '100vh' }}>
            {children}
        </div>
    )
}
