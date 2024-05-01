import type { ReactElement } from 'react'

import Layout from '../components/Layout'
import type { NextPageWithLayout } from './_app'
import { getStaticProps } from '../lib/getMdxContent'
import { ProjectData } from '../types'
import { useSelectedProject } from '../hooks/useSelectedProject'

import Menu from '../components/Menu/Menu'
import ProjectDetails from '../components/ProjectDetails/ProjectDetails'

interface WorkProps {
    projects: ProjectData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projects }) => {
    const { selectedProject, handleSelectedProject, handleCloseProject } = useSelectedProject()

    return (
        <main className="content">
            <Menu className="menu" projects={projects} onSelectProject={handleSelectedProject} />
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
export { getStaticProps }

export default Work