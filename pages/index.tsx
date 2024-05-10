import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getStaticProps as getMdxContentStaticProps } from '../lib/getMdxContent'
import { MarkdownData } from '../types'

import Menu from '../components/Menu/Menu'
import ProjectDetails from '../components/ProjectDetails/ProjectDetails'

interface WorkProps {
    parsedMDX: MarkdownData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ parsedMDX }) => {
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)
    const [isAutoAdvance, setIsAutoAdvance] = useState(true)

    const handleSelectedProject = (parsedMDX: MarkdownData) => {
        setSelectedProject(parsedMDX)
        setIsAutoAdvance(false)
    }

    useEffect(() => {
        /** Observe changes in the body element */
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isMobile = document.body.classList.contains('mobile-view')
                    setIsAutoAdvance(!isMobile)
                }
            })
        })

        observer.observe(document.body, { attributes: true })
        return () => {
            observer.disconnect()
        }
    })

    useEffect(() => {
        let curSelection: number = 0;
        const updateProject = () => {
            if (isAutoAdvance) {
                setSelectedProject(parsedMDX[curSelection])
                curSelection = (curSelection + 1) % parsedMDX.length
            }
        }

        updateProject()
        const interval = setInterval(() => {
            updateProject()
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoAdvance, parsedMDX])

    if (!parsedMDX || parsedMDX.length === 0) {
        return (
            <>
                <p>No markdown content found</p>
            </>
        )
    }

    return (
        <main className="content">
            <Menu className="menu" projects={parsedMDX} selectedProject={selectedProject} onSelectProject={handleSelectedProject} />
            {selectedProject &&
                <ProjectDetails className="projectDetails" key={selectedProject.frontMatter.index} project={selectedProject} />}
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