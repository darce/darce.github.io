import React, { useRef, useEffect, useState, useCallback } from 'react'

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
        const rotatedPointsX = rotationX(vertexArray, angle)
        const rotatedPointsY = rotationY(rotatedPointsX, angle)
        const rotatedPointsZ = rotationZ(rotatedPointsY, angle)
        const scaledPoints = scaleXYZ(rotatedPointsZ, scale)
        const projectedPoints = projectPoints(scaledPoints, distance)

        return projectedPoints
    }

    const loop = useCallback(() => {
        const newAngle = angleRef.current + 0.01
        const transformedVertexArray = transformPoints(verticesRef.current, newAngle, 500, 10)
        setVertices(transformedVertexArray)
        angleRef.current = newAngle
        animationRef.current = window.requestAnimationFrame(loop)
    }, [])

    const projectPoints = (vertexArray: Vertex[], distance: number): Vertex[] => {
        const result: Vertex[] = []
        vertexArray.forEach(vertex => {
            const f = 1 / (distance - vertex.z)
            const projectionMatrix: number[][] = [
                [f, 0, 0],
                [0, f, 0],
                [0, 0, 1]
            ]
            result.push(matrixMultiplyVertex(projectionMatrix, vertex))
        })
        return result
    }

    const rotationX = (vertexArray: Vertex[], angle: number): Vertex[] => {
        const rotationMatrix = [
            [1, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle)],
            [0, Math.sin(angle), Math.cos(angle)]
        ]
        return transformPointsWithMatrix(vertexArray, rotationMatrix)
    }

    const rotationY = (vertexArray: Vertex[], angle: number): Vertex[] => {
        const rotationMatrix: number[][] = [
            [Math.cos(angle), 0, -Math.sin(angle)],
            [0, 1, 0],
            [-Math.sin(angle), 0, Math.cos(angle)]
        ]
        return transformPointsWithMatrix(vertexArray, rotationMatrix)
    }

    const rotationZ = (vertexArray: Vertex[], angle: number): Vertex[] => {
        const rotationMatrix: number[][] = [
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ]
        return transformPointsWithMatrix(vertexArray, rotationMatrix)
    }

    const scaleXYZ = (vertexArray: Vertex[], scale: number): Vertex[] => {
        const scaleMatrix: number[][] = [
            [scale, 0, 0],
            [0, scale, 0],
            [0, 0, 1]
        ]
        return transformPointsWithMatrix(vertexArray, scaleMatrix)
    }

    const transformPointsWithMatrix = useCallback((vertexArray: Vertex[], rotationMatrix: number[][]): Vertex[] => {
        const result: Vertex[] = []
        vertexArray.forEach(vertex => {
            result.push(matrixMultiplyVertex(rotationMatrix, vertex))
        })
        return result
    }, [])

    const vertexToMatrix = (vertexObj: Vertex): number[][] => {
        let matrix: number[][] = [
            [vertexObj.x],
            [vertexObj.y],
            [vertexObj.z]
        ]
        return matrix
    }

    const matrixToVertex = (matrix: number[][]): Vertex => {
        let point = {
            x: matrix[0][0],
            y: matrix[1][0],
            z: matrix.length === 3 ? matrix[2][0] : 0
        }
        return point
    }

    const matrixMultiplyVertex = (projectionMatrix: number[][], vertex: Vertex): Vertex => {
        const vertexMatrix: number[][] = vertexToMatrix(vertex)
        const projectionRows: number = projectionMatrix.length
        const projectionColumns: number = projectionMatrix[0].length
        const pointRows: number = vertexMatrix.length;
        const pointColumns: number = vertexMatrix[0].length;
        if (projectionColumns !== pointRows) {
            throw new Error('Projection columns must match point rows')
        }

        const result: number[][] = []

        /** Projection rows */
        for (let i = 0; i < projectionRows; i++) {
            result[i] = []
            /** Point columns (should be fixed at index 0) */
            for (let j = 0; j < pointColumns; j++) {
                let sum = 0;
                /** Projection columns = point rows */
                for (let k = 0; k < projectionColumns; k++) {
                    sum += projectionMatrix[i][k] * vertexMatrix[k][j]
                }
                result[i][j] = sum
            }
        }
        /** Return as point object */
        return matrixToVertex(result)
    }

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