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
    it('calls the callback after the pause', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, 100)

        throttled('arg1')
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(fn).toHaveBeenCalledWith('arg1')

        vi.useRealTimers()
    })

    it('ignores calls during the pause period', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, 100)

        throttled('first')
        throttled('second')
        throttled('third')

        vi.advanceTimersByTime(100)
        // Only the first call goes through (others ignored while paused)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.useRealTimers()
    })

    it('allows a new call after the pause period completes', () => {
        vi.useFakeTimers()
        const fn = vi.fn()
        const throttled = throttle(fn, 100)

        throttled('first')
        vi.advanceTimersByTime(100)
        expect(fn).toHaveBeenCalledTimes(1)

        throttled('second')
        vi.advanceTimersByTime(100)
        expect(fn).toHaveBeenCalledTimes(2)

        vi.useRealTimers()
    })
})
