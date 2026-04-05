import React, { createContext, useContext } from 'react'

export interface SiblingLink {
    href: string
    title: string
}

interface BreadcrumbContextProps {
    title: string | null
    prev: SiblingLink | null
    next: SiblingLink | null
}

const BreadcrumbContext = createContext<BreadcrumbContextProps>({
    title: null,
    prev: null,
    next: null,
})

export const useBreadcrumb = () => useContext(BreadcrumbContext)

export const BreadcrumbProvider: React.FC<{
    children: React.ReactNode
    title?: string | null
    prev?: SiblingLink | null
    next?: SiblingLink | null
}> = ({ children, title = null, prev = null, next = null }) => (
    <BreadcrumbContext.Provider value={{ title, prev, next }}>
        {children}
    </BreadcrumbContext.Provider>
)
