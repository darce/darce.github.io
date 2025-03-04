import { useEffect, ReactElement } from 'react'
import { NextPageWithLayout } from '../../pages/_app'
import { MarkdownData } from '../../types'
import { useProjectData } from '../../contexts/ProjectsContext'
import Layout from '../Layout'
import Menu from '../Menu/Menu'
import ProjectDetails from '../ProjectDetails/ProjectDetails'
import useProjectSelection from '../../hooks/useProjectSelection'
import useResponsiveState from '../../hooks/useResponsiveState'
import { useRouter } from 'next/router'
interface WorkProps { }

const Work: NextPageWithLayout<WorkProps> = () => {
    const { projectsData } = useProjectData()
    const { selectedProject, handleSelectedProject } = useProjectSelection()
    const { isDesktop } = useResponsiveState()
    const router = useRouter()

    console.log('Work component render:', { projectsData, selectedProject, isDesktop })

    useEffect(() => {
        if (!projectsData) return;
        // If we're on a project page, find and select that project
        if (router.query.project && projectsData.length > 0) {
            const project = projectsData.find(p => p.slug === router.query.project)
            if (project) {
                handleSelectedProject(project)
            }
        }
        // Otherwise, if we're on desktop, select the first project
        else if
            (isDesktop && projectsData.length > 0 && !selectedProject) {
            handleSelectedProject(projectsData[0])
        }
    }, [isDesktop, projectsData, selectedProject, handleSelectedProject, router.query.project])

    if (!projectsData || projectsData.length === 0) {
        return <p>No Markdown content found</p>
    }

    return (
        <main className="content">
            <Menu
                className="menu"
                projects={projectsData}
                selectedProject={selectedProject}
                onSelectProject={handleSelectedProject}
            />
            {selectedProject && (
                <ProjectDetails
                    className="projectDetails"
                    key={selectedProject?.metaData.index}
                    project={selectedProject}
                />
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