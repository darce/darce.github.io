import React from 'react'
import { ProjectData } from '../types'
import { MDXRemote } from 'next-mdx-remote'

interface ProjectDetailsProps {
    project: ProjectData
    onClose: () => void
    className?: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, className }) => {
    return (
        <article className={className} >
            <h3>{project.frontMatter.title}</h3>
            <div><a href={project.frontMatter.links[0].url}>{project.frontMatter.links[0].label}</a></div>
            <p>{project.frontMatter.details}</p>
            <MDXRemote {...project.mdxSource} />
            <button onClick={onClose}>Close</button>

        </article >
    )
}
export default ProjectDetails