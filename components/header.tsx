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
        <header className={`container mx-auto px-4 ${className}`}>
            <h1 className='text-2xl font-bold'>{masthead.title}</h1>
            <h2 className='mt-2'>{masthead.subtitle}</h2>
        </header>
    )
}

export default Header