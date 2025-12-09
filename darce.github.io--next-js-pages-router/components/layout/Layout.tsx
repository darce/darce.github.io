import React, { useContext } from 'react'
import Header from './Header/Header'
import { useHeaderData } from '../../contexts/HeaderContext'

interface LayoutProps {
    children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { headerData } = useHeaderData()
    return (
        <div className="base__typography base__palette theme--default layout">
            <Header className="header" headerData={headerData} />
            {children}
        </div>
    )
}

export default Layout