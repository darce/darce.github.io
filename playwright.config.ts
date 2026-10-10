import { defineConfig, devices } from '@playwright/test'
import { breakpoints, spacing, tokenPixels } from './test/support/designTokens'

const port = Number(process.env.PORTFOLIO_TEST_PORT ?? 4347)
const baseURL = process.env.PORTFOLIO_TEST_URL ?? `http://127.0.0.1:${port}`
const widths = {
    mobile: Math.floor(tokenPixels(breakpoints.mobileMax) / 2),
    tablet: tokenPixels(breakpoints.tabletMax),
    desktop: tokenPixels(breakpoints.tabletMax) + tokenPixels(spacing['s-x-large']) * 8,
}

export default defineConfig({
    testDir: './test/browser',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: 0,
    workers: 2,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        ...devices['Desktop Chrome'],
        baseURL,
        channel: process.env.PW_BROWSER_CHANNEL,
        trace: 'retain-on-failure',
    },
    projects: Object.entries(widths).map(([name, width]) => ({ name, use: { viewport: { width, height: devices['Desktop Chrome'].viewport.height } } })),
    webServer: process.env.PORTFOLIO_TEST_URL ? undefined : {
        command: 'node scripts/test-static-server.mjs',
        env: { PORTFOLIO_TEST_PORT: String(port) },
        url: baseURL,
        reuseExistingServer: false,
    },
})
