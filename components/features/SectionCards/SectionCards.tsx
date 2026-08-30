import React from 'react'
import Link from 'next/link'
import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage'
import { ContentIndexData } from '../../../types'
import { ContentSection, buildItemPath } from '../../../lib/routes'
import { formatResearchBadge } from '../../../lib/researchEvidenceLabels'
import styles from './SectionCards.module.scss'

interface SectionCardsProps {
    section: ContentSection
    items: ContentIndexData[]
    className?: string
}

const EAGER_CARDS = 3

const SectionCards: React.FC<SectionCardsProps> = ({ section, items, className }) => {
    if (!items || items.length === 0) {
        return (
            <section className={`contentCards ${className || ''}`}>
                <p>No content found</p>
            </section>
        )
    }

    return (
        <section className={`contentCards ${className || ''}`}>
            <div className={styles.cardGrid}>
                {items.map((item, index) => {
                    const thumb = item.metaData.thumbnail ?? item.metaData.images?.[0]

                    return (
                        <Link
                            key={item.slug}
                            href={buildItemPath(section, item.slug)}
                            className={styles.card}
                        >
                            <article className={styles.cardInner}>
                                <div className={styles.imageWrapper}>
                                    {thumb ? (
                                        <ResponsiveImage
                                            src={thumb.src}
                                            alt={thumb.alt}
                                            priority={index < EAGER_CARDS}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                ...(thumb.position ? { objectPosition: thumb.position } : {}),
                                                ...(thumb.scale ? {
                                                    transform: `scale(${thumb.scale})`,
                                                    transformOrigin: thumb.position || 'center',
                                                } : {}),
                                            }}
                                        />
                                    ) : (
                                        <div className={styles.placeholder} aria-hidden="true" />
                                    )}
                                </div>
                                <div className={styles.cardBody}>
                                    {item.metaData.type && (
                                        <p className={styles.cardBadges}>
                                            <span className={styles.badge}>
                                                {section === 'research'
                                                    ? formatResearchBadge('type', item.metaData.type)
                                                    : item.metaData.type}
                                            </span>
                                            {item.metaData.status && (
                                                <span className={`${styles.badge} ${styles.badgeStatus}`}>
                                                    {section === 'research'
                                                        ? formatResearchBadge('status', item.metaData.status)
                                                        : item.metaData.status}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <h3 className={styles.cardTitle}>{item.metaData.title}</h3>
                                    <p className={styles.cardSubtitle}>{item.metaData.subtitle}</p>
                                </div>
                            </article>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default SectionCards
