import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const SWIPE_THRESHOLD = 80
const SWIPE_MAX_Y = 100

interface UseSwipeNavOptions {
    prev: string | null
    next: string | null
}

/**
 * Touch swipe navigation between sibling pages.
 * Swipe right → previous, swipe left → next.
 * Only activates on mobile viewports.
 */
export function useSwipeNav({ prev, next }: UseSwipeNavOptions) {
    const router = useRouter()
    const startX = useRef(0)
    const startY = useRef(0)

    useEffect(() => {
        if (!prev && !next) return

        const onTouchStart = (e: TouchEvent) => {
            startX.current = e.touches[0].clientX
            startY.current = e.touches[0].clientY
        }

        const onTouchEnd = (e: TouchEvent) => {
            const dx = e.changedTouches[0].clientX - startX.current
            const dy = Math.abs(e.changedTouches[0].clientY - startY.current)

            // Ignore vertical scrolls
            if (dy > SWIPE_MAX_Y) return

            if (dx > SWIPE_THRESHOLD && prev) {
                router.push(prev)
            } else if (dx < -SWIPE_THRESHOLD && next) {
                router.push(next)
            }
        }

        document.addEventListener('touchstart', onTouchStart, { passive: true })
        document.addEventListener('touchend', onTouchEnd, { passive: true })

        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchend', onTouchEnd)
        }
    }, [prev, next, router])
}
