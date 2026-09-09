import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useHeaderData } from '../../contexts/HeaderContext'
import { useFooterData } from '../../contexts/FooterContext'

interface LayoutProps {
    children: React.ReactNode,
}

/**
 * Landmarks a keyboard user can jump straight to. Tab never walks landmark to
 * landmark on its own — this bar is what makes that possible, so the order here
 * is the reading order of the page, not a menu of destinations.
 *
 * Each target carries tabIndex={-1}; a fragment jump to a non-focusable element
 * moves the scroll position but leaves focus behind, and the next Tab then
 * continues from wherever the reader already was.
 */
const SKIP_TARGETS = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#primary-navigation', label: 'Skip to navigation' },
    { href: '#site-footer', label: 'Skip to footer' },
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { headerData } = useHeaderData()
    const { footerData } = useFooterData()
    return (
        <div className="base__typography base__palette layout">
            <div className="skip-links">
                {SKIP_TARGETS.map(target => (
                    <a key={target.href} href={target.href} className="skip-link">{target.label}</a>
                ))}
            </div>
            <Header className="header" headerData={headerData} />
            <main id="main-content" tabIndex={-1}>
                {children}
            </main>
            <Footer className="footer" footerData={footerData} />
        </div>
    )
}

export default Layout
