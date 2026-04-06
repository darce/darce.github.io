import type { NextWebVitalsMetric } from 'next/app'

const ANON_ID_STORAGE_KEY = 'altctx_anon_id'
const PROPERTY_ID = 'darce.xyz'
const backendUrl = (
    process.env.NEXT_PUBLIC_ALTCTX_BACKEND_URL?.trim()
    ?? 'https://marketing-altcontext.fly.dev'
).replace(/\/$/, '')
// API key is optional while bootstrap tenant resolution handles single-tenant
// ingest via origin/referer check. Set NEXT_PUBLIC_ALTCTX_INGEST_API_KEY when
// multi-tenant API keys are provisioned.
const ingestApiKey = process.env.NEXT_PUBLIC_ALTCTX_INGEST_API_KEY?.trim() ?? ''

const EVENT_SAMPLE_RATES: Partial<Record<string, number>> = {
    engagement: 0.35,
    scroll_depth: 0.35,
    cwv: 0.2,
}

interface WebVitalsPayload {
    fcpMs?: number
    lcpMs?: number
    inpMs?: number
    ttfbMs?: number
    clsScore?: number
}

interface EventTrafficPayload {
    propertyId: string
    engagedTimeMs?: number
    scrollDepthPercent?: number
    webVitals?: WebVitalsPayload
}

interface EventPayloadOptions {
    props?: Record<string, unknown>
    traffic?: Omit<EventTrafficPayload, 'propertyId'>
}

let pendingWebVitals: WebVitalsPayload = {}
let flushWebVitalsTimeout: ReturnType<typeof setTimeout> | null = null

const canTrack = (): boolean =>
    typeof window !== 'undefined'
    && backendUrl.length > 0
    && process.env.NODE_ENV === 'production'

const randomId = (): string =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`

const getAnonId = (): string => {
    if (!canTrack()) {
        return randomId()
    }

    let anonId: string | null = null
    try {
        anonId = window.localStorage.getItem(ANON_ID_STORAGE_KEY)
    } catch {
        // localStorage can fail in private browsing modes.
    }

    if (!anonId) {
        anonId = typeof window.crypto?.randomUUID === 'function'
            ? window.crypto.randomUUID()
            : randomId()
        try {
            window.localStorage.setItem(ANON_ID_STORAGE_KEY, anonId)
        } catch {
            // localStorage can fail in private browsing modes.
        }
    }
    return anonId
}

const getUtmParams = (): Partial<Record<string, string>> | undefined => {
    if (!canTrack()) {
        return undefined
    }

    try {
        const params = new URLSearchParams(window.location.search)
        const utm: Record<string, string> = {}
        const keys = ['source', 'medium', 'campaign', 'term', 'content']

        for (const key of keys) {
            const value = params.get(`utm_${key}`)
            if (value) {
                utm[key] = value
            }
        }

        return Object.keys(utm).length > 0 ? utm : undefined
    } catch {
        return undefined
    }
}

const shouldSample = (eventType: string): boolean => {
    const sampleRate = EVENT_SAMPLE_RATES[eventType] ?? 1
    if (sampleRate >= 1) {
        return true
    }
    return Math.random() <= sampleRate
}

const sendEvent = (eventType: string, options?: EventPayloadOptions): void => {
    if (!canTrack() || !shouldSample(eventType)) {
        return
    }

    const trafficPayload: EventTrafficPayload = {
        propertyId: PROPERTY_ID,
        ...(options?.traffic ?? {}),
    }

    const payload = JSON.stringify({
        anonId: getAnonId(),
        eventType,
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        timestamp: new Date().toISOString(),
        utm: getUtmParams(),
        ...(options?.props ? { props: options.props } : {}),
        traffic: trafficPayload,
    })

    fetch(`${backendUrl}/v1/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(ingestApiKey ? { 'x-api-key': ingestApiKey } : undefined),
        },
        body: payload,
        keepalive: true,
    }).catch(() => {
        // Never block user interactions on telemetry failures.
    })
}

