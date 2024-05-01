import React, { useState, useEffect } from 'react'
import { ProjectData } from '../../types'
import { MDXRemote } from 'next-mdx-remote'
import TransitionOverlay from '../TransitionOverlay/TransitionOverlay'
import styles from './ProjectDetails.module.scss'

interface ProjectDetailsProps {
    project: ProjectData
    onClose: () => void
    className?: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, className }) => {
    const [showOverlay, setShowOverlay] = useState(true)

    const handleAnimationEnd = () => {
        setShowOverlay(false)
    }

    return (
        <article className={`${styles.projectDetails} ${className || ''} `}>
            {showOverlay && <TransitionOverlay onAnimationEnd={handleAnimationEnd} />}
            <h3>{project.frontMatter.title}</h3>
            {project.frontMatter.links && (
                <div className={styles.links}>
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
            <div className={styles.source}>
                <MDXRemote {...project.mdxSource} />
                <button onClick={onClose}>Close</button>
            </div>
        </article >
    )
}
export default ProjectDetails