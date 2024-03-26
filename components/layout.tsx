import React from 'react'
import Link from 'next/link'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-800 text-white py-4">
                {/** Header content */}
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-gray-800 text-white py-4">
                {/** Footer content */}
            </footer>
        </div>
    )
}

export default Layout