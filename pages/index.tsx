import type { ReactElement } from 'react'

import Layout from '../components/Layout'
import type { NextPageWithLayout } from './_app'
import { getStaticProps as getMdxContentStaticProps } from '../lib/getMdxContent'
import { MarkdownData } from '../types'
import { useSelectedProject } from '../hooks/useSelectedProject'

import Menu from '../components/Menu/Menu'
import ProjectDetails from '../components/ProjectDetails/ProjectDetails'

interface WorkProps {
    parsedMDX: MarkdownData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ parsedMDX }) => {
    const { selectedProject, handleSelectedProject, handleCloseProject } = useSelectedProject()

    if (!parsedMDX || parsedMDX.length === 0) {
        return (
            <>
                no parsedMDX found
            </>
        )
    }

    return (
        <main className="content">
            <Menu className="menu" projects={parsedMDX} onSelectProject={handleSelectedProject} />
            {selectedProject &&
                <ProjectDetails className="projectDetails" key={selectedProject.frontMatter.index} project={selectedProject} onClose={handleCloseProject} />}
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