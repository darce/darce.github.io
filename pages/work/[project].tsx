import { useRouter } from 'next/router'
import Work from '../../components/Work/Work'
import { ProjectDataProvider } from '../../contexts/ProjectsContext'
import { getMdxContent } from '../../lib/getMdxContent'
//import { useEffect, useState } from "react"
import { MarkdownData } from '../../types'
import { GetStaticProps, GetStaticPaths } from 'next'


interface ProjectPageProps {
    projectsData: MarkdownData[]
}

const ProjectPage = ({ projectsData }: ProjectPageProps) => {
    const router = useRouter()

    if (router.isFallback) {
        return <p>Loading...</p>
    }

    return (
        <ProjectDataProvider projectsData={projectsData}>
            <Work />
        </ProjectDataProvider>
    )
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = async () => {
    try {
        const projectsProps = await getMdxContent({ subDir: 'projects' })
        console.log('projectsProps:', projectsProps)
        return {
            props: {
                projectsData: projectsProps.parsedMdxArray,
            }
        }
    } catch (error) {
        console.error('Error in getStaticProps:', error)
        return {
            props: {
                projectsData: []
            }
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const projectsProps = await getMdxContent({ subDir: 'projects' })
        const paths = projectsProps.parsedMdxArray.map((project) => ({
            params: { project: project.slug }
        }))

        return {
            paths,
            fallback: false // Show 404 for paths not returned by getStaticPaths
        }
    } catch (error) {
        console.error('Error in getStaticPaths:', error)
        return {
            paths: [],
            fallback: false
        }
    }
}
//     const { project: projectSlug } = router.query
//     const { projectsData } = useProjectData()
//     const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)


//     useEffect(() => {
//         if (projectSlug && projectsData.length > 0) {
//             const project = projectsData.find(p => p.slug === projectSlug)
//             setSelectedProject(project || null)
//         }
//     }, [projectSlug, projectsData])

//     if (router.isFallback || !selectedProject) {
//         return <p>Loading...</p>
//     }
//     return <Work projectsData={projectsData} />
// }
export default ProjectPage