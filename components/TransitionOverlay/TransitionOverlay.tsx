import React from 'react'
import styles from '../../styles/animations.module.scss'

const TransitionOverlay = () => {
    const slatsCount: number = 30
    const slatsArray: null[] = Array(slatsCount).fill(null)

    return (
        <div className={styles.slatsContainer}>
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