import React from 'react'
import Header from './Header/Header'
import { useHeaderData } from '../../contexts/HeaderContext'

interface LayoutProps {
    children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { headerData } = useHeaderData()
    return (
        <div className="base__typography base__palette layout">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header className="header" headerData={headerData} />
            <main id="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout