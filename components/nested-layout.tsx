import React from 'react'

interface NestedLayoutProps {
    children: React.ReactNode
}

const NestedLayout: React.FC<NestedLayoutProps> = ({ children }) => {
    return <>{children}</>
}

export default NestedLayout