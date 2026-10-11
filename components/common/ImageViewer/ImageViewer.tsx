import React, { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
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
    const titleId = useId()

    useEffect(() => {
        const dialog = dialogRef.current!
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialog.showModal()
        closeRef.current?.focus()
        return () => {
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
                    <button ref={closeRef} type="button" aria-label="Close" title="Close" onClick={() => dialogRef.current?.close()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className={styles.viewport} role="region" aria-label="Image" tabIndex={0}>
                    <ResponsiveImage src={src} alt={alt} width={width} height={height} sizes="100vw" priority className={styles.image} />
                </div>
            </div>
        </dialog>,
        host,
    )
}

export default ImageViewer
