import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as MatrixTransforms from '../utils/matrixTransformations'

interface Vertex {
    x: number
    y: number
    z: number
}

interface Point {
    x: number
    y: number
}

const Cube: React.FC = () => {
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
    const angleRef = useRef<number>(0)
    const centerRef = useRef<Point>({ x: 0, y: 0 })
    const cubeRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>(0)

    useEffect(() => {
        if (cubeRef.current) {
            cubeRef.current?.addEventListener('click', handleClickVertex, false)
            const cubeRect = cubeRef.current.getBoundingClientRect()
            const calculatedCenter: Point = { x: cubeRect.width / 2, y: cubeRect.height / 2 }
            centerRef.current = calculatedCenter
            loop()
        }

        return () => {
            if (animationRef.current) {
                window.cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    const transformPoints = (vertexArray: Vertex[], angle: number, scale: number, distance: number) => {
        /** First rotate and scale, then project */
        const rotatedPointsX = MatrixTransforms.rotationX(vertexArray, angle)
        const rotatedPointsY = MatrixTransforms.rotationY(rotatedPointsX, angle)
        const rotatedPointsZ = MatrixTransforms.rotationZ(rotatedPointsY, angle)
        const scaledPoints = MatrixTransforms.scaleXYZ(rotatedPointsZ, scale)
        const projectedPoints = MatrixTransforms.projectPoints(scaledPoints, distance)

        return projectedPoints
    }

    const loop = useCallback(() => {
        const newAngle = angleRef.current + 0.01
        const transformedVertexArray = transformPoints(verticesRef.current, newAngle, 500, 10)
        setVertices(transformedVertexArray)
        angleRef.current = newAngle
        animationRef.current = window.requestAnimationFrame(loop)
    }, [])

    const handleClickVertex = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const vertexId = target.getAttribute('data-vertex-id')
        console.log('clicked vertex id: ', vertexId)
    }

    return (
        <>
            <div className="info">cube</div>
            <div className="cube" ref={cubeRef}>
                {vertices.map((vertexDiv, index) => (
                    <div
                        key={index}
                        className="vertex"
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
        </>
    )
}

export default Cube