const normalizeEngagedTime = (valueMs: number): number => {
    const normalized = Math.max(0, Math.round(valueMs))
    return Math.min(normalized, 86_400_000)
}

const normalizeScrollDepth = (value: number): number => {
    const normalized = Math.max(0, Math.round(value))
    return Math.min(normalized, 100)
}

const computeScrollDepthPercent = (): number => {
    const doc = document.documentElement
    const body = document.body
    const viewportBottom = window.scrollY + window.innerHeight
    const fullHeight = Math.max(
        doc.scrollHeight,
        body.scrollHeight,
        doc.offsetHeight,
        body.offsetHeight,
        doc.clientHeight,
    )

    if (fullHeight <= 0) {
        return 0
    }

    return (viewportBottom / fullHeight) * 100
}

const flushPendingWebVitals = (): void => {
    const webVitals = pendingWebVitals
    pendingWebVitals = {}
    flushWebVitalsTimeout = null

    if (Object.keys(webVitals).length === 0) {
        return
    }

    sendEvent('cwv', {
        traffic: {
            webVitals,
        },
    })
}

const scheduleWebVitalsFlush = (): void => {
    if (flushWebVitalsTimeout) {
        clearTimeout(flushWebVitalsTimeout)
    }
    flushWebVitalsTimeout = setTimeout(flushPendingWebVitals, 1000)
}

const mapMetricToPayload = (metric: NextWebVitalsMetric): Partial<WebVitalsPayload> | null => {
    switch (metric.name) {
        case 'FCP':
            return { fcpMs: Math.round(metric.value) }
        case 'LCP':
            return { lcpMs: Math.round(metric.value) }
        case 'INP':
            return { inpMs: Math.round(metric.value) }
        case 'TTFB':
            return { ttfbMs: Math.round(metric.value) }
        case 'CLS':
            return { clsScore: Number(metric.value.toFixed(3)) }
        default:
            return null
    }
}

export const trackAltContextPageView = (): void => {
    sendEvent('page_view')
}

export const initAltContextEngagementTracking = (): (() => void) => {
    if (!canTrack()) {
        return () => undefined
    }

    let engagementStartMs = Date.now()

    const sendEngagement = (): void => {
        const elapsed = Date.now() - engagementStartMs
        sendEvent('engagement', {
            traffic: {
                engagedTimeMs: normalizeEngagedTime(elapsed),
            },
        })
    }

    const handleVisibilityChange = (): void => {
        if (document.hidden) {
            sendEngagement()
            return
        }
        engagementStartMs = Date.now()
    }

    const handlePageHide = (): void => {
        if (!document.hidden) {
            sendEngagement()
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', handlePageHide)
    }
}

export const initAltContextScrollTracking = (): (() => void) => {
    if (!canTrack()) {
        return () => undefined
    }

    let maxScrollDepthPercent = 0
    let hasSent = false

    const updateDepth = (): void => {
        maxScrollDepthPercent = Math.max(
            maxScrollDepthPercent,
            normalizeScrollDepth(computeScrollDepthPercent()),
        )
    }

    const sendScrollDepth = (): void => {
        if (hasSent || maxScrollDepthPercent <= 0) {
            return
        }
        hasSent = true
        sendEvent('scroll_depth', {
            traffic: {
                scrollDepthPercent: maxScrollDepthPercent,
            },
        })
    }

    const handleVisibilityChange = (): void => {
        if (document.hidden) {
            sendScrollDepth()
        }
    }

    const handlePageHide = (): void => {
        sendScrollDepth()
    }

    updateDepth()
    window.addEventListener('scroll', updateDepth, { passive: true })
    window.addEventListener('resize', updateDepth, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
        window.removeEventListener('scroll', updateDepth)
        window.removeEventListener('resize', updateDepth)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', handlePageHide)
    }
}

export const trackAltContextWebVital = (metric: NextWebVitalsMetric): void => {
    const mappedMetric = mapMetricToPayload(metric)
    if (!mappedMetric) {
        return
    }

    pendingWebVitals = {
        ...pendingWebVitals,
        ...mappedMetric,
    }
    scheduleWebVitalsFlush()
}
