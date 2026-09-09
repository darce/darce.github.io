import React from 'react'

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Something went wrong.</h2>
                    <p>
                        {/* Deliberately not next/link: this renders because the React
                            tree below has thrown, and a client-side navigation would
                            keep that broken tree mounted. A full document load is the
                            recovery. */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/" style={{ textDecoration: 'underline' }}>
                            Return to homepage
                        </a>
                    </p>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
