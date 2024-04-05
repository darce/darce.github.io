import React from 'react'

interface HeaderProps {
    masthead: {
        title: string,
        subtitle: string
    }
    className?: string
}

const Header: React.FC<HeaderProps> = ({ masthead, className }) => {
    return (
        <header className="header">
            <h1 className="title">{masthead.title}</h1>
            <h2 className="subtitle">{masthead.subtitle}</h2>
        </header>
    )
}

export default Header