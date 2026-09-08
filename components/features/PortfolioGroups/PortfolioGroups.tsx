import React from 'react'
import { ContentIndexData } from '../../../types'
import { ContentSection } from '../../../lib/routes'
import SectionCards from '../SectionCards/SectionCards'
import styles from './PortfolioGroups.module.scss'

export interface GroupDefinition {
    id: string
    title: string
    description: string
    slugs: string[]
}

export interface PortfolioGroup extends Omit<GroupDefinition, 'slugs'> {
    items: ContentIndexData[]
}

/** Preserve uncategorised entries, omit empty groups, and show each slug once. */
export function groupPortfolioItems(
    items: ContentIndexData[],
    definitions: GroupDefinition[],
    fallback: Omit<GroupDefinition, 'slugs'>,
): PortfolioGroup[] {
    const bySlug = new Map(items.map(item => [item.slug, item]))
    const used = new Set<string>()
    const groups: PortfolioGroup[] = []
    for (const definition of definitions) {
        const selected: ContentIndexData[] = []
        for (const slug of definition.slugs) {
            const item = bySlug.get(slug)
            if (item && !used.has(slug)) {
                selected.push(item)
                used.add(slug)
            }
        }
        if (selected.length) {
            groups.push({
                id: definition.id,
                title: definition.title,
                description: definition.description,
                items: selected,
            })
        }
    }
    const remaining = items.filter(item => {
        if (used.has(item.slug)) return false
        used.add(item.slug)
        return true
    })
    if (remaining.length) groups.push({ ...fallback, items: remaining })
    return groups
}

interface PortfolioGroupsProps {
    section: ContentSection
    title: string
    description: string
    groups: PortfolioGroup[]
}

const PortfolioGroups: React.FC<PortfolioGroupsProps> = ({ section, title, description, groups }) => (
    <div className={styles.index}>
        <header className={styles.intro}>
            <h1>{title}</h1>
            <p>{description}</p>
        </header>
        {groups.length > 1 && (
            <nav aria-label={`${title} topics`} className={styles.topics}>
                <ul>
                    {groups.map(group => <li key={group.id}><a href={`#${group.id}`}>{group.title}</a></li>)}
                </ul>
            </nav>
        )}
        {groups.map(group => (
            <section key={group.id} className={styles.group} aria-labelledby={group.id}>
                <header className={styles.groupIntro}>
                    <h2 id={group.id}>{group.title}</h2>
                    <p>{group.description}</p>
                </header>
                <SectionCards section={section} items={group.items} />
            </section>
        ))}
        {!groups.length && <p>No entries are available yet.</p>}
    </div>
)

export default PortfolioGroups
