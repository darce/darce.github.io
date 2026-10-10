import React, { useState } from 'react'
import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage'
import ImageViewer from '../../common/ImageViewer/ImageViewer'
import styles from './ProjectDetails.module.scss'

interface ArticleFigureProps {
    /** Local image path under /images. */
    src: string
    alt: string
    caption?: string
    layout?: 'inset' | 'wide'
    side?: 'auto' | 'left' | 'right'
    width?: number
    height?: number
    inspectable?: boolean
    className?: string
    onError?: () => void
    children?: React.ReactNode
}

const ArticleFigure: React.FC<ArticleFigureProps> = ({
    src, alt, caption, layout = 'inset', side = 'auto', width, height,
    inspectable = true, className = '', onError, children,
}) => {
    const [viewing, setViewing] = useState(false)
    const image = <ResponsiveImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="auto, 100vw"
        onError={onError}
    />
    const figure = <figure
        className={`${styles.articleFigure} ${layout === 'inset' ? styles.insetFigure : ''} ${className}`}
        data-layout={layout}
        data-side={side}
    >
        {inspectable ? <button type="button" className={styles.imageTrigger} aria-label={`Expand image: ${alt}`} aria-haspopup="dialog" onClick={() => setViewing(true)}>
            {image}
        </button> : image}
        <figcaption>{caption ?? alt}</figcaption>
    </figure>

    return <>
        {figure}
        {children}
        {viewing && <ImageViewer src={src} alt={alt} width={width} height={height} onClose={() => setViewing(false)} />}
    </>
}

export default ArticleFigure
