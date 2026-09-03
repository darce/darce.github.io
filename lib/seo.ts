import siteMeta from './siteMeta.json'

export const SITE_URL = 'https://darce.xyz'
export const SITE_NAME = 'Daniel Arcé'
export const SITE_TITLE = 'Daniel Arcé — Product Engineer'
export const SITE_DESCRIPTION = siteMeta.description

export const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daniel Arcé',
    url: SITE_URL,
    jobTitle: 'Product Engineer',
    description: SITE_DESCRIPTION,
    email: 'mailto:daniel.arce@gmail.com',
    sameAs: [
        'https://github.com/darce',
    ],
    knowsAbout: [
        'Interaction design',
        'Product design',
        'Human-AI interaction',
        'Accessibility',
        'Design systems',
        'Semantic search',
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
