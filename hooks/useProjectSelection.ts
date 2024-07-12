import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MarkdownData } from '../types'

const useProjectSelection = (projectsData: MarkdownData[]) => {
    const router = useRouter()
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)

    useEffect(() => {
        const projectName = router.query.project
        if (projectName && projectsData) {
            const project = projectsData.find(p => p.metaData.title === projectName)
            setSelectedProject(project || null)
        }
    }, [router.query, projectsData])

    const handleSelectedProject = (project: MarkdownData) => {
        setSelectedProject(project)
        router.push(`/work/${project.metaData.title}`, undefined, { shallow: true })
    }

    return {
        selectedProject,
        handleSelectedProject
    }
}

export default useProjectSelection