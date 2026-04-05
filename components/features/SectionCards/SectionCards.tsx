import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ContentIndexData } from '../../../types'
import { ContentSection, buildItemPath } from '../../../lib/routes'
import styles from './SectionCards.module.scss'

interface SectionCardsProps {
    section: ContentSection
    items: ContentIndexData[]
    className?: string
}

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
                {items.map((item) => {
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
                                        <Image
                                            src={`/images/${thumb.src}`}
                                            alt={thumb.alt}
                                            width={600}
                                            height={450}
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
                                            sizes="(max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className={styles.placeholder} aria-hidden="true" />
                                    )}
                                </div>
                                <div className={styles.cardBody}>
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
