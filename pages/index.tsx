import { useState, useEffect, useContext, ReactElement } from 'react'
import { useRouter } from 'next/router'
import type { NextPageWithLayout } from './_app'
import { getMdxContent } from '../lib/getMdxContent'
import { MarkdownData } from '../types'
import Layout from '../components/layout/Layout'
import Menu from '../components/composite/Menu/Menu'
import ProjectDetails from '../components/features/ProjectDetails/ProjectDetails'

interface WorkProps {
    projectsData: MarkdownData[],
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    const router = useRouter()
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)
    // const [selectedProjectUrl, setSelectedProjectUrl] = useSearchParams()
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [isTablet, setIsTablet] = useState<boolean | null>(null)
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

    const handleSelectedProject = (selectedProject: MarkdownData) => {
        router.push(`/projects/${selectedProject.slug}`)
    }

    useEffect(() => {
        /** Observe changes in the body element */
        /** Autoadvance projects on desktop only */
        const setResponsiveViewStates = () => {
            const isCurrentlyMobile = document.body.classList.contains('mobile-view')
            const isCurrentlyTablet = document.body.classList.contains('mobile-view')
            const isCurrentlyDesktop = !isCurrentlyMobile && !isCurrentlyTablet

            setIsMobile(isCurrentlyMobile)
            setIsTablet(isCurrentlyTablet)
            setIsDesktop(isCurrentlyDesktop)
        }

        setResponsiveViewStates()

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                setResponsiveViewStates()
            })
        })

        observer.observe(document.body, { attributes: true })
        return () => {
            observer.disconnect()
        }
    }, [])

    /** Auto select first project only on desktop */
    useEffect(() => {
        if (isDesktop && projectsData && projectsData.length > 0) {
            setSelectedProject(projectsData[0])
        } else if (isTablet || isMobile) {
            setSelectedProject(null)
        }
    }, [isDesktop, projectsData])

    if (!projectsData || projectsData.length === 0) {
        return (
            <>
                <p>No markdown content found</p>
            </>
        )
    }

    return (<>
        <main className="content">
            <Menu className="menu" projects={projectsData} selectedProject={selectedProject} onSelectProject={handleSelectedProject} />
            {selectedProject && (
                <ProjectDetails className="projectDetails" key={selectedProject?.metaData.index} project={selectedProject} />
            )}
        </main>
    </>
    )
}

Work.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const projectsProps = await getMdxContent({ subDir: 'projects' })
    const headerProps = await getMdxContent({ subDir: 'header' })

    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Work