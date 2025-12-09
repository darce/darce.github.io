import React, { useEffect, useState } from 'react'
import { MarkdownData } from '../../../types'
import { useResponsiveView } from '../../../hooks/useResponsiveView'
import { useSectionNavigation } from '../../../hooks/useSectionNavigation'
import Menu from '../../composite/Menu/Menu'
import ProjectDetails from '../ProjectDetails/ProjectDetails'

interface SectionViewProps {
  /** The section name used for routing (e.g., 'projects', 'research') */
  section: string
  /** All items in this section for the menu */
  items: MarkdownData[]
  /** The currently selected item (optional - for detail pages) */
  selectedItem?: MarkdownData | null
  /** Whether to auto-select the first item on desktop */
  autoSelectFirst?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Shared component for displaying content sections with Menu + Details pattern
 * Used by projects, research, and other future content sections
 */
const SectionView: React.FC<SectionViewProps> = ({
  section,
  items,
  selectedItem: initialSelectedItem,
  autoSelectFirst = true,
  className
}) => {
  const { isDesktop, isMobile, isTablet } = useResponsiveView()
  const { navigateToItem } = useSectionNavigation({ section })
  const [selectedItem, setSelectedItem] = useState<MarkdownData | null>(initialSelectedItem ?? null)

  // Update selected item when prop changes (for direct URL navigation)
  useEffect(() => {
    if (initialSelectedItem !== undefined) {
      setSelectedItem(initialSelectedItem)
    }
  }, [initialSelectedItem])

  // Auto-select first item on desktop only (when no initial selection)
  useEffect(() => {
    if (autoSelectFirst && initialSelectedItem === undefined) {
      if (isDesktop && items && items.length > 0) {
        setSelectedItem(items[0])
      } else if (isTablet || isMobile) {
        setSelectedItem(null)
      }
    }
  }, [isDesktop, isMobile, isTablet, items, autoSelectFirst, initialSelectedItem])

  const handleSelectItem = (item: MarkdownData) => {
    // Update local state immediately for visual feedback
    setSelectedItem(item)
    // Then navigate to the detail page
    navigateToItem(item)
  }

  if (!items || items.length === 0) {
    return (
      <main className={`content ${className || ''}`}>
        <p>No content found</p>
      </main>
    )
  }

  return (
    <main className={`content ${className || ''}`}>
      <Menu
        className="menu"
        projects={items}
        selectedProject={selectedItem}
        onSelectProject={handleSelectItem}
      />
      {selectedItem && (
        <ProjectDetails
          className="projectDetails"
          key={selectedItem.metaData.index}
          project={selectedItem}
        />
      )}
    </main>
  )
}

export default SectionView
