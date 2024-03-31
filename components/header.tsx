import React from 'react'

interface HeaderProps {
    masthead: any
}

const Header: React.FC<HeaderProps> = ({ masthead }) => {
    return (
        <>
            <h1>{masthead.title}</h1>
            <h2>{masthead.subtitle}</h2>
        </>
    )
}

export default Header