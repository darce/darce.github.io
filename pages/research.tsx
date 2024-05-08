import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/Layout'

const Research: NextPageWithLayout = () => {

    return (
        <main className="content">
            company
            position
            date-start
            date-end
            description
        </main>
    )
}

Research.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Research