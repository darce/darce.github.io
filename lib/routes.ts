export type ContentSection = 'projects' | 'research'

export interface NavItem {
    href: string
    label: string
    ariaLabel?: string
}

export const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'home' },
    { href: '/work', label: 'work' },
    { href: '/practice', label: 'practice' },
    { href: '/about', label: 'about' },
    { href: '/resume', label: 'résumé', ariaLabel: 'Résumé (PDF)' },
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
    if (asPath.startsWith('/practice') || asPath.startsWith('/research')) {
        return '/practice'
    }
    if (asPath.startsWith('/about')) {
        return '/about'
    }
    if (asPath.startsWith('/resume')) {
        return '/resume'
    }
    return asPath
}
