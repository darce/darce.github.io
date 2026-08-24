export const SITE_URL = 'https://darce.xyz'
export const SITE_NAME = 'Daniel Arcé'
export const SITE_TITLE = 'Daniel Arcé — Product Designer & Design Technologist'
export const SITE_DESCRIPTION =
    'Product designer and design technologist, 14+ years shipping software for media, enterprise SaaS, and AI products. Interaction design and accessibility.'

export const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daniel Arcé',
    url: SITE_URL,
    jobTitle: 'Product Designer & Design Technologist',
    description: SITE_DESCRIPTION,
    email: 'mailto:daniel.arce@gmail.com',
    sameAs: [
        'https://github.com/darce',
    ],
    knowsAbout: [
        'Interaction design',
        'Human-AI interaction',
        'Product design',
        'Accessibility',
        'WCAG 2.2',
        'Design systems',
        'Prototyping',
        'React',
        'TypeScript',
    ],
}

export const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
        '@type': 'Person',
        name: 'Daniel Arcé',
    },
}
