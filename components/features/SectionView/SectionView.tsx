import React from 'react'
import { ContentIndexData, MarkdownData } from '../../../types'
import Menu from '../../composite/Menu/Menu'
import ProjectDetails from '../ProjectDetails/ProjectDetails'
import DitheredCard from '../../common/DitheredCard/DitheredCard'
import { ContentSection, buildItemPath } from '../../../lib/routes'
import styles from './SectionView.module.scss'

interface SectionViewProps {
  /** The section name used for routing (e.g., 'projects', 'research') */
  section: ContentSection
  /** All items in this section for the menu */
  items: ContentIndexData[]
  /** The currently selected item with full MDX (from getStaticProps) */
  selectedItem?: MarkdownData | null
  /** Hide detail pane on mobile/tablet — used on index pages where the menu is the primary view */
  hideDetailOnMobile?: boolean
  /** Custom class name */
  className?: string
}

const SectionView: React.FC<SectionViewProps> = ({
  section,
  items,
  selectedItem,
  hideDetailOnMobile = false,
  className
}) => {
  if (!items || items.length === 0) {
    return (
      <section aria-label="Empty Section" className={`content ${className || ''}`}>
        <p>No content found</p>
      </section>
    )
  }

  const currentIndex = selectedItem
    ? items.findIndex(item => item.slug === selectedItem.slug)
    : -1
  const prev = currentIndex > 0 ? items[currentIndex - 1] : null
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  return (
    <section aria-label="Content Section" className={`content ${className || ''}`}>
      <Menu
        className="menu"
        section={section}
        projects={items}
        selectedProject={selectedItem ?? null}
      />
      {selectedItem && 'mdxSource' in selectedItem && (
        <>
          <ProjectDetails
            className={`projectDetails${hideDetailOnMobile ? ' desktopDetailOnly' : ''}`}
            key={selectedItem.slug}
            project={selectedItem}
          />
          {(prev || next) && (
            <nav className={styles.mobileNav} aria-label="Previous and next">
              {prev && (
                <DitheredCard href={buildItemPath(section, prev.slug)} className={styles.navLink}>
                  <span className={styles.navLabel}>&larr; Previous</span>
                  <span className={styles.navTitle}>{prev.metaData.title}</span>
                </DitheredCard>
              )}
              {next && (
                <DitheredCard href={buildItemPath(section, next.slug)} className={`${styles.navLink} ${styles.navNext}`}>
                  <span className={styles.navLabel}>Next &rarr;</span>
                  <span className={styles.navTitle}>{next.metaData.title}</span>
                </DitheredCard>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default SectionView
