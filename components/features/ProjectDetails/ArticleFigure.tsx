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
    onError?: () => void
    children?: React.ReactNode
}

const ArticleFigure: React.FC<ArticleFigureProps> = ({
    src, alt, caption, layout = 'inset', side = 'auto', width, height,
    inspectable = false, onError, children,
}) => {
    const [viewing, setViewing] = useState(false)
    const figure = <figure
        className={`${styles.articleFigure} ${layout === 'inset' ? styles.insetFigure : ''}`}
        data-layout={layout}
        data-side={side}
    >
        <ResponsiveImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="auto, 100vw"
            onError={onError}
        />
        <figcaption>
            {caption ?? alt}
            {inspectable && (
                <button type="button" className={styles.inspectImage} aria-label={`View full size: ${alt}`} aria-haspopup="dialog" onClick={() => setViewing(true)}>
                    View full size
                </button>
            )}
        </figcaption>
    </figure>

    return <>
        {figure}
        {children}
        {viewing && <ImageViewer src={src} alt={alt} width={width} height={height} onClose={() => setViewing(false)} />}
    </>
}

export default ArticleFigure
