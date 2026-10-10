import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

// Next 16 removed `next lint`, so eslint is invoked directly and the config has
// to be flat. eslint-config-next v16 ships flat configs, so no FlatCompat shim.
const config = [
    {
        ignores: [
            '.next/**',
            'out/**',
            'public/**',
            'lib/generated/**',
            'agentic/**',
            'docs/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            // The site ships pre-derived variants from generate-image-variants.js
            // and next.config.js sets images.unoptimized, so next/image buys nothing.
            '@next/next/no-img-element': 'off',
        },
    },
    {
        // Build-time Node scripts are CommonJS on purpose; they run under plain
        // `node` outside the bundler, where require() is the working idiom.
        files: ['scripts/**/*.js', '*.config.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        // Recovery-link fixtures may use plain anchors. Images still require alt text.
        files: ['test/**/*.{ts,tsx}'],
        rules: {
            '@next/next/no-html-link-for-pages': 'off',
        },
    },
    {
        // Warn, not error, and deliberately left visible. Three call sites trip
        // this, and none of them is a one-line fix:
        //   Nav.tsx        — corrects the active path after hydration, because a
        //                    static export renders with the fallback route's asPath
        //   ThemeContext   — reads localStorage, which does not exist on the server
        //   useOrderBook   — resets `loading` on symbol change, which is only
        //                    needed because useWebSocket keeps stale data across a
        //                    url change; the real fix belongs in that hook
        // Erroring here would either block CI or push someone into a behavioural
        // change smuggled in under a lint fix.
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
]

export default config
