import { describe, it, expect } from 'vitest'
import { transformPoints } from '../../lib/matrixTransformations'

const CUBE_VERTICES = [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 },
]

describe('transformPoints', () => {
    it('returns the same number of vertices as input', () => {
        const result = transformPoints(CUBE_VERTICES, 0, 0, 0, 1, 5)
        expect(result).toHaveLength(CUBE_VERTICES.length)
    })

    it('preserves vertex positions with zero rotation', () => {
        const result = transformPoints(CUBE_VERTICES, 0, 0, 0, 1, 5)
        // With distance=5, z=-1: f = 1/(5-(-1)) = 1/6
        // x' = -1 * 1/6, y' = -1 * 1/6
        const first = result[0]
        expect(first.x).toBeCloseTo(-1 / 6, 5)
        expect(first.y).toBeCloseTo(-1 / 6, 5)
    })

    it('scales vertices by the given factor', () => {
        const scale1 = transformPoints(CUBE_VERTICES, 0, 0, 0, 1, 5)
        const scale2 = transformPoints(CUBE_VERTICES, 0, 0, 0, 2, 5)
        // Scaling doubles the position before projection
        // scale=1, z=-1: f=1/6, x = -1/6
        // scale=2, z=-1*2=-2: f=1/(5-(-2))=1/7 hmm, scaling affects z too
        // Actually scaling is applied before projection, so z changes too
        expect(Math.abs(scale2[0].x)).toBeGreaterThan(Math.abs(scale1[0].x))
    })

    it('produces different results for different rotation angles', () => {
        const noRotation = transformPoints(CUBE_VERTICES, 0, 0, 0, 1, 5)
        const withRotation = transformPoints(CUBE_VERTICES, Math.PI / 4, 0, 0, 1, 5)
        expect(noRotation[0].y).not.toBeCloseTo(withRotation[0].y, 3)
    })

    it('rotation by 2pi returns to original position', () => {
        const original = transformPoints(CUBE_VERTICES, 0, 0, 0, 1, 5)
        const fullRotation = transformPoints(CUBE_VERTICES, Math.PI * 2, 0, 0, 1, 5)
        for (let i = 0; i < original.length; i++) {
            expect(fullRotation[i].x).toBeCloseTo(original[i].x, 5)
            expect(fullRotation[i].y).toBeCloseTo(original[i].y, 5)
        }
    })

    it('handles empty vertex array', () => {
        const result = transformPoints([], 0, 0, 0, 1, 5)
        expect(result).toEqual([])
    })
})
