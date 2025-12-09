interface Vertex {
    x: number
    y: number
    z: number
}

/** transformPoints is the only exported function */
export const transformPoints = (vertexArray: Vertex[], angleX: number, angleY: number, angleZ: number, scale: number, distance: number) => {
    /** First rotate and scale, then project */
    let rotatedPoints = rotationX(vertexArray, angleX)
    rotatedPoints = rotationY(rotatedPoints, angleY)
    rotatedPoints = rotationZ(rotatedPoints, angleZ)
    const scaledPoints = scaleXYZ(rotatedPoints, scale)
    const projectedPoints = projectPoints(scaledPoints, distance)

    return projectedPoints
}

const transformPointsWithMatrix = (vertexArray: Vertex[], rotationMatrix: number[][]): Vertex[] => {
    return vertexArray.map(vertex => (
        matrixMultiplyVertex(rotationMatrix, vertex)
    ))
}

const matrixMultiplyVertex = (projectionMatrix: number[][], vertex: Vertex): Vertex => {
    const vertexMatrix: number[][] = vertexToMatrix(vertex)
    const projectionRows: number = projectionMatrix.length
    const projectionColumns: number = projectionMatrix[0].length
    const vertexRows: number = vertexMatrix.length
    const vertexColumns: number = vertexMatrix[0].length
    if (projectionColumns !== vertexRows) {
        throw new Error('Projection columns must match vertex rows')
    }

    const resultMatrix: number[][] = []

    /** Projection rows */
    for (let i = 0; i < projectionRows; i++) {
        resultMatrix[i] = [0]
        /** Vertex columns (should be fixed at index 0) */
        for (let j = 0; j < vertexColumns; j++) {
            let sum = 0
            /** Projection columns = vertex rows */
            for (let k = 0; k < projectionColumns; k++) {
                sum += projectionMatrix[i][k] * vertexMatrix[k][j]
            }
            resultMatrix[i][j] = sum
        }
    }
    /** Return as vertex */
    return matrixToVertex(resultMatrix)
}

const vertexToMatrix = (vertex: Vertex): number[][] => {
    const matrix: number[][] = [
        [vertex.x],
        [vertex.y],
        [vertex.z]
    ]
    return matrix
}

const matrixToVertex = (matrix: number[][]): Vertex => {
    const vertex = {
        x: matrix[0][0],
        y: matrix[1][0],
        z: matrix.length === 3 ? matrix[2][0] : 0
    }
    return vertex
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