export const SITE_URL = 'https://darce.xyz'
export const SITE_NAME = 'Daniel Arcé'
export const SITE_TITLE = 'Daniel Arcé — Product Engineer, Accessibility, AI Workflows & Front-End Systems'
export const SITE_DESCRIPTION =
    'Product engineer with 14+ years building accessible, scalable software. Specializing in accessibility, AI-assisted workflows, and front-end systems for consumer platforms and startups.'

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
        'https://altcontext.com',
    ],
    knowsAbout: [
        'Accessibility',
        'WCAG 2.2',
        'AI-assisted workflows',
        'React',
        'TypeScript',
        'Front-end architecture',
        'Design systems',
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
