import React from 'react'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="theme--default">
            <section className="base layout">
                {children}
            </section>
        </main>
    )
}

export default Layout