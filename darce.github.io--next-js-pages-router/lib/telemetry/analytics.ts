import type { NextWebVitalsMetric } from 'next/app'

import {
    initAltContextEngagementTracking,
    initAltContextScrollTracking,
    trackAltContextPageView,
    trackAltContextWebVital,
} from './altcontext'
import { isGaEnabled, trackGaPageView, trackGaWebVital } from './ga'

const parseEnabledProviders = (): Set<string> => {
    const raw = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDERS?.trim()
    const fallback = 'altcontext,ga'
    const values = (raw && raw.length > 0 ? raw : fallback)
        .split(',')
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry.length > 0)

    return new Set(values)
}

const enabledProviders = parseEnabledProviders()

export const analyticsConfig = {
    providers: enabledProviders,
    gaEnabled: isGaEnabled(enabledProviders),
    altContextEnabled: enabledProviders.has('altcontext'),
}

export const initAnalytics = (): (() => void) => {
    const cleanups: Array<() => void> = []

    if (analyticsConfig.altContextEnabled) {
        cleanups.push(initAltContextEngagementTracking())
        cleanups.push(initAltContextScrollTracking())
    }

    return () => {
        cleanups.forEach((cleanup) => cleanup())
    }
}

export const trackPageView = (path: string): void => {
    if (analyticsConfig.altContextEnabled) {
        trackAltContextPageView()
    }
    if (analyticsConfig.gaEnabled) {
        trackGaPageView(path)
    }
}

export const trackWebVital = (metric: NextWebVitalsMetric): void => {
    if (analyticsConfig.altContextEnabled) {
        trackAltContextWebVital(metric)
    }
    if (analyticsConfig.gaEnabled) {
        trackGaWebVital(metric)
    }
}
