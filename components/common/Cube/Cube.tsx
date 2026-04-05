import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as MatrixTransforms from '../../../lib/matrixTransformations'
import styles from './Cube.module.scss'
import breakpoints from '../../../styles/breakpoints.module.scss'

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
    const mobileMax = Number.parseInt(breakpoints.mobileMax, 10)
    const rafPending = useRef(false)

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

    const updateVertices = useCallback(() => {
        rafPending.current = false
        const transformedVertices = MatrixTransforms.transformPoints(verticesRef.current, angleXRef.current, angleYRef.current, angleZRef.current, 500, 10)
        setVertices(transformedVertices)
    }, [])

    const scheduleUpdate = useCallback(() => {
        if (!rafPending.current) {
            rafPending.current = true
            requestAnimationFrame(updateVertices)
        }
    }, [updateVertices])

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (window.innerWidth <= mobileMax) return

        angleXRef.current = (event.clientY / window.innerHeight) * FULL_ROTATION_RADIANS
        angleYRef.current = (event.clientX / window.innerWidth) * FULL_ROTATION_RADIANS

        scheduleUpdate()
    }, [mobileMax, scheduleUpdate])

    const handleScroll = useCallback(() => {
        if (window.innerWidth > mobileMax) return

        const proportion = window.scrollY / window.innerHeight
        angleYRef.current = proportion * FULL_ROTATION_RADIANS * 2
        angleXRef.current = proportion * FULL_ROTATION_RADIANS * 2

        scheduleUpdate()
    }, [mobileMax, scheduleUpdate])

    useEffect(() => {
        if (cubeRef.current) {
            const cubeRect = cubeRef.current.getBoundingClientRect()
            centerRef.current = { x: cubeRect.width / 2, y: cubeRect.height / 2 }
            window.addEventListener('mousemove', handleMouseMove, { passive: true })
            window.addEventListener('scroll', handleScroll, { passive: true })

            updateVertices()
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleMouseMove, handleScroll, updateVertices])

    return (
        <div className={`${styles.cube} ${className || ''}`} ref={cubeRef}>
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
