import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/Layout'

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