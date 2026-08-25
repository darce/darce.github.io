import { createContext, useContext } from 'react'
import { MarkdownData } from '../types'

interface FooterContextProps {
    footerData: MarkdownData[]
}

const FooterContext = createContext<FooterContextProps | undefined>(undefined)

export const useFooterData = () => {
    const context = useContext(FooterContext)
    if (context === undefined) {
        return { footerData: [] }
    }
    return context
}

export const FooterDataProvider: React.FC<{ children: React.ReactNode, initialData?: MarkdownData[] }> = ({ children, initialData = [] }) => {

    return (
        <FooterContext.Provider value={{ footerData: initialData }}>
            {children}
        </FooterContext.Provider>
    )
}
