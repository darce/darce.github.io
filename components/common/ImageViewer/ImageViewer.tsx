import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import tokens from '../../../design-tokens/portfolio.tokens.json'
import styles from './ImageViewer.module.scss'

interface ImageViewerProps {
    src: string
    alt: string
    width?: number
    height?: number
    onClose: () => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, width, height, onClose }) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const titleId = useId()
    const [zoomed, setZoomed] = useState(false)

    useEffect(() => {
        const dialog = dialogRef.current!
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialog.showModal()
        closeRef.current?.focus()
        const viewport = viewportRef.current!
        const image = viewport.querySelector('img')!
        const updateFit = () => {
            if (!image.naturalWidth || !image.naturalHeight) return
            const scale = Math.min(viewport.clientWidth / image.naturalWidth, viewport.clientHeight / image.naturalHeight)
            image.style.setProperty('--fitted-width', `${image.naturalWidth * scale}px`)
            image.style.setProperty('--fitted-height', `${image.naturalHeight * scale}px`)
        }
        const observer = new ResizeObserver(updateFit)
        observer.observe(viewport)
        image.addEventListener('load', updateFit)
        updateFit()
        return () => {
            observer.disconnect()
            image.removeEventListener('load', updateFit)
            dialog.close()
            document.body.style.overflow = overflow
            opener?.focus({ preventScroll: true })
        }
    }, [])

    // Keep theme inheritance while placing the viewer outside article flow.
    const host = document.querySelector('.base__typography') ?? document.body
    return createPortal(
        <dialog
            ref={dialogRef}
            className={styles.viewer}
            aria-labelledby={titleId}
            aria-modal="true"
            onTouchStart={event => event.stopPropagation()}
            onTouchEnd={event => event.stopPropagation()}
            onKeyDown={event => {
                if (event.key !== 'Tab') return
                const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]')
                const first = controls[0]
                const last = controls[controls.length - 1]
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault()
                    last.focus()
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault()
                    first.focus()
                }
            }}
            onClose={() => { if (!dialogRef.current?.open) onClose() }}
            onClick={event => {
                if (event.target !== event.currentTarget) return
                const box = event.currentTarget.getBoundingClientRect()
                if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
                    event.currentTarget.close()
                }
            }}
        >
            <div className={styles.frame}>
                <div className={styles.toolbar}>
                    <h2 id={titleId}>{alt}</h2>
                    <button type="button" onClick={() => {
                        setZoomed(value => !value)
                        viewportRef.current?.scrollTo(0, 0)
                    }}>{zoomed ? 'Fit to window' : 'Zoom in'}</button>
                    <button ref={closeRef} type="button" onClick={() => dialogRef.current?.close()}>Close</button>
                </div>
                <div ref={viewportRef} className={styles.viewport} data-zoomed={zoomed} role="region" aria-label="Image" tabIndex={0}>
                    <ResponsiveImage src={src} alt={alt} width={width} height={height} sizes={`${(zoomed ? tokens.article.viewer['zoom-factor'].$value : 1) * 100}vw`} priority className={styles.image} />
                </div>
            </div>
        </dialog>,
        host,
    )
}

export default ImageViewer
