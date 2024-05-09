import React, { useState } from 'react'
import { MarkdownData } from '../../types'
import { MDXRemote } from 'next-mdx-remote'
import TransitionOverlay from '../TransitionOverlay/TransitionOverlay'
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

    return (
        <article className={`${styles.projectDetails} ${className || ''} `}>
            {showOverlay && <TransitionOverlay onAnimationEnd={handleAnimationEnd} />}
            <h3>{project.frontMatter.title}</h3>
            <aside className={styles.metadata}>
                {project.frontMatter.links && (
                    <div className={styles.links}>
                        <a href={project.frontMatter.links[0].url}>{project.frontMatter.links[0].label}</a>
                    </div>
                )}
                <p>{project.frontMatter.details}</p>
            </aside>

            <div className={styles.post}>
                {project.frontMatter.images &&
                    project.frontMatter.images.map((image, index) => {
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