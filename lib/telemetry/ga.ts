import type { NextWebVitalsMetric } from 'next/app'

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? 'G-MHTZJGSKZL'

export const isGaEnabled = (providers: Set<string>): boolean =>
    providers.has('ga') && GA_MEASUREMENT_ID.length > 0

export const trackGaPageView = (path: string): void => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
        return
    }

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
    })
}

export const trackGaWebVital = (metric: NextWebVitalsMetric): void => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
        return
    }

    window.gtag('event', metric.name, {
        value: metric.name === 'CLS' ? Math.round(metric.value * 1000) : Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        non_interaction: true,
    })
}
