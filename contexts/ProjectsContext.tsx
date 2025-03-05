import { createContext, useContext, ReactNode } from 'react'
import { MarkdownData } from '../types'

interface ProjectContextProps {
    projectsData: MarkdownData[]
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined)

export const useProjectData = () => {
    const context = useContext(ProjectContext)
    if (!context) {
        throw new Error('useProjectData must be used within a ProjectDataProvider')
    }
    return context
}

interface ProjectDataProviderProps {
    children: ReactNode
    projectsData: MarkdownData[]
}

export const ProjectDataProvider: React.FC<ProjectDataProviderProps> = ({ children, projectsData }) => {
    return (
        <ProjectContext.Provider value={{ projectsData }}>
            {children}
        </ProjectContext.Provider>
    )
}