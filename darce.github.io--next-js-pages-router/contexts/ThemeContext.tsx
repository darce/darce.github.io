import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Appearance = 'light' | 'dark'

interface ThemeContextValue {
    appearance: Appearance
    toggle: () => void
}

const STORAGE_KEY = 'theme-preference'

const ThemeContext = createContext<ThemeContextValue>({
    appearance: 'light',
    toggle: () => {},
})

export const useTheme = () => useContext(ThemeContext)

const getInitialAppearance = (): Appearance => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return 'light'
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [appearance, setAppearance] = useState<Appearance>('light')

    useEffect(() => {
        setAppearance(getInitialAppearance())
    }, [])

    const toggle = useCallback(() => {
        setAppearance(prev => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem(STORAGE_KEY, next)
            return next
        })
    }, [])

    return (
        <ThemeContext.Provider value={{ appearance, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}
