import React from 'react'
import Link from 'next/link'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="container">
            {children}
        </main>
    )
}

export default Layout