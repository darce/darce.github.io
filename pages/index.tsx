import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getStaticProps as getMdxContentStaticProps } from '../lib/getMdxContent'
import { MarkdownData } from '../types'

import Menu from '../components/Menu/Menu'
import ProjectDetails from '../components/ProjectDetails/ProjectDetails'

interface WorkProps {
    parsedMDXArray: MarkdownData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ parsedMDXArray }) => {
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [isAutoAdvance, setIsAutoAdvance] = useState<boolean | null>(null)

    const handleSelectedProject = (selectedProject: MarkdownData) => {
        setSelectedProject(selectedProject)
        setIsAutoAdvance(false)
    }

    useEffect(() => {
        /** Observe changes in the body element */
        /** Autoadvance projects on desktop only */
        const updateMobileView = () => {
            const isCurrentlyMobile = document.body.classList.contains('mobile-view')
            setIsMobile(isCurrentlyMobile)
            setIsAutoAdvance(!isCurrentlyMobile)
            setSelectedProject(null)
        }

        updateMobileView()

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                updateMobileView()
            })
        })

        observer.observe(document.body, { attributes: true })
        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (isMobile || !isAutoAdvance) return
        /** Autoadvance projects */
        let curSelection: number = 0;
        let timeout: ReturnType<typeof setTimeout>

        const updateProject = () => {
            setSelectedProject(parsedMDXArray[curSelection])
            curSelection = (curSelection + 1) % parsedMDXArray.length
        }

        updateProject()
        timeout = setInterval(() => {
            updateProject()
        }, 5000)

        return () => clearInterval(timeout)
    }, [isAutoAdvance, isMobile, parsedMDXArray])

    if (!parsedMDXArray || parsedMDXArray.length === 0) {
        return (
            <>
                <p>No markdown content found</p>
            </>
        )
    }

    return (
        <main className="content">
            <Menu className="menu" projects={parsedMDXArray} selectedProject={selectedProject} onSelectProject={handleSelectedProject} />
            {selectedProject && (
                <ProjectDetails className="projectDetails" key={selectedProject?.frontMatter.index} project={selectedProject} />
            )}
        </main>
    )
}

Work.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build */
export const getStaticProps = async () => {
    const context = { params: { subDir: 'projects' } }
    return getMdxContentStaticProps(context)
}

export default Work