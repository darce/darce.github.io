import { useEffect, ReactElement } from 'react'
import { NextPageWithLayout } from '../../pages/_app'
import { MarkdownData } from '../../types'
import Layout from '../Layout'
import Menu from '../Menu/Menu'
import ProjectDetails from '../ProjectDetails/ProjectDetails'
import useProjectSelection from '../../hooks/useProjectSelection'
import useResponsiveState from '../../hooks/useResponsiveState'

interface WorkProps {
    projectsData: MarkdownData[],
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    const { selectedProject, handleSelectedProject } = useProjectSelection(projectsData)
    const { isDesktop } = useResponsiveState()

    useEffect(() => {
        if (isDesktop && projectsData.length > 0) {
            handleSelectedProject(projectsData[0])
        }
    }, [isDesktop, projectsData])

    if (!projectsData || projectsData.length === 0) {
        return <p>No Markdown content found</p>
    }

    return (
        <main className="content">
            <Menu className="menu" projects={projectsData} selectedProject={selectedProject} onSelectProject={handleSelectedProject} />
            {selectedProject && (
                <ProjectDetails className="projectDetails" key={selectedProject?.metaData.index} project={selectedProject} />
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
export default Work