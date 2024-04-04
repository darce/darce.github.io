import React from 'react'
import Link from 'next/link'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer>
                {/** Footer content */}
            </footer>
        </div>
    )
}

export default Layout