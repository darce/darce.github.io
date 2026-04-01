export type ContentSection = 'projects' | 'research'

export interface NavItem {
    href: string
    label: string
}

export const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'home' },
    { href: '/work', label: 'work' },
    { href: '/research', label: 'research' },
    { href: '/about', label: 'about' },
]

export const buildItemPath = (section: ContentSection, slug: string): string =>
    `/${section}/${slug}`

export const resolveNavPath = (asPath: string): string => {
    if (asPath === '/') {
        return '/'
    }
    if (asPath.startsWith('/work') || asPath.startsWith('/projects')) {
        return '/work'
    }
    if (asPath.startsWith('/research')) {
        return '/research'
    }
    if (asPath.startsWith('/about')) {
        return '/about'
    }
    return asPath
}
