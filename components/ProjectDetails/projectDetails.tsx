import React, { useState, useEffect } from 'react'
import { ProjectData } from '../../types'
import { MDXRemote } from 'next-mdx-remote'
import TransitionOverlay from '../TransitionOverlay/TransitionOverlay'
import styles from './ProjectDetails.module.scss'
import animations from '../../styles/animations.module.scss'

interface ProjectDetailsProps {
    project: ProjectData
    onClose: () => void
    className?: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, className }) => {
    const [showOverlay, setShowOverlay] = useState(true)

    return (
        // <article className={`${styles.details} ${animations.fadeIn}`}>
        <article className={styles.projectDetails}>
            {showOverlay && <TransitionOverlay />}
            <h3>{project.frontMatter.title}</h3>
            {project.frontMatter.links && (
                <div>
                    <a href={project.frontMatter.links[0].url}>{project.frontMatter.links[0].label}</a>
                </div>
            )}

            <p>{project.frontMatter.details}</p>

            {project.frontMatter.images && project.frontMatter.images.map((image, index) => {
                return (
                    <div key={index} className={styles.imgWrapper} >
                        <img src={`/images/${image.src}`} alt={image.alt} />
                    </div>
                )
            })}

            <MDXRemote {...project.mdxSource} />
            <button onClick={onClose}>Close</button>

        </article >
    )
}
export default ProjectDetails