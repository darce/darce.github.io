import { describe, it, expect, vi } from 'vitest'
import { mapRange, throttle } from '../../lib/utils'

describe('mapRange', () => {
    it('maps a value from one range to another', () => {
        expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
    })

    it('maps minimum input to minimum output', () => {
        expect(mapRange(0, 0, 10, 20, 40)).toBe(20)
    })

    it('maps maximum input to maximum output', () => {
        expect(mapRange(10, 0, 10, 20, 40)).toBe(40)
    })

    it('handles inverted output range', () => {
        expect(mapRange(5, 0, 10, 100, 0)).toBe(50)
    })

    it('handles values outside input range', () => {
        expect(mapRange(15, 0, 10, 0, 100)).toBe(150)
    })

    it('handles negative ranges', () => {
        expect(mapRange(0, -10, 10, 0, 100)).toBe(50)
    })
})

describe('throttle', () => {
    const pause = 100
    const first = 'first input'
    const second = 'second input'
    const third = 'third input'
    it('calls the callback after the pause', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, pause)

        throttled(first)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(pause)
        expect(fn).toHaveBeenCalledWith(first)

    })

    it('ignores calls during the pause period', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, pause)

        throttled(first)
        throttled(second)
        throttled(third)

        vi.advanceTimersByTime(pause)
        // Only the first call goes through (others ignored while paused)
        expect(fn.mock.calls).toEqual([[first]])

    })

    it('allows a new call after the pause period completes', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, pause)

        throttled(first)
        vi.advanceTimersByTime(pause)
        expect(fn).toHaveBeenCalledTimes(1)

        throttled(second)
        vi.advanceTimersByTime(pause)
        expect(fn.mock.calls).toEqual([[first], [second]])

    })
})
