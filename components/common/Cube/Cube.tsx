import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as MatrixTransforms from '../../../lib/matrixTransformations'
import styles from './Cube.module.scss'
import { throttle } from '../../../lib/utils'

interface Vertex {
    x: number
    y: number
    z: number
}

interface Point {
    x: number
    y: number
}

interface CubeProps {
    className?: string
}

const Cube: React.FC<CubeProps> = ({ className }) => {
    const [vertices, setVertices] = useState<Vertex[]>([])
    const FULL_ROTATION_RADIANS = Math.PI * 2
    const THROTTLE_DELAY_MS = 32

    /** Use refs for transient state */
    const verticesRef = useRef<Vertex[]>([
        { x: -0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: -0.5, z: -0.5 },
        { x: 0.5, y: 0.5, z: -0.5 },
        { x: -0.5, y: 0.5, z: -0.5 },
        { x: -0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: -0.5, z: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: -0.5, y: 0.5, z: 0.5 }
    ])
    const angleXRef = useRef<number>(0)
    const angleYRef = useRef<number>(0)
    const angleZRef = useRef<number>(0)
    const centerRef = useRef<Point>({ x: 0, y: 0 })
    const cubeRef = useRef<HTMLDivElement>(null)

    /** useCallback to memoize function */
    const updateVertices = useCallback(() => {
        const transformedVertices = MatrixTransforms.transformPoints(verticesRef.current, angleXRef.current, angleYRef.current, angleZRef.current, 500, 10)
        setVertices(transformedVertices)
    }, [])

    const handleMouseMove = useCallback(
        throttle((event: MouseEvent) => {
            if (document.body.classList.contains('mobile-view')) return

            const proportionX = event.clientX / window.innerWidth
            const proportionY = event.clientY / window.innerHeight

            /** Map scroll position to full rotation (2π radians) */
            /** Full rotation from top to bottom */
            angleXRef.current = proportionY * FULL_ROTATION_RADIANS
            /** Full rotation from left to right */
            angleYRef.current = proportionX * FULL_ROTATION_RADIANS

            /** Optimize animation using requestAnimationFrame */
            requestAnimationFrame(updateVertices)
        }, THROTTLE_DELAY_MS), [])

    const handleScroll = useCallback(
        throttle(() => {
            if (!document.body.classList.contains('mobile-view')) return

            const scrollY = window.scrollY
            const maxScrollY = window.innerHeight

            /** Map scroll position to twice full rotation on mobile(2π radians) */
            angleYRef.current = (scrollY / maxScrollY) * FULL_ROTATION_RADIANS * 2
            angleXRef.current = (scrollY / maxScrollY) * FULL_ROTATION_RADIANS * 2

            /** Optimize animation using requestAnimationFrame */
            requestAnimationFrame(updateVertices)
        }, THROTTLE_DELAY_MS), [])

    useEffect(() => {
        if (cubeRef.current) {
            const cubeRect = cubeRef.current.getBoundingClientRect()
            centerRef.current = { x: cubeRect.width / 2, y: cubeRect.height / 2 }
            window.addEventListener('mousemove', handleMouseMove, false)
            window.addEventListener('scroll', handleScroll, false)

            /** Paint Cube on load */
            updateVertices()
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('scroll', handleScroll, false)
        }
    }, [handleMouseMove, handleScroll])

    return (
        <div className={`${styles.cube} ${className || ''}`} ref={cubeRef}>
            <div className="info"></div>
            {vertices.map((vertexDiv, index) => (
                <div
                    key={index}
                    className={styles.vertex}
                    style={{
                        transform:
                            `translate3d(${vertexDiv.x + centerRef.current.x}px, 
                                ${vertexDiv.y + centerRef.current.y}px,
                                ${vertexDiv.z}px)`
                    }}
                    data-vertex-id={index}
                ></div>
            ))}
        </div>

    )
}

export default Cube