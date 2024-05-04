import { useState } from 'react'
import { MarkdownData } from '../types'

export const useSelectedProject = () => {
    const [selectedProject, setSelectedProject] = useState<MarkdownData | null>(null)

    const handleSelectedProject = (project: MarkdownData) => {
        setSelectedProject(project)
    }

    const handleCloseProject = () => {
        setSelectedProject(null)
    }

    return {
        selectedProject,
        handleSelectedProject,
        handleCloseProject
    }
}