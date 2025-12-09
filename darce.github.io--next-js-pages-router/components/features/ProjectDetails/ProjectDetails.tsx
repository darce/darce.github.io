import React, { useState } from 'react'
import { MarkdownData } from '../../../types'
import { MDXRemote } from 'next-mdx-remote'
import TransitionOverlay from '../../composite/TransitionOverlay/TransitionOverlay'
import styles from './ProjectDetails.module.scss'

interface ProjectDetailsProps {
    project: MarkdownData
    className?: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, className }) => {
    const [showOverlay, setShowOverlay] = useState(true)

    const handleAnimationEnd = () => {
        setShowOverlay(false)
    }

    if (!project) {
        return null
    }

    return (
        <article className={`${styles.projectDetails} ${className || ''} `}>
            {showOverlay && <TransitionOverlay onAnimationEnd={handleAnimationEnd} />}
            <h2>{project.metaData.title}</h2>
            <aside className={styles.metadata}>
                {project.metaData.links && (
                    <div className={styles.links}>
                        <a target="_blank" href={project.metaData.links[0].url}>{project.metaData.links[0].label}</a>
                    </div>
                )}
                <p>{project.metaData.details}</p>
            </aside>

            <div className={styles.post}>
                {project.metaData.images &&
                    project.metaData.images.map((image, index) => {
                        return (
                            <figure className={styles.imgWrapper} key={index}>
                                <img src={`/images/${image.src}`} alt={image.alt} />
                                <figcaption>{image.alt}</figcaption>
                            </figure>
                        )
                    })}
                <div className={styles.source}>
                    <MDXRemote {...project.mdxSource} />
                </div>
            </div>
        </article >
    )
}
export default ProjectDetails