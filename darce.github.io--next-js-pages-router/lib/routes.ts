export type ContentSection = 'projects' | 'research'

export interface NavItem {
    href: string
    label: string
}

export const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'work' },
    { href: '/research', label: 'research' },
    { href: '/about', label: 'about' },
]

export const buildItemPath = (section: ContentSection, slug: string): string =>
    `/${section}/${slug}`

export const resolveNavPath = (asPath: string): string => {
    if (asPath === '/' || asPath.startsWith('/projects')) {
        return '/'
    }
    if (asPath.startsWith('/research')) {
        return '/research'
    }
    return asPath
}
