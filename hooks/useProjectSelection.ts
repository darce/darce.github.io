import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MarkdownData } from '../types'
import { useProjectData } from '../contexts/ProjectsContext'

const useProjectSelection = () => {
    const router = useRouter()
    const { projectsData } = useProjectData()
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)

    useEffect(() => {
        console.log('projectsData', projectsData)
        const projectName = router.query.slug
        if (projectName && projectsData) {
            const project = projectsData.find(p => p.slug === projectName)
            setSelectedProject(project || null)
        }
    }, [router.query, projectsData])

    const handleSelectedProject = (project: MarkdownData) => {
        setSelectedProject(project)
        router.push(`/work/${project.slug}`, undefined, { shallow: true })
    }

    return {
        selectedProject,
        handleSelectedProject
    }
}

export default useProjectSelection