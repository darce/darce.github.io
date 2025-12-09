import { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { getMdxContent } from '../lib/getMdxContent'
import { MarkdownData } from '../types'
import Layout from '../components/layout/Layout'
import SectionView from '../components/features/SectionView/SectionView'

interface WorkProps {
    projectsData: MarkdownData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    return (
        <SectionView
            section="projects"
            items={projectsData}
            autoSelectFirst={true}
        />
    )
}

Work.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const projectsProps = await getMdxContent({ subDir: 'projects' })
    const headerProps = await getMdxContent({ subDir: 'header' })

    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Work