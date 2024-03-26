import React from 'react'

interface NestedLayoutProps {
    children: React.ReactNode
}

const NestedLayout: React.FC<NestedLayoutProps> = ({ children }) => {
    return <div>{children}</div>
}

export default NestedLayout