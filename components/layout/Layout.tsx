import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useHeaderData } from '../../contexts/HeaderContext'
import { useFooterData } from '../../contexts/FooterContext'

interface LayoutProps {
    children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { headerData } = useHeaderData()
    const { footerData } = useFooterData()
    return (
        <div className="base__typography base__palette layout">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header className="header" headerData={headerData} />
            <main id="main-content">
                {children}
            </main>
            <Footer className="footer" footerData={footerData} />
        </div>
    )
}

export default Layout