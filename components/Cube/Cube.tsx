import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as MatrixTransforms from '../../lib/matrixTransformations'
import styles from './Cube.module.scss'

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

    useEffect(() => {
        if (cubeRef.current) {
            cubeRef.current.addEventListener('click', handleClickVertex, false)
            const cubeRect = cubeRef.current.getBoundingClientRect()
            centerRef.current = { x: cubeRect.width / 2, y: cubeRect.height / 2 }
            window.addEventListener('mousemove', handleMouseMove, false)

        }

        return () => {
            if (cubeRef.current) {
                cubeRef.current.removeEventListener('click', handleClickVertex)
                window.removeEventListener('mousemove', handleMouseMove)
            }
        }
    }, [])

    const updateVertices = useCallback(() => {
        const transformedVertices = MatrixTransforms.transformPoints(verticesRef.current, angleXRef.current, angleYRef.current, angleZRef.current, 500, 10)
        setVertices(transformedVertices)
    }, [])

    const handleClickVertex = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const vertexId = target.getAttribute('data-vertex-id')
        console.log('clicked vertex id: ', vertexId)
    }

    const handleMouseMove = (event: MouseEvent) => {
        const proportionX = event.clientX / window.innerWidth
        const proportionY = event.clientY / window.innerHeight

        /** Map proportions to full circle roations (2π radians) */
        const fullRotaionRadians = Math.PI * 2
        /** Full rotation from top to bottom */
        angleXRef.current = proportionY * fullRotaionRadians
        /** Full rotation from left to right */
        angleYRef.current = proportionX * fullRotaionRadians
        updateVertices()
    }

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