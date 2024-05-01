import React from 'react'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="base theme--default layout">
            {children}
        </div>
    )
}

export default Layout