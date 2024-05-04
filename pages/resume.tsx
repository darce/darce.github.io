import type { ReactElement } from 'react'
import Layout from '../components/Layout'
import type { NextPageWithLayout } from './_app'

const Resume: NextPageWithLayout = () => {

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

Resume.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Resume