import { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import { getMdxContent } from '../../lib/getMdxContent'
import { MarkdownData } from '../../types'
import Layout from '../../components/layout/Layout'
import SectionView from '../../components/features/SectionView/SectionView'

interface ResearchProps {
    researchData: MarkdownData[]
}

const Research: NextPageWithLayout<ResearchProps> = ({ researchData }) => {
    return (
        <SectionView
            section="research"
            items={researchData}
            autoSelectFirst={true}
        />
    )
}

Research.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const researchProps = await getMdxContent({ subDir: 'research' })
    const headerProps = await getMdxContent({ subDir: 'header' })

    return {
        props: {
            researchData: researchProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Research