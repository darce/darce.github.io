import { useState } from 'react'
import { ProjectData } from '../types'

export const useSelectedProject = () => {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

    const handleSelectedProject = (project: ProjectData) => {
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