import React from 'react'
import styles from './TransitionOverlay.module.scss'

interface TransitionOverlayProps {
    onAnimationEnd: (event: React.AnimationEvent<HTMLDivElement>) => void
}
const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ onAnimationEnd }) => {
    const slatsCount: number = 16
    const slatsArray: null[] = Array(slatsCount).fill(null)

    return (
        <div className={styles.slatsContainer} onAnimationEnd={onAnimationEnd}>
            {slatsArray.map((_, index) => {
                return (<div key={index}
                    className={`${styles.slatElement} ${styles['slat-' + index]}`}
                ></div>)
            })
            }
        </div>
    )
}

export default TransitionOverlay