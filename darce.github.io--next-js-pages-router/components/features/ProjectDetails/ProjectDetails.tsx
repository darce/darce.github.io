import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { MarkdownData } from '../../../types'
import { MDXRemote } from 'next-mdx-remote'
import Image from 'next/image'
import TransitionOverlay from '../../composite/TransitionOverlay/TransitionOverlay'

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

import cubeStyles from '../../common/Cube/Cube.module.scss'
import styles from './ProjectDetails.module.scss'

// Dynamic imports for MDX components
const OrderBook = dynamic(() => import('../OrderBook/OrderBook'), { ssr: false })
const OrderBookProvider = dynamic(() => import('../OrderBook/OrderBookMetrics').then(mod => mod.OrderBookProvider), { ssr: false })
const BestBid = dynamic(() => import('../OrderBook/OrderBookMetrics').then(mod => mod.BestBid), { ssr: false })
const BestAsk = dynamic(() => import('../OrderBook/OrderBookMetrics').then(mod => mod.BestAsk), { ssr: false })
const Spread = dynamic(() => import('../OrderBook/OrderBookMetrics').then(mod => mod.Spread), { ssr: false })
const OrderImbalance = dynamic(() => import('../OrderBook/OrderBookMetrics').then(mod => mod.OrderImbalance), { ssr: false })
const Cube = dynamic(() => import('../../common/Cube/Cube'), { ssr: false })

// Wrapped Cube for MDX content with constrained height
const MDXCube = () => (
    <div className={cubeStyles.cubeContainer}>
        <Cube />
    </div>
)

// Custom components available in MDX content
const mdxComponents = {
    OrderBook,
    OrderBookProvider,
    BestBid,
    BestAsk,
    Spread,
    OrderImbalance,
    Cube: MDXCube,
}

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
                                <Image
                                    src={`/images/${image.src}`}
                                    alt={image.alt}
                                    width={1200}
                                    height={800}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 45vw"
                                />
                                <figcaption>{image.alt}</figcaption>
                            </figure>
                        )
                    })}
                <div className={styles.source}>
                    <MDXRemote {...project.mdxSource} components={mdxComponents} />
                </div>
            </div>
        </article >
    )
}
export default ProjectDetails
