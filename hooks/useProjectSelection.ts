import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { MarkdownData } from '../types'
import { useProjectData } from '../contexts/ProjectsContext'

const useProjectSelection = () => {
    const router = useRouter()
    const { projectsData } = useProjectData()
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)
    const isHandlingSelection = useRef(false)


    useEffect(() => {
        console.log('projectsData', projectsData)
        const projectName = router.query.project
        if (projectName && projectsData && !isHandlingSelection.current) {
            const project = projectsData.find(p => p.slug === projectName)
            if (project) setSelectedProject(project)
        }
    }, [router.query.project, projectsData])

    const handleSelectedProject = (project: MarkdownData) => {
        if (selectedProject?.slug === project.slug) return
        isHandlingSelection.current = true
        setSelectedProject(project)
        router.push(`/work/${project.slug}`, undefined, { shallow: true })
            .then(() => {
                setTimeout(() => {
                    isHandlingSelection.current = false
                }, 100)
            })
    }

    return {
        selectedProject,
        handleSelectedProject
    }
}

export default useProjectSelection