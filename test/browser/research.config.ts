import { defineConfig } from '@playwright/test'
import path from 'node:path'
import base from '../../playwright.config'

// Use an explicitly provisioned browser in offline lanes. Unset: Playwright's
// lockfile-selected browser remains the normal default.
export default defineConfig({
    ...base,
    testDir: __dirname,
    webServer: base.webServer && !Array.isArray(base.webServer)
        ? { ...base.webServer, cwd: path.resolve(__dirname, '../..') }
        : base.webServer,
    use: {
        ...base.use,
        launchOptions: process.env.RESEARCH_BROWSER_EXECUTABLE
            ? { executablePath: process.env.RESEARCH_BROWSER_EXECUTABLE }
            : undefined,
    },
})
