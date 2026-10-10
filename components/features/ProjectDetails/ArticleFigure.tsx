import React from 'react'
import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage'
import tokens from '../../../design-tokens/portfolio.tokens.json'
import styles from './ProjectDetails.module.scss'

const tabletEnd = tokens.breakpoint['tablet-end'].$value
const articleMeasure = tokens.article['measure-characters'].$value
const insetShare = tokens.article.inset['width-share'].$value

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
            sizes={`auto, (max-width: ${tabletEnd.value}${tabletEnd.unit}) 100vw, ${articleMeasure * (layout === 'inset' ? insetShare : 1)}ch`}
            onError={onError}
        />
        <figcaption>
            {caption ?? alt}
            {inspectable && (
                <a href={`/images/${src}`} target="_blank" rel="noopener noreferrer" aria-label={`View full size: ${alt}`}>
                    View full size
                </a>
            )}
        </figcaption>
    </figure>

    return children ? <div className={styles.figureFlow}>{figure}{children}</div> : figure
}

export default ArticleFigure
