import React from 'react'
import { ContentIndexData, MarkdownData } from '../../../types'
import Menu from '../../composite/Menu/Menu'
import ProjectDetails from '../ProjectDetails/ProjectDetails'
import { ContentSection } from '../../../lib/routes'

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

  return (
    <section aria-label="Content Section" className={`content ${className || ''}`}>
      <Menu
        className="menu"
        section={section}
        projects={items}
        selectedProject={selectedItem ?? null}
      />
      {selectedItem && 'mdxSource' in selectedItem && (
        <ProjectDetails
          className={`projectDetails${hideDetailOnMobile ? ' desktopDetailOnly' : ''}`}
          key={selectedItem.slug}
          project={selectedItem}
        />
      )}
    </section>
  )
}

export default SectionView
