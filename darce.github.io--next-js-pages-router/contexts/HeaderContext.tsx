import { createContext, useContext } from 'react'
import { ContentIndexData } from '../types'

interface HeaderContextProps {
    headerData: ContentIndexData[]
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined)

export const useHeaderData = () => {
    const context = useContext(HeaderContext)
    if (context === undefined) {
        throw new Error('useHeaderData must be used within a HeaderDataProvider')
    }
    return context
}

export const HeaderDataProvider: React.FC<{ children: React.ReactNode, initialData?: ContentIndexData[] }> = ({ children, initialData = [] }) => {

    return (
        <HeaderContext.Provider value={{ headerData: initialData }}>
            {children}
        </HeaderContext.Provider>
    )
}
